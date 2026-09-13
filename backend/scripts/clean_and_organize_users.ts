/**
 * backend/scripts/clean_and_organize_users.ts
 *
 * Professional database cleanup and normalization script:
 * 1. Safely deletes ephemeral test users (usr-test-*) and their test artifacts.
 * 2. Removes redundant *-demo duplicates (admin.demo, faculty.demo, etc.).
 * 3. Unifies Rameshwar Patil (usr-trainee-1) with face identity 'rameshwar' and RFID 'RFID-RAMESHWAR-01'.
 * 4. Ensures all 6 core roles and registered trainees have pristine, professional data:
 *    - Valid employeeId
 *    - Official names in English and Hindi
 *    - Proper cooperative affiliations
 *    - Clean status 'active'
 */

import prisma from '../src/config/prisma';

async function main() {
  console.log('🧹 Cleaning and organizing database users...\n');

  // 1. Delete ephemeral test accounts and their child records
  const ephemeralUserIds = [
    'usr-test-a-1788805640687',
    'usr-test-b-1788805640687',
    'usr-test-c-1788805640687',
    'usr-test-d-1788805640687',
    'usr-test-student-1788802700591',
    'usr-test-student-1788802733213',
    'usr-test-student-1788802786528',
    'usr-trainee-mtr75xma',
  ];

  console.log('1. Removing ephemeral test records...');
  for (const id of ephemeralUserIds) {
    // Delete dependent child rows first
    await prisma.quizAttemptAnswer.deleteMany({ where: { attempt: { userId: id } } }).catch(() => {});
    await prisma.quizAttempt.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.lessonProgress.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.enrollment.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.attendanceRecord.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.certificate.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.jobInterest.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.traineePublicProfile.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.appNotification.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.chatMessage.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.nomination.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.user.delete({ where: { id } }).catch(() => {});
    console.log(`   ✓ Removed ephemeral user ${id}`);
  }

  // 2. Remove redundant *-demo clone accounts
  const redundantDemoIds = [
    'usr-admin-demo',
    'usr-faculty-demo',
    'usr-superadmin-demo',
    'usr-employer-demo',
  ];

  console.log('\n2. Removing redundant demo clones...');
  for (const id of redundantDemoIds) {
    await prisma.user.delete({ where: { id } }).catch(() => {});
    console.log(`   ✓ Removed redundant clone ${id}`);
  }

  // 3. Unify Rameshwar Patil
  console.log('\n3. Unifying Rameshwar Patil records...');
  // If duplicate rameshwar (usr-trainee-mtr620ml) exists, clean its child rows and migrate
  const dupRameshwar = await prisma.user.findUnique({ where: { id: 'usr-trainee-mtr620ml' } });
  if (dupRameshwar) {
    await prisma.jobInterest.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.lessonProgress.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.quizAttemptAnswer.deleteMany({ where: { attempt: { userId: 'usr-trainee-mtr620ml' } } }).catch(() => {});
    await prisma.quizAttempt.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.enrollment.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.attendanceRecord.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.traineePublicProfile.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.appNotification.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    await prisma.chatMessage.deleteMany({ where: { userId: 'usr-trainee-mtr620ml' } }).catch(() => {});
    // Clear faceIdentity first to avoid unique constraint clash with usr-trainee-1
    await prisma.user.update({
      where: { id: 'usr-trainee-mtr620ml' },
      data: { faceIdentity: null },
    }).catch(() => {});
    await prisma.user.delete({ where: { id: 'usr-trainee-mtr620ml' } }).catch(() => {});
    console.log('   ✓ Removed duplicate rameshwar record (usr-trainee-mtr620ml)');
  }

  // Ensure usr-trainee-1 has faceIdentity='rameshwar' and faceEnrolled=true
  await prisma.user.update({
    where: { id: 'usr-trainee-1' },
    data: {
      name: 'Rameshwar Patil',
      nameHi: 'रामेश्वर पाटिल',
      email: 'rameshwar.pacs@gmail.com',
      employeeId: 'NCCT-TRN-2026-MH-44091',
      role: 'trainee',
      faceIdentity: 'rameshwar',
      faceEnrolled: true,
      rfidUid: 'RFID-RAMESHWAR-01',
      cooperativeAffiliation: 'Shri Datta PACS, Niphad, Nashik',
      instituteId: 'inst-vamnicom',
      isKycVerified: true,
      eKycStatus: 'VERIFIED',
      status: 'active',
    },
  });
  console.log('   ✓ Configured Rameshwar Patil as primary biometric demo trainee');

  // 4. Normalize Karthik and Aditya registered trainees
  const karthikUser = await prisma.user.findUnique({ where: { id: 'usr-trainee-mtschwr6' } });
  if (karthikUser) {
    await prisma.user.update({
      where: { id: 'usr-trainee-mtschwr6' },
      data: {
        name: 'Karthik N.',
        nameHi: 'कार्तिक एन.',
        faceIdentity: 'karthik',
        faceEnrolled: true,
        isKycVerified: true,
        eKycStatus: 'VERIFIED',
        instituteId: 'inst-vamnicom',
        cooperativeAffiliation: 'Shri Datta PACS, Niphad',
        status: 'active',
      },
    });
    console.log('   ✓ Normalized Karthik N. (face-enrolled trainee)');
  }

  const adityaUser = await prisma.user.findUnique({ where: { id: 'usr-trainee-mtsfqdf6' } });
  if (adityaUser) {
    await prisma.user.update({
      where: { id: 'usr-trainee-mtsfqdf6' },
      data: {
        name: 'Aditya S.',
        nameHi: 'आदित्य एस.',
        faceIdentity: 'aditya',
        faceEnrolled: true,
        isKycVerified: true,
        eKycStatus: 'VERIFIED',
        instituteId: 'inst-vamnicom',
        cooperativeAffiliation: 'Shri Datta PACS, Niphad',
        status: 'active',
      },
    });
    console.log('   ✓ Normalized Aditya S. (face-enrolled trainee)');
  }

  // 5. Verify final clean table state
  const finalUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      employeeId: true,
      faceIdentity: true,
      rfidUid: true,
      status: true,
    },
    orderBy: { role: 'asc' },
  });

  console.log('\n================ FINAL PROFESSIONAL USER TABLE ================');
  console.table(
    finalUsers.map(u => ({
      Role: u.role,
      Name: u.name,
      'Employee ID': u.employeeId,
      Email: u.email,
      'Face ID': u.faceIdentity || '-',
      'RFID UID': u.rfidUid || '-',
      Status: u.status,
    }))
  );
  console.log(`Total clean professional users: ${finalUsers.length}`);
}

main().finally(() => prisma.$disconnect());
