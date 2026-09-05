import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';
import { downloadCertificatePdf } from '../../utils/certificateGenerator';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { PageContainer } from '../../components/layout/PageContainer';

export const MyCertificates: React.FC = () => {
  const { certificates, currentUser, navigate, t } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const userCerts = certificates.filter(c => c.userId === currentUser.id);

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
              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-govTeal-700 uppercase tracking-wider bg-govTeal-50 px-2 py-0.5 rounded border border-govTeal-200">
                    National NCCT Registry
                  </span>
                  <h3 className="font-bold text-lg text-govText-primary">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-govText-secondary">
                    Issued by: <strong className="text-govText-primary">{cert.instituteName}</strong>
                  </p>
                </div>

                <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm flex-shrink-0">
                  <QRCodeSVG
                    value={`https://ncct.gov.in/verify/${cert.id}`}
                    size={64}
                    level="M"
                    fgColor="#0B6E4F"
                  />
                </div>
              </div>

              {/* Metadata Box */}
              <div className="bg-govBg rounded-xl p-3.5 border border-gray-200 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-govText-muted">Cert ID:</span>
                  <span className="font-bold text-govText-primary">{cert.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-govText-muted">Candidate:</span>
                  <span className="font-bold text-govText-primary">{cert.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-govText-muted">Issue Date:</span>
                  <span>{cert.issuedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-govText-muted">Crypto Hash:</span>
                  <span className="text-[10px] text-govTeal-700 truncate max-w-[180px]">{cert.certificateHash}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => downloadCertificatePdf(cert)}
                  className="flex-1 py-2.5 bg-govTeal-600 hover:bg-govTeal-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.certificate.downloadPdf}</span>
                </button>

                <button
                  onClick={() => navigate('verify_public', { certId: cert.id })}
                  className="px-4 py-2.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Verification</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </PageContainer>
  );
};
