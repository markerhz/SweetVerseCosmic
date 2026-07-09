# 🌌 SweetVerse Cosmic

เกม Match-3 กึ่งแอคชั่นตีมลูกกวาดอวกาศ — HTML5 Canvas ล้วน ไม่ใช้เฟรมเวิร์ก ไม่ใช้ไลบรารี

**เวอร์ชันปัจจุบัน: v0.2.1 Alpha** — เล่นได้จริงแล้ว: match, gravity, cascade ครบ
บนสถาปัตยกรรมเอนจินที่วางไว้ใน v0.2.0 รองรับการพัฒนาต่อยาวๆ จนเป็นเกมอินดี้เต็มรูปแบบ

## 🚀 วิธีรัน

โปรเจกต์ใช้ ES Modules จึงต้องรันผ่านเว็บเซิร์ฟเวอร์ (เปิดไฟล์ตรงๆ ไม่ได้):

```bash
# วิธีที่ 1: Python
python3 -m http.server 8000

# วิธีที่ 2: Node
npx serve .
```

แล้วเปิด `http://localhost:8000`

หรือเปิดผ่าน **GitHub Pages**: Settings → Pages → Deploy from branch → main

## 📁 โครงสร้างโปรเจกต์

```
SweetVerseCosmic/
├── index.html
├── css/style.css
├── js/
│   ├── main.js            # จุดเริ่มต้น
│   ├── engine/
│   │   ├── Game.js        # หัวใจเกม: state, ลูปหลัก, เชื่อมทุกส่วน
│   │   ├── Renderer.js    # งานวาดทั้งหมด (canvas, retina, mobile resize)
│   │   ├── Input.js       # pointer → พิกัดช่องบนกระดาน
│   │   └── Animation.js   # ตัวจัดการ tween กลาง (Promise-based)
│   ├── board/
│   │   ├── Board.js       # กระดาน 8x8 (ข้อมูลล้วน)
│   │   ├── Cell.js        # ช่อง 1 ช่อง
│   │   └── Candy.js       # ลูกกวาด 1 เม็ด (6 ชนิด)
│   └── systems/           # ⚠️ โครงเปล่า รอ implement
│       ├── MatchSystem.js
│       ├── GravitySystem.js
│       ├── ScoreSystem.js
│       └── SaveSystem.js
├── assets/                # sprites / audio / fonts / effects (ยังว่าง)
└── docs/                  # ROADMAP, GDD, CHANGELOG
```

**หลักการแยกความรับผิดชอบ:** Board ไม่รู้เรื่องการวาด, Renderer ไม่รู้กติกา,
Input ไม่รู้ลอจิก — ทุกอย่างเชื่อมกันที่ `Game.js` ที่เดียว ไม่มีตัวแปร global

## ✨ ฟีเจอร์ปัจจุบัน (v0.2.1 Alpha)

- Canvas engine 60 FPS, ปรับขนาดตามจอมือถือ + คมชัดบน retina
- อาร์ต 8-bit + CRT: สไปรต์พิกเซล 16x16 สร้างด้วยโค้ด, เส้นสแกน, ขอบจอมืด
- กระดาน 8x8 สุ่มลูกกวาด 6 ชนิด แบบไม่มี match ตั้งต้น
- แตะเลือก → ไฮไลต์ → แตะช่องติดกันเพื่อสลับ (ไม่เกิด match = สลับกลับ)
- **Match 3+ / Gravity / Cascade** ครบ พร้อมอนิเมชันแตก-หล่น-เติม
- ชุดเทสต์ลอจิก: `npm test` (14 เทสต์)

## 🗺️ แผนต่อไป

ดูรายละเอียดใน [docs/ROADMAP.md](docs/ROADMAP.md) และแนวคิดเกมใน [docs/GDD.md](docs/GDD.md)

สรุปสั้นๆ: Match/Gravity/Cascade → คะแนน chips×mult → **ระบบ Joker แบบ Balatro** →
เอฟเฟกต์/เสียง → เซฟเกม → ออนไลน์ → แอพ Android
