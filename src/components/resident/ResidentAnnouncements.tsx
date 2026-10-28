import { useState, type FC } from 'react';
import { Bell, Calendar, Send, X } from 'lucide-react';
import type { Resident, AnnouncementItem } from '../../types';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets';

interface Props {
  resident?: Resident;
  announcements: AnnouncementItem[];
  onAddComment: (id: string, commentText: string) => Promise<void>;
}

export const ResidentAnnouncements: FC<Props> = ({
  announcements,
  onAddComment,
}) => {
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [viewImageModal, setViewImageModal] = useState<string | null>(null);

  const handleCommentSubmit = async (annId: string) => {
    const text = commentInputs[annId];
    if (!text || !text.trim()) return;

    await onAddComment(annId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [annId]: '' }));
    setActiveCommentBox(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Barangay Seal (Screenshot 4: "Latest Announcement") */}
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
              <Bell className="w-5 h-5 text-blue-600 inline" />
              Latest Announcement
            </h1>
            <p className="text-[11px] font-mono text-slate-600">Barangay San Juan Community Announcements & Advisories</p>
          </div>
        </div>
      </div>

      {/* 2. Announcement Feed (Screenshot 4, 18) */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-[#cfd1d6] rounded-3xl p-6 sm:p-8 shadow-md border border-slate-300 font-mono text-slate-900 space-y-4"
          >
            {/* Header: Barangay Admin (Screenshot 4, 18) */}
            <div className="flex items-center justify-between border-b border-slate-400 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-slate-300 shadow-xs">
                  <img
                    src={resolveUserAvatar(ann.authorAvatar)}
                    onError={onResidentError}
                    alt="Barangay Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{ann.author}</h3>
                  <p className="text-[10px] text-slate-600">{ann.createdAt}</p>
                </div>
              </div>

              {/* Blue [Comment] Button (Screenshot 18) */}
              <button
                onClick={() =>
                  setActiveCommentBox(activeCommentBox === ann.id ? null : ann.id)
                }
                className="py-1.5 px-4 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white font-mono text-xs font-bold rounded-xs shadow-sm transition-colors cursor-pointer"
              >
                Comment
              </button>
            </div>

            {/* Announcement Details (Screenshot 18) */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">{ann.title}</h2>
              {ann.subtitle && (
                <p className="text-xs font-semibold text-slate-700">{ann.subtitle}</p>
              )}

              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {ann.description}
              </p>

              {ann.eventTime && (
                <div className="pt-3 border-t border-slate-300/80 flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Event Time: {ann.eventTime}</span>
                </div>
              )}
            </div>

            {/* Existing Comments (Screenshot 4 & 9) */}
            {ann.comments.length > 0 && (
              <div className="pt-3 border-t border-slate-400 space-y-3">
                <p className="text-xs font-bold text-slate-700">
                  {ann.comments.length} Comment{ann.comments.length !== 1 ? 's' : ''}
                </p>

                {ann.comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 bg-white/70 p-3 rounded-xl border border-slate-300 text-xs"
                  >
                    <img
                      src={resolveUserAvatar(c.authorAvatar)}
                      onError={onResidentError}
                      alt={c.author}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0 bg-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">{c.author}</span>
                        <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-800">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input Box (Toggled on [Comment] button click) */}
            {activeCommentBox === ann.id && (
              <div className="pt-3 border-t border-slate-400 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or leave a comment about this announcement..."
                  value={commentInputs[ann.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [ann.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCommentSubmit(ann.id);
                    }
                  }}
                  className="flex-1 py-2 px-3 bg-white text-slate-900 text-xs font-mono rounded border border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  onClick={() => handleCommentSubmit(ann.id)}
                  className="py-2 px-4 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white text-xs font-mono font-bold rounded shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {viewImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setViewImageModal(null)}
        >
          <div className="max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2 relative">
            <button
              onClick={() => setViewImageModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewImageModal}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg') {
                  target.src = '/4bafadd7-9cc1-4a66-84be-729df7b21bfa.jpg';
                }
              }}
              alt="Announcement poster"
              className="w-full h-auto rounded-xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
