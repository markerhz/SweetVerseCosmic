# Changelog

## v0.2.0 Alpha — 2026-07-09

### เพิ่ม
- **Refactor ทั้งโปรเจกต์เป็นสถาปัตยกรรม ES6 Classes** แยกความรับผิดชอบชัดเจน ไม่มีตัวแปร global
- `engine/Game.js` — state machine (IDLE / ANIMATING), ลูปหลัก rAF, เชื่อมทุกระบบ
- `engine/Renderer.js` — วาด 60 FPS, mobile resize + devicePixelRatio, พื้นหลังอวกาศ prerender, ลูกกวาดเรืองแสง 6 แบบ
- `engine/Input.js` — pointer event → พิกัดช่อง (รองรับเมาส์และทัชในตัว)
- `engine/Animation.js` — tween manager แบบ Promise-based พร้อม easing
- `board/Board.js`, `board/Cell.js`, `board/Candy.js` — โครงสร้างข้อมูลกระดาน 8x8, 6 ชนิดลูกกวาด
- Selection: แตะเลือก + ไฮไลต์กรอบเต้น, แตะซ้ำยกเลิก, แตะไกลย้ายการเลือก
- Swap: สลับช่องติดกันพร้อมอนิเมชันนุ่ม, ล็อกอินพุตระหว่างอนิเมชัน
- System stubs พร้อม interface และแผนเวอร์ชัน: `MatchSystem`, `GravitySystem`, `ScoreSystem`, `SaveSystem`
- เอกสาร: README, ROADMAP, GDD, CHANGELOG
- **อาร์ตสไตล์ 8-bit + CRT (แบบ Balatro)**: สไปรต์พิกเซล 16x16 สร้างด้วยโค้ดล้วน (`Renderer.spriteData` เป็น pure function เทสต์ได้), ขยาย 4 เท่าไม่เกลี่ยพิกเซล, เส้นสแกน + ขอบจอมืดแบบ CRT, ดาวกะพริบแบบขั้นบันได, เนบิวลา dither, ฟอนต์พิกเซล Press Start 2P, กรอบเลือกมุมกะพริบสไตล์เรโทร

### ข้อจำกัดที่รู้อยู่แล้ว (ตั้งใจตามแผน Alpha)
- ยังไม่มี match detection — สลับแล้วค้างตำแหน่งใหม่ ไม่มีการตรวจ/สลับกลับ
- ยังไม่มี gravity, cascade, คะแนน, ลูกกวาดพิเศษ, เอฟเฟกต์, เสียง, เซฟเกม
- ต้องรันผ่านเว็บเซิร์ฟเวอร์ (ES Modules เปิดแบบ file:// ไม่ได้)

## v0.1.1

- กริด 8x8 + สุ่มสี
- แตะเลือก 2 ช่อง สลับได้เมื่อติดกัน (โค้ดโพรโทไทป์ไฟล์เดียว)
