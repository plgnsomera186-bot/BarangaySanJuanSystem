import React, { useState } from 'react';
import { Users, Search, Filter, Archive as ArchiveIcon, Plus, Trash2, X, Vote } from 'lucide-react';
import { Resident } from '../../types.ts';
import {
  BARANGAY_SEAL_IMG,
  DEFAULT_AVATAR_PATH,
  resolveUserAvatar,
  onSealError,
  onResidentError,
} from '../../constants/assets.ts';

interface Props {
  residents: Resident[];
  isVotersMode?: boolean;
  onRemoveResident: (id: string) => Promise<void>;
  onAddResident: (data: Partial<Resident>) => Promise<void>;
}

export const AdminPopulation: React.FC<Props> = ({
  residents,
  isVotersMode = false,
  onRemoveResident,
  onAddResident,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [civilStatusFilter, setCivilStatusFilter] = useState('All');
  const [purokFilter, setPurokFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New resident form
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newStatus, setNewStatus] = useState<'Single' | 'Married' | 'Divorce' | 'Widowed'>('Single');
  const [newPurok, setNewPurok] = useState('Purok 1');
  const [newStreet, setNewStreet] = useState('');
  const [newIsVoter, setNewIsVoter] = useState(true);

  const baseList = isVotersMode
    ? residents.filter((r) => r.isRegisteredVoter && r.status === 'Approved')
    : residents.filter((r) => r.status === 'Approved');

  const filtered = baseList.filter((r) => {
    if (civilStatusFilter !== 'All' && r.civilStatus !== civilStatusFilter) return false;
    if (purokFilter !== 'All' && r.purok !== purokFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (r.fullName || '').toLowerCase().includes(q) ||
        (r.contactNo || '').includes(q) ||
        (r.address || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim()) return;

    await onAddResident({
      firstName: newFirstName,
      lastName: newLastName,
      fullName: `${newFirstName} ${newLastName}`,
      contactNo: newContact,
      civilStatus: newStatus,
      purok: newPurok,
      address: `${newStreet ? newStreet + ', ' : ''}${newPurok}, Licab`,
      isRegisteredVoter: newIsVoter,
      role: 'resident',
      status: 'Approved',
      requestDate: new Date().toLocaleDateString('en-US'),
      avatarUrl: DEFAULT_AVATAR_PATH,
    });

    setNewFirstName('');
    setNewLastName('');
    setNewContact('');
    setNewStreet('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header (Screenshot 6: "Total Population" / Screenshot 11: "Registered Voters") */}
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
              {isVotersMode ? (
                <Vote className="w-5 h-5 text-slate-800 inline" />
              ) : (
                <Users className="w-5 h-5 text-slate-800 inline" />
              )}
              {isVotersMode ? 'Registered Voters' : 'Total Population'}
            </h1>
            <p className="text-[11px] font-mono text-slate-600">
              {isVotersMode
                ? 'Official Voters Roster of Barangay San Juan'
                : 'Official Resident Masterlist of Barangay San Juan'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resident</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar (Screenshot 6) */}
      <div className="bg-[#cfd1d6] p-4 rounded-2xl shadow-sm border border-slate-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-9 pr-4 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Archive button */}
          <button
            type="button"
            className="py-2.5 px-6 bg-[#686868] hover:bg-[#525252] text-white font-bold rounded-sm shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
          >
            Archive
          </button>

          {/* Filter options */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={civilStatusFilter}
              onChange={(e) => setCivilStatusFilter(e.target.value)}
              className="py-2.5 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorce">Divorce</option>
              <option value="Widowed">Widowed</option>
            </select>

            <select
              value={purokFilter}
              onChange={(e) => setPurokFilter(e.target.value)}
              className="py-2.5 px-3 bg-white text-slate-900 rounded-sm border border-slate-300 focus:outline-none"
            >
              <option value="All">All Puroks</option>
              <option value="Purok 1">Purok 1</option>
              <option value="Purok 2">Purok 2</option>
              <option value="Purok 3">Purok 3</option>
              <option value="Purok 4">Purok 4</option>
              <option value="Purok 5">Purok 5</option>
              <option value="Purok 69">Purok 69</option>
              <option value="Purok 96">Purok 96</option>
            </select>

            <div className="p-2.5 bg-[#8e8e8e] text-white rounded-sm flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table Container: Frame 11 / Frame 10 (Screenshot 6 & 11) */}
      <div className="bg-[#cfd1d6] rounded-2xl shadow-sm border border-slate-300 overflow-hidden font-mono">
        <div className="p-3 bg-[#c6c8ce] border-b border-slate-300 text-xs text-slate-700 font-bold">
          {isVotersMode ? 'Frame 10: Official Voters Roster' : 'Frame 11: Resident Masterlist'} ({filtered.length} entries)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
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
                <th className="py-3 px-4">Contact Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No resident records found.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-white/80 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(res.id)}
                        onChange={() => toggleSelect(res.id)}
                        className="rounded border-slate-400"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-black flex items-center justify-center border border-slate-300">
                        <img
                          src={resolveUserAvatar(res.avatarUrl)}
                          onError={onResidentError}
                          alt={res.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{res.fullName}</td>
                    <td className="py-3 px-4 text-slate-700">{res.contactNo}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{res.civilStatus}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{res.address}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onRemoveResident(res.id)}
                        className="text-slate-600 hover:text-red-700 font-bold transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#cfd1d6] rounded-2xl p-6 shadow-2xl max-w-lg w-full font-mono text-slate-900 border border-slate-300">
            <div className="flex items-center justify-between mb-4 border-b border-slate-300 pb-3">
              <h3 className="font-bold text-base">Register New Resident</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                  <input
                    required
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full py-2 px-3 bg-white rounded border border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Last Name *</label>
                  <input
                    required
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full py-2 px-3 bg-white rounded border border-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="09XXXXXXXXX"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full py-2 px-3 bg-white rounded border border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Civil Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full py-2 px-3 bg-white rounded border border-slate-400"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorce">Divorce</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Purok</label>
                  <select
                    value={newPurok}
                    onChange={(e) => setNewPurok(e.target.value)}
                    className="w-full py-2 px-3 bg-white rounded border border-slate-400"
                  >
                    <option value="Purok 1">Purok 1</option>
                    <option value="Purok 2">Purok 2</option>
                    <option value="Purok 3">Purok 3</option>
                    <option value="Purok 4">Purok 4</option>
                    <option value="Purok 5">Purok 5</option>
                    <option value="Purok 69">Purok 69</option>
                    <option value="Purok 96">Purok 96</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Street / House No.</label>
                  <input
                    type="text"
                    placeholder="e.g. Main St."
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full py-2 px-3 bg-white rounded border border-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="voterCheck"
                  checked={newIsVoter}
                  onChange={(e) => setNewIsVoter(e.target.checked)}
                  className="rounded border-slate-400"
                />
                <label htmlFor="voterCheck" className="text-slate-800 font-bold">
                  Registered Voter in Barangay San Juan
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 bg-slate-300 hover:bg-slate-400 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-[#3a4be3] hover:bg-[#2c3cc9] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  Save Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
