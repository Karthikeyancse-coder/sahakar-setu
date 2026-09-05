import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Fingerprint,
  Building2,
  User,
  Mail,
  Lock,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { Language, UserRole } from '../../types';

export const SignupView: React.FC = () => {
  const { switchUser, navigate, setLanguage, currentLanguage } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('trainee');
  const [cooperativeName, setCooperativeName] = useState('Shri Datta PACS, Niphad');
  const [languagePref, setLanguagePref] = useState<Language>('hi');
  const [mockAadhaar, setMockAadhaar] = useState('548921894589');
  const [isVerifyingKyc, setIsVerifyingKyc] = useState(false);
  const [kycDone, setKycDone] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSimulateKyc = () => {
    setIsVerifyingKyc(true);
    setTimeout(() => {
      setIsVerifyingKyc(false);
      setKycDone(true);
      setTimeout(() => {
        setCurrentStep(4);
      }, 1000);
    }, 1200);
  };

  const handleFinish = () => {
    // Switch to first trainee or customized session
    switchUser('usr-trainee-1');
    setLanguage(languagePref);
    navigate('/trainee/dashboard');
  };

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white rounded-3xl border border-govText-border shadow-xl p-6 sm:p-10 space-y-8">
          
          {/* Top Title & Step Indicator */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-govTeal-100/70 border border-govTeal-200 text-govTeal-900 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-govTeal-700" />
              <span>National Cooperative Training Enrollment</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-govText-primary tracking-tight">
              Create Candidate Account
            </h1>

            {/* Stepper Wizard Indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {[
                { num: 1, label: 'Account' },
                { num: 2, label: 'Profile' },
                { num: 3, label: 'e-KYC' },
                { num: 4, label: 'Ready' },
              ].map(s => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === s.num
                        ? 'bg-govTeal-600 text-white shadow-sm ring-4 ring-govTeal-100'
                        : currentStep > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    currentStep === s.num ? 'text-govTeal-900 font-bold' : 'text-govText-muted'
                  }`}>
                    {s.label}
                  </span>
                  {s.num < 4 && <div className="w-6 sm:w-10 h-0.5 bg-gray-200" />}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: Basic Account */}
          {currentStep === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-govText-primary uppercase tracking-wider mb-1.5">
                  Full Candidate Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rameshwar Patil"
                    className="w-full h-12 px-3.5 pl-10 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:outline-none focus:ring-2 focus:ring-govTeal-600 text-sm"
                    required
                  />
                  <User className="w-4 h-4 text-govText-muted absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-govText-primary uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@pacs.gov.in"
                    className="w-full h-12 px-3.5 pl-10 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:outline-none focus:ring-2 focus:ring-govTeal-600 text-sm"
                    required
                  />
                  <Mail className="w-4 h-4 text-govText-muted absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-govText-primary uppercase tracking-wider mb-1.5">
                  Set Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 px-3.5 pl-10 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:outline-none focus:ring-2 focus:ring-govTeal-600 text-sm"
                    required
                  />
                  <Lock className="w-4 h-4 text-govText-muted absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-xs font-semibold text-govText-muted hover:text-govText-primary"
                >
                  Already registered? Sign in
                </button>
                <button
                  type="submit"
                  className="px-6 h-12 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl shadow flex items-center gap-2 text-sm"
                >
                  <span>Continue to Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Profile & Cooperative Affiliation */}
          {currentStep === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-govText-primary uppercase tracking-wider mb-1.5">
                  Registration Category / Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-12 px-3.5 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:outline-none focus:ring-2 focus:ring-govTeal-600 text-sm font-semibold"
                >
                  <option value="trainee">PACS Employee / Cooperative Trainee / Youth</option>
                  <option value="faculty">NCCT Trainer / Faculty</option>
                  <option value="employer">Cooperative Federation Recruiter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-govText-primary uppercase tracking-wider mb-1.5">
                  Primary Cooperative Society / Organization
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cooperativeName}
                    onChange={(e) => setCooperativeName(e.target.value)}
                    placeholder="e.g. Shri Datta PACS, Niphad, Nashik"
                    className="w-full h-12 px-3.5 pl-10 rounded-xl border border-govText-border bg-govBg focus:bg-white focus:outline-none focus:ring-2 focus:ring-govTeal-600 text-sm"
                    required
                  />
                  <Building2 className="w-4 h-4 text-govText-muted absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-govText-primary uppercase tracking-wider mb-1.5">
                  Preferred LMS & Assessment Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' },
                    { code: 'mr', label: 'मराठी (Marathi)' },
                  ].map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguagePref(l.code as Language)}
                      className={`h-12 rounded-xl text-xs font-bold border transition-all ${
                        languagePref === l.code
                          ? 'bg-govTeal-50 border-govTeal-600 text-govTeal-900 shadow-sm'
                          : 'bg-govBg border-govText-border hover:bg-white text-govText-primary'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 h-12 rounded-xl border border-gray-200 text-xs font-semibold text-govText-secondary flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-6 h-12 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl shadow flex items-center gap-2 text-sm"
                >
                  <span>Proceed to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Simulated e-KYC Demo */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <SimulatedBadge text="SIMULATED e-KYC — DEMO MODE" className="mx-auto" />
                <h3 className="text-lg font-bold text-govText-primary">
                  Simulated Aadhaar e-KYC Verification
                </h3>
                <p className="text-xs text-govText-secondary max-w-md mx-auto">
                  To experience instant biometric linking, enter any 12-digit mock number. No live UIDAI credentials required.
                </p>
              </div>

              <div className="bg-govBg p-4 rounded-2xl border border-govTeal-100 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-govText-secondary uppercase tracking-wider mb-1">
                    Mock 12-Digit Aadhaar / VID
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={mockAadhaar}
                    onChange={(e) => setMockAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-12 text-center text-lg font-mono tracking-widest rounded-xl border border-govText-border bg-white font-bold text-govText-primary focus:outline-none focus:ring-2 focus:ring-govTeal-600"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  Notice: This is a hackathon simulation prototype demonstrating instant farmer onboarding and tamper-evident digital identity.
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 h-12 rounded-xl border border-gray-200 text-xs font-semibold text-govText-secondary flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isVerifyingKyc}
                  onClick={handleSimulateKyc}
                  className="px-6 h-12 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl shadow flex items-center gap-2 text-sm"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>{isVerifyingKyc ? 'Verifying with Mock UIDAI...' : 'Simulate OTP & Verify'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Ready / Complete */}
          {currentStep === 4 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-govText-primary">
                  Onboarding Complete!
                </h3>
                <p className="text-xs text-govText-secondary max-w-md mx-auto">
                  Your profile has been created and verified on the federated NCCT registry. You are ready to access training modules.
                </p>
              </div>

              <div className="bg-govBg p-4 rounded-2xl border border-govTeal-100 text-xs text-left space-y-1.5 max-w-md mx-auto font-mono">
                <p>Profile: <strong className="font-sans text-govText-primary">Rameshwar Patil</strong></p>
                <p>Affiliation: Shri Datta PACS, Niphad, Nashik</p>
                <p>e-KYC Status: <span className="text-emerald-700 font-bold">VERIFIED (SIMULATED)</span></p>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full max-w-md h-12 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl shadow transition-all mx-auto flex items-center justify-center gap-2 text-sm"
              >
                <span>Launch Candidate Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
};
