import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  IndianRupee,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import api from '../../lib/api';

export const MyApplications: React.FC = () => {
  const { jobs, jobInterests, currentUser, navigate, t } = useApp();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.jobs
      .myApplications()
      .then(serverApps => {
        if (isMounted && Array.isArray(serverApps)) {
          setApplications(serverApps);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.warn('Falling back to local job interests:', err);
          // Fallback to context
          const localApps = jobInterests
            .filter(i => i.userId === currentUser.id)
            .map(interest => {
              const job = jobs.find(j => j.id === interest.jobPostingId);
              return { ...interest, job };
            })
            .filter(item => item.job !== undefined);
          setApplications(localApps);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser.id, jobInterests, jobs]);

  const getStatusBadge = (status: string) => {
    const s = (status || 'APPLIED').toUpperCase();
    switch (s) {
      case 'APPLIED':
      case 'SUBMITTED':
        return (
          <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Applied</span>
          </span>
        );
      case 'UNDER_REVIEW':
      case 'REVIEWED':
        return (
          <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Shortlisted for Interview</span>
          </span>
        );
      case 'INTERVIEW':
        return (
          <span className="px-3 py-1 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-900 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interview Scheduled</span>
          </span>
        );
      case 'SELECTED':
        return (
          <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selected</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Not Selected</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

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
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-govText-border">
          <div className="w-8 h-8 border-3 border-govTeal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-govText-secondary">Loading your submitted applications...</p>
        </div>
      ) : applications.length === 0 ? (
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
            {applications.map(app => {
              const job = app.job;
              if (!job) return null;

              const matchScore = app.matchScore ?? 80;
              const missing = Array.isArray(app.missingSkills) ? app.missingSkills : [];

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-govText-border shadow-xs hover:border-govTeal-300 transition-all flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-govTeal-800 bg-govTeal-50 px-2.5 py-0.5 rounded-md border border-govTeal-200">
                          {job.employerName}
                        </span>
                        <span className="text-[11px] text-govText-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Submitted: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : app.timestamp}</span>
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

                    {/* Match Score & Status Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{matchScore}% Match</span>
                      </div>

                      {getStatusBadge(app.status)}
                    </div>
                  </div>

                  {/* Missing Skills & Recommended Course if any */}
                  {missing.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Identified Skill Gap:</span>
                        </span>
                        {missing.map((sk: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate('courses')}
                        className="text-govTeal-700 hover:text-govTeal-800 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>View Recommended Courses</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
