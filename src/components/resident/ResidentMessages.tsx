import React, { useState } from 'react';
import { Mail, Send, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Resident, ResidentMessageItem } from '../../types.ts';
import { BARANGAY_SEAL_IMG, onSealError } from '../../constants/assets.ts';

interface Props {
  resident: Resident;
  myMessages: ResidentMessageItem[];
  onSendMessage: (data: { message: string; category: string }) => Promise<void>;
}

export const ResidentMessages: React.FC<Props> = ({
  resident,
  myMessages,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !message.trim()) return;

    setIsSubmitting(true);
    await onSendMessage({
      message: message.trim(),
      category: category.trim(),
    });
    setCategory('');
    setMessage('');
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
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
              <Mail className="w-5 h-5 text-slate-800 inline" />
              Resident Messages & Incident Reports
            </h1>
            <p className="text-[11px] font-mono text-slate-600">
              
            </p>
          </div>
        </div>
      </div>

      {/* 2. New Message / Report Form */}
      <div className="bg-[#cfd1d6] rounded-3xl p-6 sm:p-8 shadow-md border border-slate-300 font-mono text-slate-900 max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Report an Incident or Send a Message</span>
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your message has been submitted. Barangay officials will attend to it shortly.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Report Category:
            </label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="Type report category (e.g., Noise Complaint, Street Light Issue, General Inquiry)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-white rounded-lg border border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Message / Incident Description:
            </label>
            <textarea
              required
              rows={4}
              placeholder="Example: Loud late-night disturbance in front of our house..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full py-2.5 px-3 bg-white rounded-xl border border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !category.trim() || !message.trim()}
            className="w-full py-3 bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </form>
      </div>

      {/* 3. History of My Sent Reports & Replies */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden font-mono text-xs max-w-2xl mx-auto">
        <div className="p-4 bg-[#c6c8ce] border-b border-slate-300 font-bold text-slate-900 text-sm">
          My Previous Reports ({myMessages.length})
        </div>

        <div className="divide-y divide-slate-300">
          {myMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              You have not submitted any reports or messages yet.
            </div>
          ) : (
            myMessages.map((msg) => (
              <div key={msg.id} className="p-4 bg-white/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{msg.category}</span>
                  <span className="text-[10px] text-slate-500">{msg.createdAt}</span>
                </div>
                <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 italic">
                  "{msg.message}"
                </p>

                {msg.replies && msg.replies.length > 0 ? (
                  <div className="pl-3 border-l-2 border-blue-500 space-y-1.5 pt-1">
                    {msg.replies.map((r) => (
                      <div key={r.id} className="p-2 bg-blue-50 border border-blue-200 rounded-md text-[11px]">
                        <div className="flex items-center justify-between text-blue-900 font-bold mb-0.5">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                            {r.sender}
                          </span>
                          <span className="text-[9px] text-slate-400 font-normal">{r.createdAt}</span>
                        </div>
                        <p className="text-slate-700">{r.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500">
                    Status: <span className="font-semibold text-amber-700">{msg.status}</span> (Queued at the Duty Officer Desk)
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};