import React, { useState } from 'react';
import {
  Users,
  Search,
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Building2,
  Mail,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEED_USERS } from '../../data/seedData';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const TraineeDirectory: React.FC = () => {
  const { certificates, institutes, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInst, setSelectedInst] = useState('all');

  const trainees = SEED_USERS.filter(u => u.role === 'trainee');

  const filtered = trainees.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.cooperativeAffiliation && t.cooperativeAffiliation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesInst = selectedInst === 'all' || t.instituteId === selectedInst;

    return matchesSearch && matchesInst;
  });

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-govText-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              National Trainee Registry
            </span>
            <SimulatedBadge text="NCCT Verified Records" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-govText-primary mt-1 leading-snug">
            Cooperative Trainee & PACS Workforce Directory
          </h2>
          <p className="text-xs text-govText-secondary mt-1 leading-relaxed">
            Complete list of enrolled and certified trainees across 20 NCCT institutions.
          </p>
        </div>

        <div className="text-xs font-bold text-govTeal-800 bg-govTeal-50 px-4 py-2 rounded-xl border border-govTeal-200 self-start sm:self-auto">
          {trainees.length} Registered Trainees (Seeded Demo Records)
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-govText-border shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name or primary society..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg border border-govText-border text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 bg-govBg min-h-[40px]"
          />
          <Search className="w-4 h-4 text-govText-muted absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-govTeal-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-govText-secondary whitespace-nowrap">Institute:</span>
          <select
            value={selectedInst}
            onChange={(e) => setSelectedInst(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600 w-full sm:w-auto min-h-[40px]"
          >
            <option value="all">All Institutes</option>
            {institutes.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table & Cards Container */}
      <div className="bg-white rounded-2xl border border-govText-border shadow-sm overflow-hidden">
        {/* Desktop Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-govBg text-govText-secondary uppercase font-semibold border-b border-gray-200">
                <th className="p-4">Trainee Profile</th>
                <th className="p-4">Cooperative Society</th>
                <th className="p-4">Training Institute</th>
                <th className="p-4">Aadhaar Mock e-KYC</th>
                <th className="p-4">Credentials</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => {
                const userCerts = certificates.filter(c => c.userId === t.id);
                const inst = institutes.find(i => i.id === t.instituteId);

                return (
                  <tr key={t.id} className="hover:bg-govTeal-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-govTeal-600"
                        />
                        <div>
                          <p className="font-bold text-sm text-govText-primary">{t.name}</p>
                          <p className="text-[11px] text-govText-muted">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-govText-primary">
                      {t.cooperativeAffiliation || 'PACS Member'}
                    </td>
                    <td className="p-4 text-govText-secondary">
                      {inst?.name || 'VAMNICOM'}
                    </td>
                    <td className="p-4">
                      <span className="font-mono bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold text-[10px]">
                        {t.aadhaarMock || 'XXXX-XXXX-4589'}
                      </span>
                    </td>
                    <td className="p-4">
                      {userCerts.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {userCerts.map(c => (
                            <span key={c.id} className="text-[10px] bg-govTeal-50 text-govTeal-900 px-2 py-0.5 rounded font-semibold border border-govTeal-200">
                              {c.courseTitle}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Enrolled</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {userCerts.length > 0 && (
                        <button
                          onClick={() => navigate('verify_public', { certId: userCerts[0].id })}
                          className="px-2.5 py-1 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-300 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (< 768px) */}
        <div className="block md:hidden divide-y divide-gray-100">
          {filtered.map(t => {
            const userCerts = certificates.filter(c => c.userId === t.id);
            const inst = institutes.find(i => i.id === t.instituteId);

            return (
              <div key={t.id} className="p-4 space-y-3">
                {/* Header: Avatar, Name, Email */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-govTeal-600 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-govText-primary truncate">{t.name}</p>
                    <p className="text-xs text-govText-muted truncate mt-0.5">{t.email}</p>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="bg-govBg/70 p-3 rounded-xl border border-gray-100 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-govText-muted tracking-wider block">
                      Cooperative
                    </span>
                    <span className="font-semibold text-govText-primary">
                      {t.cooperativeAffiliation || 'PACS Member'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-govText-muted tracking-wider block">
                      Institute
                    </span>
                    <span className="font-semibold text-govTeal-800">
                      {inst?.name || 'VAMNICOM'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-govText-muted tracking-wider block">
                      E-KYC
                    </span>
                    <span className="font-mono bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold text-[10px] inline-block mt-0.5">
                      {t.aadhaarMock || 'XXXX-XXXX-4589'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-govText-muted tracking-wider block">
                      Credential
                    </span>
                    {userCerts.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userCerts.map(c => (
                          <span key={c.id} className="text-[11px] bg-govTeal-50 text-govTeal-900 px-2 py-0.5 rounded font-semibold border border-govTeal-200">
                            {c.courseTitle}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Enrolled candidate</span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {userCerts.length > 0 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => navigate('verify_public', { certId: userCerts[0].id })}
                      className="w-full py-2.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer transition-colors"
                    >
                      <Award className="w-4 h-4 text-saffron-700" />
                      <span>Verify Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      </div>
    </PageContainer>
  );
};
