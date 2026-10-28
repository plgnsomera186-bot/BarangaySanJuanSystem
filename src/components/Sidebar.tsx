import React from 'react';
import {
  Home,
  UserCheck,
  FileText,
  Bell,
  Mail,
  Users,
  Vote,
  LogOut,
  User,
  Check,
  X,
  ExternalLink,
  Camera,
} from 'lucide-react';
import { Resident } from '../types.ts';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../constants/assets.ts';

interface Props {
  role: 'admin' | 'resident';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  currentUser: Resident | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onGoToLanding: () => void;
  onOpenEditAvatar?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  role,
  activeTab,
  onTabChange,
  onLogout,
  currentUser,
  isOpenMobile,
  onCloseMobile,
  onGoToLanding,
  onOpenEditAvatar,
}) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'approval', label: 'Approval', icon: UserCheck },
    { id: 'documents', label: 'Document Request', icon: FileText },
    { id: 'announcements', label: 'Announcement', icon: Bell },
    { id: 'messages', label: 'Residents Messages', icon: Mail },
    { id: 'population', label: 'Total Population', icon: Users },
    { id: 'voters', label: 'Registered Voters', icon: Vote },
  ];

  const residentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'documents', label: 'Document Request', icon: FileText },
    { id: 'announcements', label: 'Announcement', icon: Bell },
    { id: 'messages', label: 'Residents Messages', icon: Mail },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : residentMenuItems;

  const sidebarContent = (
    <div className="w-64 h-full bg-[#d5d7dc] text-slate-800 flex flex-col justify-between p-4 border-r border-slate-300 select-none">
      {/* Top Section with Official Barangay Logo */}
      <div>
        <div className="flex items-center justify-between mb-5 pt-1 pb-2 border-b border-slate-300/60">
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-3 text-left group cursor-pointer min-w-0"
            title="Go to Public Portal"
          >
            <div className="relative w-13 h-13 rounded-full overflow-hidden shadow-md bg-blue-600 border-2 border-white group-hover:scale-105 transition-transform shrink-0">
              <img
                src={BARANGAY_SEAL_IMG}
                onError={onSealError}
                alt="Barangay Seal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-mono font-bold text-sm text-slate-900 leading-tight truncate">BRGY. SAN JUAN</p>
              <p className="text-[11px] text-slate-600 font-mono truncate">Licab, Nueva Ecija</p>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Tag with Direct Avatar Edit Action */}
        <div className="mb-6 p-2.5 bg-slate-100/70 border border-slate-300/80 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative group shrink-0">
              <img
                src={resolveUserAvatar(currentUser?.avatarUrl)}
                onError={onResidentError}
                alt={currentUser?.fullName || 'User'}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs bg-black"
              />
              {onOpenEditAvatar && (
                <button
                  type="button"
                  onClick={onOpenEditAvatar}
                  className="absolute -bottom-1 -right-1 p-1 bg-[#0084ff] hover:bg-blue-600 text-white rounded-full shadow-md border border-white cursor-pointer transition-transform hover:scale-110"
                  title="Change Profile Picture"
                >
                  <Camera className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser?.fullName || (role === 'admin' ? 'Hon. Harold Villaroman' : 'Resident')}
                </p>
                {onOpenEditAvatar && (
                  <button
                    type="button"
                    onClick={onOpenEditAvatar}
                    className="text-[10px] text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer ml-1 shrink-0"
                  >
                    Edit
                  </button>
                )}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {role === 'admin' ? 'Barangay Staff' : 'Resident'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5 font-mono text-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-300/80 font-bold text-slate-900 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-300/40 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-600'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-slate-800 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-slate-300/70 space-y-2 font-mono text-sm">
        <button
          onClick={onGoToLanding}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-300/40 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Public Portal</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
