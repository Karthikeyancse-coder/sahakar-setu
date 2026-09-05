import React from 'react';
import {
  Briefcase,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  IndianRupee,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const MyApplications: React.FC = () => {
  const { jobs, jobInterests, currentUser, navigate, t } = useApp();

  const userInterests = jobInterests.filter(i => i.userId === currentUser.id);

  const applications = userInterests.map(interest => {
    const job = jobs.find(j => j.id === interest.jobPostingId);
    return {
      interest,
      job
    };
  }).filter(item => item.job !== undefined);

  return (
    <PageContainer>
      {/* 1. Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Recruitment Direct Pathway
            </span>
            <SimulatedBadge text="Cooperative Placement Portal" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-govText-primary mt-1">
            {t.myApplications?.title || 'My Registered Job Applications'}
          </h1>
          <p className="text-xs text-govText-secondary mt-1">
            {t.myApplications?.subtitle || 'Track your direct expressions of interest submitted to cooperative employers.'}
          </p>
        </div>

        <button
          onClick={() => navigate('jobs')}
          className="w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
        >
          <Briefcase className="w-4 h-4 text-saffron-300" />
          <span>Explore More Openings</span>
        </button>
      </div>

      {/* 2. Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-govText-border space-y-4">
          <Briefcase className="w-12 h-12 text-govTeal-400 mx-auto" />
          <h3 className="text-base font-bold text-govText-primary">
            {t.myApplications?.emptyTitle || 'No job applications submitted yet'}
          </h3>
          <p className="text-xs text-govText-secondary max-w-sm mx-auto">
            Browse verified openings from AMUL, IFFCO, and State Cooperative Apex Banks seeking NCCT certified talent.
          </p>
          <button
            onClick={() => navigate('jobs')}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>Browse Job Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-govText-muted uppercase tracking-wider px-1">
            Active Submissions ({applications.length})
          </div>

          <div className="space-y-3">
            {applications.map(({ interest, job }) => {
              if (!job) return null;

              return (
                <div
                  key={interest.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-govText-border shadow-xs hover:border-govTeal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-govTeal-800 bg-govTeal-50 px-2.5 py-0.5 rounded-md border border-govTeal-200">
                        {job.employerName}
                      </span>
                      <span className="text-[11px] text-govText-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Submitted: {new Date(interest.timestamp).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-govText-primary">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-govText-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-govTeal-600" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-govTeal-800">
                        <IndianRupee className="w-3.5 h-3.5 text-govTeal-600" />
                        <span>{job.salaryRange}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status & CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.myApplications?.statusInterestSent || 'Interest Expressed'}</span>
                    </div>

                    <button
                      onClick={() => navigate('job_detail', { jobId: job.id })}
                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-govText-primary text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[44px] sm:min-h-0"
                    >
                      <span>View Role</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
