'use client';
import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { V3 } from '@/lib/architecture';
import type { Finishes } from './Materials';
export function Block({ p, s, color = '#e9e2d5', material, radius = .025, r }: { p: V3; s: V3; color?: string; material?: THREE.Material; radius?: number; r?: V3 }) {
  return <RoundedBox position={p} rotation={r} args={s} radius={Math.min(radius, ...s.map(n => n / 3))} smoothness={2} castShadow receiveShadow material={material}>{!material && <meshStandardMaterial color={color} roughness={.78}/>}</RoundedBox>;
}
export function Pipe({ points, radius = .018, material }: { points: V3[]; radius?: number; material: THREE.Material }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))), [points]);
  return <mesh material={material} castShadow><tubeGeometry args={[curve, 20, radius, 6, false]}/></mesh>;
}
export function Chair({ position, rotation = 0, finishes: f, outdoor = false }: { position: V3; rotation?: number; finishes: Finishes; outdoor?: boolean }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <Block p={[0, .51, 0]} s={[.65, .14, .65]} material={outdoor ? f.walnut : f.linen} radius={.08}/>
    <mesh position={[0, .79, -.07]} rotation={[0, -Math.PI / 2, 0]} material={outdoor ? f.walnut : f.linen} castShadow><cylinderGeometry args={[.36, .35, .45, 20, 1, true, 0, Math.PI]}/></mesh>
    {[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}${z}`} position={[x * .23, .24, z * .23]} rotation={[z * .08, 0, -x * .08]} material={f.walnut} castShadow><cylinderGeometry args={[.035, .025, .48, 6]}/></mesh>))}
  </group>;
}
export function Plant({ position, scale = 1, finishes: f }: { position: V3; scale?: number; finishes: Finishes }) {
  const leaves = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ a: i * 2.4, h: .48 + (i % 4) * .15 })), []);
  return <group position={position} scale={scale}>
    <mesh position={[0, .2, 0]} material={f.stone} castShadow><cylinderGeometry args={[.25, .18, .4, 20]}/></mesh>
    <mesh position={[0, .405, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.22, 20]}/><meshStandardMaterial color="#403c2e"/></mesh>
    {leaves.map(({ a, h }, i) => <group key={i} rotation={[0, a, 0]}><mesh position={[0, .42 + h / 2, .12]} rotation={[.35, 0, 0]} material={f.walnut}><cylinderGeometry args={[.008, .012, h, 4]}/></mesh><mesh position={[0, h + .38, .27]} rotation={[.55 + i % 3 * .2, 0, .1]} scale={[.13, .35, .027]} castShadow><sphereGeometry args={[1, 10, 6]}/><meshStandardMaterial color={i % 3 ? '#425c3b' : '#64774b'} roughness={.8}/></mesh></group>)}
  </group>;
}
export function Bed({ position, width = 2.9, finishes: f }: { position: V3; width?: number; finishes: Finishes }) {
  return <group position={position}>
    <Block p={[0, .2, 0]} s={[width + .1, .32, 2.7]} material={f.walnut}/>
    <Block p={[0, .48, 0]} s={[width, .3, 2.63]} material={f.cream} radius={.1}/>
    <Block p={[0, .72, .1]} s={[width + .03, .22, 2.44]} material={f.cream} radius={.1}/>
    <Block p={[0, .85, .62]} s={[width + .06, .16, 1.38]} material={f.olive} radius={.07}/>
    {Array.from({ length: 8 }, (_, i) => <Block key={i} p={[-width / 2 + .13 + i * (width - .26) / 7, .94, .77]} s={[.016, .022, 1.09]} color="#8f967e" radius={.005}/>)}
    <Block p={[0, 1.02, -1.38]} s={[width + .25, 1.5, .15]} material={f.linen} radius={.07}/>
    {[...Array(width > 2 ? 4 : 2)].map((_, i) => <Block key={i} p={[(i % 2 ? 1 : -1) * width * .23, .93 + Math.floor(i / 2) * .13, -1.05 + Math.floor(i / 2) * .32]} s={[width * .4, .22, .6]} material={i > 1 ? f.linen : f.cream} r={[-.08, 0, i % 2 ? .035 : -.035]} radius={.1}/>)}
    {width > 2 && [-1, 1].map(side => <group key={side} position={[side * (width / 2 + .5), 0, -1.03]}><Block p={[0, .38, 0]} s={[.65, .7, .6]} material={f.walnut}/><Block p={[0, .55, .31]} s={[.12, .018, .025]} material={f.brass}/><mesh position={[0, .85, 0]} material={f.brass}><cylinderGeometry args={[.035, .055, .26, 8]}/></mesh><mesh position={[0, 1.12, 0]} castShadow><cylinderGeometry args={[.2, .3, .35, 24, 1, true]}/><meshStandardMaterial color="#e1ccb1" side={THREE.DoubleSide} emissive="#dbaf6d" emissiveIntensity={.25}/></mesh></group>)}
  </group>;
}
export function Sofa({ position, finishes: f }: { position: V3; finishes: Finishes }) {
  return <group position={position}>
    <Block p={[0, .2, 0]} s={[3.65, .18, 1.18]} material={f.walnut}/>
    <Block p={[0, .39, 0]} s={[3.75, .4, 1.2]} material={f.linen} radius={.12}/>
    {[-1.08, 0, 1.08].map((x, i) => <group key={i}><Block p={[x, .64, -.06]} s={[1.03, .2, 1]} material={f.linen} radius={.08}/><Block p={[x, .98, .47]} s={[1.06, .75, .25]} material={f.linen} radius={.1} r={[.1, 0, 0]}/><Block p={[x + .2, .9, .26]} s={[.52, .48, .17]} material={i === 1 ? f.olive : f.cream} radius={.07} r={[.05, 0, i % 2 ? -.12 : .12]}/></group>)}
    {[-1, 1].map(x => <Block key={x} p={[x * 1.86, .72, 0]} s={[.28, .86, 1.2]} material={f.linen} radius={.1}/>)}
    <Block p={[-1.06, .58, -.95]} s={[1.1, .27, .95]} material={f.linen} radius={.1}/>
  </group>;
}
