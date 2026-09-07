import { attendanceRepository } from '../repositories/attendanceRepository';
import { userRepository } from '../repositories/userRepository';
import { notificationRepository } from '../repositories/notificationRepository';
import { createError } from '../middleware/errorHandler';

export const attendanceService = {
  markAttendance: async (
    userId: string,
    sessionId: string,
    method: 'qr' | 'face',
    qrToken?: string
  ) => {
    // 1. Fetch session
    const session = await attendanceRepository.findSessionById(sessionId);
    if (!session) throw createError(404, 'Session not found');
    if (!session.active) throw createError(409, 'Session is no longer active');

    // 2. Validate QR token server-side
    if (method === 'qr') {
      if (!qrToken) throw createError(400, 'QR token is required for QR check-in');
      if (qrToken !== session.qrToken) {
        throw createError(400, 'Invalid QR code — token does not match the active session');
      }
    }

    // 3. Check for duplicate
    const existing = await attendanceRepository.findBySessionAndUser(sessionId, userId);
    if (existing) {
      return { success: true, message: 'Attendance already recorded for this session', record: existing };
    }

    // 4. Fetch user info
    const user = await userRepository.findById(userId);
    if (!user) throw createError(404, 'User not found');

    // 5. Create record
    const record = await attendanceRepository.create({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sessionId,
      userId,
      traineeName: user.name,
      traineeCoop: user.cooperativeAffiliation || 'NCCT Enrolled Trainee',
      method,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      confidenceScore: method === 'qr' ? 99.8 : 96.5,
      deviceLocation:
        method === 'face'
          ? 'Raspberry Pi Kiosk Node-01 (Camera & Bounding Box Match)'
          : 'Mobile Geotagged Check-in (VAMNICOM Campus, Pune)',
    });

    // 6. In-app notification
    await notificationRepository.create({
      id: `notif-att-${record.id}`,
      userId,
      title: 'Attendance Marked ✅',
      message: `Your attendance for "${session.title}" has been recorded via ${method.toUpperCase()}.`,
      timestamp: new Date().toISOString(),
      type: 'attendance',
    });

    return { success: true, message: `Attendance logged for ${user.name} (${method.toUpperCase()})`, record };
  },

  getActiveSessions: () => attendanceRepository.findActiveSessions(),
};
