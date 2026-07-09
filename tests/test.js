/**
 * เทสต์ลอจิกเกม (ไม่แตะ DOM) — รัน: node tests/test.js
 * ต้องรันจากโฟลเดอร์ราก และมี package.json {"type":"module"} หรือรันผ่าน npm test
 */
import { Board } from '../js/board/Board.js';
import { Candy } from '../js/board/Candy.js';
import { MatchSystem } from '../js/systems/MatchSystem.js';
import { GravitySystem } from '../js/systems/GravitySystem.js';

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log('  ✅ ' + name); }
  else { fail++; console.log('  ❌ ' + name); }
}

/** rng แบบ seed ได้ (LCG) — ให้ผลซ้ำได้ทุกเครื่อง */
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** ตั้งชนิดลูกกวาดทั้งกระดานจาก array ของ string เช่น '01230123' */
function setTypes(board, rows) {
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const ch = rows[row][col];
      board.getCell(col, row).candy = ch === '.' ? null : new Candy(+ch);
    }
  }
}

/** แถวเติมที่หมุนต่างกัน → ไม่มี match แนวไหนเลย */
const rot = (i) => { const s = '01230123'; return s.slice(i % 4) + s.slice(0, i % 4); };
const fillers = (first) => [first, rot(1), rot(2), rot(3), rot(1), rot(2), rot(3), rot(1)];

console.log('--- Board: กระดานตั้งต้น ---');
{
  let clean = true;
  for (let i = 0; i < 30; i++) {
    const b = new Board(lcg(i * 999 + 1));
    if (new MatchSystem(b).findMatches().length > 0) clean = false;
  }
  ok(clean, 'สุ่ม 30 กระดาน ไม่มี match ตั้งต้นเลย');
}

console.log('--- MatchSystem.findMatches ---');
const board = new Board(lcg(42));
const match = new MatchSystem(board);
const gravity = new GravitySystem(board);
{
  setTypes(board, fillers('00045123'));
  const m = match.findMatches();
  ok(m.length === 1 && m[0].length === 3 && m[0].orient === 'h', 'เจอ match แนวนอน 3 ตัว');
}
{
  const rows = fillers(rot(0));
  rows[0] = '5' + rot(0).slice(1);
  rows[1] = '5' + rot(1).slice(1);
  rows[2] = '5' + rot(2).slice(1);
  setTypes(board, rows);
  const m = match.findMatches();
  ok(m.some((g) => g.orient === 'v' && g.length === 3 && g.type === 5), 'เจอ match แนวตั้ง 3 ตัว');
}
{
  setTypes(board, fillers('00001123'));
  const m = match.findMatches();
  ok(m.some((g) => g.length === 4), 'เจอ match 4 ตัว');
}
{
  setTypes(board, fillers(rot(0)));
  ok(match.findMatches().length === 0, 'กระดานไม่มี match → ว่าง');
}
{
  // รูปตัว L: แถว 0 มี 000 + คอลัมน์ 0 มี 0,0,0 → ช่องมุมนับครั้งเดียว
  const rows = fillers('00032103');
  rows[1] = '0' + rot(1).slice(1);
  rows[2] = '0' + rot(2).slice(1);
  setTypes(board, rows);
  const m = match.findMatches();
  const cells = match.collectCells(m);
  ok(m.length === 2 && cells.length === 5, 'รูปตัว L: 2 groups รวมช่องไม่ซ้ำ = 5 (ได้ ' + cells.length + ')');
}

console.log('--- GravitySystem ---');
{
  setTypes(board, fillers(rot(0)));
  board.getCell(0, 7).candy = null;
  board.getCell(0, 6).candy = null; // เจาะรูล่างคอลัมน์ 0
  const falls = gravity.applyGravity();
  ok(board.getCell(0, 7).candy !== null && board.getCell(0, 6).candy !== null, 'ลูกกวาดหล่นลงเติมล่าง');
  ok(board.getCell(0, 0).candy === null && board.getCell(0, 1).candy === null, 'ช่องว่างขึ้นไปบนสุด');
  ok(falls.length === 6 && falls.every((f) => f.col === 0 && f.toRow > f.fromRow), 'รายการหล่นถูกต้อง (6 ช่อง)');
  const spawned = gravity.refill(lcg(7));
  ok(spawned.length === 2 && board.getCell(0, 0).candy && board.getCell(0, 1).candy, 'เติมครบ 2 ช่อง');
  let full = true;
  board.forEachCell((c) => { if (!c.candy) full = false; });
  ok(full, 'หลัง refill ไม่มีช่องว่างเหลือ');
}

console.log('--- Cascade จำลองครบลูป (ไม่มีอนิเมชัน) ---');
{
  // แถวล่างสุดเว้นช่อง: '022.31..' — เติม 2 ลงช่องว่างจะได้ 222
  const rows = fillers(rot(0));
  rows[6] = '32101230';
  rows[7] = '22031032';
  setTypes(board, rows);
  // สลับ (3,7) กับ (2,7) ให้เกิด 220 → ไม่ match... ใช้เคสตรง: ตั้ง match ไว้เลยแล้ววนลูป resolve
  rows[7] = '22231032'; // 222 ที่คอลัมน์ 0-2
  setTypes(board, rows);
  let matches = match.findMatches();
  ok(matches.length === 1, 'มี match เริ่มต้น 1 group');
  let rounds = 0;
  const rng = lcg(123);
  while (matches.length > 0 && rounds < 20) {
    for (const cell of match.collectCells(matches)) cell.candy = null;
    gravity.applyGravity();
    gravity.refill(rng);
    matches = match.findMatches();
    rounds++;
  }
  ok(rounds >= 1 && rounds < 20, 'cascade จบใน ' + rounds + ' รอบ (ไม่วนไม่รู้จบ)');
  let full = true;
  board.forEachCell((c) => { if (!c.candy) full = false; });
  ok(full && match.findMatches().length === 0, 'จบแล้วกระดานเต็ม + นิ่ง (ไม่มี match ค้าง)');
}

console.log('\nผลรวม: ' + pass + ' ผ่าน, ' + fail + ' ไม่ผ่าน');
process.exit(fail > 0 ? 1 : 0);
