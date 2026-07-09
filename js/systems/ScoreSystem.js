/**
 * ScoreSystem — ระบบคะแนนแบบ "แต้มฐาน × ตัวคูณ" (แรงบันดาลใจจาก Balatro)
 *
 * ✅ v0.2.2: implement คะแนนพื้นฐานแล้ว
 *   คะแนนต่อสเต็ป = chips × mult
 *   - chips: แต้มฐานรวมของลูกกวาดที่แตก (เม็ดละ BASE_CHIPS)
 *   - mult:  1 + (cascade chain − 1) × CHAIN_MULT
 * ⏳ v0.3.0: การ์ด Joker จะเข้ามาแก้ค่า chips/mult ผ่าน hook ตรงนี้
 */
export class ScoreSystem {
  /** แต้มฐานต่อลูกกวาด 1 เม็ด */
  static BASE_CHIPS = 10;
  /** ตัวคูณที่เพิ่มต่อ cascade 1 ชั้น */
  static CHAIN_MULT = 0.5;

  constructor() {
    this.score = 0;      // คะแนนรอบปัจจุบัน (จะรีเซ็ตต่อด่านใน v0.3.0)
    this.totalScore = 0; // คะแนนสะสมทั้งเกม

    /** @type {Array<object>} การ์ด Joker ที่ถืออยู่ (v0.3.0) */
    this.jokers = [];
  }

  /**
   * คิดคะแนนจาก match 1 สเต็ปของ cascade
   * @param {import('../board/Cell.js').Cell[]} clearedCells ช่องที่แตกในสเต็ปนี้
   * @param {{chain:number}} context chain = ลำดับชั้น cascade (เริ่มที่ 1)
   * @returns {{chips:number, mult:number, gained:number}}
   */
  addMatchScore(clearedCells, context) {
    let chips = clearedCells.length * ScoreSystem.BASE_CHIPS;
    let mult = 1 + (context.chain - 1) * ScoreSystem.CHAIN_MULT;

    // TODO v0.3.0: วน hook ของ Joker มาแก้ chips / mult ตรงนี้

    const gained = Math.round(chips * mult);
    this.score += gained;
    this.totalScore += gained;
    return { chips, mult, gained };
  }

  reset() {
    this.score = 0;
  }
}
