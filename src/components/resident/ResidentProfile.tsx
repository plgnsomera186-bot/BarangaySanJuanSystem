import { useState, useRef, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Trash2,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  User,
  Lock,
} from 'lucide-react';
import type { Resident } from '../../types';
import { BARANGAY_SEAL_IMG, RESIDENT_DEFAULT_IMG, resolveUserAvatar, onSealError, onResidentError } from '../../constants/assets';

interface Props {
  resident: Resident;
  onUpdateProfile: (updated: Partial<Resident>) => void;
}

export const ResidentProfile: FC<Props> = ({ resident, onUpdateProfile }) => {
  const [fullName, setFullName] = useState(resident.fullName || '');
  const [email, setEmail] = useState(resident.email || '');
  const [contactNo, setContactNo] = useState(resident.contactNo || '');
  const [address, setAddress] = useState(resident.address || '');
  const [purok, setPurok] = useState(resident.purok || 'Purok 1');
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married' | 'Divorce' | 'Widowed'>(
    resident.civilStatus || 'Single'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    resolveUserAvatar(resident.avatarUrl)
  );
  const [password, setPassword] = useState(resident.password || 'password123');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAvatarUrl(resolveUserAvatar(resident.avatarUrl));
  }, [resident.id, resident.avatarUrl]);

  // Photo editing states
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoSaving, setIsPhotoSaving] = useState(false);
  const [isPhotoSaved, setIsPhotoSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick photo save directly to profile
  const handleQuickSavePhoto = async (newUrl?: string) => {
    const urlToSave = newUrl || avatarUrl;
    setIsPhotoSaving(true);
    setPhotoError('');
    try {
      await onUpdateProfile({ avatarUrl: urlToSave });
      setIsPhotoSaved(true);
      setTimeout(() => setIsPhotoSaved(false), 3500);
    } catch {
      setPhotoError('Failed to save photo.');
    } finally {
      setIsPhotoSaving(false);
    }
  };

  // Handle local image file upload (converts to optimized base64 data URL)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      const img = new Image();
      img.onload = () => {
        const maxDimension = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarUrl(compressed);
        } else {
          setAvatarUrl(rawResult);
        }
      };
      img.onerror = () => setAvatarUrl(rawResult);
      img.src = rawResult;
    };
    reader.onerror = () => {
      setPhotoError('Failed to load image. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customPhotoUrl.trim()) {
      setAvatarUrl(customPhotoUrl.trim());
      setIsUrlMode(false);
      setCustomPhotoUrl('');
    }
  };

  const handleResetPhoto = () => {
    const defaultUrl = RESIDENT_DEFAULT_IMG;
    setAvatarUrl(defaultUrl);
    setPhotoError('');
  };

  const handleResetForm = () => {
    setFullName(resident.fullName || '');
    setEmail(resident.email || '');
    setContactNo(resident.contactNo || '');
    setAddress(resident.address || '');
    setPurok(resident.purok || 'Purok 1');
    setCivilStatus(resident.civilStatus || 'Single');
    setAvatarUrl(resolveUserAvatar(resident.avatarUrl));
    setPassword(resident.password || 'password123');
    setPhotoError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onUpdateProfile({
        fullName,
        email,
        contactNo,
        address,
        purok,
        civilStatus,
        avatarUrl,
        password,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-slate-900">
      {/* Top Header Card with Barangay Seal */}
      <div className="bg-[#cfd1d6] p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-300 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-600 border border-white shadow-xs shrink-0">
            <img
              src={BARANGAY_SEAL_IMG}
              onError={onSealError}
              alt="Barangay Seal"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-blue-700 inline" />
              <span>Resident Profile & Settings</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center gap-1 border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Resident</span>
          </span>
          <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
            {resident.id}
          </span>
        </div>
      </div>

      {/* Main Profile Editor Container */}
      <div className="bg-[#cfd1d6] rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-300 max-w-3xl mx-auto">
        {/* Success Alert */}
        {isSaved && (
          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Your profile and photo have been updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: PERSONAL PROFILE PICTURE UPLOAD */}
          <div className="p-5 sm:p-6 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-300 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-700" />
              <span>Personal Profile Picture</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Avatar Preview with Camera overlay button */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-black border-4 border-white shadow-xl">
                  <img
                    src={resolveUserAvatar(avatarUrl)}
                    onError={onResidentError}
                    alt={fullName || 'Resident Profile'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Quick Camera Upload Trigger on Avatar */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2.5 bg-[#0084ff] hover:bg-blue-600 text-white rounded-full shadow-lg border-2 border-white transition-all cursor-pointer hover:scale-110"
                  title="Upload New Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Upload Controls */}
              <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {fullName || 'Resident Member'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    
                  </p>
                </div>

                {photoError && (
                  <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg border border-red-200">
                    {photoError}
                  </p>
                )}

                {/* Upload Action Buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo (File)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUrlMode(!isUrlMode)}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Image Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="px-3 py-2 text-slate-600 hover:text-red-700 hover:bg-red-50 font-bold text-xs rounded-full transition-colors cursor-pointer flex items-center gap-1"
                    title="Reset to default photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  {avatarUrl !== resident.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => handleQuickSavePhoto()}
                      disabled={isPhotoSaving}
                      className="px-4 py-2 bg-[#d7e635] hover:bg-[#c9d82a] text-slate-950 font-bold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>{isPhotoSaving ? 'Saving...' : 'Save Photo'}</span>
                    </button>
                  )}

                  {isPhotoSaved && (
                    <span className="text-xs text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Updated successfully!</span>
                    </span>
                  )}
                </div>

                {/* Optional URL Input Mode */}
                {isUrlMode && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL here..."
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      className="flex-1 py-1.5 px-3 bg-white text-slate-900 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: EDITABLE RESIDENT INFORMATION */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-700" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Full Name:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email Address:</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Contact Number:</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="09123456789"
                  className="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                />
              </div>

              {/* Purok Selector */}
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>Purok / Zone:</span>
                </label>
                <select
                  value={purok}
                  onChange={(e) => setPurok(e.target.value)}
                  className="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                >
                  <option value="Purok 1">Purok 1</option>
                  <option value="Purok 2">Purok 2</option>
                  <option value="Purok 3">Purok 3</option>
                  <option value="Purok 4">Purok 4</option>
                  <option value="Purok 5">Purok 5</option>
                  <option value="Purok 6">Purok 6</option>
                  <option value="Purok 7">Purok 7</option>
                  <option value="Purok 69">Purok 69</option>
                  <option value="Purok 96">Purok 96</option>
                </select>
              </div>

              {/* Civil Status */}
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Civil Status:
                </label>
                <select
                  value={civilStatus}
                  onChange={(e) =>
                    setCivilStatus(e.target.value as 'Single' | 'Married' | 'Divorce' | 'Widowed')
                  }
                  className="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorce">Divorce</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* Complete Address */}
              <div className="sm:col-span-2">
                <label className="block text-slate-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>Complete Address:</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House #14, Main St., Purok 1, San Juan, Licab, Nueva Ecija"
                  className="w-full py-2.5 px-4 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                />
              </div>

              {/* Password Management */}
              <div className="sm:col-span-2 pt-2">
                <label className="block text-slate-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Account Password (used for sign-in):</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full py-2.5 px-4 pr-11 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-mono shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit & Reset Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-300">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Changes</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile & Photo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
