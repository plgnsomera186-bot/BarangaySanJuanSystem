import type { FC } from 'react';
import { Bell, FileText, Mail, Clock, PlusCircle, AlertCircle, Camera } from 'lucide-react';
import type { Resident, DocumentRequestItem, AnnouncementItem, ResidentMessageItem } from '../../types';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets';

interface Props {
  resident: Resident;
  myDocuments: DocumentRequestItem[];
  announcements: AnnouncementItem[];
  myMessages: ResidentMessageItem[];
  onNavigate: (tab: string) => void;
  onOpenEditAvatar?: () => void;
}

export const ResidentDashboard: FC<Props> = ({
  resident,
  myDocuments,
  announcements,
  myMessages,
  onNavigate,
  onOpenEditAvatar,
}) => {
  const pendingDocs = myDocuments.filter((d) => d.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Container with Resident Profile Summary & Official Barangay Seal */}
      <div className="bg-[#cfd1d6] p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-300 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative group shrink-0">
            <img
              src={resolveUserAvatar(resident.avatarUrl)}
              onError={onResidentError}
              alt={resident.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-black"
            />
            {onOpenEditAvatar && (
              <button
                type="button"
                onClick={onOpenEditAvatar}
                className="absolute -bottom-1 -right-1 p-1 bg-[#0084ff] hover:bg-blue-600 text-white rounded-full shadow border border-white cursor-pointer transition-transform hover:scale-110"
                title="Change Profile Picture"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-mono font-bold text-slate-900 tracking-tight">
                Good Day, {resident.firstName || resident.fullName}!
              </h1>
              {onOpenEditAvatar && (
                <button
                  type="button"
                  onClick={onOpenEditAvatar}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                >
                  (Change Photo)
                </button>
              )}
            </div>
            <p className="text-xs text-slate-600 font-mono">
              {resident.purok || 'San Juan'}, Licab · Official Registered Resident
            </p>
          </div>
        </div>

        {/* Official Barangay Seal Badge */}
        <div className="flex items-center gap-3 bg-white/70 px-3.5 py-2 rounded-xl border border-slate-300/80 shadow-2xs">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 border border-white shadow-xs shrink-0">
            <img
              src={BARANGAY_SEAL_IMG}
              onError={onSealError}
              alt="Barangay Seal"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right sm:text-left font-mono">
            <p className="text-xs font-bold text-slate-900 leading-tight">Barangay San Juan</p>
            <p className="text-[10px] text-slate-600">Licab, Nueva Ecija</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('profile')}
            className="px-3.5 py-1.5 bg-white/80 hover:bg-white text-slate-900 text-xs font-mono font-bold rounded-lg shadow-2xs border border-slate-300 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={() => onNavigate('announcements')}
            className="p-2 text-slate-700 hover:text-blue-700 rounded-full hover:bg-slate-300/60 transition-colors cursor-pointer"
            title="Announcements notification"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Residents Dashboard Title & Stat Boxes (Screenshot 8) */}
      <div className="space-y-4">
        <h2 className="text-xl font-mono font-bold text-slate-900 tracking-tight">
          Residents Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          {/* Box 1: Pending */}
          <div
            onClick={() => onNavigate('documents')}
            className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl p-6 shadow-sm border border-slate-300 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <FileText className="w-6 h-6 text-slate-700 group-hover:text-blue-600" />
            <span className="text-sm sm:text-base font-bold text-slate-900">
              {pendingDocs} Pending
            </span>
          </div>

          {/* Box 2: Announcement */}
          <div
            onClick={() => onNavigate('announcements')}
            className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl p-6 shadow-sm border border-slate-300 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <Bell className="w-6 h-6 text-slate-700 group-hover:text-amber-600" />
            <span className="text-sm sm:text-base font-bold text-slate-900">
              {announcements.length} Announcement{announcements.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Box 3: Messages */}
          <div
            onClick={() => onNavigate('messages')}
            className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl p-6 shadow-sm border border-slate-300 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <Mail className="w-6 h-6 text-slate-700 group-hover:text-emerald-600" />
            <span className="text-sm sm:text-base font-bold text-slate-900">
              {myMessages.length} Messages
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('documents')}
          className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request New Document</span>
        </button>
        <button
          onClick={() => onNavigate('messages')}
          className="py-2.5 px-5 bg-slate-800 hover:bg-slate-900 text-white font-mono text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Send Community Report / Message Barangay Captain</span>
        </button>
      </div>

      {/* 3. Recent Activity Section (Screenshot 8) */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 p-6 font-mono">
        <div className="flex items-center gap-2.5 mb-6 text-slate-900">
          <Clock className="w-6 h-6" />
          <h3 className="font-bold text-base">Recent Activity</h3>
        </div>

        {myDocuments.length === 0 && myMessages.length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-xs">
            No recent activity
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="border-b border-slate-400 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/80">
                {myDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-200/50">
                    <td className="py-3 px-3 font-bold text-blue-900">Document</td>
                    <td className="py-3 px-3">{doc.documentType} ({doc.purpose})</td>
                    <td className="py-3 px-3 text-slate-600">{doc.dateRequested}</td>
                    <td className="py-3 px-3 text-right">
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
                  </tr>
                ))}
                {myMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-200/50">
                    <td className="py-3 px-3 font-bold text-amber-900">Report</td>
                    <td className="py-3 px-3 truncate max-w-xs">{msg.message}</td>
                    <td className="py-3 px-3 text-slate-600">{msg.createdAt}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
