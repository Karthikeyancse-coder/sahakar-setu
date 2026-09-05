# 🇮🇳 सहकार सेतु (Sahakar Setu) — "Cooperative Bridge"
### Federated Training-ERP, Multilingual LMS & Skill-to-Employment Platform for NCCT
*Built for Ministry of Cooperation • National Council for Cooperative Training (NCCT) Ecosystem*

---

## 📋 Table of Contents
1. [Overview & Problem Statement](#overview--problem-statement)
2. [Demo Credentials Table](#demo-credentials-table)
3. [Architecture Diagram](#architecture-diagram)
4. [What's Real vs. Simulated](#whats-real-vs-simulated)
5. [Key Feature Loops](#key-feature-loops)
6. [Tech Stack](#tech-stack)
7. [Getting Started Locally](#getting-started-locally)
8. [Hardware Track Deployment (Raspberry Pi Kiosk)](#hardware-track-deployment)

---

## 🌟 Overview & Problem Statement
NCCT coordinates capacity building for millions of cooperative personnel (PACS secretaries, dairy workers, SHG members, and rural youth) across **20 institutions (VAMNICOM Pune + 5 Regional ICMs + 14 State ICMs)**. Traditionally, training nominations, hostel allocations, attendance verification, and certifications operated in fragmented silos with no portable, verifiable digital record and no direct recruiter pipeline.

**Sahakar Setu** provides a unified civic platform with five connected loops:
1. **Federated Training-ERP:** Centralized programme scheduling, bulk trainee nominations, hostel bed management, and timetable builder.
2. **Multilingual LMS:** Trilingual (English, हिन्दी, मराठी) curriculum delivery with modular lessons and auto-graded interactive assessments.
3. **Hardware-Linked Attendance Kiosk:** High-contrast QR code check-in + WebCam AI facial-match biometric kiosk prototype.
4. **Cryptographically Verifiable Certification:** Auto-generated PDF certificates with public, no-login DigiLocker/NAD-compliant QR verification (`/verify/:id`).
5. **Skill-to-Employment Bridge:** Direct recruiter access for cooperative federations (AMUL, IFFCO, Apex Banks) + AI Career Sahayak.

---

## 🔑 Demo Credentials Table (Instant 1-Click Login)
The platform features an **Instant Demo Switcher** in the top navbar. You can test all 5 roles without entering passwords:

| Role | Name | Demo Email | Affiliation / Institute | Key Capabilities to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Trainee** *(Default)* | Rameshwar Patil | `rameshwar.pacs@gmail.com` | Shri Datta PACS, Niphad | Trilingual LMS, Quiz Assessment, QR Check-in, PDF Certificate, Career AI |
| **Trainee** | Sunita Devi | `sunita.shg@yahoo.com` | Prerna Mahila SHG, Barabanki | SHG Panchasutra Course, Certificate download, Job interest |
| **Institute Admin** | Dr. Rajesh Deshmukh | `admin.vamnicom@ncct.gov.in` | VAMNICOM, Pune | ERP Programmes, Bulk CSV Nominations, QR & WebCam Face Kiosk, Hostel Grid |
| **Institute Admin** | Shri Anand Tripathi | `admin.lko@ncct.gov.in` | ICM Lucknow | Batch Management, Timetable grid, Attendance audit |
| **Super Admin** | Dr. Vivek Swaroop | `secretary@ncct.gov.in` | NCCT Central Office, New Delhi | National Recharts Analytics across all 20 institutes, Registry audit |
| **Faculty** | Prof. Meenakshi Sundaram | `faculty.erp@vamnicom.gov.in` | VAMNICOM | LMS Studio, Course/Module/Lesson builder with multilingual editor |
| **Employer** | K. Patel | `careers@amul.coop` | GCMMF (AMUL), Anand | Search certified trainees by skill/institute, Post openings, Review candidates |

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer [Frontend Client Layer - React 18 + Vite + Tailwind]
        Nav[Digital India Civic Navbar & Tricolor Accent]
        TraineeUI[Trainee Mobile-First Portal]
        AdminUI[Institute Admin Desktop Workspace]
        SuperUI[National Analytics Dashboard]
        RecruiterUI[Cooperative Employer Bridge]
        PublicVerify[Public Certificate Verifier /verify/:id]
    end

    subgraph Core Engine [Sahakar Setu Core Logic & State Store]
        I18n[Trilingual Localization Engine (EN / HI / MR)]
        AuthKYC[Simulated Aadhaar e-KYC Verification Engine]
        LMS[Multilingual LMS & Interactive Quiz Engine]
        KioskEngine[WebCam Face Biometric & QR Session Engine]
        CertEngine[jsPDF Cryptographic Certificate Generator]
        OfflineEngine[PWA Offline Storage & Sync Queue]
    end

    subgraph Federated Network [NCCT 20-Institute Topology]
        VAMNICOM[VAMNICOM Pune - National Apex]
        RICMs[5 Regional Institutes (Chandigarh, Bengaluru, Kalyani, Gandhinagar, Patna)]
        ICMs[14 State Institutes (Bhopal, Chennai, Lucknow, Guwahati, Pune, etc.)]
    end

    Client Layer --> Core Engine
    Core Engine --> Federated Network
```

---

## 🔍 What's Real vs. Simulated
To guarantee an uninterrupted, zero-cost, 100% functional live demo for hackathon evaluators without requiring real government API keys:

| Feature / Integration | Real Implementation | Simulated Demo Layer |
| :--- | :--- | :--- |
| **Attendance WebCam Face Kiosk** | ✅ **Real browser `getUserMedia` webcam feed** with real-time canvas facial bounding box rendering and live confidence meter | 🟡 Feature vector matching maps to pre-stored trainee photo hashes for zero cloud latency. |
| **Attendance QR Check-in** | ✅ **Real dynamic QR code generation** using `qrcode.react` + live scanner simulation | 🟡 Geo-location coordinates use mock VAMNICOM campus coordinates. |
| **Multilingual Translations** | ✅ **Trilingual structured localization** across all UI strings and course lessons (EN, HI, MR) | 🟡 Fallback pre-translated seed dataset if `BHASHINI_API_KEY` is not provided. |
| **Aadhaar e-KYC** | ✅ **Full modal UX** accepting 12-digit mock Aadhaar, simulated OTP dispatch & state verification badge | 🟡 Clearly labeled `SIMULATED VERIFICATION — DEMO MODE`. |
| **Verifiable Certificate** | ✅ **Real client-side PDF compilation** using `jsPDF` + live public verification page (`/verify/:id`) | 🟡 Modeled on DigiLocker/NAD cryptographic verification schemas. |
| **Career Advisor Chatbot** | ✅ **Interactive rule-based decision tree** with voice speech synthesis (Web Speech API) | 🟡 Falls back to local cooperative domain knowledge graph when `LLM_API_KEY` is absent. |
| **PWA Offline Mode** | ✅ **Persistent offline banner** and local queued action synchronizer | 🟡 One-click simulation toggle to demonstrate remote PACS offline continuity. |

---

## 🚀 Key Feature Loops

### 1. Multilingual LMS & Assessment
- Supports English, Hindi, and Marathi toggled dynamically.
- Modules contain reading text, key takeaways, and multi-choice quizzes with pass thresholds (e.g. 75%).
- Passing triggers a confetti celebration and issues an official verifiable certificate.

### 2. Hardware-Linked Attendance Kiosk
- **Primary Method:** Institute Admin generates a session-specific QR token; trainees check in via mobile web.
- **Hardware-Track Showcase:** "Kiosk Mode" activates the webcam, renders a biometric bounding box on HTML5 canvas, calculates a biometric match confidence score (e.g. 96.8%), and logs the event to a persistent, exportable CSV audit table.

### 3. Public Certificate Verification (`/verify/:id`)
- Anyone (employers, banks, PACS secretaries) can scan the QR code on a PDF certificate to view the official validation record, issuing institute, performance grade, and cryptographic hash.

### 4. Recruiter & Employer Portal
- Employers like AMUL and IFFCO search certified candidates filtered by skill track (*PACS Digitalization*, *Dairy Cold Chain*, *SHG Governance*).
- Trainees can click "Express Interest" with direct recruiter linkage.

---

## 💻 Tech Stack
- **Framework:** React 18 with TypeScript + Vite
- **Styling:** Tailwind CSS (Custom *Digital India* Civic Theme: Primary `#0B6E4F`, Saffron `#E68A2E`, Neutral `#F7F5F0`)
- **Icons:** Lucide React
- **Analytics Charts:** Recharts (Responsive Bar, Area, and Pie charts)
- **PDF Generation:** jsPDF (Landscape official NCCT format)
- **QR Engine:** `qrcode.react` (SVG rendering)
- **Biometric Simulation:** HTML5 Video + Canvas 2D Rendering

---

## ⚡ Getting Started Locally

```bash
# 1. Clone the repository and navigate into folder
cd "s:\Web project\SIH"

# 2. Install dependencies (Node 18+)
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Use the **Demo Switcher** in the top navbar to explore all features instantly!
