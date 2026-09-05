import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Edit3,
  Users,
  Search,
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
  Eye,
  Trash2,
  AlertCircle
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
  const { courses, navigate, currentUser, deleteCourse } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRosterCourse, setActiveRosterCourse] = useState<Course | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  // Edit / Delete Course Management States
  const [courseToDelete, setCourseToDelete] = useState<{ course: Course; enrolledCount: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAuthor = currentUser?.role === 'faculty';

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 350));
    deleteCourse(courseToDelete.course.id);
    setIsDeleting(false);
    setCourseToDelete(null);
    setToastMessage('Course deleted successfully.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

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
      <div className="space-y-6 animate-fadeIn pb-24 sm:pb-28 lg:pb-12">
        {/* 1. Header Banner (Management Perspective - No Trainee Enrollment Language) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-govText-border shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-bold text-govTeal-700 uppercase tracking-wider px-2 py-0.5 rounded bg-govTeal-50 border border-govTeal-200">
                Curriculum Governance
              </span>
              <SimulatedBadge text="Faculty Course Management" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-govText-primary mt-1.5">
              My Authored Courses
            </h1>
            <p className="text-xs text-govText-secondary mt-1 max-w-2xl leading-relaxed">
              Curriculum authoring, lesson modules, quiz assessments, and trainee performance analytics for courses authored by Prof. Meenakshi Sundaram.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/faculty/courses/new')}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B6E4F] hover:bg-[#085A40] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 min-h-[44px] flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Author New Course / Module</span>
          </button>
        </div>

        {/* 2. Filter & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-govText-border shadow-xs p-3.5 sm:p-4 lg:px-6 lg:py-0 lg:h-[88px] flex flex-col md:flex-row md:items-center gap-3 lg:gap-4 w-full">
          {/* Mobile Search Row (< md) */}
          <div className="md:hidden relative w-full flex items-center">
            <Search className="w-4 h-4 text-govText-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your authored courses..."
              className="w-full h-[48px] pl-10 pr-9 rounded-xl border border-govText-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6E4F] bg-[#F6F8F6] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop & Tablet Search Control (>= md) */}
          <div className="hidden md:flex items-center shrink-0">
            {isSearchExpanded || searchQuery ? (
              <div className="relative flex items-center h-[56px] w-64 lg:w-72 transition-all duration-200">
                <Search className="w-5 h-5 text-[#0B6E4F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={desktopSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                      setIsSearchExpanded(false);
                    }
                  }}
                  placeholder="Search authored courses..."
                  className="w-full h-[56px] pl-11 pr-10 rounded-[16px] border border-[#0B6E4F] text-xs font-semibold text-govText focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/20 bg-white shadow-xs"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchExpanded(false);
                  }}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => desktopSearchInputRef.current?.focus(), 50);
                }}
                title="Search authored courses"
                aria-label="Search authored courses"
                className="w-[56px] h-[56px] rounded-[16px] border border-[#0B6E4F] bg-white hover:bg-[#0B6E4F]/5 text-[#0B6E4F] flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/40"
              >
                <Search className="w-5 h-5 text-gray-600 group-hover:text-[#0B6E4F] transition-colors" />
              </button>
            )}
          </div>

          {/* Category Label + Horizontally Scrollable Chips */}
          <div className="flex items-center gap-3 flex-1 min-w-0 w-full md:w-auto">
            <span className="text-xs sm:text-[13px] font-semibold text-govText-secondary shrink-0 select-none leading-none inline-flex items-center">
              Category:
            </span>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-[50px] min-h-[50px] max-h-[50px] px-4 sm:px-5 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center shrink-0 leading-none select-none ${
                    selectedCategory === cat
                      ? 'bg-[#0B6E4F] text-white font-bold shadow-xs'
                      : 'bg-[#F6F8F6] hover:bg-[#EDF2ED] text-govText-secondary hover:text-govText font-semibold'
                  }`}
                >
                  {cat === 'all' ? `All Authored (${facultyCourses.length})` : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Course Cards Grid in Management Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredCourses.map((course, idx) => {
            // Realistic metrics per course
            const enrolled = idx === 0 ? 540 : idx === 1 ? 460 : 280;
            const compRate = idx === 0 ? 92 : idx === 1 ? 86 : 87;
            const updatedDate = idx === 0 ? 'Updated 2 days ago' : idx === 1 ? 'Updated 5 days ago' : 'Updated 1 week ago';

            return (
              <FacultyCourseCard
                key={course.id}
                course={course}
                enrolledCount={enrolled}
                completionRate={compRate}
                lastUpdatedText={updatedDate}
                onManage={() => navigate(`/faculty/courses/${course.id}/edit`)}
                onViewRoster={() => setActiveRosterCourse(course)}
                onEdit={isAuthor ? () => navigate(`/faculty/courses/${course.id}/edit-course`, { editCourseId: course.id }) : undefined}
                onDelete={isAuthor ? () => setCourseToDelete({ course, enrolledCount: enrolled }) : undefined}
              />
            );
          })}
        </div>

        {/* 4. Enrolled Trainee Roster Modal (Part 3) */}
        {activeRosterCourse && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden p-4 sm:p-6 shadow-2xl border border-gray-200 flex flex-col space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-shrink-0 gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-govTeal-50 text-govTeal-800 border border-govTeal-200">
                      Enrolled Roster
                    </span>
                    <span className="text-xs text-govText-muted font-mono">{activeRosterCourse.id}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-govText-primary mt-1 truncate">
                    {activeRosterCourse.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveRosterCourse(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Close roster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Roster Table with horizontal scrolling on mobile */}
              <div className="flex-1 overflow-y-auto overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[560px] text-left text-xs text-govText-primary">
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

        {/* 5. Delete Course Confirmation Modal */}
        {courseToDelete && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scaleUp">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-lg font-extrabold text-govText-primary">
                  Delete Course?
                </h3>
                <p className="text-xs text-govText-secondary leading-relaxed">
                  Are you sure you want to delete <strong className="text-govText-primary font-bold">'{courseToDelete.course.title}'</strong>? This action cannot be undone.
                </p>
              </div>

              {courseToDelete.enrolledCount > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Warning:</strong> This course has enrolled trainees ({courseToDelete.enrolledCount} learners). Deleting it may affect existing learner records and certification history.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setCourseToDelete(null)}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer min-h-[44px] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer min-h-[44px] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Course</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Small Success Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1300] bg-govTeal-950 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-govTeal-700 flex items-center gap-2 text-xs font-semibold animate-slideUp">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
