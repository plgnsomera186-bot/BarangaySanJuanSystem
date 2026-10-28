import React, { useState } from 'react';
import { Users, FileText, UserCheck, Mail, Search, ArrowUpRight } from 'lucide-react';
import { StatsOverview, DocumentRequestItem, ResidentMessageItem } from '../../types.ts';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets.ts';

interface Props {
  stats: StatsOverview;
  recentDocuments: DocumentRequestItem[];
  recentMessages: ResidentMessageItem[];
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  stats,
  recentDocuments,
  recentMessages,
  onNavigate,
}) => {
  const [timePeriod, setTimePeriod] = useState('All Time');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSearchFilter = (e: React.FormEvent) => {
    e.preventDefault();
    // filter applied
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Title Container with Official Barangay Seal */}
      <div className="bg-[#cfd1d6] p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 border-2 border-white shadow-md shrink-0">
            <img
              src={BARANGAY_SEAL_IMG}
              onError={onSealError}
              alt="Barangay Seal Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-mono font-bold text-slate-900 tracking-tight">
              Barangay Services and Document
            </h1>
            <p className="text-xs font-mono text-slate-600">
              Barangay San Juan Management System · Admin Operations
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/70 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Official Portal</span>
        </div>
      </div>

      {/* 2. Filter Bar (Screenshot 3) */}
      <div className="bg-[#cfd1d6] p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-300">
        <form
          onSubmit={handleSearchFilter}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Time Period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 font-mono text-xs rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              From Date
            </label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 font-mono text-xs rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              To Date
            </label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 font-mono text-xs rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-400"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-6 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white font-mono font-bold text-xs rounded-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Four Core Action Cards with Color Top Borders (Screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 1: Total Population (Red top border) */}
        <div
          onClick={() => onNavigate('population')}
          className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl shadow-md border-t-8 border-t-[#960d0d] border border-slate-300 p-6 flex flex-col justify-between transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-slate-700" />
              <span className="font-mono font-bold text-base sm:text-lg text-slate-900">
                Total Population
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalPopulation.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-600">Registered Residents</span>
          </div>
        </div>

        {/* Card 2: Document Request (Lime/Yellow-green top border) */}
        <div
          onClick={() => onNavigate('documents')}
          className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl shadow-md border-t-8 border-t-[#8ea307] border border-slate-300 p-6 flex flex-col justify-between transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-slate-700" />
              <span className="font-mono font-bold text-base sm:text-lg text-slate-900">
                Document Request
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalDocuments}
            </span>
            <span className="text-xs font-mono text-slate-600">
              {stats.pendingDocuments} Pending Action
            </span>
          </div>
        </div>

        {/* Card 3: To Approved (Cyan top border) */}
        <div
          onClick={() => onNavigate('approval')}
          className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl shadow-md border-t-8 border-t-[#00c5d7] border border-slate-300 p-6 flex flex-col justify-between transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-slate-700" />
              <span className="font-mono font-bold text-base sm:text-lg text-slate-900">
                To Approved
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.pendingApprovals}
            </span>
            <span className="text-xs font-mono text-slate-600">Accounts Waiting</span>
          </div>
        </div>

        {/* Card 4: Residents Messages (Olive/Brown top border) */}
        <div
          onClick={() => onNavigate('messages')}
          className="group bg-[#cfd1d6] hover:bg-[#d8dade] rounded-xl shadow-md border-t-8 border-t-[#967d49] border border-slate-300 p-6 flex flex-col justify-between transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-slate-700" />
              <span className="font-mono font-bold text-base sm:text-lg text-slate-900">
                Residents Messages
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalMessages}
            </span>
            <span className="text-xs font-mono text-slate-600">Community Reports</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Tables Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Latest Document Submissions */}
        <div className="bg-[#cfd1d6] p-5 rounded-2xl shadow-sm border border-slate-300">
          <div className="flex items-center justify-between mb-4 border-b border-slate-300 pb-3">
            <h3 className="font-mono font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              Recent Document Requests
            </h3>
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs font-mono text-blue-700 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentDocuments.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="bg-white/80 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={resolveUserAvatar(doc.profileUrl)}
                    onError={onResidentError}
                    alt={doc.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 bg-black shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{doc.fullName}</p>
                    <p className="text-slate-600 truncate">{doc.documentType}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'Ready for Pickup'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{doc.dateRequested}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Blotter / Resident Inquiries */}
        <div className="bg-[#cfd1d6] p-5 rounded-2xl shadow-sm border border-slate-300">
          <div className="flex items-center justify-between mb-4 border-b border-slate-300 pb-3">
            <h3 className="font-mono font-bold text-sm text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-700" />
              Latest Community Messages
            </h3>
            <button
              onClick={() => onNavigate('messages')}
              className="text-xs font-mono text-blue-700 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentMessages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="bg-white/80 p-3 rounded-xl border border-slate-200 text-xs font-mono"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={resolveUserAvatar(msg.residentAvatar)}
                      onError={onResidentError}
                      alt={msg.residentName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 bg-black shrink-0"
                    />
                    <span className="font-bold text-slate-900 truncate">{msg.residentName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{msg.createdAt}</span>
                </div>
                <p className="text-slate-700 text-[11px] line-clamp-2 italic">
                  "{msg.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
