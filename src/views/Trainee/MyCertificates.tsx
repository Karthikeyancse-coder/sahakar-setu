import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Download,
  QrCode,
  ShieldCheck,
  ExternalLink,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  Sparkles,
  Share2,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';
import { downloadCertificatePdf } from '../../utils/certificateGenerator';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { api } from '../../lib/api';

export const MyCertificates: React.FC = () => {
  const { certificates: contextCertificates, currentUser, navigate, activeViewParams, t } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [dbCerts, setDbCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.certificates
      .mine()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setDbCerts(data);
        }
      })
      .catch((err) => {
        console.warn('[MyCertificates] Failed to fetch user certificates:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser.id]);

  const userCerts = useMemo(() => {
    const certMap = new Map<string, Certificate>();
    contextCertificates.filter((c) => c.userId === currentUser.id).forEach((c) => certMap.set(c.id, c));
    dbCerts.forEach((c) => certMap.set(c.id, c));
    return Array.from(certMap.values());
  }, [contextCertificates, dbCerts, currentUser.id]);

  // If navigated with certId in params, automatically select and open preview
  useEffect(() => {
    if (activeViewParams?.certId && userCerts.length > 0) {
      const match = userCerts.find(
        (c) => c.id.toLowerCase() === String(activeViewParams.certId).toLowerCase()
      );
      if (match) setSelectedCert(match);
    }
  }, [activeViewParams?.certId, userCerts.length]);

  return (
    <PageContainer>
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-govText-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govTeal-700 uppercase tracking-wider">
              Verifiable Credentials
            </span>
            <SimulatedBadge text="DigiLocker / NAD Protocol Prototype" />
          </div>
          <h2 className="text-2xl font-extrabold text-govText-primary">
            {t.certificate.title}
          </h2>
          <p className="text-xs text-govText-secondary mt-1">
            Tamper-proof, cryptographically signed digital certificates for cooperative employment.
          </p>
        </div>

        <div className="bg-govTeal-50 border border-govTeal-200 px-4 py-2 rounded-xl text-xs text-govTeal-900 font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-saffron-500" />
          <span>{userCerts.length} Verified Credentials Available</span>
        </div>
      </div>

      {userCerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-govText-border text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-govBg text-govTeal-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-govText-primary">No Certificates Earned Yet</h3>
          <p className="text-xs text-govText-secondary max-w-md mx-auto">
            Complete a course module and pass the final assessment with ≥75% to generate an authenticated certificate.
          </p>
          <button
            onClick={() => navigate('courses')}
            className="px-5 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white font-bold rounded-xl text-xs shadow"
          >
            Browse Training Modules
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userCerts.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border-2 border-govTeal-200 p-6 shadow-md hover:shadow-lg transition-all space-y-5 relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-govTeal-600 via-saffron-500 to-emerald-600" />

              {/* Certificate Header */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-govTeal-700 uppercase tracking-wider bg-govTeal-50 px-2 py-0.5 rounded border border-govTeal-200 inline-block">
                      Certificate of Completion
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-govText-primary leading-snug">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-govText-secondary">
                    Issued by: <strong className="text-govText-primary">{cert.instituteName}</strong>
                  </p>
                </div>

                <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm flex-shrink-0 cursor-pointer" onClick={() => setSelectedCert(cert)} title="Click to view full preview">
                  <QRCodeSVG
                    value={`https://ncct.gov.in/verify/${cert.id}`}
                    size={64}
                    level="M"
                    fgColor="#0B6E4F"
                  />
                </div>
              </div>

              {/* Metadata Box with word wrap guarantee */}
              <div className="bg-govBg rounded-xl p-3.5 border border-gray-200 text-xs space-y-2 font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Certificate ID:</span>
                  <span className="font-bold text-govText-primary break-all [overflow-wrap:anywhere]">{cert.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Student Name:</span>
                  <span className="font-bold text-govText-primary">{cert.userName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Course Name:</span>
                  <span className="font-bold text-govText-primary">{cert.courseTitle}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Assessment Score:</span>
                  <span className="font-bold text-emerald-700">{cert.grade ? `${cert.grade} (Passed)` : 'Passed (≥75%)'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Completion Date:</span>
                  <span>{cert.completionDate || cert.issuedDate || cert.issueDate}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Verification Status:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Verified &amp; Tamper-Proof
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                  <span className="text-govText-muted flex-shrink-0">Crypto Hash:</span>
                  <span className="text-[10px] text-govTeal-800 break-all [overflow-wrap:anywhere] [word-break:break-word]">{cert.certificateHash}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="w-full sm:w-auto px-4 py-3 min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Certificate</span>
                </button>

                <button
                  onClick={() => downloadCertificatePdf(cert)}
                  className="w-full sm:flex-1 py-3 min-h-[44px] bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate</span>
                </button>

                <button
                  onClick={() => navigate('verify_public', { certId: cert.id })}
                  className="w-full sm:w-auto px-4 py-3 min-h-[44px] bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border-4 border-govTeal-700 overflow-hidden relative my-auto">
            {/* Modal Header */}
            <div className="bg-govTeal-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-saffron-400" />
                <h3 className="font-extrabold text-sm sm:text-base">Official Digital Certificate Preview</h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Template Visual Body */}
            <div className="p-6 sm:p-10 bg-[#FAF9F5] text-center space-y-4 border-8 border-[#F0ECE1] m-3 sm:m-4 rounded-2xl relative">
              <div className="text-[11px] font-bold text-govTeal-800 uppercase tracking-wider">
                Government of India • Ministry of Cooperation
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">
                NATIONAL COUNCIL FOR COOPERATIVE TRAINING (NCCT)
              </h2>
              <p className="text-xs text-gray-500 italic">
                An Autonomous Body under Ministry of Cooperation, New Delhi
              </p>

              <div className="w-24 h-0.5 bg-saffron-500 mx-auto my-2" />

              <div className="text-xs font-bold text-govTeal-700 uppercase tracking-widest">
                Certificate of Completion
              </div>

              <p className="text-xs text-gray-600 italic pt-1">This is to certify that</p>

              <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-wide uppercase py-1 border-b border-gray-200 max-w-md mx-auto">
                {selectedCert.userName}
              </div>

              {selectedCert.userAadhaarMock && (
                <div className="text-[10px] text-gray-500">
                  [ Aadhaar Verified: {selectedCert.userAadhaarMock} ]
                </div>
              )}

              <p className="text-xs text-gray-600 max-w-lg mx-auto">
                has successfully completed the specialized capacity-building programme on
              </p>

              <div className="text-base sm:text-lg font-extrabold text-govTeal-900 max-w-xl mx-auto px-4">
                &ldquo;{selectedCert.courseTitle}&rdquo;
              </div>

              <p className="text-xs text-gray-700">
                Conducted and Examined by: <strong className="text-gray-900">{selectedCert.instituteName}</strong>
              </p>

              <div className="inline-block bg-white px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm">
                Performance Grade: <strong className="text-govTeal-800">{selectedCert.grade || 'Passed'}</strong> • Date of Issue: <strong>{selectedCert.issuedDate}</strong>
              </div>

              {/* Certificate Verification Details Box */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-left flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="space-y-1 font-mono text-[11px] text-gray-700 min-w-0 flex-1">
                  <div><strong className="text-gray-900">Certificate ID:</strong> {selectedCert.id}</div>
                  <div className="break-all [overflow-wrap:anywhere]"><strong className="text-gray-900">Digital Hash:</strong> {selectedCert.certificateHash}</div>
                  <div><strong className="text-gray-900">Protocol:</strong> Simulated Prototype (NAD / DigiLocker Compliant)</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                  <QRCodeSVG
                    value={`https://ncct.gov.in/verify/${selectedCert.id}`}
                    size={72}
                    level="M"
                    fgColor="#0B6E4F"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => navigate('verify_public', { certId: selectedCert.id })}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-gray-900 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify on Public Portal</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => downloadCertificatePdf(selectedCert)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Certificate</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </PageContainer>
  );
};
