# 🛠️ HARDWARE.md — Raspberry Pi Attendance Kiosk Deployment Guide

## 1. Overview
This document specifies how the browser-based WebCam biometric face-recognition and QR code check-in kiosk in **Sahakar Setu** maps onto a physical, edge-deployed hardware kiosk stationed at NCCT institutes (VAMNICOM, RICMs, ICMs) or remote primary credit societies (PACS).

```
+-------------------------------------------------------------+
|               SAHAKAR SETU - HARDWARE KIOSK                 |
|                                                             |
|  +-------------------------------------------------------+  |
|  | [Camera Feed: Sony IMX219 / USB Webcam]               |  |
|  |                                                       |  |
|  |        +-----------------------------------+          |  |
|  |        |    [ Facial Bounding Box ]        |          |  |
|  |        |   Biometric Score: 96.8% MATCH    |          |  |
|  |        +-----------------------------------+          |  |
|  |                                                       |  |
|  | Trainee: Rameshwar Patil (Shri Datta PACS, Niphad)    |  |
|  | Attendance Status: LOGGED & SYNCED TO NCCT CLOUD      |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [7-inch Capacitive Touch Display / HDMI 800x480]           |
+-------------------------------------------------------------+
               |                       |
      [Raspberry Pi 4 Model B]     [Local SQLite Cache]
               |
     [Ethernet / 4G SIM HAT] ---> [NCCT Federated Central Server]
```

---

## 2. Bill of Materials (BOM)

| Item | Component | Specification / Model | Est. Cost (INR) | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Single-Board Computer | **Raspberry Pi 4 Model B** (4GB RAM) | ₹5,200 | Runs local kiosk OS & lightweight ML inference |
| 2 | Optical Camera Sensor | **Raspberry Pi Camera Module v2** (8MP, Sony IMX219) or USB Wide-Angle 1080p WebCam | ₹2,400 | Captures high-definition facial frames for trainee check-in |
| 3 | Touch Display | **7-inch IPS Capacitive Touchscreen** (DSI / HDMI, 1024x600) | ₹4,100 | Visual UI, QR generation, status prompts, and voice playback |
| 4 | Power Supply & UPS | 5V 3A USB-C Power Adapter + 18650 Battery Backup Shield | ₹1,500 | Uninterrupted operation during rural grid outages |
| 5 | Enclosure | **Custom 3D-Printed / Sheet Metal Wall-Mount Kiosk Enclosure** | ₹1,800 | Tamper-resistant casing for classroom & hostel entrance |
| 6 | Connectivity Module | **SIM7600G-H 4G LTE HAT** (Optional) | ₹2,900 | Enables offline-first batch synchronization in zero-broadband PACS |
| **Total** | | | **~₹17,900** | **Complete Low-Cost Kiosk Node** |

---

## 3. Hardware Architecture & Wiring Notes

1. **Camera Connection:**
   - Ribbon cable from Camera Module v2 connects directly into the **15-pin MIPI Camera Serial Interface (CSI)** on the Raspberry Pi board.
   - For wide-angle multi-student entry gates, a USB 2.0/3.0 UVC-compliant webcam is connected to the USB 3.0 blue ports.
2. **Display Interface:**
   - 7-inch Touch LCD connects via the **DSI ribbon port** (or micro-HDMI + USB for touch signals).
3. **Audio / Voice Feedback (Optional):**
   - 3.5mm audio jack or I2S mini speaker outputs audio confirmation in Hindi/Marathi ("उपस्थिति दर्ज की गई", "हजेरी नोंदवली गेली").

---

## 4. Software Stack & Migration Path from Web App to Device

The browser code implemented in `src/views/InstituteAdmin/AttendanceKiosk.tsx` cleanly ports to the physical device through the following layers:

### A. Kiosk Operating System
- **OS:** Raspberry Pi OS Lite (64-bit Debian Bullseye).
- **Display Server:** Wayland / Chromium in Kiosk Mode (`--kiosk --disable-translate --noerrdialogs --autoplay-policy=no-user-gesture-required`).

### B. Face Recognition Pipeline on Edge
1. **Edge Frame Extraction:** The video capture loop extracts frames at 15 FPS using OpenCV / V4L2.
2. **Face Detection & Embeddings:**
   - Uses lightweight **MobileNetV2 / Ultra-Light-Fast-Generic-Face-Detector** (quantized to ONNX / TFLite format).
   - Generates a 128-dimensional facial feature embedding vector in under 120ms on the Cortex-A72 CPU.
3. **Matching Algorithm:**
   - Calculates Euclidean distance between the detected face vector and pre-enrolled trainee embeddings stored in local SQLite database.
   - If distance `< 0.45` (Confidence `> 95%`), attendance is logged locally.

### C. Offline-First Synchronization
- Attendance timestamps and GPS coordinates are stored locally in SQLite (`attendance_log.db`).
- A background worker (`sync_daemon.py` or PWA service worker) polls the NCCT Central Server every 60 seconds; when internet connectivity is detected, all queued logs upload in an atomic batch.
