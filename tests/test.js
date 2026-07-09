/**
 * เทสต์ลอจิกเกม (ไม่แตะ DOM) — รัน: node tests/test.js
 * ต้องรันจากโฟลเดอร์ราก และมี package.json {"type":"module"} หรือรันผ่าน npm test
 */
import { Board } from '../js/board/Board.js';
import { Candy } from '../js/board/Candy.js';
import { MatchSystem } from '../js/systems/MatchSystem.js';
import { GravitySystem } from '../js/systems/GravitySystem.js';
import { ScoreSystem } from '../js/systems/ScoreSystem.js';

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

console.log('--- ScoreSystem (chips × mult) ---');
{
  const score = new ScoreSystem();
  const cells3 = [{}, {}, {}]; // 3 เม็ด
  const r1 = score.addMatchScore(cells3, { chain: 1 });
  ok(r1.chips === 30 && r1.mult === 1 && r1.gained === 30, 'chain 1: 3 เม็ด = 30 (ได้ ' + r1.gained + ')');
  const r2 = score.addMatchScore(cells3, { chain: 2 });
  ok(r2.mult === 1.5 && r2.gained === 45, 'chain 2: mult 1.5 → 45 (ได้ ' + r2.gained + ')');
  const r3 = score.addMatchScore([{}, {}, {}, {}], { chain: 3 });
  ok(r3.mult === 2 && r3.gained === 80, 'chain 3: 4 เม็ด × mult 2 = 80 (ได้ ' + r3.gained + ')');
  ok(score.score === 155 && score.totalScore === 155, 'คะแนนสะสมถูกต้อง (155)');
  score.reset();
  ok(score.score === 0 && score.totalScore === 155, 'reset ล้างเฉพาะคะแนนรอบ ไม่ล้างคะแนนรวม');
}

console.log('--- hasPossibleMove (กันเกมตัน) ---');
{
  // กระดานที่ "ตันสนิท": แถวคู่สลับสี 0/1, แถวคี่สลับสี 2/3
  // สองชุดสีไม่ปนกัน → สลับยังไงก็เรียง 3 ไม่ได้
  const rows = [];
  for (let r = 0; r < 8; r++) {
    rows.push(r % 2 === 0 ? '01010101' : '23232323');
  }
  setTypes(board, rows);
  ok(match.hasPossibleMove() === false, 'กระดานตันจริง → ตรวจเจอว่าไม่มีตาเดิน');
}
{
  // เปิดตาเดินให้ 1 จุด: '0102' สลับกลาง → '0012'? ใช้เคสชัดๆ: แถวแรก 0,0,1,0 → สลับ (2,0)-(3,0) ได้ 000
  const rows = fillers(rot(0));
  rows[0] = '00103123';
  setTypes(board, rows);
  ok(match.hasPossibleMove() === true, 'มีตาเดิน 1 จุด → เจอ');
}
{
  let allMovable = true;
  for (let i = 0; i < 20; i++) {
    const b = new Board(lcg(i * 77 + 5));
    if (!new MatchSystem(b).hasPossibleMove()) allMovable = false;
  }
  ok(allMovable, 'กระดานสุ่ม 20 อัน มีตาเดินทุกอัน');
}
{
  // fillRandom (reshuffle): เติมใหม่แล้วไม่มี match ตั้งต้น
  const b = new Board(lcg(31337));
  b.fillRandom();
  ok(new MatchSystem(b).findMatches().length === 0, 'reshuffle แล้วไม่มี match ตั้งต้น');
}

console.log('\nผลรวม: ' + pass + ' ผ่าน, ' + fail + ' ไม่ผ่าน');
process.exit(fail > 0 ? 1 : 0);
