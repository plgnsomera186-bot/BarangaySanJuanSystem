import React, { useState } from 'react';
import { X, Clock, Shield, CheckCircle2, UserCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Resident } from '../types.ts';
import { BARANGAY_SEAL_IMG, RESIDENT_DEFAULT_IMG, onSealError } from '../constants/assets.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Resident, role: 'admin' | 'resident') => void;
  onRegistered?: () => void;
  initialMode?: 'signin' | 'register' | 'split';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegistered,
  initialMode = 'signin',
}) => {
  const [view, setView] = useState<'signin' | 'register' | 'submitted' | 'split'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign in fields
  const [signInName, setSignInName] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Register fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regMiddleName, setRegMiddleName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regPurok, setRegPurok] = useState('Purok 1');
  const [regStreet, setRegStreet] = useState('');
  const [regHouseNo, setRegHouseNo] = useState('');
  const [regCivilStatus, setRegCivilStatus] = useState<'Single' | 'Married' | 'Divorce' | 'Widowed'>('Single');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = signInName.trim();
    const trimmedPassword = signInPassword.trim();

    if (!trimmedName || !trimmedPassword) {
      setError('Please enter your Name and Password to sign in.');
      return;
    }

    const lowerName = trimmedName.toLowerCase();
    const isAdmin =
      lowerName === 'admin' ||
      lowerName === 'barangay admin' ||
      lowerName === 'kapitan' ||
      lowerName.includes('admin') ||
      lowerName.includes('harold') ||
      lowerName.includes('villaroman') ||
      lowerName === 'juan dela cruz';

    // Direct admin login bypass if valid admin credentials are typed
    if (
      isAdmin &&
      (trimmedPassword === 'admin' ||
        trimmedPassword === 'admin123' ||
        trimmedPassword === 'password123')
    ) {
      handleQuickAdminLogin();
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          password: trimmedPassword,
          role: isAdmin ? 'admin' : 'resident',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        onLoginSuccess(data.user, data.user.role || (isAdmin ? 'admin' : 'resident'));
        onClose();
      } else {
        setError(data.message || 'Invalid name or password, or your account is still pending approval.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    const adminUser: Resident = {
      id: 'admin-1',
      firstName: 'Hon. Harold',
      lastName: 'Villaroman',
      fullName: 'Hon. Harold Villaroman',
      email: 'admin.sanjuan@licab.gov.ph',
      contactNo: '09944258953',
      address: 'Barangay Hall, San Juan, Licab, Nueva Ecija',
      purok: 'Purok 1',
      civilStatus: 'Married',
      isRegisteredVoter: true,
      role: 'admin',
      status: 'Approved',
      requestDate: '01/01/2026',
      avatarUrl: RESIDENT_DEFAULT_IMG,
    };
    onLoginSuccess(adminUser, 'admin');
    onClose();
  };

  const handleQuickResidentLogin = () => {
    const resUser: Resident = {
      id: 'res-1',
      firstName: 'John Rhonel',
      lastName: 'Celin',
      fullName: 'John Rhonel Celin',
      email: 'rhonel.celin@gmail.com',
      contactNo: '09704875728',
      address: 'Purok 69, Mapagmahal St., San Juan',
      purok: 'Purok 69',
      civilStatus: 'Divorce',
      isRegisteredVoter: true,
      role: 'resident',
      status: 'Approved',
      requestDate: '10/14/2026',
      avatarUrl: RESIDENT_DEFAULT_IMG,
    };
    onLoginSuccess(resUser, 'resident');
    onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          middleName: regMiddleName,
          email: regEmail,
          contactNo: regContact,
          purok: regPurok,
          street: regStreet,
          houseNo: regHouseNo,
          civilStatus: regCivilStatus,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRegistered?.();
        setView('submitted');
      } else {
        setError('Failed to submit registration. Please check inputs.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 text-slate-700 bg-white/80 hover:bg-white rounded-full shadow-xs cursor-pointer transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. SPLIT VIEW (Screenshot 12) */}
        {view === 'split' && (
          <div className="rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row bg-white border border-slate-200">
            {/* Left grey banner */}
            <div className="md:w-1/2 bg-[#d7d8dc] p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-300">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-white mb-4 bg-blue-600">
                <img
                  src={BARANGAY_SEAL_IMG}
                  onError={onSealError}
                  alt="Barangay Seal"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                Barangay San Juan
              </h2>
              <p className="text-xs font-mono text-slate-600 mb-6">Licab Nueva Ecija</p>
              <div className="text-sm font-mono text-slate-800 font-medium">
                Join Our Community
              </div>
            </div>

            {/* Right blue panel */}
            <div className="md:w-1/2 bg-[#0084ff] p-8 text-white flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-bold font-mono mb-2">Register</h3>
              <p className="text-xs font-mono opacity-90 mb-8 max-w-[200px]">
                Tap button below to create account
              </p>
              <button
                onClick={() => setView('register')}
                className="w-full max-w-[200px] py-3 px-6 bg-[#d7d8dc] hover:bg-white text-slate-900 font-mono font-bold text-sm rounded-full shadow-md transition-all cursor-pointer"
              >
                Sign Up
              </button>
              <div className="mt-8 pt-4 border-t border-white/20 w-full">
                <button
                  onClick={() => setView('signin')}
                  className="text-xs font-mono underline hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SIGN IN VIEW (Screenshot 1) */}
        {view === 'signin' && (
          <div className="bg-[#0084ff] rounded-3xl p-8 sm:p-10 shadow-2xl text-white text-center border-4 border-blue-400/30">
            {/* Logo */}
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-xl border-2 border-white mb-4 bg-white/10">
              <img
                src={BARANGAY_SEAL_IMG}
                onError={onSealError}
                alt="Barangay Seal"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-3xl font-mono font-bold tracking-tight mb-8">Welcome</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-600/90 text-white text-xs font-mono flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto text-left">
              <div>
                <input
                  type="text"
                  placeholder="Name:"
                  value={signInName}
                  onChange={(e) => setSignInName(e.target.value)}
                  className="w-full py-3 px-4 bg-[#cfd1d6] text-slate-900 placeholder-slate-700 font-mono text-sm rounded-xs border-none focus:outline-none focus:ring-2 focus:ring-white transition"
                />
              </div>

              <div className="relative">
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  placeholder="Password:"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full py-3 px-4 pr-11 bg-[#cfd1d6] text-slate-900 placeholder-slate-700 font-mono text-sm rounded-xs border-none focus:outline-none focus:ring-2 focus:ring-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors p-1"
                  title={showSignInPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignInPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-44 py-2.5 px-6 bg-[#cfd1d6] hover:bg-white text-slate-900 font-mono font-semibold text-sm rounded-xs shadow-sm transition-all cursor-pointer"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="w-56 py-2.5 px-6 bg-[#cfd1d6] hover:bg-white text-slate-900 font-mono font-semibold text-sm rounded-xs shadow-sm transition-all cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. CREATE ACCOUNT VIEW (Screenshot 2 & 13) */}
        {view === 'register' && (
          <div className="bg-[#cfd1d6] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-300">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white mb-2 bg-blue-600">
                <img
                  src={BARANGAY_SEAL_IMG}
                  onError={onSealError}
                  alt="Barangay Seal"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-mono font-bold tracking-tight text-slate-900">
                Create Account
              </h2>
              <p className="text-xs font-mono text-slate-600">Barangay San Juan, Licab, Nueva Ecija</p>
              <div className="w-16 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-600 text-white text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Last Name *</label>
                    <input
                      required
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="e.g. Dela Cruz"
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">First Name *</label>
                    <input
                      required
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="e.g. Juan"
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={regMiddleName}
                      onChange={(e) => setRegMiddleName(e.target.value)}
                      placeholder="Optional"
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Civil Status *</label>
                    <select
                      value={regCivilStatus}
                      onChange={(e) => setRegCivilStatus(e.target.value as any)}
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorce">Divorce</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information (Email removed as requested) */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold mb-3">
                  Contact Information
                </h3>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Contact number *</label>
                  <input
                    required
                    type="tel"
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    placeholder="09XXXXXXXXX"
                    className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold mb-3">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Barangay / Purok *</label>
                    <select
                      value={regPurok}
                      onChange={(e) => setRegPurok(e.target.value)}
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    <label className="block text-xs font-mono text-slate-700 mb-1">Street *</label>
                    <input
                      required
                      type="text"
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="Mapagmahal St."
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">House No. *</label>
                    <input
                      required
                      type="text"
                      value={regHouseNo}
                      onChange={(e) => setRegHouseNo(e.target.value)}
                      placeholder="Lot 4, Block 2"
                      className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">Password *</label>
                <input
                  required
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full py-2 px-3 bg-white/90 text-slate-900 font-mono text-xs rounded-full border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 px-8 bg-[#0084ff] hover:bg-blue-600 text-white font-mono font-bold text-sm rounded-full shadow-md transition-all cursor-pointer"
                >
                  {isLoading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="text-xs font-mono text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  Already have an account? Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. FINISH REGISTER / SUBMITTED VIEW (Screenshot 14) */}
        {view === 'submitted' && (
          <div className="bg-[#cfd1d6] rounded-3xl p-8 sm:p-12 shadow-2xl text-slate-900 text-center border border-slate-300">
            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white mb-6 bg-blue-600">
              <img
                src={BARANGAY_SEAL_IMG}
                onError={onSealError}
                alt="Barangay Seal"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-mono font-bold tracking-tight mb-4">
              Registration Submitted
            </h2>

            <div className="space-y-4 max-w-md mx-auto text-sm font-mono text-slate-700 leading-relaxed mb-8">
              <p>
                Your account has been created successfully and is pending admins approval.
              </p>
              <p className="text-xs text-slate-600">
                Once approved, you can sign in using your registered account credentials.
              </p>
            </div>

            <button
              onClick={() => setView('signin')}
              className="py-3 px-8 bg-[#0084ff] hover:bg-blue-600 text-white font-mono font-semibold text-sm rounded-xs shadow-md transition-all cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
