import React, { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Award,
  Send,
  Plus,
  ArrowRight,
  Sparkles,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Filter,
  PhoneCall,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEED_USERS } from '../../data/seedData';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { GlobalModal } from '../../components/common/GlobalModal';

export const EmployerDashboardView: React.FC = () => {
  const { currentUser, jobs, jobInterests, certificates, navigate } = useApp();

  // Employer's postings (matched by employerId or name)
  const employerJobs = jobs.filter(
    j => j.employerId === currentUser.id || j.employerId === 'usr-employer-amul' || j.employerName.includes('AMUL') || j.employerName.includes('GCMMF')
  );

  // Relevant job IDs
  const employerJobIds = new Set(employerJobs.map(j => j.id));

  // Candidate interests for this employer's jobs
  const employerInterests = jobInterests.filter(ji => employerJobIds.has(ji.jobPostingId));

  // Certified trainees in the talent pool
  const certifiedTrainees = SEED_USERS.filter(u => u.role === 'trainee');

  // Contact modal state
  const [selectedApplicant, setSelectedApplicant] = useState<{ name: string; email: string; coop: string; jobTitle: string } | null>(null);
  const [outreachSent, setOutreachSent] = useState(false);

  const handleQuickContact = (interest: typeof employerInterests[0], jobTitle: string) => {
    const traineeUser = SEED_USERS.find(u => u.id === interest.userId);
    setSelectedApplicant({
      name: interest.traineeName,
      email: interest.traineeEmail || 'trainee@ncct.coop.in',
      coop: traineeUser?.cooperativeAffiliation || 'Primary Agricultural Cooperative Society',
      jobTitle,
    });
    setOutreachSent(false);
  };

  return (
    <PageContainer>
      <div className="space-y-5 sm:space-y-6 animate-fadeIn pb-16 min-w-0">
        {/* 1. Welcome Banner (Deep Teal Government Visual Language) */}
        <div className="bg-gradient-to-r from-govTeal-900 via-govTeal-800 to-govTeal-700 text-white p-5 sm:p-8 rounded-2xl shadow-md border border-govTeal-600 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-md text-xs font-bold text-saffron-300">
                Cooperative Recruiter Portal
              </span>
              <SimulatedBadge text="GCMMF / AMUL Talent Hub" className="bg-white/10 text-amber-200 border-white/20" />
            </div>
            <span className="text-xs text-govTeal-100 font-mono">
              Recruitment Cycle 2025–26 • NCCT National Registry
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-[22px] sm:text-3xl font-extrabold tracking-tight leading-tight break-words">
                Welcome, {currentUser.name || 'K. Patel'}
              </h1>
              <p className="text-xs sm:text-sm text-govTeal-100 leading-relaxed">
                Head of Talent Acquisition &bull; Gujarat Cooperative Milk Marketing Federation (GCMMF / Amul).
                Manage postings and access certified talent from 20 NCCT institutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => navigate('jobs_new')}
                className="min-h-[44px] px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>Post New Opening</span>
              </button>

              <button
                onClick={() => navigate('trainee_directory')}
                className="min-h-[44px] px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Users className="w-4 h-4 text-saffron-300 flex-shrink-0" />
                <span>Browse Candidates</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Stat Cards (4 Essential Recruiter Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Active Job Postings */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:border-govTeal-300 transition-all">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Active Job Postings</span>
              <div className="w-9 h-9 rounded-xl bg-saffron-50 flex items-center justify-center text-saffron-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {employerJobs.length}
            </p>
            <p className="text-[11px] text-govTeal-800 font-semibold flex items-center justify-between">
              <span>Matching GCMMF / Amul openings</span>
              <button
                onClick={() => navigate('jobs')}
                className="text-xs font-bold text-govTeal-600 hover:underline inline-flex items-center gap-0.5"
              >
                Manage &rarr;
              </button>
            </p>
          </div>

          {/* Card 2: Candidate Interests Received */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:border-govTeal-300 transition-all">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Total Candidate Interests</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Send className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {employerInterests.length}
            </p>
            <p className="text-[11px] text-blue-800 font-semibold flex items-center justify-between">
              <span>Direct expressions of interest</span>
              <button
                onClick={() => navigate('jobs')}
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-0.5"
              >
                View &rarr;
              </button>
            </p>
          </div>

          {/* Card 3: Certified Trainees Available */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:border-govTeal-300 transition-all">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Certified Talent Pool</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              {certifiedTrainees.length}
            </p>
            <p className="text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
              <span>Verified NCCT graduates</span>
              <button
                onClick={() => navigate('trainee_directory')}
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
              >
                Browse &rarr;
              </button>
            </p>
          </div>

          {/* Card 4: Candidates Contacted This Month */}
          <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-xs space-y-2 hover:border-govTeal-300 transition-all">
            <div className="flex items-center justify-between text-govText-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Candidates Contacted</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-govText-primary">
              14
            </p>
            <p className="text-[11px] text-purple-800 font-semibold">
              <span>Active recruiter interviews this month</span>
            </p>
          </div>
        </div>

        {/* 3. Main Dashboard Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
          {/* Left Column (2 Cols): Recent Candidate Interests Preview */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-govText-border shadow-xs p-5 sm:p-6 space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-govTeal-600" />
                <h2 className="font-bold text-base text-govText-primary">
                  Recent Candidate Interests Received
                </h2>
              </div>
              <button
                onClick={() => navigate('jobs')}
                className="text-xs font-bold text-govTeal-600 hover:text-govTeal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({employerInterests.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {employerInterests.length === 0 ? (
              <div className="py-12 text-center text-xs text-govText-muted space-y-2">
                <Users className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-semibold">No candidate expressions of interest received yet.</p>
                <p className="text-[11px]">When trainees apply from the Trainee portal, they will populate here instantly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employerInterests.slice(0, 3).map(interest => {
                  const job = jobs.find(j => j.id === interest.jobPostingId);
                  const traineeUser = SEED_USERS.find(u => u.id === interest.userId);

                  return (
                    <div
                      key={interest.id}
                      className="p-4 rounded-xl border border-gray-200 bg-govBg hover:border-govTeal-300 transition-all flex flex-col gap-3"
                    >
                      {/* Top row: name + status badge */}
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-govText-primary break-words">
                              {interest.traineeName}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex-shrink-0">
                              {interest.status}
                            </span>
                          </div>

                          <p className="text-xs text-govTeal-700 font-medium flex items-start gap-1">
                            <Briefcase className="w-3 h-3 text-govTeal-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <span className="font-semibold">Applied for: </span>
                              <span className="break-words">{job?.title || 'Assistant Milk Procurement & AMCS Officer'}</span>
                            </span>
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-govText-secondary">
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span>{traineeUser?.cooperativeAffiliation || 'PACS Society Member'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span>{interest.timestamp}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact button — full-width on all sizes for comfortable touch target */}
                      <button
                        onClick={() => handleQuickContact(interest, job?.title || 'Open Role')}
                        className="min-h-[44px] w-full sm:w-auto self-start sm:self-center px-4 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Contact Trainee</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (1 Col): Talent Pool Highlights & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-govText-border shadow-xs p-5 space-y-3">
              <h3 className="font-bold text-sm text-govText-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-saffron-500" />
                <span>Recruiter Quick Actions</span>
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('jobs_new')}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-govTeal-400 bg-govBg hover:bg-govTeal-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-saffron-100 text-saffron-800 flex items-center justify-center font-bold">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-govText-primary">Post New Opening</div>
                      <div className="text-[10px] text-govText-muted">Publish AMCS or ERP positions</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-govTeal-700 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('trainee_directory')}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-govTeal-400 bg-govBg hover:bg-govTeal-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-govTeal-100 text-govTeal-800 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-govText-primary">Search Certified Talent</div>
                      <div className="text-[10px] text-govText-muted">Filter by institute & credential</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-govTeal-700 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('jobs')}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-govTeal-400 bg-govBg hover:bg-govTeal-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-govText-primary">Manage Openings ({employerJobs.length})</div>
                      <div className="text-[10px] text-govText-muted">View applicants & toggle status</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-govTeal-700 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>

            {/* Talent Track Highlights */}
            <div className="bg-white rounded-2xl border border-govText-border shadow-xs p-5 space-y-3">
              <h3 className="font-bold text-sm text-govText-primary flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-govTeal-600" />
                <span>National Talent Pools</span>
              </h3>

              <div className="space-y-2 text-xs">
                {[
                  { label: 'PACS ERP Specialists', badge: 'Accredited' },
                  { label: 'Dairy AMCS & Cold Chain', badge: 'NDDB Aligned' },
                  { label: 'KCC & Credit Auditors', badge: 'NABARD Aligned' },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg bg-govBg border border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-govText-primary">{item.label}</span>
                    <span className="font-bold text-govTeal-800 bg-govTeal-100 px-2 py-0.5 rounded text-[10px] flex-shrink-0">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Modal */}
        <GlobalModal
          isOpen={selectedApplicant !== null}
          onClose={() => setSelectedApplicant(null)}
          maxWidth="max-w-md"
          ariaLabel="Contact Candidate"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-govText-primary">
                Contact Candidate
              </h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-xs text-govText-muted hover:text-govText-primary"
              >
                Close
              </button>
            </div>

            {outreachSent ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-govText-primary">Outreach Dispatched</p>
                <p className="text-[11px] text-govText-secondary">Candidate has been invited for interview.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-govText-secondary">
                  Send direct recruitment outreach to <span className="font-bold text-govText-primary">{selectedApplicant?.name}</span> regarding the opening <span className="font-bold text-govTeal-700">{selectedApplicant?.jobTitle}</span>.
                </p>

                <div className="bg-govBg p-3 rounded-lg border border-gray-200 space-y-1">
                  <div><span className="font-semibold">Candidate:</span> {selectedApplicant?.name}</div>
                  <div><span className="font-semibold">Cooperative:</span> {selectedApplicant?.coop}</div>
                  <div><span className="font-semibold">Email:</span> {selectedApplicant?.email}</div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-govText-primary font-bold rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setOutreachSent(true);
                      setTimeout(() => setSelectedApplicant(null), 1500);
                    }}
                    className="px-4 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Interview Call</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlobalModal>
      </div>
    </PageContainer>
  );
};
