export type Residence = { id: string; floor: number; position: number; bedrooms: number; area: number; terrace: number; available: boolean; name: string; price: number };
export const residences: Residence[] = Array.from({ length: 32 }, (_, i) => {
  const floor = Math.floor(i / 4) + 1;
  const position = i % 4;
  return { id: `${floor}${String.fromCharCode(65 + position)}`, floor, position,
    bedrooms: [2, 1, 2, 3][position], area: [86, 64, 92, 128][position] + (floor > 6 ? 4 : 0),
    terrace: [12, 8, 14, 22][position], available: ![2, 7, 9, 14, 16, 21, 27, 30].includes(i),
    name: ['The Garden', 'The Pied-à-terre', 'The Terrace', 'The Corner'][position],
    price: [285_000_000, 185_000_000, 310_000_000, 465_000_000][position] + (floor - 1) * 7_500_000 };
});
export const unitsOnFloor = (floor: number) => residences.filter(unit => unit.floor === floor);
export const availableOnFloor = (floor: number) => unitsOnFloor(floor).filter(unit => unit.available);
export function getResidence(id: string) { return residences.find(unit => unit.id === id); }

export const money = (price: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
