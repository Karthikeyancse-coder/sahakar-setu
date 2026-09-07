import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  Download,
  Mail,
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  Lock,
  Send,
  X,
  AlertCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { api } from '../../lib/api';
import { downloadSkillCardPdf } from '../../utils/skillCardPdfGenerator';

interface PublicSkillCardData {
  publicToken: string;
  registrationId: string;
  lastUpdated: string;
  trainee: {
    name: string;
    nameHi?: string;
    avatarUrl?: string;
    designation: string;
    cooperativeAffiliation: string;
    instituteName: string;
    district: string;
    state: string;
    preferredLanguage: string;
    isKycVerified: boolean;
    verificationBadges: {
      identityVerified: boolean;
      trainingVerified: boolean;
      certificateVerified: boolean;
    };
  };
  summary: {
    coursesCompleted: number;
    certificatesCount: number;
    trainingHours: number;
    verifiedSkillsCount: number;
    employmentApplications: number;
  };
  verifiedSkills: Array<{
    name: string;
    sourceCourse: string;
    category: string;
    verificationStatus: string;
    verifiedBy: string;
  }>;
  completedCourses: Array<{
    id: string;
    title: string;
    titleHi?: string;
    status: string;
    durationHours: number;
    category: string;
    level: string;
    institute: string;
    completionDate: string;
  }>;
  certificates: Array<{
    id: string;
    certificateNumber: string;
    courseTitle: string;
    courseTitleHi?: string;
    instituteName: string;
    issuedDate: string;
    grade: string;
    status: string;
    verificationToken: string;
  }>;
  employmentReadiness: {
    status: string;
    badges: string[];
    relevantRoles: string[];
  };
  securityNotice: {
    federatedLedger: string;
    digitalSignature: string;
    isAuthentic: boolean;
  };
}

export const SkillCardPublic: React.FC = () => {
  const { activeViewParams, navigate } = useApp();
  const token = activeViewParams?.token || 'token-rameshwar-2026';

  const [cardData, setCardData] = useState<PublicSkillCardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Recruiter modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [recruiterName, setRecruiterName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [proposedRole, setProposedRole] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.skillCard
      .getPublicCard(token)
      .then((data: PublicSkillCardData) => {
        setCardData(data);
      })
      .catch((err: any) => {
        setError(err.message || 'Unable to retrieve verified skill card. It may have been revoked or regenerated.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const handleDownloadPdf = () => {
    if (!cardData) return;
    downloadSkillCardPdf({
      traineeName: cardData.trainee.name,
      registrationId: cardData.registrationId,
      affiliation: cardData.trainee.cooperativeAffiliation,
      institute: cardData.trainee.instituteName,
      districtState: `${cardData.trainee.district}, ${cardData.trainee.state}`,
      isKycVerified: cardData.trainee.isKycVerified,
      publicToken: cardData.publicToken,
      summary: cardData.summary,
      skills: cardData.verifiedSkills,
      courses: cardData.completedCourses,
      certificates: cardData.certificates,
      roles: cardData.employmentReadiness.relevantRoles,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName || !organizationName || !recruiterEmail) return;

    setContactSubmitting(true);
    try {
      await api.skillCard.contactTrainee(token, {
        recruiterName,
        organizationName,
        recruiterEmail,
        recruiterPhone,
        jobRole: proposedRole,
        message: inquiryMessage,
      });
      setContactSuccess(true);
      setTimeout(() => {
        setIsContactModalOpen(false);
        setContactSuccess(false);
        setRecruiterName('');
        setOrganizationName('');
        setRecruiterEmail('');
        setRecruiterPhone('');
        setProposedRole('');
        setInquiryMessage('');
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to send recruiter inquiry');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        
        {/* Top Back Nav & Verification Header */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-xs font-bold text-govTeal-800 hover:text-govTeal-950 bg-white px-3.5 py-2 rounded-xl border border-govText-border shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs font-semibold text-govText-secondary hover:text-govTeal-800 bg-white px-3 py-2 rounded-xl border border-govText-border shadow-xs transition-colors cursor-pointer"
              title="Share Skill Card Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copySuccess ? 'Copied!' : 'Share'}</span>
            </button>
            <SimulatedBadge text="NCCT Verified Digital Credential" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-govText-border shadow-sm space-y-4 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-govTeal-100 mx-auto flex items-center justify-center text-govTeal-700">
              <ShieldCheck className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-govText-primary">Validating Public Skill Card...</h2>
            <p className="text-xs text-govText-secondary">
              Querying National Cooperative Database (NCD) and NCCT federated credential ledger.
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-white rounded-3xl p-10 border border-red-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Skill Card Not Accessible</h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <button
                onClick={() => navigate('home')}
                className="px-5 py-2.5 bg-govTeal-700 text-white rounded-xl text-xs font-bold hover:bg-govTeal-800 transition shadow"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        )}

        {/* Main Public Skill Card Content */}
        {!isLoading && cardData && (
          <>
            {/* 1. Official Header & Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-govText-border shadow-md relative overflow-hidden">
              {/* Decorative Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-govTeal-700 via-saffron-500 to-emerald-600" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                
                {/* Left: Avatar + Identity */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                  <div className="relative">
                    <img
                      src={cardData.trainee.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={cardData.trainee.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-3 border-govTeal-600 shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-full shadow border-2 border-white" title="Verified Credential">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-govTeal-50 border border-govTeal-200 text-govTeal-800 text-[11px] font-extrabold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-govTeal-700" />
                      <span>NCCT Digital Skill Card</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-govText-primary tracking-tight">
                      {cardData.trainee.name}
                    </h1>

                    <p className="text-xs sm:text-sm font-semibold text-govTeal-700">
                      {cardData.trainee.designation}
                    </p>

                    <div className="text-xs text-govText-secondary space-y-0.5 pt-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-govTeal-600 shrink-0" />
                        <span>{cardData.trainee.cooperativeAffiliation}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-govTeal-600 shrink-0" />
                        <span>{cardData.trainee.instituteName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Reg ID & Verification Badges */}
                <div className="flex flex-col items-center md:items-end gap-3 shrink-0 pt-2 md:pt-0">
                  <div className="bg-govBg px-4 py-2.5 rounded-xl border border-govText-border text-center md:text-right w-full sm:w-auto">
                    <span className="block text-[10px] font-bold text-govText-muted uppercase tracking-wider">
                      NCCT Registration ID
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-govTeal-900 tracking-wide">
                      {cardData.registrationId}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                    {cardData.trainee.verificationBadges.identityVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-[11px] font-bold shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Identity Verified</span>
                      </span>
                    )}

                    {cardData.trainee.verificationBadges.trainingVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-govTeal-50 border border-govTeal-300 text-govTeal-800 rounded-lg text-[11px] font-bold shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-govTeal-700" />
                        <span>Training Verified</span>
                      </span>
                    )}

                    {cardData.trainee.verificationBadges.certificateVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-[11px] font-bold shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>Certificates Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: PDF Export & Contact Trainee */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-govText-secondary text-center sm:text-left">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Privacy Protected: Private contact details are concealed per NCCT digital policy.</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-gray-50 border border-govText-border text-govText-primary rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-govTeal-700" />
                    <span>Download Skill Card</span>
                  </button>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-saffron-300" />
                    <span>Contact Trainee</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Training Achievement Summary (5 Metric Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-govText-border shadow-xs text-center space-y-1">
                <BookOpen className="w-5 h-5 text-govTeal-600 mx-auto" />
                <span className="block text-xl font-extrabold text-govText-primary">
                  {cardData.summary.coursesCompleted}
                </span>
                <span className="text-[11px] font-bold text-govText-muted uppercase tracking-wider">Courses Completed</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-govText-border shadow-xs text-center space-y-1">
                <Award className="w-5 h-5 text-saffron-600 mx-auto" />
                <span className="block text-xl font-extrabold text-govText-primary">
                  {cardData.summary.certificatesCount}
                </span>
                <span className="text-[11px] font-bold text-govText-muted uppercase tracking-wider">Certifications</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-govText-border shadow-xs text-center space-y-1">
                <Clock className="w-5 h-5 text-blue-600 mx-auto" />
                <span className="block text-xl font-extrabold text-govText-primary">
                  {cardData.summary.trainingHours} hrs
                </span>
                <span className="text-[11px] font-bold text-govText-muted uppercase tracking-wider">Training Hours</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-govText-border shadow-xs text-center space-y-1">
                <Sparkles className="w-5 h-5 text-emerald-600 mx-auto" />
                <span className="block text-xl font-extrabold text-govText-primary">
                  {cardData.summary.verifiedSkillsCount}
                </span>
                <span className="text-[11px] font-bold text-govText-muted uppercase tracking-wider">Verified Skills</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-govText-border shadow-xs text-center space-y-1 col-span-2 sm:col-span-1">
                <Briefcase className="w-5 h-5 text-purple-600 mx-auto" />
                <span className="block text-xl font-extrabold text-govText-primary">
                  {cardData.summary.employmentApplications}
                </span>
                <span className="text-[11px] font-bold text-govText-muted uppercase tracking-wider">Applications</span>
              </div>
            </div>

            {/* 3. Verified Skills Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-govText-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-govTeal-50 text-govTeal-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-govText-primary">
                      Verified Competencies & Skills
                    </h2>
                    <p className="text-xs text-govText-secondary">
                      Accredited by NCCT curriculum and verified assessment completion
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-govTeal-700 bg-govTeal-50 px-2.5 py-1 rounded-lg border border-govTeal-200">
                  {cardData.verifiedSkills.length} Skills
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {cardData.verifiedSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-govBg border border-govText-border/60 hover:border-govTeal-400 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-govText-primary leading-tight">
                        {skill.name}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    </div>
                    <div className="text-[11px] text-govText-secondary line-clamp-1">
                      {skill.sourceCourse}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-govTeal-700 pt-1 border-t border-gray-200/60">
                      <ShieldCheck className="w-3 h-3 text-govTeal-600" />
                      <span>{skill.verificationStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Completed Courses Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-govText-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-govTeal-50 text-govTeal-700">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-govText-primary">
                      Completed Training Curriculum
                    </h2>
                    <p className="text-xs text-govText-secondary">
                      Official training programs completed across NCCT institutes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {cardData.completedCourses.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {cardData.completedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl bg-white border border-govText-border hover:border-govTeal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-govTeal-50 text-govTeal-800 text-[10px] font-bold rounded-md">
                          {course.category}
                        </span>
                        <span className="text-xs font-semibold text-govText-muted">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-govText-primary">
                        {course.title}
                      </h3>
                      <p className="text-xs text-govText-secondary flex items-center gap-2">
                        <span>{course.institute}</span>
                        <span>•</span>
                        <span>{course.durationHours} Hours Duration</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      <div className="text-left sm:text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                        <span className="block text-[10px] text-govText-muted mt-0.5">
                          {course.completionDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Certifications Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-govText-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-saffron-50 text-saffron-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-govText-primary">
                      NCCT Official Certifications
                    </h2>
                    <p className="text-xs text-govText-secondary">
                      Cryptographically signed digital credentials backed by Supabase
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {cardData.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-2xl bg-gradient-to-r from-govBg via-white to-govTeal-50/20 border border-govTeal-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-saffron-100 text-saffron-800 font-bold text-[10px]">
                          {cert.grade}
                        </span>
                        <span className="text-xs font-mono font-bold text-govTeal-800">
                          {cert.certificateNumber}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-govText-primary">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-xs text-govText-secondary">
                        Issued by: <span className="font-semibold text-govText-primary">{cert.instituteName}</span> • Date: {cert.issuedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => navigate('verify_public', { certId: cert.id })}
                        className="px-4 py-2.5 bg-govTeal-700 hover:bg-govTeal-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-saffron-300" />
                        <span>Verify Certificate</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Employment Readiness & Matched Roles */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-govText-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-govText-primary">
                      Employment Readiness & Suitable Roles
                    </h2>
                    <p className="text-xs text-govText-secondary">
                      Cooperative job roles matching the trainee's verified skill matrix
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Employment Ready</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {cardData.employmentReadiness.relevantRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs font-bold flex items-center gap-2 shadow-2xs"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Government Security & Trust Footer */}
            <div className="bg-govBg rounded-2xl p-5 border border-govText-border text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-govText-secondary">
              <div className="space-y-1">
                <div className="font-bold text-govText-primary flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-govTeal-700" />
                  <span>Ministry of Cooperation — National Cooperative Database (NCD)</span>
                </div>
                <p className="text-[11px] text-govText-muted">
                  This skill card is cryptographically anchored. Real-time verification token: <span className="font-mono text-govTeal-800 font-bold">{token}</span>
                </p>
              </div>

              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-govText-border rounded-xl text-xs font-bold text-govTeal-800 transition shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Official PDF</span>
              </button>
            </div>
          </>
        )}

      </div>

      {/* Recruiter Contact Trainee Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-govText-border shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-govTeal-50 text-govTeal-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-govText-primary">Contact Verified Trainee</h3>
                  <p className="text-xs text-govText-secondary">Send an authorized employer inquiry</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold">Inquiry Sent Successfully!</h4>
                <p className="text-xs leading-relaxed">
                  Your message has been delivered directly to {cardData?.trainee.name} within their secure Sahakar Setu dashboard notifications.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-govText-primary mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="e.g. Vikram Nair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:ring-2 focus:ring-govTeal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-govText-primary mb-1">Cooperative Society / Organization *</label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Karnataka Milk Federation (KMF)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:ring-2 focus:ring-govTeal-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-govText-primary mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      placeholder="recruiter@coop.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:ring-2 focus:ring-govTeal-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-govText-primary mb-1">Mobile / Phone (Optional)</label>
                    <input
                      type="tel"
                      value={recruiterPhone}
                      onChange={(e) => setRecruiterPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:ring-2 focus:ring-govTeal-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-govText-primary mb-1">Proposed Role / Opening</label>
                  <input
                    type="text"
                    value={proposedRole}
                    onChange={(e) => setProposedRole(e.target.value)}
                    placeholder="e.g. PACS ERP Assistant"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:ring-2 focus:ring-govTeal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-govText-primary mb-1">Message for Trainee</label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Briefly describe your hiring interest or upcoming interview..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:ring-2 focus:ring-govTeal-600 outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-govTeal-50 border border-govTeal-200 rounded-xl text-[11px] text-govTeal-900 leading-relaxed">
                  <Lock className="w-3.5 h-3.5 inline mr-1 text-govTeal-700" />
                  <span>Privacy Notice: Your message will appear inside the trainee's portal notifications. The trainee's private personal contact info remains shielded until they choose to respond.</span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2.5 border border-govText-border rounded-xl text-govText-secondary font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="px-5 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-saffron-300" />
                    <span>{contactSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </PublicLayout>
  );
};
