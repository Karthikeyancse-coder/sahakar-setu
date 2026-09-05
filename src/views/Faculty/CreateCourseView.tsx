import React, { useState, useId } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileText,
  ListPlus,
  X,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { Course, CourseModule, Lesson } from '../../types';
import { FacultyCourseCard } from '../../components/common/FacultyCourseCard';
import { CoursePreviewModal } from '../../components/common/CoursePreviewModal';

interface ModuleFormItem {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  lessons: string[];
}

export const CreateCourseView: React.FC = () => {
  const { courses, addNewCourse, navigate, currentUser } = useApp();

  // Basic Information Form State
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [hasManuallyEditedId, setHasManuallyEditedId] = useState(false);
  const [category, setCategory] = useState('PACS Digitalization');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [durationHours, setDurationHours] = useState<number | ''>(30);
  const [description, setDescription] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    'Understand fundamental cooperative principles and legal compliance standards.',
    'Execute day-to-day accounting transactions on the National PACS ERP software.',
  ]);
  const [newObjectiveInput, setNewObjectiveInput] = useState('');

  // Course Modules State
  const [modules, setModules] = useState<ModuleFormItem[]>([
    {
      id: 'mod-init-1',
      title: 'Module 01: Foundations & Legal Framework',
      description: 'Cooperative legislation, state bye-laws, and National MoC policy architecture.',
      durationHours: 12,
      lessons: ['What is a Cooperative?', 'Cooperative Governance Principles', 'Role of PACS in Rural Economy'],
    },
    {
      id: 'mod-init-2',
      title: 'Module 02: Digital Operations & Day-End Balancing',
      description: 'Transaction entry, double-entry ledger balancing, and KCC loan disbursement.',
      durationHours: 18,
      lessons: ['Digital Cash Book Posting', 'Day-Open and Day-Close Locks', 'NABARD Subvention Audit Trail'],
    },
  ]);

  // Temporary input for adding a lesson inside a specific module
  const [lessonInputs, setLessonInputs] = useState<Record<string, string>>({});

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedCourseTitle, setPublishedCourseTitle] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Auto-generate Course ID from Title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!hasManuallyEditedId) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 30);
      setCourseId(slug ? `crs-${slug}` : '');
    }
  };

  const handleIdChange = (val: string) => {
    setCourseId(val);
    setHasManuallyEditedId(true);
  };

  // Learning Objectives Handlers
  const handleAddObjective = () => {
    if (!newObjectiveInput.trim()) return;
    setLearningObjectives(prev => [...prev, newObjectiveInput.trim()]);
    setNewObjectiveInput('');
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  // Modules Handlers
  const handleAddModule = () => {
    const newModNumber = modules.length + 1;
    const newMod: ModuleFormItem = {
      id: `mod-${Date.now()}`,
      title: `Module ${String(newModNumber).padStart(2, '0')}: New Curriculum Section`,
      description: 'Provide an overview of key operational topics covered in this module.',
      durationHours: 10,
      lessons: ['Introduction & Conceptual Overview'],
    };
    setModules(prev => [...prev, newMod]);
  };

  const handleUpdateModule = (id: string, field: keyof ModuleFormItem, value: any) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleDeleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === modules.length - 1)
    ) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    setModules(prev => {
      const copy = [...prev];
      const item = copy.splice(index, 1)[0];
      copy.splice(newIndex, 0, item);
      return copy;
    });
  };

  const handleAddLesson = (moduleId: string) => {
    const text = lessonInputs[moduleId]?.trim();
    if (!text) return;
    setModules(prev =>
      prev.map(m => {
        if (m.id === moduleId) {
          return { ...m, lessons: [...m.lessons, text] };
        }
        return m;
      })
    );
    setLessonInputs(prev => ({ ...prev, [moduleId]: '' }));
  };

  const handleRemoveLesson = (moduleId: string, lessonIdx: number) => {
    setModules(prev =>
      prev.map(m => {
        if (m.id === moduleId) {
          return { ...m, lessons: m.lessons.filter((_, idx) => idx !== lessonIdx) };
        }
        return m;
      })
    );
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Course title is required.';
    }

    if (!courseId.trim()) {
      newErrors.courseId = 'Course ID is required.';
    } else {
      // Check for duplicate course IDs in existing courses list
      const isDuplicate = courses.some(c => c.id.toLowerCase() === courseId.trim().toLowerCase());
      if (isDuplicate) {
        newErrors.courseId = `Course ID "${courseId}" already exists. Please choose a unique identifier.`;
      }
    }

    if (!category) {
      newErrors.category = 'Please select a course category.';
    }

    if (!durationHours || Number(durationHours) <= 0) {
      newErrors.durationHours = 'Please enter a valid course duration in hours.';
    }

    if (!description.trim() || description.trim().length < 20) {
      newErrors.description = 'Course description must be at least 20 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Publish Course Action
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Construct full Course object compatible with existing Course Studio & catalog
    const newCourseObj: Course = {
      id: courseId.trim(),
      title: title.trim(),
      titleHi: title.trim(),
      titleMr: title.trim(),
      description: description.trim(),
      descriptionHi: description.trim(),
      descriptionMr: description.trim(),
      thumbnail: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80',
      instituteId: currentUser.instituteId || 'inst-vamnicom',
      durationHours: Number(durationHours),
      level: difficulty,
      category: category as any,
      modules: modules.map((m, idx) => ({
        id: m.id,
        courseId: courseId.trim(),
        order: idx + 1,
        title: m.title,
        titleHi: m.title,
        titleMr: m.title,
        lessons: m.lessons.map((lessonTitle, lIdx) => ({
          id: `les-${m.id}-${lIdx + 1}`,
          moduleId: m.id,
          order: lIdx + 1,
          title: lessonTitle,
          titleHi: lessonTitle,
          titleMr: lessonTitle,
          durationMinutes: 30,
          contentType: 'text',
          contentByLanguage: {
            en: {
              text: `### Overview: ${lessonTitle}\n\nThis training unit covers the regulatory standards and standard operating procedures sanctioned by the National Council for Cooperative Training (NCCT) under the Ministry of Cooperation.\n\nKey takeaways:\n- Standardized operating workflow\n- Compliance auditing guidelines\n- Practical field simulations`,
              keyTakeaways: [
                'Accredited standard curriculum under Ministry of Cooperation',
                'Verifiable assessment criteria with practical ledger demonstrations',
              ],
            },
            hi: {
              text: `### सारांश: ${lessonTitle}\n\nयह प्रशिक्षण इकाई सहकारिता मंत्रालय के तत्वावधान में राष्ट्रीय सहकारी प्रशिक्षण परिषद (NCCT) द्वारा अनुमोदित मानक संचालन प्रक्रियाओं को समाहित करती है।`,
              keyTakeaways: ['सहकारिता मंत्रालय के अंतर्गत मान्यता प्राप्त पाठ्यक्रम', 'व्यावहारिक सत्यापन एवं ई-केवाईसी दिशानिर्देश'],
            },
            mr: {
              text: `### सारांश: ${lessonTitle}\n\nहा प्रशिक्षण विभाग सहकार मंत्रालयाच्या अंतर्गत राष्ट्रीय सहकारी प्रशिक्षण परिषदेने (NCCT) निर्धारित केलेल्या मानकांची माहिती देतो.`,
              keyTakeaways: ['अधिकृत राष्ट्रीय अभ्यासक्रम', 'प्रत्यक्ष प्रात्यक्षिक व मूल्यांकन'],
            },
          },
        })),
        quiz: {
          id: `quiz-${m.id}`,
          moduleId: m.id,
          title: `${m.title} Assessment Quiz`,
          titleHi: `${m.title} मूल्यांकन परीक्षा`,
          titleMr: `${m.title} मूल्यांकन चाचणी`,
          passThreshold: 75,
          questions: [
            {
              id: `q-${m.id}-1`,
              question: 'What is the primary governing objective of standard cooperative bookkeeping?',
              questionHi: 'सहकारी बही-खाता संधारण का प्राथमिक उद्देश्य क्या है?',
              questionMr: 'सहकारी हिशोब तपासणीचे मुख्य उद्दिष्ट काय आहे?',
              options: {
                en: ['Transparent member dividend audit', 'Tax evasion', 'Manual secrecy', 'Unrecorded credits'],
                hi: ['पारदर्शी सदस्य लाभांश ऑडिट', 'कर अपवंचन', 'गोपनीयता', 'अनाधिकृत ऋण'],
                mr: ['पारदर्शक सभासद लाभांश ऑडिट', 'कर चुकवेगिरी', 'गोपनीयता', 'अनधिकृत कर्ज'],
              },
              correctOptionIndex: 0,
              explanation: {
                en: 'Double-entry cooperative accounting mandates total audit transparency for members and regulatory authorities.',
                hi: 'दोहरी प्रविष्टि सहकारी लेखांकन सदस्यों और नियामक प्राधिकरणों के लिए पूर्ण ऑडिट पारदर्शिता अनिवार्य करता है।',
                mr: 'द्विनोंद पद्धत सभासद व नियामक संस्थांसाठी पूर्ण पारदर्शकता निश्चित करते.',
              },
            },
          ],
        },
      })),
    };

    // Add to shared AppContext courses state (persisted to localStorage)
    addNewCourse(newCourseObj);

    setPublishedCourseTitle(title.trim());
    setShowSuccessModal(true);
  };

  // Save as Draft Action
  const handleSaveDraft = () => {
    if (!title.trim() || !courseId.trim()) {
      setErrors({
        title: !title.trim() ? 'Course title is required to save a draft.' : '',
        courseId: !courseId.trim() ? 'Course ID is required.' : '',
      });
      return;
    }

    const draftCourse: Course = {
      id: courseId.trim(),
      title: `${title.trim()} (Draft)`,
      titleHi: `${title.trim()} (Draft)`,
      titleMr: `${title.trim()} (Draft)`,
      description: description.trim() || 'Curriculum draft in preparation.',
      descriptionHi: description.trim() || 'Curriculum draft in preparation.',
      descriptionMr: description.trim() || 'Curriculum draft in preparation.',
      thumbnail: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80',
      instituteId: currentUser.instituteId || 'inst-vamnicom',
      durationHours: Number(durationHours) || 10,
      level: difficulty,
      category: category as any,
      modules: [],
    };

    addNewCourse(draftCourse);
    navigate('/faculty/courses');
  };

  // Construct dynamic live preview course from current form state
  const previewCourse: Course = {
    id: courseId.trim() || 'crs-preview-id',
    title: title.trim() || 'Untitled Course',
    titleHi: '',
    titleMr: '',
    description:
      description.trim() ||
      'Course description will appear here once entered in the curriculum authoring form.',
    descriptionHi: '',
    descriptionMr: '',
    thumbnail:
      'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80',
    instituteId: currentUser?.instituteId || 'inst-vamnicom',
    durationHours: Number(durationHours) || 30,
    level: difficulty,
    category: category as any,
    modules: modules.map((m, idx) => ({
      id: m.id || `mod-${idx + 1}`,
      courseId: courseId.trim() || 'crs-preview-id',
      order: idx + 1,
      title: m.title || `Module ${idx + 1}`,
      titleHi: '',
      titleMr: '',
      description: m.description || '',
      durationHours: m.durationHours || 10,
      lessons: m.lessons.map((lessonTitle, lIdx) => ({
        id: `les-${idx + 1}-${lIdx + 1}`,
        moduleId: m.id,
        order: lIdx + 1,
        title: lessonTitle,
        titleHi: lessonTitle,
        titleMr: lessonTitle,
        durationMinutes: 30,
        contentType: 'text' as const,
        contentByLanguage: {
          en: {
            text: `Overview of ${lessonTitle}`,
            keyTakeaways: ['Accredited training curriculum'],
          },
          hi: {
            text: `विवरण: ${lessonTitle}`,
            keyTakeaways: ['प्रमाणित पाठ्यक्रम'],
          },
          mr: {
            text: `तपशील: ${lessonTitle}`,
            keyTakeaways: ['प्रमाणित अभ्यासक्रम'],
          },
        },
      })),
    })),
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-24">
        {/* 1. Header & Breadcrumbs */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-govText-border shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/faculty/courses')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-govTeal-700 hover:text-govTeal-900 hover:underline cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to My Courses</span>
              </button>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
                Curriculum Authoring
              </span>
              <SimulatedBadge text="Course Studio v2.4" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-govText-primary tracking-tight">
              Create New Course
            </h1>
            <p className="text-xs text-govText-secondary">
              Design a new training programme for cooperative-sector learners.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-govBg hover:bg-govTeal-50 text-govTeal-900 border border-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px]"
            >
              <Eye className="w-4 h-4 text-govTeal-700" />
              <span>Preview Course</span>
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px]"
            >
              <Save className="w-4 h-4 text-gray-600" />
              <span>Save as Draft</span>
            </button>
          </div>
        </div>

        {/* 2. Form Wrapper */}
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Section A: Basic Course Information */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-govText-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <BookOpen className="w-5 h-5 text-govTeal-600 flex-shrink-0" />
              <div>
                <h2 className="text-base font-bold text-govText-primary">
                  Basic Course Information
                </h2>
                <p className="text-xs text-govText-secondary">
                  Specify the national title, system ID, duration, and classification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* 1. Course Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-govText-primary mb-1">
                  Course Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. Advanced Cooperative Society Management"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#FBFDFB] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? 'border-rose-400 focus:ring-rose-300'
                      : 'border-gray-200 focus:ring-[#0B6E4F] focus:border-[#0B6E4F]'
                  }`}
                />
                {errors.title && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* 2. Course ID */}
              <div>
                <label className="block text-xs font-bold text-govText-primary mb-1">
                  Course Identifier (ID) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={courseId}
                    onChange={e => handleIdChange(e.target.value)}
                    placeholder="crs-coop-mgmt-401"
                    className={`w-full px-3.5 py-2.5 font-mono text-xs rounded-xl border bg-[#FBFDFB] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.courseId
                        ? 'border-rose-400 focus:ring-rose-300'
                        : 'border-gray-200 focus:ring-[#0B6E4F] focus:border-[#0B6E4F]'
                    }`}
                  />
                </div>
                {errors.courseId ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.courseId}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-govText-muted mt-1">
                    Auto-generated from title. Must be unique across all 20 NCCT institutes.
                  </p>
                )}
              </div>

              {/* 3. Category */}
              <div>
                <label className="block text-xs font-bold text-govText-primary mb-1">
                  Domain Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-[#FBFDFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F] transition-all cursor-pointer"
                >
                  <option value="PACS Digitalization">PACS Digitalization</option>
                  <option value="Dairy Management">Dairy Management</option>
                  <option value="Women & SHGs">Women & SHGs</option>
                  <option value="Cooperative Governance">Cooperative Governance</option>
                  <option value="Financial Literacy">Financial Literacy</option>
                  <option value="Agriculture & Rural Development">Agriculture & Rural Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 4. Difficulty */}
              <div>
                <label className="block text-xs font-bold text-govText-primary mb-1">
                  Difficulty Level <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                        difficulty === lvl
                          ? 'bg-govTeal-600 text-white border-govTeal-600 shadow-2xs'
                          : 'bg-govBg hover:bg-gray-100 text-govText-primary border-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Duration */}
              <div>
                <label className="block text-xs font-bold text-govText-primary mb-1">
                  Total Course Duration (Hours) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={durationHours}
                    onChange={e => setDurationHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="30"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#FBFDFB] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.durationHours
                        ? 'border-rose-400 focus:ring-rose-300'
                        : 'border-gray-200 focus:ring-[#0B6E4F]'
                    }`}
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-govText-muted font-medium pointer-events-none">
                    Hours
                  </span>
                </div>
                {errors.durationHours && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.durationHours}</span>
                  </p>
                )}
              </div>

              {/* 6. Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-govText-primary mb-1">
                  Course Overview & Description <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the training objectives, target cooperative functionaries, and key practical outcomes..."
                  className={`w-full p-3.5 text-xs rounded-xl border bg-[#FBFDFB] focus:bg-white focus:outline-none focus:ring-2 transition-all leading-relaxed ${
                    errors.description
                      ? 'border-rose-400 focus:ring-rose-300'
                      : 'border-gray-200 focus:ring-[#0B6E4F]'
                  }`}
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* 7. Learning Objectives */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold text-govText-primary">
                  Learning Objectives & Key Takeaways
                </label>
                <div className="space-y-2">
                  {learningObjectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 bg-govBg rounded-xl border border-gray-100 text-xs"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-govTeal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-govText-primary">{obj}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(idx)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove objective"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newObjectiveInput}
                    onChange={e => setNewObjectiveInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                    placeholder="Type an objective and tap '+ Add'..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-[#FBFDFB] focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3.5 py-2 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 text-xs font-bold rounded-xl border border-govTeal-200 transition-colors cursor-pointer"
                  >
                    + Add Learning Objective
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Module Builder (Part 3) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-govText-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-2">
              <div>
                <h2 className="text-base font-bold text-govText-primary flex items-center gap-2">
                  <Layers className="w-5 h-5 text-govTeal-600" />
                  Course Modules & Curriculum Architecture
                </h2>
                <p className="text-xs text-govText-secondary mt-0.5">
                  Organize your course syllabus into logical modules and lesson topics.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-govTeal-50 hover:bg-govTeal-100 text-govTeal-800 rounded-xl text-xs font-bold border border-govTeal-200 transition-colors cursor-pointer self-start sm:self-auto min-h-[38px]"
              >
                <Plus className="w-4 h-4 text-govTeal-700" />
                <span>+ Add Module</span>
              </button>
            </div>

            {/* Empty State */}
            {modules.length === 0 ? (
              <div className="text-center py-10 px-4 bg-govBg rounded-2xl border border-dashed border-gray-300 space-y-3">
                <Layers className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="font-bold text-sm text-govText-primary">
                  No modules added yet
                </h3>
                <p className="text-xs text-govText-secondary max-w-sm mx-auto">
                  Every training programme requires at least one curriculum module. Tap the button below to add your first module.
                </p>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-4 py-2 bg-[#0B6E4F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#085A40] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Module</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-[#FBFDFB] rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4 shadow-2xs hover:border-govTeal-400 transition-colors"
                  >
                    {/* Module Header Bar with Re-order & Delete */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-govTeal-700 text-white uppercase">
                          Module {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-mono text-govText-muted">{module.id}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveModule(index, 'up')}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === modules.length - 1}
                          onClick={() => handleMoveModule(index, 'down')}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(module.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Module Title & Duration Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-govText-primary mb-1">
                          Module Title
                        </label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={e => handleUpdateModule(module.id, 'title', e.target.value)}
                          placeholder="e.g. Module 01: Introduction to Cooperative Governance"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-govText-primary mb-1">
                          Est. Duration (Hrs)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={module.durationHours}
                          onChange={e => handleUpdateModule(module.id, 'durationHours', Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-govText-primary mb-1">
                        Module Description
                      </label>
                      <input
                        type="text"
                        value={module.description}
                        onChange={e => handleUpdateModule(module.id, 'description', e.target.value)}
                        placeholder="Brief summary of topics covered in this module..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]"
                      />
                    </div>

                    {/* Lessons Section under this module */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-govText-primary flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-govTeal-600" />
                          <span>Lessons in this Module ({module.lessons.length})</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {module.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100 text-xs"
                          >
                            <span className="font-medium text-govText-primary truncate">
                              {lIdx + 1}. {lesson}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveLesson(module.id, lIdx)}
                              className="text-gray-400 hover:text-rose-600 p-1"
                              title="Delete lesson"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Lesson input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={lessonInputs[module.id] || ''}
                          onChange={e =>
                            setLessonInputs(prev => ({ ...prev, [module.id]: e.target.value }))
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddLesson(module.id);
                            }
                          }}
                          placeholder="Add a lesson title (e.g. 'Role of PACS in Credit Linkage')..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0B6E4F]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddLesson(module.id)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-govTeal-50 text-govTeal-800 text-xs font-semibold rounded-lg border border-gray-200"
                        >
                          + Add Lesson
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section C: Sticky / Fixed Action Buttons (Part 4) */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-govText-border shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky bottom-3 z-30">
            <div className="flex items-center gap-2 text-xs text-govText-secondary">
              <Sparkles className="w-4 h-4 text-saffron-500 flex-shrink-0" />
              <span>
                Publishing makes this course immediately accessible in <strong>My Authored Courses</strong> and Course Studio.
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => navigate('/faculty/courses')}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-2.5 bg-govBg hover:bg-govTeal-50 text-govTeal-900 border border-gray-300 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-govTeal-700" />
                <span>Preview</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0B6E4F] hover:bg-[#085A40] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer min-h-[44px] flex items-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-saffron-300" />
                <span>Publish Course</span>
              </button>
            </div>
          </div>
        </form>

        {/* 3. Course Preview Modal (Student-Facing Production Preview) */}
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={title}
          courseId={courseId}
          category={category}
          difficulty={difficulty}
          durationHours={durationHours}
          description={description}
          learningObjectives={learningObjectives}
          modules={modules}
        />

        {/* 4. Success Modal Experience (Part 11) */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center space-y-4 animate-scaleUp">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-govText-primary">
                  Course Published Successfully!
                </h3>
                <p className="text-xs text-govText-secondary mt-1 leading-relaxed">
                  <strong>"{publishedCourseTitle}"</strong> has been accredited and added to your authored courses catalogue.
                </p>
              </div>

              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 text-left font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Immediate Availability:</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Visible in "My Authored Courses" and ready for editing in Course Studio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/faculty/courses');
                }}
                className="w-full py-2.5 bg-[#0B6E4F] hover:bg-[#085A40] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Back to My Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
