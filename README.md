# 🌌 SweetVerse Cosmic

เกม Match-3 กึ่งแอคชั่นตีมลูกกวาดอวกาศ — HTML5 Canvas ล้วน ไม่ใช้เฟรมเวิร์ก ไม่ใช้ไลบรารี

**เวอร์ชันปัจจุบัน: v0.2.0 Alpha** — รอบนี้โฟกัส *สถาปัตยกรรม* ไม่ใช่ฟีเจอร์
เป้าหมายคือเอนจินที่แข็งแรง รองรับการพัฒนาต่อยาวๆ จนเป็นเกมอินดี้เต็มรูปแบบ

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

## ✨ ฟีเจอร์ปัจจุบัน (v0.2.0 Alpha)

- Canvas engine 60 FPS, ปรับขนาดตามจอมือถือ + คมชัดบน retina
- กระดาน 8x8 สุ่มลูกกวาด 6 ชนิด (ตีมอวกาศ: ดาวเคราะห์วงแหวน, ดาว, คริสตัล, จันทร์เสี้ยว, วงโคจร, ดาวหาง)
- แตะเลือก → ไฮไลต์ → แตะช่องติดกันเพื่อสลับ (อนิเมชันนุ่ม)
- ช่องไม่ติดกัน = ย้ายการเลือก ไม่สลับ
- พื้นหลังอวกาศ เนบิวลา + ดาวกะพริบ

## 🗺️ แผนต่อไป

ดูรายละเอียดใน [docs/ROADMAP.md](docs/ROADMAP.md) และแนวคิดเกมใน [docs/GDD.md](docs/GDD.md)

สรุปสั้นๆ: Match/Gravity/Cascade → คะแนน chips×mult → **ระบบ Joker แบบ Balatro** →
เอฟเฟกต์/เสียง → เซฟเกม → ออนไลน์ → แอพ Android
