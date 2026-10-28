import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, RotateCcw } from 'lucide-react';
import { RESIDENT_DEFAULT_IMG, resolveUserAvatar, onResidentError } from '../constants/assets.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  userName: string;
  onSaveAvatar: (newAvatarUrl: string) => Promise<void> | void;
}

export const EditProfilePhotoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onSaveAvatar,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(resolveUserAvatar(currentAvatar));
  const [inputUrl, setInputUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(resolveUserAvatar(currentAvatar));
      setError('');
    }
  }, [isOpen, currentAvatar]);

  if (!isOpen) return null;

  // Compress & resize image to max 600x600
  const processImageFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreviewUrl(compressedDataUrl);
        } else {
          setPreviewUrl(e.target?.result as string);
        }
      };
      img.onerror = () => {
        setError('Unable to read the image. Please try again.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Unable to open the file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      setPreviewUrl(inputUrl.trim());
      setError('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveAvatar(previewUrl);
      onClose();
    } catch {
      setError('Failed to save photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const presets = [
    { label: 'Default Profile', url: RESIDENT_DEFAULT_IMG },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
      <div className="bg-[#cfd1d6] w-full max-w-md rounded-2xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-200/90 px-5 py-4 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-700" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900">
              Change Profile Picture
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-300/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-5">
          {/* Circular Preview Container */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-black border-4 border-white shadow-xl flex items-center justify-center">
                <img
                  src={previewUrl || RESIDENT_DEFAULT_IMG}
                  alt={userName}
                  onError={onResidentError}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 bg-[#0084ff] hover:bg-blue-600 text-white rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                title="Choose a photo from your device"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-800 text-center truncate max-w-xs mt-1">
              {userName}
            </p>
            <span className="text-[10px] text-slate-500">Live Preview</span>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-bold bg-red-100/80 p-2.5 rounded-lg border border-red-300">
              {error}
            </p>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex border border-slate-300 rounded-xl overflow-hidden bg-white/50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
                activeTab === 'upload' ? 'bg-[#0084ff] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
                activeTab === 'url' ? 'bg-[#0084ff] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
              }`}
            >
              Image Link
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
                activeTab === 'presets' ? 'bg-[#0084ff] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
              }`}
            >
              Presets
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-400 bg-white/40 hover:bg-white/80 rounded-xl p-5 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Click to choose a photo
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  JPG, PNG, or WebP (Automatically optimized)
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Direct Image Link:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 gap-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreviewUrl(preset.url)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-3 ${
                    previewUrl === preset.url
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                      : 'border-slate-300 bg-white/40 hover:bg-white'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 bg-black"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-200/90 px-5 py-3.5 border-t border-slate-300 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPreviewUrl(RESIDENT_DEFAULT_IMG)}
            className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#d7e635] hover:bg-[#c9d82a] text-slate-950 text-xs font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Photo'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
