-- CreateTable
CREATE TABLE "Institute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameHi" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "activeCount" INTEGER NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameHi" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "languagePreference" TEXT NOT NULL DEFAULT 'en',
    "instituteId" TEXT,
    "cooperativeAffiliation" TEXT,
    "avatarUrl" TEXT,
    "aadhaarMock" TEXT,
    "isKycVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT,
    "title" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleMr" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionHi" TEXT NOT NULL,
    "descriptionMr" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "modulesJson" JSONB NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "completedLessonIds" JSONB NOT NULL DEFAULT '[]',
    "completedQuizIds" JSONB NOT NULL DEFAULT '[]',
    "lastAccessedLessonId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "enrolledDate" TEXT NOT NULL,
    "completionDate" TEXT,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "traineeName" TEXT NOT NULL,
    "traineeCoop" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION,
    "deviceLocation" TEXT,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userAadhaarMock" TEXT,
    "courseId" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "courseTitleHi" TEXT,
    "instituteId" TEXT NOT NULL,
    "instituteName" TEXT NOT NULL,
    "issuedDate" TEXT NOT NULL,
    "certificateHash" TEXT NOT NULL,
    "grade" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "employerName" TEXT NOT NULL,
    "employerLogo" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredSkills" JSONB NOT NULL,
    "location" TEXT NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "postedDate" TEXT NOT NULL,
    "openingsCount" INTEGER NOT NULL,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobInterest" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "traineeName" TEXT NOT NULL,
    "traineeEmail" TEXT NOT NULL,
    "traineeSkills" JSONB NOT NULL,
    "timestamp" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',

    CONSTRAINT "JobInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "linkView" TEXT,
    "linkParams" JSONB,

    CONSTRAINT "AppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_qrToken_key" ON "Session"("qrToken");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_sessionId_userId_key" ON "AttendanceRecord"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "JobInterest_jobPostingId_userId_key" ON "JobInterest"("jobPostingId", "userId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInterest" ADD CONSTRAINT "JobInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInterest" ADD CONSTRAINT "JobInterest_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppNotification" ADD CONSTRAINT "AppNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
