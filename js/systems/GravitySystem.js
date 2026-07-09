/**
 * GravitySystem — แรงโน้มถ่วง: ลูกกวาดหล่นเติมช่องว่าง + เกิดใหม่จากด้านบน
 *
 * ⚠️ v0.2.0 Alpha: โครงเปล่าตามแผน — ยังไม่ implement
 */
export class GravitySystem {
  /**
   * @param {import('../board/Board.js').Board} board
   */
  constructor(board) {
    this.board = board;
  }

  /**
   * ทำให้ลูกกวาดหล่นลงล่าง เติมช่องว่างในแต่ละคอลัมน์
   * @returns {Array<{col:number, fromRow:number, toRow:number}>} รายการที่หล่น (ไว้ทำอนิเมชัน)
   */
  applyGravity() {
    // TODO v0.2.1: compact แต่ละคอลัมน์จากล่างขึ้นบน
    return [];
  }

  /**
   * เติมลูกกวาดใหม่ในช่องว่างที่เหลือ (spawn จากเหนือกระดาน)
   * @returns {Array<{col:number, row:number}>} ช่องที่ถูกเติม
   */
  refill() {
    // TODO v0.2.1
    return [];
  }
}
