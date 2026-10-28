import React, { useState } from 'react';
import { UserCheck, Search, CheckCircle, XCircle } from 'lucide-react';
import { Resident } from '../../types.ts';
import { BARANGAY_SEAL_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets.ts';

interface Props {
  residents: Resident[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const AdminApproval: React.FC<Props> = ({
  residents,
  onApprove,
  onReject,
}) => {
  const [filterTab, setFilterTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [approvedName, setApprovedName] = useState<string | null>(null);

  const pendingList = residents.filter((r) => r.status === 'Pending');
  const approvedList = residents.filter((r) => r.status === 'Approved');
  const rejectedList = residents.filter((r) => r.status === 'Rejected');

  const currentList =
    filterTab === 'Pending'
      ? pendingList
      : filterTab === 'Approved'
      ? approvedList
      : rejectedList;

  const filtered = currentList.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.fullName || '').toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q) ||
      (r.contactNo || '').includes(q) ||
      (r.address || '').toLowerCase().includes(q)
    );
  });

  const handleApproveAction = async (resident: Resident) => {
    setLoadingId(resident.id);
    await onApprove(resident.id);
    setApprovedName(resident.fullName);
    setLoadingId(null);
  };

  const handleRejectAction = async (id: string) => {
    setLoadingId(id);
    await onReject(id);
    setLoadingId(null);
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
              <UserCheck className="w-5 h-5 text-slate-800 inline" />
              User Approval Management
            </h1>
            <p className="text-[11px] font-mono text-slate-600"></p>
          </div>
        </div>
      </div>

      {/* 2. Search Bar (Screenshot 7) */}
      <div className="bg-[#cfd1d6] p-4 rounded-2xl shadow-sm border border-slate-300">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or contact number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-4 bg-white text-slate-900 font-mono text-xs rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <button
            type="button"
            className="py-2.5 px-8 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white font-mono font-bold text-xs rounded-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* 3. Three Status Tabs / Cards (Screenshot 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <button
          onClick={() => setFilterTab('Pending')}
          className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
            filterTab === 'Pending'
              ? 'bg-slate-300 border-slate-500 font-bold text-slate-950 shadow-xs'
              : 'bg-[#cfd1d6] border-slate-300 text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <p className="text-sm">Pending Approval</p>
          <span className="text-xl font-bold text-amber-700 tabular-nums">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('Approved')}
          className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
            filterTab === 'Approved'
              ? 'bg-slate-300 border-slate-500 font-bold text-slate-950 shadow-xs'
              : 'bg-[#cfd1d6] border-slate-300 text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <p className="text-sm">Approved users</p>
          <span className="text-xl font-bold text-emerald-700 tabular-nums">
            {approvedList.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('Rejected')}
          className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
            filterTab === 'Rejected'
              ? 'bg-slate-300 border-slate-500 font-bold text-slate-950 shadow-xs'
              : 'bg-[#cfd1d6] border-slate-300 text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <p className="text-sm">Rejected users</p>
          <span className="text-xl font-bold text-red-700 tabular-nums">
            {rejectedList.length}
          </span>
        </button>
      </div>

      {/* Notification banner when account is approved */}
      {approvedName && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs font-mono text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-bold">
              Account Approved for {approvedName}!
            </p>
          </div>
          <button
            onClick={() => setApprovedName(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Table Section (Screenshot 7: "Pending Request") */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-4 border-b border-slate-300 bg-[#c6c8ce]">
          <h2 className="font-mono font-bold text-base text-slate-900">
            {filterTab} Request{filterTab === 'Pending' ? 's' : ' Records'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-800">
            <thead className="bg-[#bcbfc6] border-b border-slate-300 text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">User Information</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    No {filterTab.toLowerCase()} requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-white/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveUserAvatar(user.avatarUrl)}
                          onError={onResidentError}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 bg-black"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{user.fullName}</p>
                          <p className="text-[11px] text-slate-500">{user.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{user.contactNo}</td>
                    <td className="py-3 px-4 text-slate-600">{user.requestDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                          user.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : user.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveAction(user)}
                            disabled={loadingId === user.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-mono text-[11px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectAction(user.id)}
                            disabled={loadingId === user.id}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-mono text-[11px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Archived</span>
                      )}
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
