import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Camera,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Users,
  ShieldCheck,
  Zap,
  Sparkles,
  MapPin,
  Clock,
  Video,
  VideoOff
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SEED_USERS } from '../../data/seedData';

export const AttendanceKiosk: React.FC = () => {
  const { sessions, attendance, markAttendance, currentUser, t } = useApp();
  const [activeTab, setActiveTab] = useState<'qr' | 'face'>('qr');
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');

  // Webcam & Face Kiosk State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    traineeName: string;
    coop: string;
    confidence: number;
    timestamp: string;
  } | null>(null);

  // QR Scanner Simulator State
  const [selectedTraineeForScan, setSelectedTraineeForScan] = useState(
    currentUser.role === 'trainee' ? currentUser.id : SEED_USERS[0].id
  );
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const selectedSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];
  const sessionAttendance = attendance.filter(a => a.sessionId === selectedSession?.id);

  // Start / Stop Camera Stream for Kiosk
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error or permission denied:', err);
      setCameraError('Webcam access not allowed or unavailable. Using virtual kiosk simulation feed.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Face Detection Loop Simulation on Canvas
  useEffect(() => {
    let animationFrameId: number;

    const drawSimulation = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          if (isCameraActive && videoRef.current) {
            ctx.drawImage(videoRef.current, 0, 0, 400, 300);
          } else {
            // Draw simulated dark feed
            ctx.fillStyle = '#1E2523';
            ctx.fillRect(0, 0, 400, 300);

            ctx.fillStyle = '#34A868';
            ctx.font = '12px Inter';
            ctx.fillText('• KIOSK CAMERA NODE-01 ACTIVE', 20, 30);
          }

          if (isDetecting) {
            // Draw scanning bounding box
            const time = Date.now() / 300;
            const offsetY = Math.sin(time) * 15;

            ctx.strokeStyle = '#E68A2E';
            ctx.lineWidth = 3;
            ctx.strokeRect(100, 60 + offsetY, 200, 180);

            // Corner indicators
            ctx.fillStyle = '#0B6E4F';
            ctx.fillRect(95, 55 + offsetY, 15, 5);
            ctx.fillRect(95, 55 + offsetY, 5, 15);
            ctx.fillRect(290, 55 + offsetY, 15, 5);
            ctx.fillRect(300, 55 + offsetY, 5, 15);

            // Text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Inter';
            ctx.fillText('BIOMETRIC AI FEATURE SCAN...', 115, 260 + offsetY);
          }
        }
      }
      animationFrameId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCameraActive, isDetecting]);

  const handleSimulateFaceScan = () => {
    setIsDetecting(true);
    setMatchResult(null);

    setTimeout(() => {
      setIsDetecting(false);
      const randomTrainee = SEED_USERS[Math.floor(Math.random() * 4)];
      const confidence = Number((95 + Math.random() * 4.8).toFixed(1));

      const res = markAttendance(selectedSession.id, 'face', randomTrainee.id, confidence);
      setMatchResult({
        traineeName: randomTrainee.name,
        coop: randomTrainee.cooperativeAffiliation || 'NCCT Trainee',
        confidence,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 1800);
  };

  const handleQrScanSubmit = () => {
    const res = markAttendance(selectedSession.id, 'qr', selectedTraineeForScan, 99.8);
    setScanNotice(res.message);
    setTimeout(() => setScanNotice(null), 4000);
  };

  const exportCsv = () => {
    const headers = 'ID,Session,Trainee Name,Cooperative,Method,Confidence,Timestamp,Location\n';
    const rows = sessionAttendance
      .map(
        a =>
          `"${a.id}","${selectedSession.title}","${a.traineeName}","${a.traineeCoop}","${a.method}","${a.confidenceScore}%","${a.timestamp}","${a.deviceLocation}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NCCT_Attendance_${selectedSession.id}.csv`;
    a.click();
  };

  return (
    <PageContainer>

      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-govText-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-extrabold text-govTeal-700 uppercase tracking-wider">
              HARDWARE TRACK SHOWCASE
            </span>
            <SimulatedBadge text="Raspberry Pi + Camera Kiosk Prototype" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-govText-primary leading-tight">
            {t.attendance.title}
          </h2>
          <p className="text-xs text-govText-secondary leading-relaxed max-w-xl">
            {t.attendance.subtitle}
          </p>
        </div>

        {/* Tab Switcher: Full width stacked on mobile/tablet (< lg), horizontal on desktop */}
        <div className="flex flex-col sm:flex-col lg:flex-row w-full lg:w-auto bg-govBg p-1.5 rounded-xl border border-govTeal-100 gap-2 lg:gap-1.5">
          <button
            onClick={() => setActiveTab('qr')}
            className={`w-full lg:w-auto px-4 py-3 sm:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${activeTab === 'qr'
                ? 'bg-govTeal-600 text-white shadow'
                : 'text-govText-secondary hover:text-govText-primary bg-white/60 lg:bg-transparent'
              }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Primary: Session QR Check-in</span>
          </button>
          <button
            onClick={() => setActiveTab('face')}
            className={`w-full lg:w-auto px-4 py-3 sm:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${activeTab === 'face'
                ? 'bg-saffron-500 text-white shadow'
                : 'text-govText-secondary hover:text-govText-primary bg-white/60 lg:bg-transparent'
              }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Hardware Showcase: Face Kiosk</span>
          </button>
        </div>
      </div>

      {/* Session Selector Bar */}
      <div className="bg-govBg p-4 rounded-xl border border-govTeal-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
        <div className="flex flex-col gap-1.5 w-full lg:w-auto min-w-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-govTeal-600 flex-shrink-0" />
            <span className="text-xs font-bold text-govText-primary">Select Session:</span>
          </div>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full max-w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-govText-border bg-white focus:outline-none focus:ring-2 focus:ring-govTeal-600 min-h-[44px] truncate"
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.timeSlot})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-semibold text-govTeal-800 bg-white px-3 py-2 rounded-lg border border-gray-200 self-start lg:self-auto shadow-xs">
          {sessionAttendance.length} Trainees Checked In
        </div>
      </div>

      {/* TAB 1: QR Code Check-in Flow */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* QR Display Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-8 border border-govText-border shadow-sm flex flex-col items-center text-center space-y-6 w-full">
            <div className="space-y-1 w-full">
              <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                Live Dynamic Token
              </span>
              <h3 className="text-base sm:text-xl font-bold text-govText-primary break-words [overflow-wrap:anywhere] leading-snug">
                {selectedSession?.title}
              </h3>
              <p className="text-xs text-govText-secondary max-w-md mx-auto">
                {t.attendance.scanInstructions}
              </p>
            </div>

            {/* Render High-Contrast Civic QR Code: width min(280px, 70vw) */}
            <div
              style={{ width: 'min(280px, 70vw)', height: 'auto' }}
              className="p-4 sm:p-5 bg-white rounded-2xl border-4 border-govTeal-600 shadow-xl relative group mx-auto flex items-center justify-center aspect-square"
            >
              <QRCodeSVG
                value={`https://sahakarsetu.gov.in/checkin?token=${selectedSession?.qrToken}`}
                size={220}
                level="H"
                fgColor="#0B6E4F"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-govTeal-900/5 backdrop-blur-[0.5px] rounded-xl pointer-events-none" />
            </div>

            <div className="bg-govBg px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-govText-secondary break-all max-w-full text-center">
              Session Token: <strong className="text-govTeal-800 break-all">{selectedSession?.qrToken}</strong>
            </div>
          </div>

          {/* Mobile Camera Scanner Simulator (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Camera className="w-5 h-5 text-govTeal-600" />
                <h4 className="font-bold text-sm text-govText-primary">
                  Trainee Mobile Camera Scanner Simulator
                </h4>
              </div>
              <p className="text-xs text-govText-secondary leading-relaxed">
                Test the mobile QR scanning experience without needing a second physical phone:
              </p>

              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1.5">
                  Select Scanning Trainee Profile:
                </label>
                <select
                  value={selectedTraineeForScan}
                  onChange={(e) => setSelectedTraineeForScan(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                >
                  {SEED_USERS.filter(u => u.role === 'trainee').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.cooperativeAffiliation})
                    </option>
                  ))}
                </select>
              </div>

              {scanNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{scanNotice}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleQrScanSubmit}
              className="w-full py-3 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-saffron-300" />
              <span>Simulate Instant Camera Scan</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: Raspberry Pi Face-Recognition Kiosk Showcase */}
      {activeTab === 'face' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Webcam & Canvas Feed (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-govText-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-saffron-600" />
                <h3 className="font-bold text-base text-govText-primary">
                  Raspberry Pi Optical Kiosk Feed
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 rounded-lg text-xs font-bold border border-govTeal-200 flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enable Real Webcam</span>
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200 flex items-center gap-1.5"
                  >
                    <VideoOff className="w-3.5 h-3.5" />
                    <span>Stop Camera</span>
                  </button>
                )}
              </div>
            </div>

            {/* Hidden video element for stream */}
            <video ref={videoRef} className="hidden" playsInline muted />

            {/* Canvas Display */}
            <div className="relative mx-auto flex justify-center bg-gray-950 rounded-2xl overflow-hidden border-2 border-govTeal-600 shadow-xl max-w-[400px]">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full h-auto block"
              />
              {isDetecting && (
                <div className="absolute top-3 left-3 bg-saffron-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                  AI MATCHING IN PROGRESS...
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                {cameraError}
              </p>
            )}

            <div className="pt-2">
              <button
                onClick={handleSimulateFaceScan}
                disabled={isDetecting}
                className="w-full py-3.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isDetecting ? 'Analyzing Face Vectors...' : 'Trigger Kiosk Face Match & Check-in'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Match Telemetry (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-sm text-govText-primary">
                Kiosk Edge Telemetry
              </h4>
              <span className="text-[10px] font-mono font-bold bg-govBg px-2 py-0.5 rounded text-govTeal-800 border border-govTeal-200">
                NODE-01 (ARM Cortex-A72)
              </span>
            </div>

            {matchResult ? (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h5 className="font-bold text-emerald-900 text-sm">Face Match Verified!</h5>
                </div>

                <div className="text-xs space-y-1 text-emerald-950 font-mono">
                  <p>Candidate: <strong className="text-sm font-sans">{matchResult.traineeName}</strong></p>
                  <p>Cooperative: {matchResult.coop}</p>
                  <p>Match Confidence: <strong className="text-emerald-700">{matchResult.confidence}%</strong></p>
                  <p>Timestamp: {matchResult.timestamp}</p>
                  <p className="text-[10px] text-emerald-700">Audit Status: Synchronized with NCCT Cloud</p>
                </div>
              </div>
            ) : (
              <div className="bg-govBg rounded-xl p-6 text-center space-y-2 border border-gray-200">
                <Cpu className="w-8 h-8 text-govTeal-600 mx-auto opacity-70" />
                <p className="text-xs font-semibold text-govText-primary">Awaiting Face Capture</p>
                <p className="text-[11px] text-govText-muted">
                  Click 'Trigger Kiosk Face Match' to simulate camera frame feature matching against pre-stored biometric vectors.
                </p>
              </div>
            )}

            <div className="bg-govBg rounded-xl p-3.5 border border-govTeal-100 text-xs text-govTeal-950 space-y-1">
              <p className="font-bold text-[11px] uppercase tracking-wider text-govTeal-800">Hardware Specs:</p>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 opacity-90">
                <li>Sensor: Sony IMX219 8MP Camera Module</li>
                <li>Inference: Client-side quantized MobileNet</li>
                <li>Fallback: Automatic offline SQLite caching</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Live Biometric & QR Attendance Audit Log Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-govText-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-govText-primary">
              {t.attendance.recentLogs}
            </h3>
            <p className="text-xs text-govText-secondary">
              Real-time audit log of attendees for session: <strong className="text-govText-primary">{selectedSession?.title}</strong>
            </p>
          </div>

          <button
            onClick={exportCsv}
            className="w-full sm:w-auto px-3.5 py-2.5 sm:py-2 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 text-xs font-bold rounded-xl border border-govTeal-200 flex items-center justify-center gap-1.5 transition-colors min-h-[44px] sm:min-h-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Audit Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-govBg text-govText-secondary uppercase font-semibold border-b border-gray-200">
                <th className="p-3">Trainee Name</th>
                <th className="p-3">Cooperative Affiliation</th>
                <th className="p-3">Method</th>
                <th className="p-3">Biometric Score</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Kiosk / Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessionAttendance.map(record => (
                <tr key={record.id} className="hover:bg-govTeal-50/40 transition-colors">
                  <td className="p-3 font-bold text-govText-primary">{record.traineeName}</td>
                  <td className="p-3 text-govText-secondary">{record.traineeCoop}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${record.method === 'face'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                      {record.method}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-govTeal-700 font-bold">
                    {record.confidenceScore}%
                  </td>
                  <td className="p-3 text-govText-muted font-mono">{record.timestamp}</td>
                  <td className="p-3 text-govText-secondary text-[11px] truncate max-w-[200px]">
                    {record.deviceLocation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </PageContainer>
  );
};
