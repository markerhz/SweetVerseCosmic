/**
 * MatchSystem — ตรวจจับ match บนกระดาน
 *
 * ✅ v0.2.1: implement findMatches แล้ว (พอร์ตจากลอจิกที่ผ่านเทสต์)
 * ⏳ v0.2.3: resolveMatches จะสร้างลูกกวาดพิเศษ (เรียง 4 = ระเบิด, เรียง 5 = โนวา)
 */
export class MatchSystem {
  /**
   * @param {import('../board/Board.js').Board} board
   */
  constructor(board) {
    this.board = board;
  }

  /**
   * หา match ทั้งหมดบนกระดาน — "run" แนวนอน/แนวตั้งที่ชนิดเดียวกันติดกัน >= 3
   * @returns {Array<{cells: import('../board/Cell.js').Cell[], length:number, type:number, orient:'h'|'v'}>}
   */
  findMatches() {
    const N = this.board.size;
    const groups = [];

    // ชนิดของช่อง (-1 = ว่าง/จับคู่ไม่ได้ — ค่าที่ไม่มีทางเท่ากัน 3 ตัวติด)
    const typeAt = (col, row) => {
      const cell = this.board.getCell(col, row);
      return (cell && cell.candy) ? cell.candy.type : -1;
    };

    // สแกนแนวนอน
    for (let row = 0; row < N; row++) {
      let col = 0;
      while (col < N) {
        const t = typeAt(col, row);
        let len = 1;
        while (col + len < N && t >= 0 && typeAt(col + len, row) === t) len++;
        if (t >= 0 && len >= 3) {
          const cells = [];
          for (let i = 0; i < len; i++) cells.push(this.board.getCell(col + i, row));
          groups.push({ cells, length: len, type: t, orient: 'h' });
        }
        col += len;
      }
    }
    // สแกนแนวตั้ง
    for (let col = 0; col < N; col++) {
      let row = 0;
      while (row < N) {
        const t = typeAt(col, row);
        let len = 1;
        while (row + len < N && t >= 0 && typeAt(col, row + len) === t) len++;
        if (t >= 0 && len >= 3) {
          const cells = [];
          for (let i = 0; i < len; i++) cells.push(this.board.getCell(col, row + i));
          groups.push({ cells, length: len, type: t, orient: 'v' });
        }
        row += len;
      }
    }
    return groups;
  }

  /**
   * รวมทุก group เป็นรายการช่องแบบไม่ซ้ำ (ช่องที่อยู่ทั้งแถวและคอลัมน์นับครั้งเดียว)
   * @param {Array} matches ผลจาก findMatches()
   * @returns {import('../board/Cell.js').Cell[]}
   */
  collectCells(matches) {
    const set = new Set();
    for (const g of matches) for (const cell of g.cells) set.add(cell);
    return Array.from(set);
  }

  /**
   * เคลียร์ match + สร้างลูกกวาดพิเศษ
   * @param {Array} matches
   */
  resolveMatches(matches) {
    // TODO v0.2.3: เรียง 4 → 💣 ระเบิด, เรียง 5 → 🌟 ซูเปอร์โนวา
  }

  /** กระดานมีตาเดินที่เป็นไปได้เหลือไหม (กันเกมตัน) */
  hasPossibleMove() {
    // TODO v0.2.2
    return true;
  }
}
