import React, { useState } from 'react';
import { Mail, Trash2, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ResidentMessageItem } from '../../types.ts';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets.ts';

interface Props {
  messages: ResidentMessageItem[];
  onReplyMessage: (id: string, replyText: string) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export const AdminMessages: React.FC<Props> = ({
  messages,
  onReplyMessage,
  onDeleteMessage,
}) => {
  const [replyInputs, setReplyInputs] = useState<{ [id: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleSendReply = async (id: string) => {
    const text = replyInputs[id];
    if (!text || !text.trim()) return;

    await onReplyMessage(id, text.trim());
    setReplyInputs((prev) => ({ ...prev, [id]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Container with Barangay Seal */}
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
              Residents Messages
            </h1>
            <p className="text-[11px] font-mono text-slate-600"></p>
          </div>
        </div>
      </div>

      {/* 2. Messages Container (Screenshot 10) */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden font-mono">
        {/* Subheader bar */}
        <div className="p-3.5 bg-[#c6c8ce] border-b border-slate-300 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="font-bold">{messages.length} Messages</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-500">Blotter & Incident Reports</span>
          </div>
        </div>

        {/* Message Items List */}
        <div className="divide-y divide-slate-300">
          {messages.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No new messages or reports from residents.
            </div>
          ) : (
            messages.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 bg-white/40 hover:bg-white/60 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Resident Avatar */}
                  <img
                    src={resolveUserAvatar(item.residentAvatar)}
                    onError={onResidentError}
                    alt={item.residentName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-xs shrink-0 bg-black"
                  />

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">
                          {item.residentName}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {item.createdAt}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-semibold">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveReplyId(activeReplyId === item.id ? null : item.id)}
                          className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                        >
                          {activeReplyId === item.id ? 'Cancel' : 'Reply'}
                        </button>
                        <button
                          onClick={() => onDeleteMessage(item.id)}
                          className="text-xs text-slate-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Resident Message text (Screenshot 10) */}
                    <div className="p-3 bg-white/80 rounded-xl border border-slate-200 mt-2">
                      <p className="text-xs text-slate-800 leading-relaxed font-mono">
                        {item.message}
                      </p>
                    </div>

                    {/* Replies / Actions history */}
                    {item.replies && item.replies.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-blue-400 space-y-2">
                        {item.replies.map((rep) => (
                          <div key={rep.id} className="text-xs bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-blue-900 flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                                {rep.sender}
                              </span>
                              <span className="text-[10px] text-slate-500">{rep.createdAt}</span>
                            </div>
                            <p className="text-slate-700">{rep.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {activeReplyId === item.id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Reply to resident (e.g. We will dispatch a barangay officer...)"
                          value={replyInputs[item.id] || ''}
                          onChange={(e) =>
                            setReplyInputs({ ...replyInputs, [item.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSendReply(item.id);
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-white text-slate-900 text-xs font-mono rounded border border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <button
                          onClick={() => handleSendReply(item.id)}
                          className="py-2 px-4 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white text-xs font-mono font-bold rounded shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
