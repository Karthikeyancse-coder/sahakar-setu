import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Fingerprint,
  CheckCircle2,
  Save,
  BookOpen,
  Award,
  Briefcase,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { Language } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    enrollments,
    certificates,
    jobInterests,
    setLanguage,
    t
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98220 12345');
  const [affiliation, setAffiliation] = useState(currentUser.cooperativeAffiliation || 'Shri Datta PACS, Niphad, Nashik');
  const [langPref, setLangPref] = useState<Language>(currentUser.languagePreference);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
  const userCertificates = certificates.filter(c => c.userId === currentUser.id);
  const userApplications = jobInterests.filter(i => i.userId === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      cooperativeAffiliation: affiliation,
      languagePreference: langPref
    });
    setLanguage(langPref);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <PageContainer>
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Member Identity
            </span>
            <SimulatedBadge text="NCCT Trainee Identity Card" />
          </div>
          <h1 className="text-2xl font-extrabold text-govText-primary mt-1">
            {t.profile?.title || 'Trainee Profile & Affiliation'}
          </h1>
          <p className="text-xs text-govText-secondary mt-1">
            {t.profile?.subtitle || 'Manage your personal details, cooperative society registration, and language preference.'}
          </p>
        </div>

        {currentUser.isKycVerified ? (
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs">
            <Fingerprint className="w-4 h-4 text-emerald-600" />
            <span>Aadhaar e-KYC Verified</span>
          </div>
        ) : (
          <div className="px-3.5 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2 shadow-xs">
            <Fingerprint className="w-4 h-4 text-amber-600" />
            <span>e-KYC Pending</span>
          </div>
        )}
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card & Quick Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-govText-border shadow-sm text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-govTeal-600 shadow-md"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-govTeal-700 text-white rounded-full hover:bg-govTeal-800 transition-colors shadow"
                title="Update avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-govText-primary">{currentUser.name}</h2>
              <p className="text-xs text-govTeal-700 font-bold uppercase tracking-wider mt-0.5">
                Cooperative Trainee
              </p>
              <p className="text-xs text-govText-secondary mt-1">
                {currentUser.cooperativeAffiliation || 'Shri Datta PACS, Niphad, Nashik'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
              <div className="bg-govBg p-2.5 rounded-xl border border-gray-100">
                <BookOpen className="w-4 h-4 text-govTeal-600 mx-auto mb-1" />
                <span className="block text-sm font-bold text-govText-primary">{userEnrollments.length}</span>
                <span className="text-[10px] text-govText-muted">Courses</span>
              </div>
              <div className="bg-govBg p-2.5 rounded-xl border border-gray-100">
                <Award className="w-4 h-4 text-saffron-600 mx-auto mb-1" />
                <span className="block text-sm font-bold text-govText-primary">{userCertificates.length}</span>
                <span className="text-[10px] text-govText-muted">Certs</span>
              </div>
              <div className="bg-govBg p-2.5 rounded-xl border border-gray-100">
                <Briefcase className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="block text-sm font-bold text-govText-primary">{userApplications.length}</span>
                <span className="text-[10px] text-govText-muted">Applied</span>
              </div>
            </div>
          </div>

          {/* Institutional Accreditation Note */}
          <div className="bg-govBg rounded-2xl p-5 border border-govTeal-100 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-govTeal-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-govTeal-700" />
              <span>NCCT Registration ID</span>
            </div>
            <p className="text-govText-muted leading-relaxed font-mono">
              NCCT-TRN-2026-MH-44091
            </p>
            <p className="text-[11px] text-govText-secondary leading-relaxed">
              Linked to Ministry of Cooperation National Cooperative Database (NCD) federated ledger.
            </p>
          </div>
        </div>

        {/* Right Column: Edit Profile Form (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-govText-border shadow-sm space-y-6">
            
            {savedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-govText-primary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-govTeal-600" />
                    <span>{t.profile?.fullName || 'Full Legal Name'}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-govText-primary flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-govTeal-600" />
                    <span>{t.profile?.email || 'Email Address'}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-govText-primary flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-govTeal-600" />
                    <span>{t.profile?.phone || 'Mobile Number'}</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white"
                  />
                </div>

                {/* Preferred Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-govText-primary flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-govTeal-600" />
                    <span>Preferred App Language</span>
                  </label>
                  <select
                    value={langPref}
                    onChange={(e) => setLangPref(e.target.value as Language)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white font-medium"
                  >
                    <option value="en">English (National)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>
              </div>

              {/* Cooperative Affiliation */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-govText-primary flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-govTeal-600" />
                  <span>{t.profile?.affiliation || 'Cooperative Society Affiliation (PACS / Dairy / SHG)'}</span>
                </label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govText-border bg-govBg text-xs focus:outline-none focus:ring-2 focus:ring-govTeal-600 focus:bg-white"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.profile?.saveProfile || 'Save Changes'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </PageContainer>
  );
};
