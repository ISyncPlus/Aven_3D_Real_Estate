'use client';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html, useTexture } from '@react-three/drei';
import { facade, type Part, type V3 } from '@/lib/architecture';
import { residences, type Residence } from '@/lib/residences';

type MaterialName = 'stone' | 'lightStone' | 'dark' | 'glass' | 'warmGlass' | 'interior' | 'rail' | 'metal' | 'wood' | 'green' | 'curtain' | 'roomLight';
export function Boxes({ parts, color, metalness = 0, roughness = .8, transparent = false, opacity = 1, emissive = '#000000', emissiveIntensity = 0, texture, material, normalMap, roughnessMap, normalStrength = .15, clearcoat = 0 }: { parts: Part[]; color: string; metalness?: number; roughness?: number; transparent?: boolean; opacity?: number; emissive?: string; emissiveIntensity?: number; texture?: THREE.Texture; material?: THREE.Material; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture; normalStrength?: number; clearcoat?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    parts.forEach((part, index) => {
      dummy.position.set(...part.p); dummy.scale.set(...part.s); dummy.rotation.set(...(part.r || [0, 0, 0]));
      dummy.updateMatrix(); ref.current!.setMatrixAt(index, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [parts]);
  if (!parts.length) return null;
  return <instancedMesh material={material} ref={ref} args={[undefined, undefined, parts.length]} castShadow={!transparent} receiveShadow>
    <boxGeometry args={[1, 1, 1]}/>
    {!material && <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} transparent={transparent} opacity={opacity} emissive={emissive} emissiveIntensity={emissiveIntensity} map={texture} normalMap={normalMap} normalScale={[normalStrength, normalStrength]} roughnessMap={roughnessMap} clearcoat={clearcoat} clearcoatRoughness={.12} depthWrite={!transparent}/>}
  </instancedMesh>;
}
export function Building({ dusk, selected, hovered, activeFloor, onHover, onSelect }: { dusk: boolean; selected: Residence | null; hovered: Residence | null; activeFloor: number | null; onHover: (unit: Residence | null) => void; onSelect: (unit: Residence) => void }) {
  const parts = useMemo(facade, []);
  const [stoneNormal, stoneRough, oak, oakNormal, oakRough] = useTexture(['/materials/stone-normal.jpg', '/materials/stone-rough.jpg', '/materials/timber-color.jpg', '/materials/timber-normal.jpg', '/materials/timber-rough.jpg']);
  useMemo(() => {
    [stoneNormal, stoneRough, oak, oakNormal, oakRough].forEach(map => { map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 8; map.needsUpdate = true; });
    oak.colorSpace = THREE.SRGBColorSpace;
  }, [stoneNormal, stoneRough, oak, oakNormal, oakRough]);
  const materials: Record<MaterialName, { color: string; metalness?: number; roughness?: number; transparent?: boolean; opacity?: number; emissive?: string; emissiveIntensity?: number; texture?: THREE.Texture; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture; normalStrength?: number; clearcoat?: number }> = {
    stone: { color: '#b9ac94', normalMap: stoneNormal, roughnessMap: stoneRough, normalStrength: .075 }, lightStone: { color: '#dacbb1', normalMap: stoneNormal, roughnessMap: stoneRough, normalStrength: .06 },
    dark: { color: '#252a29' }, interior: { color: '#393d3b' },
    glass: { color: dusk ? '#789097' : '#9bb2b7', roughness: .12, metalness: .24, clearcoat: 1, transparent: true, opacity: .6 },
    warmGlass: { color: '#a2a18c', roughness: .14, metalness: .24, clearcoat: 1, transparent: true, opacity: .64, emissive: '#d5a96b', emissiveIntensity: dusk ? .06 : 0 },
    rail: { color: '#9daead', metalness: .2, roughness: .14, transparent: true, opacity: .25 },
    metal: { color: '#343b39', metalness: .65, roughness: .3 }, wood: { color: '#b8a586', texture: oak, normalMap: oakNormal, roughnessMap: oakRough, normalStrength: .2 }, green: { color: '#45533a' },
    curtain: { color: '#bfb9a6', roughness: .95 }, roomLight: { color: dusk ? '#bf9c6d' : '#b9b7a6', emissive: '#d4ad74', emissiveIntensity: dusk ? .35 : 0 },
  };
  const active = hovered || selected;
  return <group position={[7, 0, 0]} scale={[1.4, 1, 1]}>
    {(Object.entries(parts) as [MaterialName, Part[]][]).map(([name, batch]) => <Boxes key={name} parts={batch} {...materials[name]}/>)}
    {activeFloor && !selected && <mesh position={[0, 4.5 + (activeFloor - 1) * 3, 6.24]}><boxGeometry args={[17.7, 2.72, .025]}/><meshBasicMaterial color="#eac080" transparent opacity={.055} depthWrite={false}/></mesh>}
    {residences.map(unit => <mesh key={unit.id} position={[-6.525 + unit.position * 4.35, 4.5 + (unit.floor - 1) * 3, 6.2]}
      onPointerOver={event => { event.stopPropagation(); onHover(unit); }}
      onPointerOut={() => onHover(null)}
      onClick={event => { event.stopPropagation(); if (unit.available) onSelect(unit); }}>
      <boxGeometry args={[3.98, 2.72, .04]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/>
    </mesh>)}
    {hovered && !selected && <Html position={[-6.525 + hovered.position * 4.35, 4.5 + (hovered.floor - 1) * 3, 6.6]} style={{ pointerEvents: 'none' }} zIndexRange={[15, 10]}><div className="hover-preview hover-preview-3d"><span>Apartment {hovered.id}</span><p>{hovered.bedrooms} bedrooms <span>{hovered.area} m²</span></p><span className="preview-availability">{hovered.available ? 'Available to explore' : 'Reserved'}</span></div></Html>}
    {active && <mesh position={[-6.525 + active.position * 4.35, 4.5 + (active.floor - 1) * 3, 6.24]}>
      <boxGeometry args={[3.98, 2.72, .035]}/><meshBasicMaterial color={active.available ? '#edc37f' : '#97a2a5'} transparent opacity={.28} depthWrite={false}/>
    </mesh>}
    {dusk && <pointLight position={[0, 1.7, 7]} color="#f2c68e" intensity={18} distance={12} decay={2}/>}
  </group>;
}

function random(seed: number) { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
export function Trees({ positions, scale = 1 }: { positions: V3[]; scale?: number }) {
  const foliage = useRef<THREE.InstancedMesh>(null);
  const trunks = useMemo(() => positions.map(p => ({ p: [p[0], p[1] + 2 * scale, p[2]] as V3, s: [.22 * scale, 4 * scale, .22 * scale] as V3 })), [positions, scale]);
  useLayoutEffect(() => {
    if (!foliage.current) return;
    const dummy = new THREE.Object3D(); const color = new THREE.Color();
    positions.forEach((p, t) => {
      for (let i = 0; i < 420; i++) {
        const seed = t * 67 + i;
        const a = random(seed) * Math.PI * 2; const radius = Math.sqrt(random(seed + 21)) * 1.8 * scale;
        dummy.position.set(p[0] + Math.cos(a) * radius, p[1] + 4.6 * scale + (random(seed + 44) - .5) * 3.5 * scale * Math.sqrt(Math.max(0, 1 - (radius / (2 * scale)) ** 2)), p[2] + Math.sin(a) * radius);
        dummy.scale.set((.14 + random(seed + 4) * .24) * scale, (.2 + random(seed + 7) * .28) * scale, (.14 + random(seed + 5) * .25) * scale);
        dummy.rotation.set(random(seed) * 3, random(seed + 2) * 3, random(seed + 3) * 3); dummy.updateMatrix();
        foliage.current!.setMatrixAt(t * 420 + i, dummy.matrix);
        color.setHSL(.22 + random(seed + 8) * .055, .16 + random(seed + 9) * .2, .08 + random(seed + 10) * .085);
        foliage.current!.setColorAt(t * 420 + i, color);
      }
    });
    foliage.current.instanceMatrix.needsUpdate = true;
    if (foliage.current.instanceColor) foliage.current.instanceColor.needsUpdate = true;
    foliage.current.computeBoundingSphere();
  }, [positions, scale]);
  return <group><Boxes parts={trunks} color="#524d40"/><instancedMesh ref={foliage} args={[undefined, undefined, positions.length * 420]} castShadow receiveShadow><icosahedronGeometry args={[1, 0]}/><meshStandardMaterial color="#6f8558" roughness={1}/></instancedMesh></group>;
}
export function Streetscape({ dusk }: { dusk: boolean }) {
  const geometry = useMemo(() => {
    const stripes: Part[] = []; const paving: Part[] = []; const bollards: Part[] = []; const hedges: Part[] = [];
    for (let i = -14; i < 18; i++) stripes.push({ p: [i * 5, -.045, 18], s: [2.5, .025, .12] });
    for (let x = -24; x <= 32; x += 2) for (let z = 7.4; z <= 11; z += 1.2) paving.push({ p: [x, -.01, z], s: [1.95, .12, 1.15] });
    for (let x = -22; x <= 30; x += 3) bollards.push({ p: [x, .4, 11], s: [.075, .8, .075] });
    for (let x = -24; x <= 30; x += 1.1) hedges.push({ p: [x, .48, 23.5], s: [1.18, 1, 1.6] });
    return { stripes, paving, bollards, hedges };
  }, []);
  const trees = useMemo<V3[]>(() => [[-14, 0, 1], [-22, 0, -4], [-6, 0, -13], [23, 0, -4], [30, 0, 2], [-29, 0, 6], [37, 0, -9]], []);
  const shrubs = useMemo<V3[]>(() => [[-4, -.8, 6.6], [-6, -.8, 6.6], [18, -.8, 7], [20, -.8, 7], [-11, -.8, 8]], []);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.18, 0]} receiveShadow><planeGeometry args={[400, 400]}/><meshStandardMaterial color={dusk ? '#39463f' : '#626c50'} roughness={1}/></mesh>
    <mesh position={[0, -.1, 17]} receiveShadow><boxGeometry args={[300, .1, 10]}/><meshStandardMaterial color="#343c43" roughness={.94}/></mesh>
    <mesh position={[0, -.1, 28]} receiveShadow><boxGeometry args={[300, .1, 6]}/><meshStandardMaterial color="#555e60" roughness={1}/></mesh>
    <Boxes parts={geometry.paving} color="#8b8e85"/>
    <Boxes parts={geometry.stripes} color="#b6b8b1"/>
    <Boxes parts={geometry.bollards} color="#273333" metalness={.4}/>
    <Boxes parts={geometry.hedges} color="#3e5139"/>
    <Trees positions={trees}/><Trees positions={shrubs} scale={.35}/>
    {[-8, 25].map(x => <group key={x} position={[x, 0, 10.8]}>
      <mesh position={[0, 2.3, 0]} castShadow><cylinderGeometry args={[.045, .07, 4.6, 8]}/><meshStandardMaterial color="#343c3b"/></mesh>
      <mesh position={[.48, 4.65, 0]}><boxGeometry args={[1.05, .075, .22]}/><meshStandardMaterial color="#303635"/></mesh>
      <mesh position={[.57, 4.59, 0]}><boxGeometry args={[.7, .025, .16]}/><meshStandardMaterial color="#f2d6a3" emissive="#f2d6a3" emissiveIntensity={dusk ? 2 : .2}/></mesh>
    </group>)}
    <group position={[4, .2, 8.7]}>
      <Boxes color="#78634e" parts={[{ p: [0, .38, 0], s: [2, .1, .5] }, { p: [0, .7, -.2], s: [2, .55, .08] }]}/>
      <Boxes color="#303938" parts={[-.7, .7].map(x => ({ p: [x, .15, 0], s: [.08, .45, .4] }))}/>
    </group>
  </group>;
}
