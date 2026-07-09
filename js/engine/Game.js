/**
 * Game — หัวใจของเกม เชื่อมทุกส่วนเข้าด้วยกัน
 *
 *   Input   → บอกว่าผู้เล่นแตะช่องไหน
 *   Board   → เก็บข้อมูลกระดาน/ลูกกวาด
 *   Animation → tween ค่าให้นุ่ม
 *   Renderer  → วาดทุกอย่าง
 *   Systems   → กติกาเกม (v0.2.0 ยังเป็นโครงเปล่า)
 *
 * ลูปหลัก: requestAnimationFrame → update(dt) → draw
 */
import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { Animation } from './Animation.js';
import { Board } from '../board/Board.js';
import { MatchSystem } from '../systems/MatchSystem.js';
import { GravitySystem } from '../systems/GravitySystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';

/** สถานะของเกม */
const State = {
  IDLE: 'idle',       // รออินพุต
  ANIMATING: 'animating', // กำลังเล่นอนิเมชัน ห้ามรับอินพุต
};

export class Game {
  /** ระยะเวลาอนิเมชันสลับ (ms) */
  static SWAP_DURATION = 160;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.animation = new Animation();
    this.board = new Board();

    // ---- Systems (v0.2.0: โครงเปล่า พร้อมเสียบลอจิกใน v0.2.x) ----
    this.matchSystem = new MatchSystem(this.board);
    this.gravitySystem = new GravitySystem(this.board);
    this.scoreSystem = new ScoreSystem();
    this.saveSystem = new SaveSystem();

    // ---- Input ----
    this.input = new Input(canvas, this.renderer);
    this.input.onTap = (pos) => this.handleTap(pos);

    /** @type {import('../board/Cell.js').Cell|null} ช่องที่เลือกอยู่ */
    this.selected = null;
    this.state = State.IDLE;
    this.lastTime = 0;
  }

  /** เริ่มลูปหลัก */
  start() {
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(time) {
    const dt = Math.min(32, time - this.lastTime); // กันเฟรมกระโดดตอนสลับแท็บ
    this.lastTime = time;

    this.animation.update(dt);
    this.renderer.draw(this.board, this.selected, time);

    requestAnimationFrame((t) => this.loop(t));
  }

  // =====================================================
  // การเลือก + สลับ (ฟีเจอร์หลักของ v0.2.0)
  // =====================================================

  /** ผู้เล่นแตะช่อง (col,row) */
  handleTap(pos) {
    if (this.state !== State.IDLE) return;
    const cell = this.board.getCell(pos.col, pos.row);
    if (!cell || cell.isEmpty) return;

    // ยังไม่ได้เลือกอะไร → เลือกช่องนี้
    if (!this.selected) {
      this.selected = cell;
      return;
    }
    // แตะช่องเดิม → ยกเลิกการเลือก
    if (this.selected === cell) {
      this.selected = null;
      return;
    }
    // แตะช่องติดกัน → สลับ
    if (this.selected.isAdjacentTo(cell)) {
      const from = this.selected;
      this.selected = null;
      this.swap(from, cell);
      return;
    }
    // แตะช่องไกล → ย้ายการเลือกมาช่องใหม่ (spec: ไม่ติดกัน = ไม่สลับ)
    this.selected = cell;
  }

  /**
   * สลับลูกกวาด 2 ช่องพร้อมอนิเมชันนุ่มๆ
   * v0.2.x: หลังสลับจะต่อด้วย matchSystem.findMatches() ตรงนี้
   */
  async swap(a, b) {
    this.state = State.ANIMATING;

    const C = Renderer.CELL;
    const dx = (b.col - a.col) * C;
    const dy = (b.row - a.row) * C;

    // สลับข้อมูลทันที แล้วตั้ง offset ให้ "ภาพ" ยังอยู่ที่เดิม จากนั้น tween เข้า 0
    this.board.swapCandies(a, b);
    b.candy.offsetX = -dx; b.candy.offsetY = -dy;
    a.candy.offsetX = dx;  a.candy.offsetY = dy;

    await Promise.all([
      this.animation.tween(a.candy, { offsetX: 0, offsetY: 0 }, Game.SWAP_DURATION),
      this.animation.tween(b.candy, { offsetX: 0, offsetY: 0 }, Game.SWAP_DURATION),
    ]);

    // TODO (v0.2.1):
    //   const matches = this.matchSystem.findMatches();
    //   ถ้าไม่มี match → สลับกลับ
    //   ถ้ามี → เคลียร์ → gravitySystem.apply() → scoreSystem.addMatchScore()

    this.state = State.IDLE;
  }
}
