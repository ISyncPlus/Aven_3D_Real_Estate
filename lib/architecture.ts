export type V3 = [number, number, number];
export type Part = { p: V3; s: V3; r?: V3 };
export type Parts = Record<string, Part[]>;
export function facade(): Parts {
  const parts: Parts = { stone: [], lightStone: [], dark: [], glass: [], warmGlass: [], interior: [], rail: [], metal: [], wood: [], green: [], curtain: [], roomLight: [] };
  const add = (material: string, p: V3, s: V3) => parts[material].push({ p, s });
  add('stone', [0, 1.5, -5.1], [17.6, 3, .4]);
  add('dark', [0, 1.4, .1], [17.1, 2.8, 10.1]);
  add('glass', [0, 1.55, 5.26], [17, 2.6, .07]);
  for (let x = -8; x <= 8; x += .8) add('metal', [x, 1.6, 5.32], [.045, 2.8, .08]);
  add('wood', [-2.7, 1.4, 5.34], [4.1, 2.6, .06]);
  add('dark', [0, .1, 0], [19, .25, 13]);
  for (let floor = 0; floor <= 8; floor++) {
    const y = 3 + floor * 3;
    add('lightStone', [0, y, 0], [18, .22, 12.4]);
    add('stone', [0, y - .12, 6.12], [18, .26, .15]);
    if (floor === 8) continue;
    add('interior', [0, y + 1.45, -1.1], [17.2, 2.8, 7.5]);
    add('stone', [0, y + 1.5, -4.95], [17.5, 2.9, .3]);
    for (let bay = 0; bay < 4; bay++) {
      const x = -6.525 + bay * 4.35;
      add('stone', [x - 2.05, y + 1.5, 5.5], [.29, 3, 1.3]);
      add('stone', [x + .05, y + 1.5, 5.45], [.15, 2.9, 1.25]);
      add('dark', [x, y + 1.45, 4.88], [3.84, 2.68, .16]);
      add((floor + bay) % 4 === 0 ? 'warmGlass' : 'glass', [x, y + 1.43, 4.99], [3.58, 2.48, .06]);
      for (let mullion = -1; mullion <= 1; mullion++) add('metal', [x + mullion * 1.16, y + 1.45, 5.05], [.055, 2.6, .075]);
      add('metal', [x, y + 2.65, 5.05], [3.8, .055, .08]);
      add('roomLight', [x, y + 1.42, 2.72], [3.65, 2.55, .05]);
      add('wood', [x, y + .09, 3.8], [3.65, .08, 2.05]);
      add('curtain', [x - .7, y + .58, 3.65], [1.3, .75, .55]);
      add('wood', [x + .75, y + .49, 3.7], [.75, .08, .6]);
      add('metal', [x + .75, y + .27, 3.7], [.06, .45, .06]);
      for (let fold = 0; fold < 5; fold++) add('curtain', [x - 1.58 + fold * .08, y + 1.45, 4.79 + (fold % 2) * .045], [.08, 2.4, .08]);
      add('dark', [x, y + 2.79, 4.5], [3.85, .045, 1.1]);
      add('roomLight', [x, y + 2.76, 4.65], [1.2, .026, .07]);
      add('rail', [x, y + .62, 6.06], [3.8, 1.02, .045]);
      add('metal', [x, y + 1.16, 6.1], [3.9, .045, .055]);
      add('metal', [x - 1.88, y + .65, 6.09], [.04, 1.05, .04]);
      add('metal', [x + 1.88, y + .65, 6.09], [.04, 1.05, .04]);
      if ((floor + bay) % 3 !== 0) {
        add('lightStone', [x + 1.3, y + .28, 5.58], [.7, .4, .55]);
        add('green', [x + 1.3, y + .6, 5.58], [.64, .36, .49]);
      }
      if ((floor + bay) % 2 === 0) {
        add('wood', [x - .95, y + .45, 5.5], [.55, .08, .55]);
        add('metal', [x - .95, y + .24, 5.5], [.06, .42, .06]);
        for (const chair of [-1, 1]) {
          add('wood', [x - .95 + chair * .67, y + .4, 5.55], [.4, .08, .43]);
          add('wood', [x - .95 + chair * .67, y + .64, 5.73], [.4, .45, .065]);
          for (const leg of [-1, 1]) add('metal', [x - .95 + chair * .67 + leg * .14, y + .2, 5.55], [.035, .4, .3]);
        }
      }
      if (bay % 2 === floor % 2) {
        for (let slat = 0; slat < 5; slat++) add('wood', [x - 1.55 + slat * .13, y + 1.5, 5.08], [.055, 2.5, .07]);
      }
      add('stone', [8.58, y + 1.5, 5.5], [.3, 3, 1.3]);
    }
    for (const side of [-1, 1]) {
      for (let bay = 0; bay < 3; bay++) {
        const z = -3.4 + bay * 3.4;
        add('stone', [side * 8.6, y + 1.5, z], [.25, 2.8, 3.2]);
        add('dark', [side * 8.76, y + 1.5, z], [.06, 2.45, 1.7]);
        add('glass', [side * 8.8, y + 1.5, z], [.045, 2.3, 1.52]);
        add('metal', [side * 8.84, y + 1.5, z], [.04, 2.35, .05]);
      }
    }
  }
  for (let i = 0; i <= 4; i++) add('stone', [-8.65 + i * 4.325, 1.55, 5.6], [.3, 3.1, 1.2]);
  add('stone', [0, 27.35, -5.8], [18, .5, .28]);
  add('stone', [-8.85, 27.35, 0], [.28, .5, 12]);
  add('stone', [8.85, 27.35, 0], [.28, .5, 12]);
  add('stone', [0, 27.35, 6], [18, .5, .25]);
  add('lightStone', [-2.5, 28.1, -1], [7.7, 2, 5.5]);
  add('metal', [-2.5, 29.16, -1], [8, .15, 5.8]);
  for (let i = 0; i < 14; i++) add('wood', [2.5 + i * .35, 29, 2.4], [.16, .13, 5.5]);
  for (const x of [2.5, 7.1]) for (const z of [-.1, 4.8]) add('metal', [x, 28, z], [.1, 2, .1]);
  add('stone', [4.8, 27.3, 4], [4, .5, .7]);
  add('green', [4.8, 27.65, 4], [3.8, .35, .65]);
  return parts;
}
