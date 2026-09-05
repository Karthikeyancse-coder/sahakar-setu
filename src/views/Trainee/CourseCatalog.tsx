import React, { useState } from 'react';
import {
  Compass,
  Search,
  Filter,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { CourseCard } from '../../components/common/CourseCard';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const CourseCatalog: React.FC = () => {
  const { courses, enrollments, currentUser, currentLanguage, navigate, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.catalog?.allCategories || 'All Categories' },
    { id: 'pacs', label: 'PACS Digitalization' },
    { id: 'dairy', label: 'Dairy & AMCS' },
    { id: 'banking', label: 'Cooperative Banking' },
    { id: 'governance', label: 'Audit & Governance' },
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const filteredCourses = courses.filter(course => {
    const courseTitle = currentLanguage === 'hi' ? course.titleHi : currentLanguage === 'mr' ? course.titleMr : course.title;
    const courseDesc = currentLanguage === 'hi' ? course.descriptionHi : currentLanguage === 'mr' ? course.descriptionMr : course.description;

    const matchesSearch =
      courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      course.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      course.title.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesLevel =
      selectedLevel === 'all' ||
      course.level.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <PageContainer>
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              National Curriculum
            </span>
            <SimulatedBadge text="NCCT & VAMNICOM Standardized" />
          </div>
          <h1 className="text-2xl font-extrabold text-govText-primary mt-1">
            {t.catalog?.title || 'National Course Catalog'}
          </h1>
          <p className="text-xs text-govText-secondary mt-1 max-w-2xl">
            {t.catalog?.subtitle || 'Explore accredited cooperative training courses and earn recognized certifications.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('my_courses')}
            className="px-4 py-2.5 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 border border-govTeal-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-govTeal-700" />
            <span>{t.myCourses?.title || 'My Enrolled Courses'}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-govText-border shadow-sm flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:flex-1 min-w-0 sm:min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.catalog?.searchPlaceholder || 'Search courses by name, topic, or code...'}
            className="w-full px-3.5 py-2.5 pl-9 rounded-lg border border-govText-border text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 bg-govBg"
          />
          <Search className="w-4 h-4 text-govText-muted absolute left-3 top-3" />
        </div>

        {/* Category Pills (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-govText-muted flex-shrink-0" />
          <div className="flex gap-1.5 flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer min-h-[36px] flex items-center ${selectedCategory === cat.id
                    ? 'bg-govTeal-700 text-white shadow-xs'
                    : 'bg-govBg text-govText-secondary hover:bg-gray-200 border border-gray-200'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level Dropdown */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg border border-govText-border bg-govBg font-medium text-govText-primary focus:outline-none focus:ring-2 focus:ring-govTeal-600 min-h-[38px]"
        >
          {levels.map((lvl) => (
            <option key={lvl.id} value={lvl.id}>
              {lvl.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-govText-border space-y-4">
          <GraduationCap className="w-12 h-12 text-govTeal-400 mx-auto" />
          <h3 className="text-base font-bold text-govText-primary">No courses match your criteria</h3>
          <p className="text-xs text-govText-secondary max-w-sm mx-auto">
            Try adjusting your search query or reset the filters to see all available national courses.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}
            className="px-4 py-2 bg-govTeal-600 text-white text-xs font-bold rounded-xl hover:bg-govTeal-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const enrollment = enrollments.find(
              e => e.userId === currentUser.id && e.courseId === course.id
            );

            return (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollment}
                currentLanguage={currentLanguage}
                onSelect={(id) => navigate('course_detail', { courseId: id })}
                continueLabel={t.lms.continueLesson}
                startLabel={t.catalog?.enrollNow || t.lms.startLesson}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};
