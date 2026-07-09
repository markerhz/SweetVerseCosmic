/**
 * Renderer — งานวาดทั้งหมดอยู่ที่นี่ที่เดียว
 * - พื้นหลังอวกาศ (เนบิวลา + ดาวกะพริบ) เตรียมล่วงหน้าใน offscreen canvas
 * - ลูกกวาดเรืองแสง 6 แบบ (ตีมอวกาศ)
 * - รองรับมือถือ: ปรับขนาดตามหน้าจอ + คมชัดบนจอ retina (devicePixelRatio)
 *
 * ใช้พิกัด "logical" คงที่ 512x512 (8 ช่อง x 64px) แล้วสเกลตอนวาด
 * ทำให้ลอจิกเกมไม่ต้องสนใจขนาดจอจริงเลย
 */
export class Renderer {
  /** ขนาด logical ของกระดาน (px) */
  static LOGICAL = 512;
  /** ขนาดช่อง (px logical) */
  static CELL = 64;

  static COLORS = ['#ff4d6d', '#ffd84d', '#5cff9c', '#4db8ff', '#b46cff', '#ff9c3a'];
  static GLOW   = ['#ff8fa3', '#ffe98f', '#a8ffcf', '#a3d9ff', '#d9b3ff', '#ffc98f'];

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.buildBackground();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /** ปรับขนาด canvas ให้พอดีจอ (mobile-first) และคมชัดบน retina */
  resize() {
    const maxW = Math.min(window.innerWidth * 0.94, 512);
    const maxH = window.innerHeight - 150; // เผื่อ header + hint
    const cssSize = Math.max(240, Math.min(maxW, maxH));
    const dpr = window.devicePixelRatio || 1;

    this.canvas.style.width = cssSize + 'px';
    this.canvas.style.height = cssSize + 'px';
    this.canvas.width = Math.round(cssSize * dpr);
    this.canvas.height = Math.round(cssSize * dpr);

    /** สเกลจาก logical → พิกเซลจริง */
    this.scale = this.canvas.width / Renderer.LOGICAL;
  }

  /** แปลงพิกัดหน้าจอ → ช่องบนกระดาน (null ถ้าอยู่นอกกระดาน) */
  screenToBoard(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const lx = (clientX - rect.left) / rect.width * Renderer.LOGICAL;
    const ly = (clientY - rect.top) / rect.height * Renderer.LOGICAL;
    const col = Math.floor(lx / Renderer.CELL);
    const row = Math.floor(ly / Renderer.CELL);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    return { col, row };
  }

  /** เตรียมพื้นหลังอวกาศครั้งเดียว (วาดซ้ำทุกเฟรมจะเปลือง) */
  buildBackground() {
    const bg = document.createElement('canvas');
    bg.width = Renderer.LOGICAL; bg.height = Renderer.LOGICAL;
    const g = bg.getContext('2d');
    g.fillStyle = '#0a0e1e';
    g.fillRect(0, 0, bg.width, bg.height);
    const nebulas = [
      [130, 100, 200, 'rgba(123,92,255,.14)'],
      [400, 380, 240, 'rgba(77,184,255,.10)'],
      [420, 90, 150, 'rgba(255,77,109,.08)'],
    ];
    for (const [x, y, r, color] of nebulas) {
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'transparent');
      g.fillStyle = grad;
      g.fillRect(0, 0, bg.width, bg.height);
    }
    this.background = bg;

    /** ดาวกะพริบ */
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * Renderer.LOGICAL,
        y: Math.random() * Renderer.LOGICAL,
        r: Math.random() * 1.4 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 2,
      });
    }
  }

  /**
   * วาด 1 เฟรม
   * @param {import('../board/Board.js').Board} board
   * @param {import('../board/Cell.js').Cell|null} selected ช่องที่ถูกเลือกอยู่
   * @param {number} time เวลาปัจจุบัน (ms) ใช้ทำอนิเมชันกะพริบ/หมุน
   */
  draw(board, selected, time) {
    const ctx = this.ctx;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.clearRect(0, 0, Renderer.LOGICAL, Renderer.LOGICAL);
    ctx.drawImage(this.background, 0, 0);

    for (const s of this.stars) {
      const a = 0.3 + 0.7 * Math.abs(Math.sin(time / 1000 * s.speed + s.phase));
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }

    board.forEachCell((cell) => {
      if (cell.candy) this.drawCandy(cell, time);
    });

    if (selected) this.drawSelection(selected, time);
  }

  /** กรอบไฮไลต์ช่องที่เลือก (เต้นตุบๆ) */
  drawSelection(cell, time) {
    const ctx = this.ctx;
    const C = Renderer.CELL;
    const pulse = 2 + Math.sin(time / 150) * 1.5;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#4db8ff';
    ctx.shadowBlur = 12;
    ctx.strokeRect(cell.col * C + pulse, cell.row * C + pulse, C - pulse * 2, C - pulse * 2);
    ctx.shadowBlur = 0;
  }

  /** วาดลูกกวาดตีมอวกาศ 6 แบบ */
  drawCandy(cell, time) {
    const ctx = this.ctx;
    const C = Renderer.CELL;
    const candy = cell.candy;
    const px = cell.col * C + C / 2 + candy.offsetX;
    const py = cell.row * C + C / 2 + candy.offsetY;
    const r = (C / 2 - 7) * candy.scale;
    if (r <= 0) return;

    const color = Renderer.COLORS[candy.type];
    const glow = Renderer.GLOW[candy.type];

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    const grad = ctx.createRadialGradient(px - r * 0.35, py - r * 0.35, r * 0.1, px, py, r);
    grad.addColorStop(0, glow);
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, Renderer.shade(color, -35));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // ไฮไลต์เงาสะท้อน
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.beginPath();
    ctx.ellipse(px - r * 0.35, py - r * 0.4, r * 0.22, r * 0.13, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // สัญลักษณ์ประจำชนิด (ช่วยแยกสีสำหรับคนตาบอดสีด้วย)
    switch (candy.type) {
      case 0: { // ดาวเคราะห์มีวงแหวน
        ctx.strokeStyle = 'rgba(255,255,255,.55)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(px, py, r * 1.05, r * 0.32, -0.4, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 1: { // ดาวห้าแฉก
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        Renderer.starPath(ctx, px, py, 5, r * 0.45, r * 0.2);
        ctx.fill();
        break;
      }
      case 2: { // คริสตัล
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.beginPath();
        ctx.moveTo(px, py - r * 0.5);
        ctx.lineTo(px + r * 0.35, py);
        ctx.lineTo(px, py + r * 0.5);
        ctx.lineTo(px - r * 0.35, py);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 3: { // จันทร์เสี้ยว
        ctx.fillStyle = 'rgba(255,255,255,.65)';
        ctx.beginPath();
        ctx.arc(px, py, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px + r * 0.22, py - r * 0.1, r * 0.42, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 4: { // วงโคจร + ดวงจันทร์เล็กวิ่งรอบ
        ctx.strokeStyle = 'rgba(255,255,255,.5)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(px, py, r * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        const a = time / 300;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(px + Math.cos(a) * r * 0.55, py + Math.sin(a) * r * 0.55, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 5: { // ดาวหาง
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.beginPath();
        ctx.moveTo(px - r * 0.5, py + r * 0.4);
        ctx.lineTo(px + r * 0.1, py - r * 0.05);
        ctx.lineTo(px - r * 0.15, py + r * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + r * 0.15, py - r * 0.1, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
    ctx.restore();
  }

  /** วาดรูปดาวแฉก */
  static starPath(ctx, cx, cy, spikes, outerR, innerR) {
    let rot = -Math.PI / 2;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    for (let i = 0; i < spikes; i++) {
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    }
    ctx.closePath();
  }

  /** ปรับความสว่างของสี hex */
  static shade(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const r = clamp((n >> 16) + amount);
    const g = clamp(((n >> 8) & 255) + amount);
    const b = clamp((n & 255) + amount);
    return `rgb(${r},${g},${b})`;
  }
}
