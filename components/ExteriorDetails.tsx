'use client';
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Block, Chair, Plant } from './Furniture';
import { useFinishes } from './Materials';
import { Boxes, Trees } from './Architecture';
export default function ExteriorDetails({ dusk }: { dusk: boolean }) {
  const f = useFinishes();
  const sign = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#24312f'; context.fillRect(0, 0, 1024, 256);
    context.fillStyle = '#d6c3a1'; context.font = '300 132px sans-serif'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText('A V E N', 512, 132);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }, []);
  useEffect(() => () => sign.dispose(), [sign]);
  const roofTrees = useMemo<[number, number, number][]>(() => [[13.8, 27.18, -3.7], [16.5, 27.18, 3.7]], []);
  return <group>
    <group position={[7, 0, 0]} scale={[1.4, 1, 1]}>
      <Block p={[-2.7, 1.45, 5.4]} s={[4, 2.8, .1]} material={f.walnut}/>
      <mesh position={[-2.7, 2.05, 5.46]}><planeGeometry args={[2.8, .7]}/><meshBasicMaterial map={sign} toneMapped={false}/></mesh>
      <Block p={[.5, 1.45, 5.44]} s={[2.2, 2.75, .04]} material={f.glass}/>
      <Boxes parts={[-.64, .5, 1.64].map(x => ({ p: [x, 1.45, 5.48], s: [.035, 2.8, .08] }))} color="#343e38" material={f.metal}/>
      <Boxes parts={[.38, .62].map(x => ({ p: [x, 1.3, 5.54], s: [.025, .6, .065] }))} color="#9d8a63" material={f.brass}/>
      <Block p={[.45, 2.94, 6]} s={[6, .16, 2.2]} material={f.metal}/>
      <mesh position={[.45, 2.85, 6.6]}><boxGeometry args={[5.6, .025, .07]}/><meshStandardMaterial color="#e4c18d" emissive="#e4b871" emissiveIntensity={dusk ? 1 : .05}/></mesh>
      <Block p={[.5, .2, 6.3]} s={[5.9, .18, 2.1]} material={f.stone}/>
      <Block p={[.5, .09, 6.7]} s={[6.3, .12, 2.1]} material={f.stone}/>
      <Plant position={[-5.1, .1, 6.2]} scale={.8} finishes={f}/><Plant position={[3.7, .1, 6.2]} scale={.8} finishes={f}/>
      <group position={[4.7, 27.16, 2.1]}><Chair position={[-.8, 0, 0]} rotation={.35} finishes={f} outdoor/><Chair position={[.8, 0, 0]} rotation={-.35} finishes={f} outdoor/><mesh position={[0, .6, .8]} material={f.stone}><cylinderGeometry args={[.45, .45, .08, 20]}/></mesh><Plant position={[2, 0, 1]} finishes={f}/></group>
    </group>
    <Trees positions={roofTrees} scale={.38}/>
    <Boxes color="#65745b" parts={[-15, -11, 24, 28].map(x => ({ p: [x, .1, 5], s: [3.6, .24, 4.5] }))}/>
    <Boxes color="#b4ad99" material={f.stone} parts={[-15, -11, 24, 28].map(x => ({ p: [x, .32, 7.15], s: [3.6, .5, .2] }))}/>
    <group position={[27, .05, -9]} rotation={[0, .4, 0]}><Car color="#b9bdb5"/></group>
    <group position={[-22, .05, -8]} rotation={[0, -.3, 0]}><Car color="#3c4c51"/></group>
  </group>;
}
function Car({ color }: { color: string }) {
  return <group><Block p={[0, .54, 0]} s={[1.85, .55, 4.4]} color={color} radius={.18}/><Block p={[0, 1.02, -.15]} s={[1.62, .7, 2.35]} color="#344449" radius={.23}/><Block p={[0, 1.37, -.3]} s={[1.55, .08, 1.45]} color={color} radius={.04}/>{[-1, 1].flatMap(x => [-1, 1].map(z => <group key={`${x}${z}`} position={[x * .9, .4, z * 1.45]} rotation={[0, 0, Math.PI / 2]}><mesh castShadow><cylinderGeometry args={[.37, .37, .21, 20]}/><meshStandardMaterial color="#252a29" roughness={.9}/></mesh><mesh><cylinderGeometry args={[.23, .23, .23, 12]}/><meshStandardMaterial color="#92958a" metalness={.8} roughness={.25}/></mesh></group>))}<Block p={[0, .58, 2.22]} s={[1.55, .14, .03]} color="#d3d5c5"/><Block p={[0, .58, -2.22]} s={[1.55, .1, .03]} color="#7f4b3d"/></group>;
}
