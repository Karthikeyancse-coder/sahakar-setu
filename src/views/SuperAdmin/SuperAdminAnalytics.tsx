import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Building2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  BarChart3,
  Percent,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

type SortColumn = 'name' | 'type' | 'activeCount' | 'capacity' | 'utilization' | 'certificates' | 'nominations';
type SortDirection = 'asc' | 'desc';

export const SuperAdminAnalytics: React.FC = () => {
  const { institutes, certificates, nominations, navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('utilization');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // 12-Month Longitudinal Certification Trajectory
  const twelveMonthTrendData = [
    { month: 'Apr 2025', monthly: 95, cumulative: 420 },
    { month: 'May 2025', monthly: 110, cumulative: 530 },
    { month: 'Jun 2025', monthly: 135, cumulative: 665 },
    { month: 'Jul 2025', monthly: 160, cumulative: 825 },
    { month: 'Aug 2025', monthly: 175, cumulative: 1000 },
    { month: 'Sep 2025', monthly: 185, cumulative: 1185 },
    { month: 'Oct 2025', monthly: 210, cumulative: 1395 },
    { month: 'Nov 2025', monthly: 265, cumulative: 1660 },
    { month: 'Dec 2025', monthly: 340, cumulative: 2000 },
    { month: 'Jan 2026', monthly: 425, cumulative: 2425 },
    { month: 'Feb 2026', monthly: 345, cumulative: 2770 },
    { month: 'Mar 2026', monthly: 351, cumulative: 3121 },
  ];

  // Completion Rate by Institute Tier
  const completionRateData = [
    { tier: 'VAMNICOM (Apex)', completionRate: 94.2, dropoutRate: 5.8, fill: '#0B6E4F' },
    { tier: '5 RICMs (Regional)', completionRate: 88.5, dropoutRate: 11.5, fill: '#148C58' },
    { tier: '14 ICMs (State)', completionRate: 83.1, dropoutRate: 16.9, fill: '#E68A2E' },
  ];

  // Employment Outcomes Funnel (Seeded real counts: 3121 -> 846 -> 142)
  const funnelStages = [
    {
      stage: 'Trainees Certified',
      count: 3121,
      percent: '100%',
      color: 'bg-emerald-600',
      description: 'NCCT Modular LMS & Practical Evaluation Qualified',
    },
    {
      stage: 'Employer Interest Generated',
      count: 846,
      percent: '27.1%',
      color: 'bg-[#148C58]',
      description: 'Profiles shortlisted by GCMMF (Amul), IFFCO, and State Apex Banks',
    },
    {
      stage: 'Placements Initiated',
      count: 142,
      percent: '16.8% of Shortlisted',
      color: 'bg-[#E68A2E]',
      description: 'Formal appointment offers in PACS ERP and Dairy Chilling hubs',
    },
  ];

  // Calculated Institute Metrics Table for all 20 institutes
  const instituteMetrics = useMemo(() => {
    return institutes.map((inst, index) => {
      // Deterministic realistic allocations for each institute
      const utilRate = Math.min(100, Math.round((inst.activeCount / inst.capacity) * 100));
      // Proportional distribution of 2420 certs & pending nominations
      const certShare = Math.round(inst.activeCount * 0.78) + (index % 5) * 4;
      const pendingNom = Math.round((inst.capacity - inst.activeCount) * 0.25) + (index % 4);

      return {
        id: inst.id,
        name: inst.name,
        type: inst.type,
        city: inst.city,
        state: inst.state,
        director: inst.director,
        activeCount: inst.activeCount,
        capacity: inst.capacity,
        utilization: utilRate,
        certificates: certShare,
        nominations: pendingNom,
      };
    });
  }, [institutes]);

  // Filtering & Sorting
  const sortedAndFilteredInstitutes = useMemo(() => {
    return instituteMetrics
      .filter(inst => {
        const matchesQuery =
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.state.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || inst.type === selectedType;
        return matchesQuery && matchesType;
      })
      .sort((a, b) => {
        let valA: any = a[sortColumn];
        let valB: any = b[sortColumn];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [instituteMetrics, searchQuery, selectedType, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 inline ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-govTeal-700 inline ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-govTeal-700 inline ml-1" />
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
        {/* National Banner */}
        <div className="bg-gradient-to-r from-govTeal-900 via-govTeal-800 to-govTeal-700 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-govTeal-600 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-md text-xs font-bold text-saffron-300">
                National NCCT Capacity & Outcomes Intelligence
              </span>
              <SimulatedBadge text="In-Depth Analytical Audit" className="bg-white/10 text-amber-200 border-white/20" />
            </div>
            <span className="text-xs text-govTeal-100 font-mono">
              20 Autonomous Nodes Synchronized
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Training Capacity, Utilization & Employment Outcomes
          </h1>
          <p className="text-sm text-govTeal-100 max-w-3xl leading-relaxed">
            Multi-tier analytical evaluation across VAMNICOM, 5 RICMs, and 14 ICMs. Review 12-month certification trajectories, institutional seat utilization efficiency, and cooperative recruiter placement conversion funnels.
          </p>
        </div>

        {/* 1. Longitudinal 12-Month Trend & Completion Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 12-Month Line/Area Trend (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-govText-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-govTeal-600" />
                  12-Month Longitudinal Certification Trajectory
                </h3>
                <p className="text-xs text-govText-secondary mt-0.5">
                  Monthly volume vs. cumulative nationwide certified trainees (Apr 2025 – Mar 2026)
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg">
                Total: 3,121 Certified
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={twelveMonthTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B6E4F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0B6E4F" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                    formatter={(value: any, name: any) => [
                      `${value.toLocaleString()} Trainees`,
                      name === 'cumulative' ? 'Cumulative Total' : 'Monthly Issued'
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative Certified"
                    stroke="#0B6E4F"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCumulative)"
                  />
                  <Line
                    type="monotone"
                    dataKey="monthly"
                    name="Monthly Certifications"
                    stroke="#E68A2E"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#E68A2E' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Completion Rate by Institute Tier (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-base text-govText-primary flex items-center gap-2">
                <Percent className="w-5 h-5 text-saffron-600" />
                Course Completion Rate by Institutional Tier
              </h3>
              <p className="text-xs text-govText-secondary mt-0.5">
                Pass & certificate qualification rate across autonomous administrative tiers
              </p>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionRateData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: '#374151' }} width={120} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Average Completion Rate']}
                  />
                  <Bar dataKey="completionRate" radius={[0, 8, 8, 0]}>
                    {completionRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2. Employment Outcomes Funnel (Certified -> Shortlisted -> Placed) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-govText-border shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-lg text-govText-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-govTeal-700" />
                Employment & Cooperative Placement Pipeline
              </h3>
              <p className="text-xs text-govText-secondary mt-0.5">
                Conversion funnel from certified candidates to verified recruitment in cooperative federations
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              142 Placements Initiated Across 6 Federations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {funnelStages.map((stage, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl p-5 border border-gray-200 bg-[#FBFDFB] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-govText-muted">
                    Stage 0{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-govBg border border-gray-200 text-govText-primary">
                    {stage.percent}
                  </span>
                </div>

                <div>
                  <div className="text-3xl font-extrabold text-govText-primary tracking-tight">
                    {stage.count.toLocaleString()}
                  </div>
                  <h4 className="text-sm font-bold text-govTeal-800 mt-1">{stage.stage}</h4>
                  <p className="text-xs text-govText-secondary mt-1 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full`}
                    style={{ width: idx === 0 ? '100%' : idx === 1 ? '55%' : '25%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Nationwide All-20 Institutes Comparative Table */}
        <div className="bg-white rounded-2xl border border-govText-border shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-govText-primary flex items-center gap-2">
                <Building2 className="w-5 h-5 text-govTeal-700" />
                20 NCCT Institutes Capacity, Utilization & Nominations Matrix
              </h3>
              <p className="text-xs text-govText-secondary mt-0.5">
                Complete federated audit. Click column headers to sort by capacity, trainees, or utilization rate.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-govText-muted">
                Showing {sortedAndFilteredInstitutes.length} of 20 Nodes
              </span>
            </div>
          </div>

          {/* Search & Type Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by institute name, city, or state..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-govText-border text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 bg-govBg"
              />
              <Search className="w-4 h-4 text-govText-muted absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5">
              {['all', 'VAMNICOM', 'RICM', 'ICM'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedType === t
                      ? 'bg-govTeal-600 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {t === 'all' ? 'All (20)' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Matrix Table (>= 768px) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs text-govText-primary">
              <thead className="bg-[#F8FAF8] border-b border-gray-200 text-[11px] font-bold text-govText-secondary uppercase">
                <tr>
                  <th
                    className="p-3.5 cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    Institute & Location {renderSortIcon('name')}
                  </th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('type')}
                  >
                    Tier {renderSortIcon('type')}
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('activeCount')}
                  >
                    Enrolled {renderSortIcon('activeCount')}
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('capacity')}
                  >
                    Capacity {renderSortIcon('capacity')}
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('utilization')}
                  >
                    Utilization % {renderSortIcon('utilization')}
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('certificates')}
                  >
                    Certificates {renderSortIcon('certificates')}
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-govTeal-800 transition-colors"
                    onClick={() => handleSort('nominations')}
                  >
                    Pending Nominations {renderSortIcon('nominations')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedAndFilteredInstitutes.map(inst => (
                  <tr
                    key={inst.id}
                    onClick={() => navigate(`/super-admin/institutes/${inst.id}`)}
                    className="hover:bg-govTeal-50/40 transition-colors cursor-pointer group"
                    title={`Click to drill down into ${inst.name}`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-govText-primary group-hover:text-govTeal-800 transition-colors">
                        {inst.name}
                      </div>
                      <div className="text-[11px] text-govText-muted mt-0.5">
                        {inst.city}, {inst.state} • Director: {inst.director}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inst.type === 'VAMNICOM'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : inst.type === 'RICM'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {inst.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-govText-primary">
                      {inst.activeCount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-govText-muted">
                      {inst.capacity.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            inst.utilization >= 85
                              ? 'text-emerald-700'
                              : inst.utilization >= 70
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {inst.utilization}%
                        </span>
                        <div className="w-12 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              inst.utilization >= 85
                                ? 'bg-emerald-600'
                                : inst.utilization >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${inst.utilization}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-semibold text-emerald-800">
                      {inst.certificates.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-amber-800">
                      {inst.nominations}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="block md:hidden space-y-3">
            {sortedAndFilteredInstitutes.map(inst => (
              <div
                key={inst.id}
                onClick={() => navigate(`/super-admin/institutes/${inst.id}`)}
                className="bg-[#FBFDFB] p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-govTeal-400 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                        inst.type === 'VAMNICOM'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : inst.type === 'RICM'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {inst.type}
                    </span>
                    <h4 className="font-bold text-sm text-govText-primary leading-snug">
                      {inst.name}
                    </h4>
                    <p className="text-xs text-govText-secondary mt-0.5">
                      {inst.city}, {inst.state}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {inst.utilization}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                  <div className="bg-white p-2 rounded-lg border border-gray-100">
                    <span className="text-govText-muted block text-[10px]">Trainees / Capacity</span>
                    <span className="font-bold text-govText-primary">
                      {inst.activeCount} / {inst.capacity}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-100">
                    <span className="text-govText-muted block text-[10px]">Certificates Issued</span>
                    <span className="font-bold text-emerald-800">{inst.certificates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
