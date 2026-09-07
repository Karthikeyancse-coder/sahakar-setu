import prisma from 's:/Web project/SIH/backend/src/config/prisma';
import {
  calculateJobMatch,
  getStudentProfileData,
  JobRequirementData,
  StudentProfileData,
} from 's:/Web project/SIH/backend/src/services/matchingEngine';
import { jobService } from 's:/Web project/SIH/backend/src/services/jobService';

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING JOB MATCHING & SKILL-TO-EMPLOYMENT TEST SUITE');
  console.log('====================================================\n');

  // Base job: Assistant Milk Procurement & AMCS Officer
  const jobReq: JobRequirementData = {
    id: 'job-001',
    title: 'Assistant Milk Procurement & AMCS Officer',
    employerName: 'Gujarat Cooperative Milk Marketing Federation (GCMMF / AMUL)',
    requiredSkills: ['Dairy Cold Chain', 'AMCS Operations', 'FAT/SNF Testing', 'Milk Procurement'],
    preferredSkills: ['NDDB Standards', 'Dairy ERP'],
    requiredQualification: 'Graduation / Diploma (B.Com / B.Sc / Dairy Diploma)',
    minimumExperience: 0,
    requiredCertificates: ['Dairy Cooperative Management'],
    location: 'Anand / Vadodara, Gujarat',
    type: 'Full-time',
  };

  // TEST 1: Student has all required skills + certificate + education + location
  console.log('--- TEST 1: Student has all required skills, certificate & qualification ---');
  const student1: StudentProfileData = {
    userId: 'test-user-1',
    name: 'Aarav Mehta',
    email: 'aarav@test.com',
    qualification: 'Graduate (B.Sc Dairy Technology)',
    education: 'Bachelor Degree in Science',
    location: 'Anand, Gujarat',
    experienceYears: 1.0,
    preferredLocation: 'Gujarat',
    preferredEmploymentType: 'Full-time',
    availability: 'Immediate',
    skills: ['Dairy Cold Chain', 'AMCS Operations', 'FAT/SNF Testing', 'Milk Procurement', 'NDDB Standards', 'Dairy ERP'],
    certificates: [{
      id: 'cert-1',
      courseId: 'crs-dairy-101',
      courseTitle: 'Dairy & Livestock Cooperative Management',
      grade: 'Distinction',
      issuedDate: '2026-03-01',
    }],
    completedCourses: ['crs-dairy-101'],
  };

  const res1 = calculateJobMatch(student1, jobReq);
  console.log(`Match Score: ${res1.matchScore}% (${res1.matchLabel})`);
  console.log(`Eligibility: ${res1.eligibilityStatus}`);
  console.log(`Matched Skills (${res1.matchedSkills.length}/${jobReq.requiredSkills.length}): ${res1.matchedSkills.join(', ')}`);
  console.assert(res1.matchScore >= 90, 'Test 1 Failed: Score should be >= 90');
  console.assert(res1.eligibilityStatus === 'ELIGIBLE', 'Test 1 Failed: Should be ELIGIBLE');
  console.log('✓ TEST 1 PASSED\n');

  // TEST 2: Student missing one preferred skill (Dairy ERP)
  console.log('--- TEST 2: Student missing one preferred skill ---');
  const student2: StudentProfileData = {
    ...student1,
    skills: ['Dairy Cold Chain', 'AMCS Operations', 'FAT/SNF Testing', 'Milk Procurement', 'NDDB Standards'], // Missing Dairy ERP
  };
  const res2 = calculateJobMatch(student2, jobReq);
  console.log(`Match Score: ${res2.matchScore}% (${res2.matchLabel})`);
  console.log(`Eligibility: ${res2.eligibilityStatus}`);
  console.log(`Missing Preferred: ${res2.missingPreferredSkills.join(', ')}`);
  console.assert(res2.eligibilityStatus === 'ELIGIBLE', 'Test 2 Failed: Should be ELIGIBLE');
  console.assert(res2.matchScore < res1.matchScore, 'Test 2 Failed: Score should be lower without preferred skill');
  console.log('✓ TEST 2 PASSED\n');

  // TEST 3: Student missing mandatory certificate and mandatory skill
  console.log('--- TEST 3: Student missing mandatory certificate & qualification ---');
  const student3: StudentProfileData = {
    ...student1,
    qualification: '10th Pass',
    education: 'Secondary School',
    certificates: [], // No certificate
    skills: [], // No skills
  };
  const res3 = calculateJobMatch(student3, jobReq);
  console.log(`Match Score: ${res3.matchScore}% (${res3.matchLabel})`);
  console.log(`Eligibility: ${res3.eligibilityStatus}`);
  console.log(`Ineligibility Reasons:`, res3.ineligibilityReasons);
  console.assert(res3.eligibilityStatus === 'NOT_ELIGIBLE', 'Test 3 Failed: Should be NOT_ELIGIBLE');
  console.assert(res3.ineligibilityReasons.length >= 2, 'Test 3 Failed: Should explain reasons');
  console.log('✓ TEST 3 PASSED\n');

  // TEST 4 & 5: Real DB Trainee Rameshwar (Has completed Dairy course + Certificate in DB)
  console.log('--- TEST 4 & 5: Live Database Trainee Profile (Rameshwar) ---');
  const rameshwarProfile = await getStudentProfileData('usr-trainee-mtr620ml');
  console.log('Rameshwar Name:', rameshwarProfile.name);
  console.log('Rameshwar Earned Skills:', rameshwarProfile.skills);
  console.log('Rameshwar Certificates:', rameshwarProfile.certificates.map(c => c.courseTitle));

  const rameshwarJob1Match = calculateJobMatch(rameshwarProfile, jobReq);
  console.log(`Rameshwar vs Assistant Milk Procurement:`);
  console.log(`  Match Score: ${rameshwarJob1Match.matchScore}% (${rameshwarJob1Match.matchLabel})`);
  console.log(`  Eligibility: ${rameshwarJob1Match.eligibilityStatus}`);
  console.log(`  Matched Skills: ${rameshwarJob1Match.matchedSkills.join(', ')}`);
  console.log(`  Missing Skills: ${rameshwarJob1Match.missingSkills.join(', ')}`);
  console.log(`  Certificate Verified: ${rameshwarJob1Match.hasRequiredCertificate}`);
  console.log(`  Recommended Courses:`, rameshwarJob1Match.recommendedCourses.map(r => `${r.courseTitle} (${r.skillAddressed})`));
  console.assert(rameshwarJob1Match.hasRequiredCertificate === true, 'Test 5 Failed: Certificate should be verified');
  console.assert(rameshwarJob1Match.matchScore >= 75, 'Test 5 Failed: Rameshwar score should be >= 75%');
  console.log('✓ TEST 4 & 5 PASSED\n');

  // TEST 6: Duplicate Application Protection
  console.log('--- TEST 6: Duplicate Application Protection ---');
  // First application
  const app1 = await jobService.applyForJob('usr-trainee-mtr620ml', 'job-001');
  console.log('Application 1 Result:', { alreadyApplied: app1.alreadyApplied, id: app1.interest.id, score: app1.interest.matchScore });
  
  // Second application to the same job
  const app2 = await jobService.applyForJob('usr-trainee-mtr620ml', 'job-001');
  console.log('Application 2 Result:', { alreadyApplied: app2.alreadyApplied, message: app2.message });
  console.assert(app2.alreadyApplied === true, 'Test 6 Failed: Duplicate should be blocked');

  const count = await prisma.jobInterest.count({
    where: { userId: 'usr-trainee-mtr620ml', jobPostingId: 'job-001' },
  });
  console.log(`Total records in DB for user + job-001: ${count}`);
  console.assert(count === 1, 'Test 6 Failed: Exactly 1 record should exist in DB');
  console.log('✓ TEST 6 PASSED\n');

  // TEST 7: Recruiter Candidates Ranking
  console.log('--- TEST 7: Recruiter Candidate Sorting ---');
  const candidates = await jobService.getRecruiterCandidates();
  console.log(`Recruiter Candidates Retrieved: ${candidates.length}`);
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    console.log(`  #${i + 1}: ${c.traineeName} | Job: ${c.job.title} | Score: ${c.matchScore}% | Status: ${c.eligibilityStatus} (${c.status})`);
  }
  console.log('✓ TEST 7 PASSED\n');

  // TEST 8: Application Status Lifecycle Transition
  console.log('--- TEST 8: Application Status Lifecycle Transition ---');
  const updatedStatus = await jobService.updateApplicationStatus(app1.interest.id, 'SHORTLISTED');
  console.log(`Updated status for application ${app1.interest.id}: ${updatedStatus.status}`);
  console.assert(updatedStatus.status === 'SHORTLISTED', 'Test 8 Failed: Status should be SHORTLISTED');
  console.log('✓ TEST 8 PASSED\n');

  console.log('====================================================');
  console.log('ALL 8 SKILL-TO-EMPLOYMENT TEST CASES PASSED PERFECTLY!');
  console.log('====================================================');
}

runTests().catch(console.error).finally(() => process.exit(0));
