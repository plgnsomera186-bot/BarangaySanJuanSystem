import React, { useState } from 'react';
import { FileText, Search, Printer, CheckCircle, Archive as ArchiveIcon, Clock } from 'lucide-react';
import { DocumentRequestItem } from '../../types.ts';
import { BARANGAY_SEAL_IMG, RESIDENT_DEFAULT_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets.ts';

interface Props {
  documents: DocumentRequestItem[];
  onUpdateStatus: (id: string, status: DocumentRequestItem['status']) => Promise<void>;
  onArchiveToggle: (id: string, isArchived: boolean) => Promise<void>;
  onPreviewClearance: (doc: DocumentRequestItem) => void;
}

export const AdminDocuments: React.FC<Props> = ({
  documents,
  onUpdateStatus,
  onArchiveToggle,
  onPreviewClearance,
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Archive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [toDate, setToDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = documents.filter((doc) => {
    if (activeTab === 'Active' && doc.isArchived) return false;
    if (activeTab === 'Archive' && !doc.isArchived) return false;

    if (statusFilter !== 'All Status' && doc.status !== statusFilter) return false;
    if (typeFilter !== 'All Types' && !doc.documentType.toLowerCase().includes(typeFilter.toLowerCase()))
      return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        doc.fullName.toLowerCase().includes(q) ||
        doc.documentType.toLowerCase().includes(q) ||
        doc.address.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
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
              <FileText className="w-5 h-5 text-slate-800 inline" />
              Document Request
            </h1>
            <p className="text-[11px] font-mono text-slate-600"></p>
          </div>
        </div>
      </div>

      {/* 2. Active Request / Archive Segmented Control (Screenshot 5) */}
      <div className="bg-[#cfd1d6] p-3 rounded-2xl shadow-sm border border-slate-300">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('Active')}
            className={`py-2 px-6 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'Active'
                ? 'bg-[#002f54] text-white shadow-sm'
                : 'bg-slate-300/60 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Active Request
          </button>
          <button
            onClick={() => setActiveTab('Archive')}
            className={`py-2 px-6 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'Archive'
                ? 'bg-[#002f54] text-white shadow-sm'
                : 'bg-slate-300/60 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Archive
          </button>
        </div>
      </div>

      {/* 3. Filter Bar (Screenshot 5) */}
      <div className="bg-[#cfd1d6] p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end font-mono text-xs">
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Search:</label>
            <input
              type="text"
              placeholder="Search Bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Process">In Process</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Document Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All Types">All Types</option>
              <option value="Clearance">Barangay Clearance</option>
              <option value="Business">Business Permit</option>
              <option value="Residency">Certificate of Residency</option>
              <option value="Indigency">Certificate of Indigency</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">To:</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">From:</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full py-2 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 4. User Section Bar (Screenshot 5: "User") */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-3.5 bg-[#c6c8ce] border-b border-slate-300 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-black flex items-center justify-center border border-slate-400 shrink-0">
            <img
              src={RESIDENT_DEFAULT_IMG}
              onError={onResidentError}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-mono font-bold text-sm text-slate-900">User</span>
        </div>

        {/* Table (Screenshot 5) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-800">
            <thead className="bg-[#bcbfc6] border-b border-slate-300 text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-400"
                  />
                </th>
                <th className="py-3 px-3">Profile</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Requested</th>
                <th className="py-3 px-4">Pickup Period</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 font-mono">
                    No document requests in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/80 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                        className="rounded border-slate-400"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-black border border-slate-300 flex items-center justify-center">
                        <img
                          src={resolveUserAvatar(doc.profileUrl)}
                          onError={onResidentError}
                          alt={doc.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{doc.fullName}</p>
                      <p className="text-[10px] text-slate-500">{doc.contactNo}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{doc.documentType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={doc.status}
                        onChange={(e) => onUpdateStatus(doc.id, e.target.value as any)}
                        className={`text-[11px] font-bold py-1 px-2 rounded border focus:outline-none cursor-pointer ${
                          doc.status === 'Ready for Pickup'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : doc.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : doc.status === 'Rejected'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Process">In Process</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{doc.dateRequested}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.pickupPeriod}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onArchiveToggle(doc.id, !doc.isArchived)}
                          className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded font-mono text-[11px] shadow-xs transition-colors cursor-pointer"
                          title={doc.isArchived ? 'Restore from Archive' : 'Move to Archive'}
                        >
                          <ArchiveIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
