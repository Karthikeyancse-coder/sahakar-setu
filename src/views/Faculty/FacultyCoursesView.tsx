import React, { useState } from 'react';
import {
  BookOpen,
  Edit3,
  Users,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  X,
  UserCheck,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { Course } from '../../types';
import { FacultyCourseCard } from '../../components/common/FacultyCourseCard';

// Mock enrolled trainees for Part 3 Enrolled Trainee Roster
interface TraineeRosterItem {
  id: string;
  name: string;
  coop: string;
  enrolledDate: string;
  progressPercent: number;
  quizScore: string;
  status: 'completed' | 'in_progress';
}

const MOCK_ROSTER_BY_COURSE: Record<string, TraineeRosterItem[]> = {
  'crs-pacs-erp-101': [
    { id: 't-1', name: 'Rameshwar Patil', coop: 'Shri Datta PACS, Niphad, Nashik', enrolledDate: '2026-02-10', progressPercent: 100, quizScore: '92% (Pass)', status: 'completed' },
    { id: 't-2', name: 'Anjali Sharma', coop: 'Kisan Seva PACS, Indore, MP', enrolledDate: '2026-02-14', progressPercent: 85, quizScore: '88% (Pass)', status: 'in_progress' },
    { id: 't-3', name: 'Ganesh Shinde', coop: 'Mahanand Dairy Union, Kolhapur', enrolledDate: '2026-02-18', progressPercent: 70, quizScore: '80% (Pass)', status: 'in_progress' },
    { id: 't-4', name: 'Deepak Verma', coop: 'Indore PACS Central Rural Bank', enrolledDate: '2026-02-22', progressPercent: 60, quizScore: 'Pending', status: 'in_progress' },
    { id: 't-5', name: 'Sanjay Deshpande', coop: 'Khed Taluka Primary Agricultural Society', enrolledDate: '2026-02-25', progressPercent: 100, quizScore: '96% (Distinction)', status: 'completed' },
  ],
  'crs-dairy-mgmt-201': [
    { id: 't-6', name: 'Ganesh Shinde', coop: 'Mahanand Dairy Union, Kolhapur', enrolledDate: '2026-03-01', progressPercent: 90, quizScore: '94% (Pass)', status: 'in_progress' },
    { id: 't-7', name: 'Surekha Gaikwad', coop: 'Warana Dairy Sangh, Kolhapur', enrolledDate: '2026-03-02', progressPercent: 100, quizScore: '90% (Pass)', status: 'completed' },
    { id: 't-8', name: 'Pravin Jadhav', coop: 'Baramati Taluka Cooperative Milk Union', enrolledDate: '2026-03-03', progressPercent: 45, quizScore: 'Pending', status: 'in_progress' },
  ],
  'crs-shg-gov-301': [
    { id: 't-9', name: 'Sunita Devi', coop: 'Mahila Utkarsh SHG Federation, Lucknow', enrolledDate: '2026-02-12', progressPercent: 100, quizScore: '95% (Distinction)', status: 'completed' },
    { id: 't-10', name: 'Meena Kumari', coop: 'Prerna SHG Cluster, Varanasi', enrolledDate: '2026-02-16', progressPercent: 80, quizScore: '84% (Pass)', status: 'in_progress' },
    { id: 't-11', name: 'Kavita Patel', coop: 'Sardar Patel Mahila Sahakari Mandali, Anand', enrolledDate: '2026-02-20', progressPercent: 100, quizScore: '88% (Pass)', status: 'completed' },
  ],
};

export const FacultyCoursesView: React.FC = () => {
  const { courses, navigate, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRosterCourse, setActiveRosterCourse] = useState<Course | null>(null);

  // Faculty's authored courses
  const facultyCourses = courses;

  // Filtered list
  const filteredCourses = facultyCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'PACS Digitalization', 'Dairy Management', 'Women & SHGs', 'Cooperative Governance', 'Financial Literacy', 'Agriculture & Rural Development'];

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
        {/* 1. Header Banner (Management Perspective - No Trainee Enrollment Language) */}
        <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
                Curriculum Governance
              </span>
              <SimulatedBadge text="Faculty Course Management" />
            </div>
            <h1 className="text-2xl font-extrabold text-govText-primary mt-1">
              My Authored Courses
            </h1>
            <p className="text-xs text-govText-secondary mt-1 max-w-2xl leading-relaxed">
              Curriculum authoring, lesson modules, quiz assessments, and trainee performance analytics for courses authored by Prof. Meenakshi Sundaram.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/faculty/courses/new')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B6E4F] hover:bg-[#085A40] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 min-h-[44px] flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Author New Course / Module</span>
          </button>
        </div>

        {/* 2. Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-govText-border shadow-xs flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your authored courses by title or topic..."
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-govText-border text-xs focus:outline-none focus:ring-2 focus:ring-[#0B6E4F] bg-govBg"
            />
            <Search className="w-4 h-4 text-govText-muted absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-govText-secondary">
              <Filter className="w-4 h-4 text-govTeal-600" />
              <span>Category:</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-govTeal-600 text-white shadow-xs'
                      : 'bg-govBg hover:bg-gray-100 text-govText-secondary'
                  }`}
                >
                  {cat === 'all' ? `All Authored (${facultyCourses.length})` : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Course Cards Grid in Management Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            // Realistic metrics per course
            const enrolled = idx === 0 ? 540 : idx === 1 ? 460 : 280;
            const compRate = idx === 0 ? 92 : idx === 1 ? 86 : 87;
            const updatedDate = idx === 0 ? 'Updated 2 days ago' : idx === 1 ? 'Updated 5 days ago' : 'Updated 1 week ago';
            const totalModules = course.modules?.length || 2;
            const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 4;

            return (
              <FacultyCourseCard
                key={course.id}
                course={course}
                enrolledCount={enrolled}
                completionRate={compRate}
                lastUpdatedText={updatedDate}
                onManage={() => navigate(`/faculty/courses/${course.id}/edit`)}
                onViewRoster={() => setActiveRosterCourse(course)}
              />
            );
          })}
        </div>

        {/* 4. Enrolled Trainee Roster Modal (Part 3) */}
        {activeRosterCourse && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden p-5 sm:p-6 shadow-2xl border border-gray-200 flex flex-col space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-govTeal-50 text-govTeal-800 border border-govTeal-200">
                      Enrolled Roster
                    </span>
                    <span className="text-xs text-govText-muted font-mono">{activeRosterCourse.id}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-govText-primary mt-1">
                    {activeRosterCourse.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveRosterCourse(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                  aria-label="Close roster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Roster Table */}
              <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs text-govText-primary">
                  <thead className="bg-[#F8FAF8] border-b border-gray-200 text-[11px] font-bold text-govText-secondary uppercase sticky top-0">
                    <tr>
                      <th className="p-3">Trainee Candidate</th>
                      <th className="p-3">Sponsoring Society</th>
                      <th className="p-3 text-right">LMS Progress</th>
                      <th className="p-3 text-right">Quiz Assessment</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(MOCK_ROSTER_BY_COURSE[activeRosterCourse.id] || MOCK_ROSTER_BY_COURSE['crs-pacs-erp-101']).map(trainee => (
                      <tr key={trainee.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <div className="font-bold text-govText-primary">{trainee.name}</div>
                          <div className="text-[10px] text-govText-muted font-mono">{trainee.id}</div>
                        </td>
                        <td className="p-3 text-govText-secondary">
                          {trainee.coop}
                        </td>
                        <td className="p-3 text-right">
                          <div className="font-bold text-govText-primary">{trainee.progressPercent}%</div>
                          <div className="w-20 bg-gray-200 h-1.5 rounded-full overflow-hidden ml-auto mt-1">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${trainee.progressPercent}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-800">
                          {trainee.quizScore}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              trainee.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {trainee.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                            {trainee.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Roster Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs flex-shrink-0">
                <span className="text-govText-muted">
                  Showing 5 sample candidates from central NCCT database.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/faculty/courses/${activeRosterCourse.id}/edit`);
                    setActiveRosterCourse(null);
                  }}
                  className="px-3.5 py-1.5 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Open in Course Studio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
