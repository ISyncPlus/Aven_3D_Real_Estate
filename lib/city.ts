import type { Part, Parts, V3 } from './architecture';
// Each neighbor has its own facade language; all repeated detail shares instanced geometry.
export function city(): Parts {
  const parts: Parts = { limestone: [], plaster: [], brick: [], paleBrick: [], glass: [], litGlass: [], frame: [], bronze: [], ledge: [], roof: [], railing: [], timber: [] };
  const add = (mat: string, p: V3, s: V3, r?: V3) => parts[mat].push({ p, s, r });
  const sites = [
    { x: -31, z: -23, w: 18, h: 18, d: 13, style: 'brick', levels: 6 },
    { x: -11, z: -40, w: 19, h: 24, d: 13, style: 'stone', levels: 8 },
    { x: 18, z: -39, w: 20, h: 22, d: 14, style: 'plaster', levels: 7 },
    { x: 39, z: -19, w: 20, h: 21, d: 15, style: 'stone', levels: 7 },
    { x: -52, z: -12, w: 18, h: 25, d: 15, style: 'plaster', levels: 8 },
    { x: 49, z: -43, w: 19, h: 28, d: 15, style: 'brick', levels: 9 },
    { x: -37, z: -54, w: 24, h: 29, d: 16, style: 'stone', levels: 9 },
    { x: 68, z: -21, w: 17, h: 25, d: 14, style: 'plaster', levels: 8 },
  ];
  sites.forEach(({ x, z, w, h, d, style, levels }, site) => {
    const material = style === 'brick' ? 'brick' : style === 'stone' ? 'limestone' : 'plaster';
    const floorHeight = h / levels;
    add(material, [x, h / 2, z], [w, h, d]);
    add('roof', [x, h + .08, z], [w - .35, .15, d - .35]);
    add('limestone', [x, h + .7, z - 1], [w * .48, 1.2, d * .47]);
    add('roof', [x, h + 1.35, z - 1], [w * .5, .14, d * .49]);
    for (let vent = 0; vent < 3; vent++) {
      add('frame', [x + w * .2 + vent * .85, h + .4, z - 2], [.65, .65, 1.2]);
      for (let grille = 0; grille < 4; grille++) add('ledge', [x + w * .2 + vent * .85, h + .2 + grille * .12, z - 1.38], [.58, .04, .04]);
    }
    for (const side of [0, 1, 2, 3]) {
      const front = side < 2;
      const direction = side % 2 === 0 ? 1 : -1;
      const span = front ? w : d;
      const count = Math.max(4, Math.floor(span / (style === 'stone' ? 2.75 : 2.6)));
      const bay = span / count;
      const point = (u: number, y: number, offset: number): V3 => front ? [x + u, y, z + direction * (d / 2 + offset)] : [x + direction * (w / 2 + offset), y, z + u];
      const size = (width: number, height: number, depth: number): V3 => front ? [width, height, depth] : [depth, height, width];
      const piece = (mat: string, u: number, y: number, offset: number, width: number, height: number, depth: number) => add(mat, point(u, y, offset), size(width, height, depth));
      piece('ledge', 0, .16, .15, span + .3, .32, .5);
      piece('ledge', 0, floorHeight, .1, span + .22, .2, .35);
      piece(style === 'brick' ? 'paleBrick' : 'ledge', 0, h - .18, .15, span + .5, .35, .6);
      piece(material, 0, h + .36, -.04, span, .7, .25);
      piece('ledge', 0, h + .74, .02, span + .4, .12, .4);
      for (let floor = 0; floor < levels; floor++) {
        const y = floor * floorHeight + floorHeight / 2;
        if (floor && (style !== 'plaster' || floor % 3 === 0)) piece(style === 'brick' ? 'paleBrick' : 'ledge', 0, floor * floorHeight, .055, span, .12, .24);
        for (let col = 0; col < count; col++) {
          const u = -span / 2 + bay * (col + .5);
          const ground = floor === 0;
          const width = bay * (ground ? .8 : style === 'plaster' ? .57 : .67);
          const height = floorHeight * (ground ? .76 : .61);
          piece('frame', u, y, .045, width + .18, height + .19, .16);
          piece((col + floor + site) % 11 === 0 ? 'litGlass' : 'glass', u, y, .14, width, height, .035);
          piece('bronze', u, y, .17, .04, height, .04);
          piece('ledge', u, y - height / 2 - .09, .15, width + .35, .13, .44);
          if (style === 'stone') {
            for (const edge of [-1, 1]) piece('limestone', u + edge * (width / 2 + .18), y, .18, .14, height + .3, .4);
            piece('limestone', u, y + height / 2 + .18, .17, width + .5, .16, .4);
            piece('bronze', u, y - .18, .17, width, .025, .035);
          }
          if (style === 'brick') {
            piece('paleBrick', u, y + height / 2 + .13, .13, width + .35, .14, .28);
            if (floor > 0 && col % 3 === 1 && front) {
              piece('ledge', u, y - floorHeight / 2 + .1, .6, bay - .13, .18, 1.3);
              piece('railing', u, y - .55, 1.18, bay - .22, .85, .04);
              piece('bronze', u, y - .1, 1.21, bay - .16, .045, .05);
              for (let bar = 0; bar < 7; bar++) piece('bronze', u - bay / 2 + .22 + bar * (bay - .44) / 6, y - .55, 1.21, .025, .85, .04);
            }
          }
          if (style === 'plaster' && floor % 3 === 1) piece('timber', u + width * .32, y, .19, width * .2, height, .06);
        }
      }
      if (style === 'brick') {
        for (let line = 1; line < h * 3; line++) piece('paleBrick', 0, line / 3, .006, span, .012, .012);
      }
    }
    if (style === 'stone') {
      for (let panel = 0; panel < 6; panel++) add('frame', [x - w * .3 + panel * .8, h + .22, z + d * .22], [.68, .08, 2.6], [-.16, 0, 0]);
    }
  });
  return parts;
}
