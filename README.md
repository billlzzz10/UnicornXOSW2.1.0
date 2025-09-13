# Ashval Writer's Suite - เอกสารทางเทคนิคสำหรับนักพัฒนา

> **หมายเหตุสำคัญ:** เอกสารนี้จะต้องได้รับการอัปเดตเป็น **ภาษาไทย** เสมอ กรุณาใช้หัวข้อที่มีอยู่และเพิ่มเติมเนื้อหาต่อท้ายเมื่อมีการอัปเดตฟีเจอร์หรือโครงสร้างใหม่

---

## 1. ภาพรวมโปรเจกต์ (Overview)

**Ashval Writer's Suite** คือชุดเครื่องมือสำหรับนักเขียนที่ขับเคลื่อนด้วย AI ถูกออกแบบมาเพื่อเป็นผู้ช่วยที่ครบวงจร ตั้งแต่การจดบันทึก, จัดการไอเดีย, สร้างเนื้อหา, วางโครงเรื่อง, ไปจนถึงการสร้างและสำรวจโลกในจินตนาการผ่านแผนภาพความรู้ (Knowledge Map)

โปรเจกต์นี้เป็นแอปพลิเคชันฝั่ง Client-side ทั้งหมด (ทำงานบนเบราว์เซอร์ของผู้ใช้) โดยไม่มี Backend Server เป็นของตัวเอง ทำให้ง่ายต่อการติดตั้งและดูแลรักษา

<!-- เพิ่มภาพสาธิต GIF -->
![](assets/demo.gif)

## 2. ฟีเจอร์หลัก (Core Features)

-   **Dashboard:** ภาพรวมความคืบหน้าของโปรเจกต์, สถิติการเขียน, และภารกิจประจำวัน (Daily Quests)
-   **Notes:** ระบบจดบันทึกที่ยืดหยุ่น รองรับ Markdown, การจัดหมวดหมู่, และการนำเข้า/ส่งออก
-   **AI Writer:** ผู้ช่วยนักเขียน AI ที่ปรับเปลี่ยนบุคลิก (Personality) ได้
-   **Graph View (Knowledge Map):** แผนภาพความรู้ที่แสดงความเชื่อมโยงของข้อมูล
-   **Lore Manager:** ศูนย์กลางในการจัดการ "จุดในโครงเรื่อง" (Plot Points) และ "องค์ประกอบโลก" (World Elements)
-   **เครื่องมือเสริม:** Pomodoro Timer, Dictionary, และเครื่องมือสร้างโครงสร้างเรื่อง
-   **Markdown Tools (ใหม่):**
    -   **สร้างสารบัญอัตโนมัติ (TOC Generation):** สร้างสารบัญจาก Headings ในโน้ต
    -   **แก้ไข Markdown อัตโนมัติ (Auto-Correction):** จัดระเบียบและแก้ไขรูปแบบของ Markdown

## 3. เทคโนโลยีและเครื่องมือ (Technology Stack)

-   **Frontend Framework:** React (v19) with TypeScript
-   **Styling:** Tailwind CSS (กำหนดค่าผ่าน CDN ใน `index.html`)
-   **AI Integration:** Google Gemini API ผ่าน `@google/genai`
-   **Data Storage:** `localStorage` ของเบราว์เซอร์

## 4. วิธีการติดตั้งและพัฒนาต่อ (Setup for Development)

### 4.1. การรันโปรเจกต์ (Running the Project)

1.  Clone a copy of the repository.
2.  เปิดโฟลเดอร์โปรเจกต์ใน Code Editor
3.  ติดตั้ง Extension Live Server
4.  คลิกขวาที่ไฟล์ `index.html` แล้วเลือก "Open with Live Server"

### 4.2. การตั้งค่า API Key (สำคัญมาก)

- แก้ไขไฟล์ `index.html` เพื่อเพิ่ม `API_KEY` ของคุณ (ดูรายละเอียดในไฟล์)

## 5. โครงสร้างโฟลเดอร์ (Folder Structure)

```
/
├── assets/
├── components/
│   ├── charts/
│   ├── views/
│   └── ...
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── prompts.ts
├── README.md
├── types.ts
└── utils.ts
```

## 6. โร้ดแมพการพัฒนา (Roadmap)

### ระยะสั้น (Short-term)
- [✅] **UI/UX Overhaul**
- [✅] **Consolidated AI Mentor**
- [✅] **Custom Icon System**
- [✅] **Graph View Enhancement**
- [✅] **TOC Generation**
- [✅] **Markdown Auto-Correction**
- [ ] **Auto-Outlining**
- [ ] **Advanced Note Linking**
