'use client';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { Building, Streetscape } from './Architecture';
import Apartment from './Apartment';
import City from './City';
import ExteriorDetails from './ExteriorDetails';
import type { Residence } from '@/lib/residences';
export type ViewMode = 'home' | 'residences' | 'architecture' | 'setting' | 'apartment';
type Props = { mode: ViewMode; dusk: boolean; view: number; reduced: boolean; selected: Residence | null; activeFloor: number | null; hovered: Residence | null; onHover: (unit: Residence | null) => void; onSelect: (unit: Residence) => void; onReady: () => void; onFailure: () => void };
function CameraRig({ mode, view, reduced, onReady }: Pick<Props, 'mode' | 'view' | 'reduced' | 'onReady'>) {
  const { camera, size, pointer } = useThree();
  const rig = useRef({ x: 25, y: 18, z: 28, tx: 7, ty: 16, tz: 0 });
  const initialized = useRef(false);
  const smoothPointer = useRef(new THREE.Vector2());
  const mobile = size.width < 700;
  const compact = size.width < 1100;
  useLayoutEffect(() => {
    let destination;
    if (mode === 'apartment') destination = mobile ? { x: 17, y: 24, z: 24, tx: -3.8, ty: 0, tz: .5 } : { x: 12, y: 18, z: 21, tx: 0, ty: .5, tz: 0 };
    else if (mobile) destination = { x: [-33, 7, 40][view % 3], y: 25, z: mode === 'setting' ? 120 : 99, tx: 3, ty: 19, tz: 0 };
    else if (compact) destination = { x: [-31, 7, 35][view % 3], y: 24, z: mode === 'setting' ? 105 : 84, tx: -1, ty: 13, tz: 0 };
    else if (mode === 'architecture') destination = { x: -25, y: 21, z: 53, tx: -3, ty: 15, tz: 0 };
    else if (mode === 'setting') destination = { x: -36, y: 28, z: 78, tx: -4, ty: 9, tz: 0 };
    else if (view % 3 === 1) destination = { x: 14, y: 24, z: 61, tx: -1, ty: 12, tz: 0 };
    else if (view % 3 === 2) destination = { x: 31, y: 21, z: 64, tx: -3, ty: 12, tz: 0 };
    else destination = { x: -26, y: 22, z: 64, tx: -5, ty: 12.5, tz: 0 };
    const first = !initialized.current;
    initialized.current = true;
    const animation = gsap.to(rig.current, { ...destination, duration: reduced ? 0 : first ? 3.8 : 1.8, ease: 'power2.inOut', onComplete: onReady });
    return () => { animation.kill(); };
  }, [mode, view, mobile, compact, reduced, onReady]);
  useFrame((_, delta) => {
    const damp = 1 - Math.exp(-delta * 2.5);
    if (reduced || mobile) smoothPointer.current.set(0, 0);
    else smoothPointer.current.lerp(pointer, damp);
    const r = rig.current;
    camera.position.set(r.x + smoothPointer.current.x * .5, r.y + smoothPointer.current.y * .22, r.z);
    camera.lookAt(r.tx, r.ty, r.tz);
  });
  return null;
}
function Atmosphere({ dusk }: { dusk: boolean }) {
  const uniforms = useMemo(() => ({
    zenith: { value: new THREE.Color(dusk ? '#687f99' : '#729db8') },
    horizon: { value: new THREE.Color(dusk ? '#b6b0b6' : '#d7dddb') },
  }), [dusk]);
  return <mesh scale={200}>
    <sphereGeometry args={[1, 32, 16]}/>
    <shaderMaterial side={THREE.BackSide} depthWrite={false} uniforms={uniforms}
      vertexShader={`varying vec3 vDirection; void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
      fragmentShader={`uniform vec3 zenith; uniform vec3 horizon; varying vec3 vDirection;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
        void main(){vec3 d=normalize(vDirection);float h=max(0.,d.y);vec3 color=mix(horizon,zenith,smoothstep(0.,.65,h));vec2 p=d.xz/(h+.25)*3.;float n=noise(p)+.5*noise(p*2.4);float cloud=smoothstep(.8,1.15,n)*smoothstep(.05,.2,h)*(1.-smoothstep(.4,.7,h));color=mix(color,horizon,cloud*.2);gl_FragColor=vec4(color,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`}/>
  </mesh>;
}
function World(props: Props) {
  const { mode, dusk, selected, hovered, onHover, onSelect } = props;
  const apartment = mode === 'apartment';
  const { gl, scene } = useThree();
  useEffect(() => {
    const lose = (event: Event) => { event.preventDefault(); props.onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lose);
    return () => gl.domElement.removeEventListener('webglcontextlost', lose);
  }, [gl, props.onFailure]);
  useEffect(() => {
    const bg = new THREE.Color(apartment ? '#e8e3d9' : dusk ? '#657282' : '#a9b6bd');
    scene.background = bg;
    gl.toneMappingExposure = apartment ? .95 : 1.05;
    scene.fog = new THREE.Fog(apartment ? bg : new THREE.Color(dusk ? '#939b9e' : '#bdc8c8'), apartment ? 100 : 88, apartment ? 250 : 200);
  }, [scene, gl, dusk, apartment]);
  useEffect(() => { document.body.style.cursor = hovered?.available ? 'pointer' : ''; return () => { document.body.style.cursor = ''; }; }, [hovered]);
  return <>
    {!apartment && <Atmosphere dusk={dusk}/>}
    <CameraRig mode={props.mode} view={props.view} reduced={props.reduced} onReady={props.onReady}/>
    <ambientLight intensity={apartment ? .35 : dusk ? .45 : .85}/>
    <hemisphereLight args={[apartment ? '#fff5e4' : '#c2d2e6', '#5c6355', apartment ? .75 : 1.4]}/>
    <directionalLight position={[-25, 38, 28]} color={apartment ? '#fff2d8' : dusk ? '#ffd09a' : '#ffe2b9'} intensity={apartment ? 1.6 : dusk ? 2.1 : 3} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-35} shadow-normalBias={apartment ? .02 : .04} shadow-bias={-.00015}/>
    <directionalLight position={[24, 18, -35]} color="#b5c7dd" intensity={.85}/>
    {apartment ? <Environment files="/materials/interior-light.hdr" environmentIntensity={.65}/> : <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={2.1} position={[0, 35, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[100, 100, 1]}/>
      <Lightformer form="rect" intensity={2.5} color="#ffe0b2" position={[-20, 15, 15]} scale={[20, 30, 1]} rotation={[0, .7, 0]}/>
      <Lightformer form="rect" intensity={1.4} color="#a4bdcf" position={[20, 12, 15]} scale={[20, 25, 1]} rotation={[0, -.7, 0]}/>
    </Environment>}
    {apartment ? <><Apartment bedrooms={selected?.bedrooms || 2}/><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.44, 0]} receiveShadow><planeGeometry args={[200, 200]}/><shadowMaterial transparent opacity={.17} depthWrite={false}/></mesh></> : <><Building dusk={dusk} selected={selected} hovered={hovered} activeFloor={props.activeFloor} onHover={onHover} onSelect={onSelect}/><Streetscape dusk={dusk}/><City dusk={dusk}/><ExteriorDetails dusk={dusk}/></>}
  </>;
}
export default function Scene(props: Props) {
  const camera = useMemo(() => ({ position: [35, 23, 58] as [number, number, number], fov: 37, near: .1, far: 300 }), []);
  return <Canvas shadows dpr={[1, 1.65]} camera={camera} gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }} fallback={<div className="webgl-fallback">The interactive view needs WebGL. You can still explore every residence below.</div>}>
    <Suspense fallback={null}><World {...props}/></Suspense>
  </Canvas>;
}
