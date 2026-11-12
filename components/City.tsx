'use client';
import { useMemo } from 'react';
import { city } from '@/lib/city';
import { Boxes } from './Architecture';
export default function City({ dusk }: { dusk: boolean }) {
  const details = useMemo(city, []);
  const materials: Record<string, { color: string; roughness?: number; metalness?: number; transparent?: boolean; opacity?: number; emissive?: string; emissiveIntensity?: number }> = {
    limestone: { color: '#aaa69a', roughness: .86 },
    plaster: { color: '#b9bcb3', roughness: .9 },
    brick: { color: '#776d61', roughness: 1 },
    paleBrick: { color: '#9a8e7c', roughness: .9 },
    glass: { color: '#697b82', roughness: .19, metalness: .65 },
    litGlass: { color: '#948e75', roughness: .3, metalness: .2, emissive: '#e9b977', emissiveIntensity: dusk ? .25 : .025 },
    frame: { color: '#424b4b', metalness: .35, roughness: .5 },
    bronze: { color: '#555b53', metalness: .55, roughness: .4 },
    ledge: { color: '#b6b5a8', roughness: .9 },
    roof: { color: '#737b75', roughness: 1 },
    railing: { color: '#859594', roughness: .2, transparent: true, opacity: .25 },
    timber: { color: '#8c7d66', roughness: .9 },
  };
  return <group>{Object.entries(details).map(([name, parts]) => <Boxes key={name} parts={parts} {...materials[name]}/>)}</group>;
}
