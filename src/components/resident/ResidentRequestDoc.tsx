import { useState, type FC, type FormEvent } from 'react';
import { FileText, Clock, CheckCircle2, Eye } from 'lucide-react';
import type { Resident, DocumentRequestItem } from '../../types';
import { BARANGAY_SEAL_IMG, onSealError } from '../../constants/assets';

interface Props {
  resident: Resident;
  myDocuments: DocumentRequestItem[];
  onSubmitRequest: (types: string[], purpose: string, address: string) => Promise<void>;
  onPreviewClearance: (doc: DocumentRequestItem) => void;
}

export const ResidentRequestDoc: FC<Props> = ({
  resident,
  myDocuments,
  onSubmitRequest,
  onPreviewClearance,
}) => {
  const [address, setAddress] = useState(resident.address || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [otherType, setOtherType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const availableDocTypes = [
    'Barangay Clearance',
    'Business Permit',
    'Certificate of Residency',
    'Certificate of Indigency',
    'Other (Specify)',
  ];

  const handleToggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length === 0) return;

    setIsSubmitting(true);
    setSuccessMsg(false);

    const finalTypes = selectedTypes.map((t) =>
      t === 'Other (Specify)' ? (otherType || 'Other Document') : t
    );

    await onSubmitRequest(finalTypes, purpose, address);
    setPurpose('');
    setOtherType('');
    setSelectedTypes([]);
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Official Seal */}
      <div className="bg-[#cfd1d6] p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 border border-white shadow-xs shrink-0">
            <img
              src={BARANGAY_SEAL_IMG}
              onError={onSealError}
              alt="Barangay Seal"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-800 inline" />
              Document Request
            </h1>
            <p className="text-[11px] font-mono text-slate-600">
              
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Request Form Card (Screenshot 15) */}
      <div className="bg-[#cfd1d6] rounded-3xl p-6 sm:p-8 shadow-md border border-slate-300 max-w-2xl mx-auto font-mono text-slate-900">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Request Document</h2>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Document request submitted successfully!</p>
              <p>Please wait for your pickup schedule within 2-3 days.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Address field (Screenshot 15) */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full py-2.5 px-4 bg-[#bcbfc6] text-slate-900 font-mono rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Document Type (Select one or more) (Screenshot 15) */}
          <div>
            <label className="block text-slate-800 font-bold mb-3">
              Document Type (Select one or more)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableDocTypes.map((type) => {
                const isChecked = selectedTypes.includes(type);
                return (
                  <label
                    key={type}
                    onClick={() => handleToggleType(type)}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <div
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#0084ff] border-blue-600 text-white'
                          : 'bg-white border-slate-500'
                      }`}
                    >
                      {isChecked && <div className="w-2 h-2 bg-white rounded-xs"></div>}
                    </div>
                    <span className="text-xs text-slate-800">{type}</span>
                  </label>
                );
              })}
            </div>

            {selectedTypes.includes('Other (Specify)') && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Specify other document..."
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  className="w-full py-2 px-3 bg-white text-slate-900 text-xs rounded border border-slate-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Purpose of Document (Screenshot 15) */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Purpose of Document:
            </label>
            <input
              required
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full py-2.5 px-4 bg-[#bcbfc6] text-slate-900 font-mono rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Estimated processing banner (Screenshot 15) */}
          <div className="p-3 bg-[#70aee8] text-slate-900 rounded-full flex items-center gap-2.5 text-xs font-semibold px-4 shadow-xs">
            <Clock className="w-4 h-4 text-slate-900 shrink-0" />
            <span>Estimated processing time: 2-3 days</span>
          </div>

          {/* Submit button (Screenshot 15) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || selectedTypes.length === 0}
              className="w-full py-3 bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. My Requested Documents History */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden font-mono text-xs">
        <div className="p-4 bg-[#c6c8ce] border-b border-slate-300 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            My Requested Documents ({myDocuments.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-800">
            <thead className="bg-[#bcbfc6] border-b border-slate-300 text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Document Type</th>
                <th className="py-2.5 px-4">Purpose</th>
                <th className="py-2.5 px-4">Date Requested</th>
                <th className="py-2.5 px-4">Pickup Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white/40">
              {myDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No requested documents yet.
                  </td>
                </tr>
              ) : (
                myDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/70">
                    <td className="py-3 px-4 font-semibold">{doc.documentType}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.purpose}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.dateRequested}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{doc.pickupPeriod}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          doc.status === 'Ready for Pickup'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onPreviewClearance(doc)}
                        className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
