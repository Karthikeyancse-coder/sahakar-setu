import React, { useState } from 'react';
import {
  Edit3,
  Plus,
  Save,
  BookOpen,
  Layers,
  HelpCircle,
  Globe,
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule, Lesson, Quiz } from '../../types';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const CourseBuilder: React.FC = () => {
  const { courses, addNewCourse, currentUser } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);

  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newTitleMr, setNewTitleMr] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Agri-Credit');
  const [newDescEn, setNewDescEn] = useState('');

  const [savedNotice, setSavedNotice] = useState(false);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourseObj: Course = {
      id: `crs-${Date.now()}`,
      title: newTitleEn,
      titleHi: newTitleHi || newTitleEn,
      titleMr: newTitleMr || newTitleEn,
      description: newDescEn,
      descriptionHi: newDescEn,
      descriptionMr: newDescEn,
      thumbnail: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80',
      instituteId: currentUser.instituteId || 'inst-vamnicom',
      durationHours: 30,
      level: 'Intermediate',
      category: newCategory,
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          courseId: `crs-${Date.now()}`,
          order: 1,
          title: 'Module 1: Foundations & Legal Framework',
          titleHi: 'मॉड्यूल 1: बुनियादी सिद्धांत एवं कानूनी ढांचा',
          titleMr: 'विभाग १: मूलभूत तत्त्वे व कायदेशीर चौकट',
          lessons: [
            {
              id: `les-${Date.now()}-1-1`,
              moduleId: `mod-${Date.now()}-1`,
              order: 1,
              title: '1.1 Cooperative Governance Standards',
              titleHi: '1.1 सहकारी शासन मानक',
              titleMr: '1.1 सहकार प्रशासन मानके',
              durationMinutes: 25,
              contentType: 'text',
              contentByLanguage: {
                en: {
                  text: 'Comprehensive module on bylaws, voting rights, and audit trails in cooperative societies.',
                  keyTakeaways: ['Democracy in cooperative decision making', 'Audit compliance with NABARD'],
                },
                hi: {
                  text: 'सहकारी समितियों में उप-नियम, मताधिकार एवं ऑडिट ट्रेल पर व्यापक अध्ययन।',
                  keyTakeaways: ['निर्णय लेने में लोकतांत्रिक प्रक्रिया', 'नाबार्ड के साथ ऑडिट अनुपालन'],
                },
                mr: {
                  text: 'सहकारी संस्थांचे पोटनियम, मतदान हक्क आणि ऑडिट नियमावली.',
                  keyTakeaways: ['लोकशाही निर्णय पद्धती', 'नाबार्ड नियमांची पूर्तता'],
                },
              },
            },
          ],
        },
      ],
    };

    addNewCourse(newCourseObj);
    setSelectedCourseId(newCourseObj.id);
    setIsNewCourseModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              LMS Curriculum Studio
            </span>
            <SimulatedBadge text="Multilingual Course Authoring" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary">
            Course, Module & Quiz Builder
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            Author national curriculum modules in English, Hindi, and Marathi with auto-grading assessments.
          </p>
        </div>

        <button
          onClick={() => setIsNewCourseModalOpen(true)}
          className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Course created and published to NCCT LMS repository!</span>
        </div>
      )}

      {/* Select active course */}
      <div className="bg-white p-4 rounded-xl border border-govText-border shadow-sm flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-govText-secondary">Select Active Course:</span>
        <div className="flex flex-wrap gap-2">
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCourseId === c.id
                  ? 'bg-govTeal-600 text-white shadow-sm'
                  : 'bg-govBg hover:bg-govTeal-50 text-govText-primary'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Course Structure View */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-govText-border shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
              {activeCourse.category} • {activeCourse.durationHours} Hours
            </span>
            <h3 className="text-xl font-bold text-govText-primary mt-1">
              {activeCourse.title}
            </h3>
            <p className="text-xs text-govText-secondary mt-1">
              Hindi: <strong className="font-normal font-devanagari">{activeCourse.titleHi}</strong> | Marathi: <strong className="font-normal font-devanagari">{activeCourse.titleMr}</strong>
            </p>
          </div>

          <button
            onClick={() => alert('Changes saved to NCCT local cache!')}
            className="px-4 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Course Updates</span>
          </button>
        </div>

        {/* Modules & Lessons List */}
        <div className="space-y-4">
          {activeCourse.modules.map((mod, mIdx) => (
            <div key={mod.id} className="border border-govTeal-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-govTeal-50 p-4 flex items-center justify-between border-b border-govTeal-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-govTeal-700" />
                  <h4 className="font-bold text-sm text-govTeal-900">{mod.title}</h4>
                </div>
                <span className="text-xs text-govTeal-700 font-semibold font-devanagari">
                  {mod.titleHi}
                </span>
              </div>

              <div className="p-4 space-y-3 bg-white">
                {mod.lessons.map((les, lIdx) => (
                  <div
                    key={les.id}
                    className="p-3 bg-govBg rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-govTeal-600 flex-shrink-0" />
                      <span className="font-bold text-govText-primary">{les.title}</span>
                      <span className="text-govText-muted font-devanagari">({les.titleHi})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-govText-muted">{les.durationMinutes} mins</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        Trilingual Verified
                      </span>
                    </div>
                  </div>
                ))}

                {mod.quiz && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-950 font-semibold">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      <span>{mod.quiz.title} ({mod.quiz.questions.length} MCQ Questions)</span>
                    </div>
                    <span className="font-bold font-mono">Pass Threshold: {mod.quiz.passThreshold}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Course Modal */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-govTeal-200 w-full max-w-lg overflow-hidden">
            <div className="bg-govTeal-800 text-white p-5">
              <h3 className="font-bold text-lg">Author New NCCT Course</h3>
              <p className="text-xs text-govTeal-100">Add course metadata and multilingual titles</p>
            </div>

            <form onSubmit={handleSaveNewCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">
                  Course Title (English)
                </label>
                <input
                  type="text"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="e.g. Agri-Credit Auditing & Governance"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-govText-secondary mb-1">
                    Title (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={newTitleHi}
                    onChange={(e) => setNewTitleHi(e.target.value)}
                    placeholder="कृषि ऋण लेखापरीक्षा"
                    className="w-full px-3 py-2 text-xs font-devanagari rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-govText-secondary mb-1">
                    Title (मराठी)
                  </label>
                  <input
                    type="text"
                    value={newTitleMr}
                    onChange={(e) => setNewTitleMr(e.target.value)}
                    placeholder="कृषी पतपुरवठा व ऑडिट"
                    className="w-full px-3 py-2 text-xs font-devanagari rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">
                  Category Track
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                >
                  <option value="PACS Digitalization">PACS Digitalization</option>
                  <option value="Dairy & Livestock">Dairy & Livestock</option>
                  <option value="SHG Governance">SHG Governance</option>
                  <option value="Agri-Credit">Agri-Credit</option>
                  <option value="Auditing & Compliance">Auditing & Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-govText-secondary mb-1">
                  Course Synopsis
                </label>
                <textarea
                  rows={3}
                  value={newDescEn}
                  onChange={(e) => setNewDescEn(e.target.value)}
                  placeholder="Summary of learning outcomes for cooperative workers..."
                  className="w-full p-2.5 text-xs rounded-lg border border-govText-border bg-govBg focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-govText-primary text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Publish Course
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
