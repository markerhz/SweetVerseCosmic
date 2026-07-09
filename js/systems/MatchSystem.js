/**
 * MatchSystem — ตรวจจับและจัดการ match
 *
 * ⚠️ v0.2.0 Alpha: โครงเปล่าตามแผน — ยังไม่ implement
 * ลอจิกที่ผ่านการเทสต์แล้ว (findMatchGroups / planClears / expandClears)
 * พร้อมพอร์ตเข้ามาใน v0.2.1
 */
export class MatchSystem {
  /**
   * @param {import('../board/Board.js').Board} board
   */
  constructor(board) {
    this.board = board;
  }

  /**
   * หา match ทั้งหมดบนกระดาน (แถว/คอลัมน์ที่ยาว >= 3)
   * @returns {Array<{cells: Array<{col:number,row:number}>, length:number, type:number}>}
   */
  findMatches() {
    // TODO v0.2.1: สแกนแนวนอน + แนวตั้ง หา run >= 3
    return [];
  }

  /**
   * เคลียร์ match ออกจากกระดาน + สร้างลูกกวาดพิเศษ
   * (เรียง 4 = ระเบิด, เรียง 5 = ซูเปอร์โนวา — ดู docs/GDD.md)
   * @param {Array} matches ผลจาก findMatches()
   */
  resolveMatches(matches) {
    // TODO v0.2.1
  }

  /** กระดานมีตาเดินที่เป็นไปได้เหลือไหม (กันเกมตัน) */
  hasPossibleMove() {
    // TODO v0.2.2
    return true;
  }
}
