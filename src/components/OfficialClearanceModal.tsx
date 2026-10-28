import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { DocumentRequestItem } from '../types.ts';
import { BARANGAY_SEAL_IMG, onSealError } from '../constants/assets.ts';

interface Props {
  document: DocumentRequestItem | null;
  onClose: () => void;
}

export const OfficialClearanceModal: React.FC<Props> = ({ document, onClose }) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm tracking-wide">
              Official Document Preview: {document.documentType}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper */}
        <div className="p-8 sm:p-12 text-slate-800 bg-white border border-slate-200 relative print:p-0 print:border-none">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <img
              src={BARANGAY_SEAL_IMG}
              onError={onSealError}
              alt="Barangay Seal Watermark"
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6 relative">
            <img
              src={BARANGAY_SEAL_IMG}
              onError={onSealError}
              alt="Barangay Seal"
              className="w-20 h-20 object-contain rounded-full border border-slate-200"
            />
            <div className="text-center flex-1 px-4">
              <p className="text-xs uppercase tracking-wider text-slate-600 font-serif">
                Republic of the Philippines
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-600 font-serif">
                Province of Nueva Ecija · Municipality of Licab
              </p>
              <h2 className="text-xl font-bold tracking-tight text-blue-900 uppercase font-serif mt-0.5">
                BARANGAY SAN JUAN
              </h2>
              <p className="text-xs font-semibold text-slate-700 tracking-widest uppercase mt-0.5">
                Office of the Barangay Chairman
              </p>
            </div>
            <div className="w-20 flex justify-end">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-center text-slate-400 leading-tight">
                OFFICIAL DRY SEAL
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h1 className="text-2xl font-extrabold uppercase tracking-wider text-slate-900 underline underline-offset-8 font-serif">
              {document.documentType}
            </h1>
          </div>

          {/* Salutation */}
          <p className="font-serif font-bold text-sm uppercase text-slate-800 mb-4">
            TO WHOM IT MAY CONCERN:
          </p>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-justify text-sm leading-relaxed text-slate-700 font-serif">
            <p>
              This is to certify that <span className="font-bold text-slate-900 underline uppercase">{document.fullName}</span>, 
              of legal age, Filipino, is a bonafide resident of <span className="font-semibold text-slate-900">{document.address}</span>, 
              Barangay San Juan, Municipality of Licab, Province of Nueva Ecija.
            </p>
            <p>
              Based on the records of this office, the aforementioned individual is of good moral character, 
              a law-abiding citizen, and has no pending derogatory record, administrative complaint, or criminal case 
              filed before the Barangay Justice System of this barangay.
            </p>
            <p>
              This clearance/certification is being issued upon the request of the interested party for the purpose of:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-900 uppercase tracking-wide">
              "{document.purpose}"
            </div>
            <p>
              Issued this <span className="font-semibold">{document.dateRequested}</span> at the Barangay Hall of San Juan, 
              Licab, Nueva Ecija, Philippines.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-12 mt-8 border-t border-slate-200">
            <div>
              <p className="text-xs uppercase text-slate-500">Applicant Signature:</p>
              <div className="mt-8 border-b border-slate-400 w-44"></div>
              <p className="text-xs font-semibold text-slate-800 mt-1 uppercase">{document.fullName}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="text-xs uppercase text-slate-500">Approved by:</p>
              <div className="mt-8 border-b-2 border-slate-900 w-56 text-center">
                <span className="font-bold text-slate-900 font-serif text-sm">
                  HON. HAROLD VILLAROMAN
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Barangay Chairman
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Barangay San Juan, Licab, Nueva Ecija</span>
            <span>Valid for six (6) months from issuance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
