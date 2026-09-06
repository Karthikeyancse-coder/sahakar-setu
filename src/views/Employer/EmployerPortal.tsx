import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Award,
  Briefcase,
  Plus,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Sparkles,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEED_USERS } from '../../data/seedData';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const EmployerPortal: React.FC = () => {
  const { certificates, jobs, createJobPosting, jobInterests, institutes, currentUser, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'candidates' | 'postings' | 'applicants'>('candidates');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('Pune, Maharashtra');
  const [jobSalary, setJobSalary] = useState('₹3.5 - ₹4.8 Lakh / annum');
  const [jobSkills, setJobSkills] = useState('PACS Digitalization, KCC Accounting');
  const [jobDesc, setJobDesc] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Apprenticeship' | 'Contract'>('Full-time');
  const [jobOpenings, setJobOpenings] = useState(10);

  const certifiedTrainees = SEED_USERS.filter(u => u.role === 'trainee');

  const filteredCandidates = certifiedTrainees.filter(trainee => {
    const matchesQuery =
      trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trainee.cooperativeAffiliation && trainee.cooperativeAffiliation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesInst = selectedInstitute === 'all' || trainee.instituteId === selectedInstitute;

    return matchesQuery && matchesInst;
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJobPosting({
      employerId: currentUser.id,
      employerName: currentUser.name,
      title: jobTitle,
      description: jobDesc,
      location: jobLocation,
      salaryRange: jobSalary,
      type: jobType,
      openingsCount: Number(jobOpenings),
      requiredSkills: jobSkills.split(',').map(s => s.trim()),
    });
    setIsPostJobModalOpen(false);
    setActiveTab('postings');
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Cooperative Talent Bridge
            </span>
            <SimulatedBadge text="NCCT Verified Registry Access" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary">
            Recruiter & Employer Operations Portal
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            Search verified PACS & cooperative certified talent, publish openings, and review applicants.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-govBg p-1.5 rounded-xl border border-govTeal-100 max-w-md">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'candidates' ? 'bg-govTeal-600 text-white shadow' : 'text-govText-secondary hover:text-govText-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Certified Trainees</span>
        </button>
        <button
          onClick={() => setActiveTab('postings')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'postings' ? 'bg-govTeal-600 text-white shadow' : 'text-govText-secondary hover:text-govText-primary'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Postings ({jobs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'applicants' ? 'bg-govTeal-600 text-white shadow' : 'text-govText-secondary hover:text-govText-primary'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Candidate Interests</span>
        </button>
      </div>

      {/* TAB 1: Search Certified Candidates */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-govText-border shadow-sm flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name or cooperative..."
                className="w-full px-3.5 py-2 pl-9 rounded-lg border border-govText-border text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 bg-govBg"
              />
              <Search className="w-4 h-4 text-govText-muted absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-govTeal-600" />
              <span className="text-xs font-semibold text-govText-secondary">Issuing Institute:</span>
              <select
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
              >
                <option value="all">All 20 Institutes</option>
                {institutes.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => {
              const candidateCerts = certificates.filter(c => c.userId === candidate.id);
              const inst = institutes.find(i => i.id === candidate.instituteId);

              return (
                <div
                  key={candidate.id}
                  className="bg-white rounded-2xl border border-govText-border shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-govTeal-600"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-govText-primary truncate">
                          {candidate.name}
                        </h4>
                        <p className="text-xs text-govTeal-700 font-medium truncate">
                          {candidate.cooperativeAffiliation}
                        </p>
                      </div>
                    </div>

                    <div className="bg-govBg p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-govText-muted">Trained At:</span>
                        <span className="font-medium text-govText-primary truncate max-w-[150px]">
                          {inst?.name || 'VAMNICOM'}
                        </span>
                      </div>
                    </div>

                    {/* Earned Credentials */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-govText-muted uppercase tracking-wider">
                        Verified Credentials:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {candidateCerts.length > 0 ? (
                          candidateCerts.map(c => (
                            <span
                              key={c.id}
                              className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                            >
                              {c.courseTitle}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-govText-muted italic">
                            In-progress curriculum
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => alert(`Direct profile contact request logged for ${candidate.name}`)}
                      className="flex-1 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact Trainee</span>
                    </button>
                    {candidateCerts.length > 0 && (
                      <button
                        onClick={() => navigate('verify_public', { certId: candidateCerts[0].id })}
                        className="p-2 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-300 rounded-lg"
                        title="Verify Certificate Online"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Active Job Postings */}
      {activeTab === 'postings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(j => (
            <div
              key={j.id}
              className="bg-white rounded-2xl border border-govText-border shadow-sm p-6 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200 uppercase">
                  {j.type} • {j.openingsCount} Openings
                </span>
                <h3 className="font-bold text-base text-govText-primary">{j.title}</h3>
                <p className="text-xs text-govTeal-700 font-semibold">{j.employerName}</p>
                <p className="text-xs text-govText-secondary leading-relaxed line-clamp-3">{j.description}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 text-xs font-semibold text-govText-primary">
                {j.salaryRange} • {j.location}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Applicants / Candidate Interests */}
      {activeTab === 'applicants' && (
        <div className="bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-4">
          <h3 className="font-bold text-base text-govText-primary">
            Candidate Expressions of Interest
          </h3>
          {jobInterests.length === 0 ? (
            <div className="py-8 text-center text-xs text-govText-muted">
              No recent applicant submissions yet. Candidates applying from the Trainee portal will populate here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-govBg text-govText-secondary uppercase font-semibold">
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Applied Job ID</th>
                    <th className="p-3">Submission Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobInterests.map(ji => (
                    <tr key={ji.id}>
                      <td className="p-3 font-bold text-govText-primary">{ji.traineeName}</td>
                      <td className="p-3 font-mono">{ji.jobPostingId}</td>
                      <td className="p-3 text-govText-muted">{ji.timestamp}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold uppercase text-[10px]">
                          {ji.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Job Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-govTeal-200 w-full max-w-lg overflow-hidden">
            <div className="bg-govTeal-800 text-white p-5">
              <h3 className="font-bold text-lg">Post Cooperative Job / Apprenticeship</h3>
              <p className="text-xs text-govTeal-100">Direct reach to certified NCCT trainees across 20 institutes</p>
            </div>

            <form onSubmit={handlePostJob} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. PACS ERP & Operations Officer"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-govText-secondary mb-1">Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-govText-secondary mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Duties, qualifications, and cooperative background..."
                  className="w-full p-2.5 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-govText-primary text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </PageContainer>
  );
};
