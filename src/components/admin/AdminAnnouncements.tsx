import React, { useState } from 'react';
import { Bell, Plus, Trash2, Edit2, MessageSquare, Image, Calendar, Send, X } from 'lucide-react';
import { AnnouncementItem } from '../../types.ts';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets.ts';

interface Props {
  announcements: AnnouncementItem[];
  onCreateAnnouncement: (data: {
    title: string;
    subtitle?: string;
    description: string;
    eventTime?: string;
  }) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  onAddComment: (id: string, commentText: string) => Promise<void>;
}

export const AdminAnnouncements: React.FC<Props> = ({
  announcements,
  onCreateAnnouncement,
  onDeleteAnnouncement,
  onAddComment,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [viewImageModal, setViewImageModal] = useState<string | null>(null);

  // Comment input per announcement
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreateAnnouncement({
      title,
      subtitle,
      description,
      eventTime,
    });

    setTitle('');
    setSubtitle('');
    setDescription('');
    setEventTime('');
    setShowCreateModal(false);
  };

  const handleCommentSubmit = async (annId: string) => {
    const text = commentInputs[annId];
    if (!text || !text.trim()) return;

    await onAddComment(annId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [annId]: '' }));
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
              <Bell className="w-5 h-5 text-slate-800 inline" />
              Barangay Announcement
            </h1>
            <p className="text-[11px] font-mono text-slate-600">Manage Announcements and Reminders in Barangay San Juan</p>
          </div>
        </div>
      </div>

      {/* 2. Create Announcement Action Button (Screenshot 9) */}
      <div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-6 bg-[#cfd1d6] hover:bg-[#d8dade] text-slate-900 font-mono font-bold text-xs rounded-sm shadow-sm border border-slate-300 transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* 3. Announcements Feed (Screenshot 9) */}
      <div className="space-y-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden font-mono"
          >
            {/* Top Author Bar */}
            <div className="p-4 bg-[#c6c8ce] border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-black border border-slate-300 shadow-xs">
                  <img
                    src={resolveUserAvatar(ann.authorAvatar)}
                    onError={onResidentError}
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">{ann.author}</p>
                  <p className="text-[10px] text-slate-600">{ann.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="text-slate-700 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-3">
              <h2 className="text-lg font-bold text-slate-900">{ann.title}</h2>
              {ann.subtitle && (
                <p className="text-xs font-semibold text-slate-700">{ann.subtitle}</p>
              )}

              <p className="text-xs text-slate-800 leading-relaxed max-w-2xl whitespace-pre-line">
                {ann.description}
              </p>

              {ann.eventTime && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-300/80">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Event Time: {ann.eventTime}</span>
                </div>
              )}
            </div>

            {/* Comments Thread (Screenshot 9) */}
            <div className="bg-[#c2c5cb] p-4 border-t border-slate-300">
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-700 font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>{ann.comments.length} Comment{ann.comments.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="space-y-3 mb-4">
                {ann.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-slate-300">
                    <img
                      src={resolveUserAvatar(c.authorAvatar)}
                      onError={onResidentError}
                      alt={c.author}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0 bg-black"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">{c.author}</span>
                        <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-800">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment reply */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a reply or comment as Admin..."
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
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#cfd1d6] rounded-2xl p-6 shadow-2xl max-w-lg w-full font-mono text-slate-900 border border-slate-300">
            <div className="flex items-center justify-between mb-4 border-b border-slate-300 pb-3">
              <h3 className="font-bold text-base">Create New Announcement</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Community Clean-Up Drive / Relief Distribution"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-white rounded border border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtitle / Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Open to all residents of Barangay San Juan"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full py-2 px-3 bg-white rounded border border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Date & Time</label>
                <input
                  type="text"
                  placeholder="e.g. 11/23/2030, 8:00 AM at Barangay Plaza"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full py-2 px-3 bg-white rounded border border-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Announcement Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter complete details, requirements to bring, and instructions for residents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-2 px-3 bg-white rounded border border-slate-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-4 bg-slate-300 hover:bg-slate-400 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {viewImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setViewImageModal(null)}
        >
          <div className="max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2 relative">
            <button
              onClick={() => setViewImageModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black"
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
