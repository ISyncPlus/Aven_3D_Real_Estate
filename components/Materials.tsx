'use client';
import { useEffect, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
export function useFinishes() {
  const source = useTexture(['/materials/timber-color.jpg', '/materials/timber-normal.jpg', '/materials/timber-rough.jpg', '/materials/stone-normal.jpg', '/materials/stone-rough.jpg', '/materials/fabric-normal.jpg']);
  const finishes = useMemo(() => {
    const maps = source.map((original, i) => {
      const map = original.clone();
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(i < 3 ? 1.5 : 2, i < 3 ? 1 : 2);
      map.anisotropy = 8;
      if (i === 0) map.colorSpace = THREE.SRGBColorSpace;
      map.needsUpdate = true;
      return map;
    });
    const [oak, oakNormal, oakRough, stoneNormal, stoneRough, fabricNormal] = maps;
    const materials = {
      oak: new THREE.MeshStandardMaterial({ color: '#e1d4bc', map: oak, normalMap: oakNormal, normalScale: new THREE.Vector2(.24, .24), roughnessMap: oakRough, roughness: .6 }),
      walnut: new THREE.MeshStandardMaterial({ color: '#8c7460', map: oak, roughnessMap: oakRough, roughness: .6 }),
      wall: new THREE.MeshStandardMaterial({ color: '#e5e0d5', normalMap: stoneNormal, normalScale: new THREE.Vector2(.07, .07), roughness: .88 }),
      stone: new THREE.MeshPhysicalMaterial({ color: '#d6d2c4', normalMap: stoneNormal, normalScale: new THREE.Vector2(.12, .12), roughnessMap: stoneRough, roughness: .4, clearcoat: .25 }),
      linen: new THREE.MeshStandardMaterial({ color: '#ded6c5', normalMap: fabricNormal, normalScale: new THREE.Vector2(.4, .4), roughness: .95 }),
      olive: new THREE.MeshStandardMaterial({ color: '#79836b', normalMap: fabricNormal, normalScale: new THREE.Vector2(.5, .5), roughness: .9 }),
      cream: new THREE.MeshStandardMaterial({ color: '#eee8dc', normalMap: fabricNormal, normalScale: new THREE.Vector2(.3, .3), roughness: .95 }),
      rug: new THREE.MeshStandardMaterial({ color: '#b6b09e', normalMap: fabricNormal, normalScale: new THREE.Vector2(.7, .7), roughness: 1 }),
      metal: new THREE.MeshStandardMaterial({ color: '#393d36', metalness: .7, roughness: .3 }),
      brass: new THREE.MeshStandardMaterial({ color: '#a18d66', metalness: .82, roughness: .28 }),
      ceramic: new THREE.MeshPhysicalMaterial({ color: '#f0eade', roughness: .2, clearcoat: .9 }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#b1c6c6', transparent: true, opacity: .17, metalness: .15, roughness: .1, clearcoat: 1, depthWrite: false }),
      blackGlass: new THREE.MeshPhysicalMaterial({ color: '#19242a', metalness: .45, roughness: .12, clearcoat: 1 }),
    };
    return { materials, maps };
  }, [source]);
  useEffect(() => () => { Object.values(finishes.materials).forEach(material => material.dispose()); finishes.maps.forEach(map => map.dispose()); }, [finishes]);
  return finishes.materials;
}
export type Finishes = ReturnType<typeof useFinishes>;
