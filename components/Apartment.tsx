'use client';
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Boxes } from './Architecture';
import { useFinishes } from './Materials';
import { Bed, Block, Chair, Pipe, Plant, Sofa } from './Furniture';
import type { Part } from '@/lib/architecture';
export default function Apartment({ bedrooms }: { bedrooms: number }) {
  const f = useFinishes();
  const floor = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(12, 7.9);
    const uv = geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2.5, uv.getY(i) * 2.5);
    return geometry;
  }, []);
  const trim = useMemo<Part[]>(() => [
    { p: [0, .13, -4.43], s: [12, .22, .06] }, { p: [-5.92, .13, -.6], s: [.06, .22, 7.7] },
    { p: [-.87, .13, -2.45], s: [.055, .22, 3.8] }, { p: [-3.5, .13, -.45], s: [4.9, .22, .06] },
    { p: [0, 2.66, -4.43], s: [12, .12, .1] }, { p: [-5.92, 2.66, -.6], s: [.1, .12, 7.7] },
  ], []);
  const art = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 384;
    const c = canvas.getContext('2d')!;
    c.fillStyle = '#d6cbb2'; c.fillRect(0, 0, 512, 384);
    c.fillStyle = '#8b9074'; c.beginPath(); c.arc(240, 150, 96, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#c2ab87'; c.fillRect(85, 220, 350, 90);
    c.strokeStyle = '#5b6655'; c.lineWidth = 3;
    for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(145 + i * 28, 320); c.bezierCurveTo(90, 120, 370, 180, 370 + i * 8, 80); c.stroke(); }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }, []);
  useEffect(() => () => { floor.dispose(); art.dispose(); }, [floor, art]);
  return <group position={[-4.2, 0, 0]} rotation={[0, -.22, 0]}>
    <Block p={[0, -.21, .2]} s={[12.5, .42, 10.05]} material={f.stone}/>
    <mesh geometry={floor} material={f.oak} rotation={[-Math.PI / 2, 0, 0]} position={[0, .065, -.45]} receiveShadow/>
    <Block p={[0, 1.35, -4.5]} s={[12.3, 2.7, .18]} material={f.wall}/>
    <Block p={[-6, 1.35, -.65]} s={[.18, 2.7, 7.8]} material={f.wall}/>
    <Block p={[-.9, 1.35, -2.95]} s={[.15, 2.7, 3.1]} material={f.wall}/>
    <Block p={[-.9, 1.35, -.9]} s={[.15, 2.7, .55]} material={f.wall}/>
    <Block p={[-3.5, 1.35, -.47]} s={[5, 2.7, .14]} material={f.wall}/>
    <Boxes parts={trim} color="#e9e4d9" material={f.cream}/>
    <Block p={[-3.7, .105, -2.4]} s={[4.45, .055, 3.65]} material={f.rug}/>
    <Bed position={[-3.7, .08, -2.8]} finishes={f}/>
    <Block p={[-3.7, 2.05, -4.36]} s={[1.7, 1.13, .05]} material={f.walnut}/>
    <mesh position={[-3.7, 2.05, -4.32]}><planeGeometry args={[1.58, 1.01]}/><meshStandardMaterial map={art} roughness={.9}/></mesh>
    <Block p={[-5.66, 1.18, -1.4]} s={[.48, 2.24, 1.55]} material={f.walnut}/>
    {[-1.79, -1.02].map(z => <group key={z}><Block p={[-5.405, 1.18, z]} s={[.035, 2.17, .72]} material={f.cream}/><Block p={[-5.37, 1.12, z + .2]} s={[.035, .35, .025]} material={f.brass}/></group>)}
    {bedrooms > 2 ? <>
      <Block p={[-3.55, 1.15, 1.3]} s={[.12, 2.3, 3.3]} material={f.wall}/>
      <Bed position={[-4.75, .08, 1.2]} width={1.6} finishes={f}/><Bed position={[-2.3, .08, 1.2]} width={1.6} finishes={f}/>
    </> : bedrooms > 1 ? <><Block p={[-3.8, .1, 1.1]} s={[4.3, .04, 3.3]} material={f.rug}/><Bed position={[-3.75, .08, 1.1]} width={2.7} finishes={f}/></> : <>
      <Block p={[-4.7, .79, 1]} s={[2.1, .08, .85]} material={f.walnut}/>
      <Boxes parts={[-5.5, -3.9].map(x => ({ p: [x, .4, 1], s: [.08, .77, .7] }))} color="#454a40" material={f.metal}/>
      <Block p={[-4.7, .87, 1.1]} s={[.6, .045, .42]} material={f.blackGlass}/>
      <Block p={[-4.7, 1.13, .88]} s={[.6, .5, .025]} material={f.blackGlass}/>
      <Chair position={[-4.6, .08, 1.8]} finishes={f}/><Plant position={[-2, .1, 1.9]} finishes={f}/>
    </>}
    <Block p={[.3, .12, -3.1]} s={[2.2, .14, 2.7]} material={f.stone}/>
    <Block p={[1.44, 1.25, -3.1]} s={[.12, 2.5, 2.7]} material={f.wall}/>
    <Block p={[.7, 1.25, -1.75]} s={[1.6, 2.5, .12]} material={f.wall}/>
    <Block p={[.1, .2, -3.85]} s={[1.75, .16, 1]} material={f.ceramic}/>
    <Block p={[.1, 1.38, -3.29]} s={[1.75, 2.35, .025]} material={f.glass}/>
    <Block p={[.1, 2.56, -3.29]} s={[1.8, .035, .035]} material={f.brass}/>
    <Pipe points={[[.6, .4, -4.35], [.6, 2.15, -4.35], [.6, 2.25, -4.05]]} material={f.brass}/>
    <mesh position={[.6, 2.2, -4.02]} material={f.brass}><cylinderGeometry args={[.16, .16, .025, 20]}/></mesh>
    <Block p={[-.3, .55, -2.3]} s={[.9, .8, .65]} material={f.walnut}/>
    <mesh position={[-.3, .99, -2.3]} scale={[.33, .12, .25]} material={f.ceramic} castShadow><sphereGeometry args={[1, 20, 10]}/></mesh>
    <Pipe points={[[-.3, .96, -2.55], [-.3, 1.28, -2.55], [-.3, 1.3, -2.32]]} material={f.brass}/>
    <Block p={[-.79, 1.6, -2.3]} s={[.025, .9, .7]} color="#939f99"/>
    <mesh position={[.89, .41, -2.4]} scale={[.27, .38, .37]} material={f.ceramic} castShadow><sphereGeometry args={[1, 16, 10]}/></mesh>
    <Block p={[.89, .77, -2.64]} s={[.48, .55, .17]} material={f.ceramic} radius={.06}/>
    <Block p={[3.4, 1.35, -4.35]} s={[3.5, .7, .07]} material={f.stone}/>
    {[1.9, 2.9, 3.9, 4.9].map((x, i) => <group key={x}>
      <Block p={[x, .5, -3.9]} s={[.98, .88, 1]} material={f.walnut}/>
      <Block p={[x, .55, -3.375]} s={[.94, .72, .035]} material={i === 2 ? f.blackGlass : f.olive}/>
      <Block p={[x, .82, -3.34]} s={[.46, .025, .04]} material={f.brass}/>
      <Block p={[x, 2.11, -4.16]} s={[.97, .88, .52]} material={f.cream}/>
      <Block p={[x + .31, 2.03, -3.87]} s={[.024, .22, .035]} material={f.brass}/>
    </group>)}
    <Block p={[3.4, 1, -3.9]} s={[4.2, .12, 1.12]} material={f.stone}/>
    <Block p={[3.9, 1.07, -3.85]} s={[.9, .026, .73]} material={f.blackGlass}/>
    {[[-.22, -.2], [.22, -.2], [-.22, .2], [.22, .2]].map(([x, z], i) => <mesh key={i} position={[3.9 + x, 1.089, -3.85 + z]} rotation={[-Math.PI / 2, 0, 0]} material={f.metal}><torusGeometry args={[.115, .012, 5, 20]}/></mesh>)}
    <Block p={[1.93, 1.07, -3.85]} s={[.7, .025, .55]} material={f.metal}/>
    <Block p={[1.93, 1.085, -3.85]} s={[.57, .025, .43]} material={f.blackGlass}/>
    <Pipe points={[[1.93, 1.04, -4.17], [1.93, 1.47, -4.17], [1.93, 1.58, -3.93], [1.93, 1.39, -3.8]]} material={f.brass}/>
    <Block p={[5.64, 1.35, -3.93]} s={[.78, 2.6, 1.05]} material={f.stone}/>
    <Block p={[5.64, 1.35, -3.38]} s={[.74, 2.5, .035]} material={f.olive}/>
    <Block p={[5.37, 1.36, -3.34]} s={[.025, .55, .04]} material={f.brass}/>
    <mesh position={[3.4, 1.65, -3.87]}><boxGeometry args={[4, .025, .045]}/><meshStandardMaterial color="#e8d2a9" emissive="#e8c58a" emissiveIntensity={1.4}/></mesh>
    <Block p={[4.85, 1.29, -3.9]} s={[.35, .43, .32]} material={f.blackGlass}/>
    <Plant position={[1.7, 1.07, -3.88]} scale={.3} finishes={f}/>
    <Block p={[2.2, .8, -1.2]} s={[2, .12, 1.1]} material={f.walnut} radius={.1}/>
    <Boxes parts={[-1, 1].flatMap(x => [-1, 1].map(z => ({ p: [2.2 + x * .75, .41, -1.2 + z * .3] as [number, number, number], s: [.075, .75, .075] })))} color="#665b46" material={f.walnut}/>
    <Chair position={[1.55, .08, -.25]} rotation={Math.PI} finishes={f}/><Chair position={[2.85, .08, -.25]} rotation={Math.PI} finishes={f}/>
    <Chair position={[1.55, .08, -2.15]} finishes={f}/><Chair position={[2.85, .08, -2.15]} finishes={f}/>
    <mesh position={[2.2, .92, -1.2]} material={f.ceramic}><cylinderGeometry args={[.22, .13, .18, 20]}/></mesh>
    {[1.7, 2.7].map(x => <group key={x}><mesh position={[x, 2.7, -1.2]} castShadow material={f.metal}><cylinderGeometry args={[.15, .34, .22, 24]}/></mesh><mesh position={[x, 3.12, -1.2]} material={f.metal}><cylinderGeometry args={[.008, .008, .65, 5]}/></mesh><mesh position={[x, 2.58, -1.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.29, 24]}/><meshBasicMaterial color="#e9cc98"/></mesh></group>)}
    <Block p={[3.25, .1, 1.22]} s={[4.95, .055, 3.1]} material={f.rug}/>
    <Sofa position={[3.3, .08, 2.4]} finishes={f}/>
    <Block p={[3.4, .46, .8]} s={[1.8, .13, .9]} material={f.stone} radius={.13}/>
    <Boxes parts={[-.55, .55].map(x => ({ p: [3.4 + x, .27, .8], s: [.16, .35, .6] }))} color="#8e7d66" material={f.walnut}/>
    {[0, 1, 2].map(i => <Block key={i} p={[3.1, .56 + i * .045, .8]} s={[.44, .04, .32]} color={['#4e5d4b', '#c4b599', '#b9b6a9'][i]} r={[0, i * .1, 0]}/>)}
    <mesh position={[3.85, .61, .8]} material={f.ceramic}><cylinderGeometry args={[.07, .11, .2, 16]}/></mesh>
    <Chair position={[.78, .08, 1.1]} rotation={Math.PI / 2} finishes={f}/>
    <Block p={[5.65, .37, .5]} s={[.45, .65, 2.2]} material={f.walnut}/>
    <Block p={[5.69, 1.25, .5]} s={[.055, 1.15, 1.95]} material={f.blackGlass}/>
    <Plant position={[5.5, .1, 2.7]} scale={.85} finishes={f}/>
    <Block p={[0, .1, 4.25]} s={[12, .15, 1.9]} material={f.oak}/>
    <Boxes color="#514c3f" parts={Array.from({ length: 48 }, (_, i) => ({ p: [-5.85 + i * .25, .185, 4.25], s: [.012, .012, 1.9] }))}/>
    <Block p={[0, .8, 5.15]} s={[12, 1.2, .025]} material={f.glass}/>
    <Boxes parts={[-6, -3, 0, 3, 6].map(x => ({ p: [x, .82, 5.15], s: [.04, 1.3, .055] }))} color="#3b463f" material={f.metal}/>
    <Block p={[0, 1.47, 5.15]} s={[12, .04, .055]} material={f.metal}/>
    <Block p={[0, .23, 3.2]} s={[12, .07, .1]} material={f.metal}/>
    <Boxes parts={[-6, -2, 2, 6].map(x => ({ p: [x, 1.3, 3.2], s: [.045, 2.4, .08] }))} color="#3b463f" material={f.metal}/>
    <Chair position={[1.2, .2, 4.25]} rotation={.5} finishes={f} outdoor/><Chair position={[3, .2, 4.25]} rotation={-.5} finishes={f} outdoor/>
    <mesh position={[2.1, .75, 4.4]} material={f.stone} castShadow><cylinderGeometry args={[.42, .42, .08, 28]}/></mesh>
    <mesh position={[2.1, .46, 4.4]} material={f.metal}><cylinderGeometry args={[.04, .1, .55, 8]}/></mesh>
    <Plant position={[5.5, .2, 4.6]} scale={1.1} finishes={f}/><Plant position={[-5.4, .2, 4.6]} scale={.9} finishes={f}/>
    <pointLight position={[3.4, 1.7, -3.5]} color="#eac694" intensity={1.4} distance={5}/>
    <pointLight position={[-3.7, 1.3, -3.8]} color="#ebc99b" intensity={1.2} distance={4}/>
  </group>;
}
