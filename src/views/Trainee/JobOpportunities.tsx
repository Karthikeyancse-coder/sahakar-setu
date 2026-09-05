import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Building,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Send,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const JobOpportunities: React.FC = () => {
  const { jobs, jobInterests, applyForJob, currentUser, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  const skillsList = ['all', 'PACS Digitalization', 'Dairy Cold Chain', 'KCC Management', 'AMCS Operations'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkill = selectedSkill === 'all' || job.requiredSkills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()));

    return matchesSearch && matchesSkill;
  });

  const handleApply = (jobId: string) => {
    applyForJob(jobId);
    setJustAppliedId(jobId);
    setTimeout(() => setJustAppliedId(null), 3000);
  };

  return (
    <PageContainer>
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Cooperative Recruiter Bridge
            </span>
            <SimulatedBadge text="NCCT Certified Talent Direct Pathway" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary">
            {t.jobs.title}
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            {t.jobs.subtitle}
          </p>
        </div>

        <div className="bg-saffron-50 border border-saffron-200 px-4 py-2 rounded-xl text-xs text-saffron-900 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron-600" />
          <span>{jobs.reduce((acc, j) => acc + j.openingsCount, 0)} Active Cooperative Openings</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-govText-border shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles, federations, or cities (e.g., Amul, Pune, PACS)..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg border border-govText-border text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 bg-govBg"
          />
          <Search className="w-4 h-4 text-govText-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-govTeal-600" />
          <span className="text-xs font-semibold text-govText-secondary">Skill Track:</span>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
          >
            {skillsList.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Cooperative Tracks' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => {
          const hasExpressedInterest = jobInterests.some(
            ji => ji.jobPostingId === job.id && ji.userId === currentUser.id
          );
          const isJustApplied = justAppliedId === job.id;

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-govText-border shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 border border-saffron-200 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                    <h3 className="font-bold text-base text-govText-primary leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-govTeal-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>{job.employerName}</span>
                    </p>
                  </div>

                  {job.employerLogo && (
                    <img
                      src={job.employerLogo}
                      alt={job.employerName}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />
                  )}
                </div>

                <p className="text-xs text-govText-secondary line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium bg-govBg text-govText-secondary px-2 py-0.5 rounded-md border border-gray-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Location & Salary */}
                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-govText-secondary">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-govTeal-600" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-govText-primary">
                    <span className="text-govTeal-700 font-bold">{job.salaryRange}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                {hasExpressedInterest || isJustApplied ? (
                  <div className="w-full py-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Interest Registered</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job.id)}
                    className="w-full py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.jobs.expressInterest}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </PageContainer>
  );
};
