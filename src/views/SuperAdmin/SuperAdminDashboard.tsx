import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Building2,
  Users,
  Award,
  Briefcase,
  TrendingUp,
  Download,
  MapPin,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const SuperAdminDashboard: React.FC = () => {
  const { institutes, courses, certificates, navigate, t } = useApp();

  // Aggregate Data for Recharts
  const instituteTypeData = [
    { name: 'VAMNICOM (Apex)', count: 382, capacity: 450, fill: '#0B6E4F' },
    { name: '5 RICMs (Regional)', count: 874, capacity: 1040, fill: '#148C58' },
    { name: '14 ICMs (State)', count: 1864, capacity: 2280, fill: '#E68A2E' },
  ];

  const monthlyCertData = [
    { month: 'Oct 2025', certs: 180, attendanceRate: 92 },
    { month: 'Nov 2025', certs: 240, attendanceRate: 94 },
    { month: 'Dec 2025', certs: 310, attendanceRate: 91 },
    { month: 'Jan 2026', certs: 420, attendanceRate: 96 },
    { month: 'Feb 2026', certs: 580, attendanceRate: 98 },
    { month: 'Mar 2026', certs: 690, attendanceRate: 97 },
  ];

  const skillDemandData = [
    { name: 'PACS ERP Operations', value: 42, color: '#0B6E4F' },
    { name: 'Dairy Cold Chain & AMCS', value: 28, color: '#E68A2E' },
    { name: 'SHG Micro-Credit Linkage', value: 18, color: '#34A868' },
    { name: 'Cooperative Audit & Compliance', value: 12, color: '#EEA247' },
  ];

  const totalTrainees = institutes.reduce((acc, i) => acc + i.activeCount, 0);

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* National Banner */}
      <div className="bg-gradient-to-r from-govTeal-900 via-govTeal-800 to-govTeal-700 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-govTeal-600 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-md text-xs font-bold text-saffron-300">
              National NCCT Central Registry
            </span>
            <SimulatedBadge text="Ministry of Cooperation Analytics" className="bg-white/10 text-amber-200 border-white/20" />
          </div>
          <span className="text-xs text-govTeal-100 font-mono">
            Last Federated Sync: Just Now (All 20 Nodes Connected)
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.analytics.title}
        </h2>
        <p className="text-sm text-govTeal-100 max-w-2xl">
          {t.analytics.subtitle}
        </p>
      </div>

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.totalTrainees}</span>
            <div className="w-9 h-9 rounded-xl bg-govTeal-50 flex items-center justify-center text-govTeal-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-govText-primary">
            {totalTrainees.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% YoY National Growth</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.activeInstitutes}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-govText-primary">
            20 / 20
          </p>
          <p className="text-[11px] text-govTeal-800 font-semibold">
            1 VAMNICOM + 5 RICMs + 14 ICMs
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.certsIssued}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-govText-primary">
            2,420
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">
            Cryptographically Verifiable
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-govText-border shadow-sm space-y-2">
          <div className="flex items-center justify-between text-govText-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.jobPlacements}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-govText-primary">
            142
          </p>
          <p className="text-[11px] text-purple-700 font-semibold">
            Across AMUL, IFFCO & Apex Banks
          </p>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Trainees by Institute Type (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-govText-primary">
                {t.analytics.trainingsByInstitute}
              </h3>
              <p className="text-xs text-govText-secondary">
                Capacity utilization across VAMNICOM, RICMs, and ICMs
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DCE4DF', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="count" name="Enrolled Trainees" fill="#0B6E4F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacity" name="Total Sanctioned Capacity" fill="#E68A2E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Skills in Demand (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-govText-primary">
                {t.analytics.employerDemand}
              </h3>
              <p className="text-xs text-govText-secondary">
                Recruitment focus of cooperative federations
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDemandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {skillDemandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Demand Share']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Certification Issuance Trend (12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-2xl p-6 border border-govText-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-govText-primary">
                {t.analytics.monthlyCertTrends}
              </h3>
              <p className="text-xs text-govText-secondary">
                Verifiable certificates issued & average biometric attendance fidelity (%)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCertData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="certGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B6E4F" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0B6E4F" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DCE4DF', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="certs" name="Certificates Issued" stroke="#0B6E4F" strokeWidth={2.5} fillOpacity={1} fill="url(#certGrad)" />
                <Line type="monotone" dataKey="attendanceRate" name="Attendance Rate (%)" stroke="#E68A2E" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      </div>
    </PageContainer>
  );
};
