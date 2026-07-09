/**
 * ScoreSystem — ระบบคะแนนแบบ "แต้มฐาน × ตัวคูณ" (แรงบันดาลใจจาก Balatro)
 *
 * ⚠️ v0.2.0 Alpha: โครงเปล่าตามแผน — ยังไม่ implement
 *
 * แผนออกแบบ (ดู docs/GDD.md):
 *   คะแนนต่อสเต็ป = chips × mult
 *   - chips: แต้มฐานรวมของลูกกวาดที่แตก
 *   - mult:  ตัวคูณจาก cascade chain + การ์ด Joker
 *   ระบบ Joker (v0.3.0): การ์ดที่เปลี่ยนวิธีคิดคะแนน ถือได้สูงสุด 5 ใบ
 */
export class ScoreSystem {
  constructor() {
    this.score = 0;
    this.totalScore = 0;

    /** @type {Array<object>} การ์ด Joker ที่ถืออยู่ (v0.3.0) */
    this.jokers = [];
  }

  /**
   * คิดคะแนนจาก match 1 สเต็ป
   * @param {Array} clearedCandies ลูกกวาดที่แตกในสเต็ปนี้
   * @param {{chain:number}} context ข้อมูลประกอบ เช่น ลำดับ cascade
   * @returns {number} คะแนนที่ได้
   */
  addMatchScore(clearedCandies, context) {
    // TODO v0.2.2: chips × mult + hook ของ Joker
    return 0;
  }

  reset() {
    this.score = 0;
  }
}
