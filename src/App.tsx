import { useState, useEffect, useRef, type SyntheticEvent } from 'react';
import { Menu, ArrowLeft, CheckCircle, Clock, X } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { OfficialClearanceModal } from './components/OfficialClearanceModal';
import { EditProfilePhotoModal } from './components/EditProfilePhotoModal';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminApproval } from './components/admin/AdminApproval';
import { AdminDocuments } from './components/admin/AdminDocuments';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminPopulation } from './components/admin/AdminPopulation';

// Resident Views
import { ResidentDashboard } from './components/resident/ResidentDashboard';
import { ResidentRequestDoc } from './components/resident/ResidentRequestDoc';
import { ResidentAnnouncements } from './components/resident/ResidentAnnouncements';
import { ResidentMessages } from './components/resident/ResidentMessages';
import { ResidentProfile } from './components/resident/ResidentProfile';

import type {
  Resident,
  DocumentRequestItem,
  AnnouncementItem,
  ResidentMessageItem,
  StatsOverview,
} from './types';
import { BARANGAY_SEAL_IMG, onSealError } from './constants/assets';

const DEFAULT_AVATAR_PATH = '/user_profile_default.png';
const USER_PROFILE_DEFAULT_IMG =
  'data:image/png;base64,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';

const resolveUserAvatar = (url?: string | null): string => {
  if (!url || typeof url !== 'string') return USER_PROFILE_DEFAULT_IMG;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === DEFAULT_AVATAR_PATH ||
    trimmed === BARANGAY_SEAL_IMG ||
    trimmed.includes('user_profile_default') ||
    trimmed.includes('image_42a9f4ee') ||
    trimmed.includes('/assets/aistudio/') ||
    trimmed.includes('filipino_male_resident') ||
    trimmed.includes('filipino_female_resident') ||
    trimmed.includes('barangay_seal') ||
    trimmed.includes('unsplash.com') ||
    trimmed.includes('pravatar') ||
    trimmed.includes('ui-avatars') ||
    trimmed.includes('dicebear') ||
    trimmed.includes('randomuser') ||
    trimmed.includes('4bafadd7-9cc1-4a66-84be-729df7b21bfa')
  ) {
    return USER_PROFILE_DEFAULT_IMG;
  }
  return trimmed;
};

const onResidentError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (e?.currentTarget && e.currentTarget.src !== USER_PROFILE_DEFAULT_IMG) {
    e.currentTarget.src = USER_PROFILE_DEFAULT_IMG;
  }
};

// --- Built-in Approval & Session Sync Bridge ---
const TAB_ID = Math.random().toString(36).slice(2);
const WAITING_KEY = 'sj_waiting_resident';
const HEARTBEAT_KEY = 'sj_waiting_heartbeat';
const SESSION_KEY = 'sj_active_session';
const CHANNEL_NAME = 'sj_portal_sync';

interface SyncBridgeHandlers {
  currentUser: Resident | null;
  role: 'admin' | 'resident';
  currentView: 'landing' | 'portal';
  loginAs: (u: Resident, r: 'admin' | 'resident') => void;
  setActiveTab: (t: string) => void;
  setIsAuthOpen: (open: boolean) => void;
  fetchData: () => Promise<void> | void;
}

interface ToastInfo {
  message: string;
  resident?: Resident;
  variant?: 'success' | 'error';
}

interface AuthApiPayload {
  resident?: Resident;
  user?: Resident;
  admin?: Resident;
  id?: string;
  status?: Resident['status'];
  role?: 'admin' | 'resident';
  pendingApproval?: boolean;
}

let latestHandlers: SyncBridgeHandlers | null = null;
let setOverlayWaiting: ((u: Resident | null) => void) | null = null;
let setOverlayToast: ((info: ToastInfo | null) => void) | null = null;
let rawFetchRef: typeof window.fetch | null = null;
let mobileValidationInstalled = false;
let certHiderInstalled = false;
let approvalFetchInstalled = false;

function buildFallbackAdminUser(partial?: Partial<Resident> | null): Resident {
  return {
    id: partial?.id || 'admin-1',
    firstName: partial?.firstName || 'Hon. Harold',
    lastName: partial?.lastName || 'Villaroman',
    fullName: partial?.fullName || 'Hon. Harold Villaroman',
    email: partial?.email || 'admin.sanjuan@licab.gov.ph',
    contactNo: partial?.contactNo || '09944258953',
    address: partial?.address || 'Barangay Hall, San Juan, Licab, Nueva Ecija',
    purok: partial?.purok || 'Purok 1',
    civilStatus: partial?.civilStatus || 'Married',
    isRegisteredVoter: partial?.isRegisteredVoter ?? true,
    role: 'admin',
    status: 'Approved',
    requestDate: partial?.requestDate || '01/01/2026',
    avatarUrl: resolveUserAvatar(partial?.avatarUrl),
  };
}

function readWaitingResident(): Resident | null {
  try {
    const raw = localStorage.getItem(WAITING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Resident;
    return {
      ...parsed,
      avatarUrl: resolveUserAvatar(parsed.avatarUrl),
    };
  } catch {
    return null;
  }
}

function interceptPendingLogin(user: Resident) {
  const normalizedUser: Resident = {
    ...user,
    avatarUrl: resolveUserAvatar(user.avatarUrl),
  };
  try {
    localStorage.setItem(WAITING_KEY, JSON.stringify(normalizedUser));
  } catch {
    // ignore storage quota errors
  }
  if (latestHandlers) {
    latestHandlers.setIsAuthOpen(false);
  }
  if (setOverlayWaiting) {
    setOverlayWaiting(normalizedUser);
  }
}

function clearActiveSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore storage errors
  }
}

function enterResidentPortalDirectly(user: Resident) {
  const approvedUser: Resident = {
    ...user,
    avatarUrl: resolveUserAvatar(user.avatarUrl),
    status: 'Approved',
    role: 'resident',
  };
  try {
    localStorage.removeItem(WAITING_KEY);
    localStorage.removeItem(HEARTBEAT_KEY);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: approvedUser, role: 'resident' }));
  } catch {
    // ignore storage errors
  }
  if (setOverlayWaiting) setOverlayWaiting(null);
  if (setOverlayToast) setOverlayToast(null);
  if (latestHandlers) {
    latestHandlers.setIsAuthOpen(false);
    latestHandlers.loginAs(approvedUser, 'resident');
    void latestHandlers.fetchData();
  }
}

function showValidationToast(message: string) {
  if (setOverlayToast) {
    setOverlayToast({ message, variant: 'error' });
  }
}

function isMobileInputElement(input: HTMLInputElement): boolean {
  const type = (input.type || '').toLowerCase();
  if (
    type === 'password' ||
    type === 'email' ||
    type === 'checkbox' ||
    type === 'radio' ||
    type === 'hidden' ||
    type === 'file'
  ) {
    return false;
  }

  const attrs = [
    input.name || '',
    input.id || '',
    input.placeholder || '',
    input.getAttribute('aria-label') || '',
  ]
    .join(' ')
    .toLowerCase();

  const prevLabel =
    input.previousElementSibling instanceof HTMLElement
      ? input.previousElementSibling.textContent || ''
      : '';
  const parentLabel =
    input.parentElement?.querySelector('label')?.textContent ||
    input.closest('div')?.querySelector('label')?.textContent ||
    '';
  const labelText = `${prevLabel} ${parentLabel}`.toLowerCase();
  const combined = `${attrs} ${labelText}`;

  if (
    combined.includes('email') ||
    combined.includes('username') ||
    combined.includes('full name')
  ) {
    return false;
  }

  return (
    type === 'tel' ||
    combined.includes('contact number') ||
    combined.includes('contact no') ||
    combined.includes('mobile') ||
    combined.includes('cellphone') ||
    combined.includes('phone')
  );
}

function isInsideCreateAccountView(el: Element): boolean {
  const modalOrForm =
    el.closest('form') || el.closest('[role="dialog"]') || el.closest('.fixed') || document.body;
  const text = (modalOrForm?.textContent || '').toLowerCase();
  return text.includes('create account') || text.includes('submit registration');
}

function findActiveCreateAccountMobileInput(scope?: Element | null): HTMLInputElement | null {
  const root = scope || document;
  const inputs = Array.from(root.querySelectorAll('input'));
  for (const inp of inputs) {
    if (inp instanceof HTMLInputElement && inp.offsetParent !== null && isMobileInputElement(inp)) {
      if (isInsideCreateAccountView(inp)) {
        return inp;
      }
    }
  }
  return null;
}

function getMobileValidationError(rawValue: string): string | null {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return 'Please enter a Contact Number (exact 11 digits).';
  }
  if (!/^\d+$/.test(trimmed)) {
    return 'Only numbers (0-9) are allowed in Contact Number.';
  }
  if (trimmed.length < 11) {
    return `Mobile number is incomplete (${trimmed.length}/11 digits). Must be exactly 11 digits.`;
  }
  if (trimmed.length > 11) {
    return `Mobile number is too long (${trimmed.length}/11 digits). Must be exactly 11 digits.`;
  }
  return null;
}

function setInlineFieldError(input: HTMLInputElement, errorMsg: string | null) {
  const errClass = 'sj-mobile-inline-error';
  const parent = input.parentElement;
  if (!parent) return;

  let errEl = parent.querySelector(`.${errClass}`) as HTMLElement | null;
  if (errorMsg) {
    input.style.borderColor = '#dc2626';
    input.style.outlineColor = '#dc2626';
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = `${errClass} text-xs font-bold text-red-600 mt-1.5`;
      parent.appendChild(errEl);
    }
    errEl.textContent = errorMsg;
  } else {
    input.style.borderColor = '';
    input.style.outlineColor = '';
    if (errEl) {
      errEl.remove();
    }
  }
}

function installMobileValidationBridge() {
  if (mobileValidationInstalled) return;
  mobileValidationInstalled = true;

  document.addEventListener(
    'input',
    (e) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      const input = e.target;
      if (!isMobileInputElement(input) || !isInsideCreateAccountView(input)) return;

      const err = getMobileValidationError(input.value);
      if (input.value.trim().length === 0) {
        setInlineFieldError(input, null);
      } else {
        setInlineFieldError(input, err);
      }
    },
    true
  );

  document.addEventListener(
    'click',
    (e) => {
      if (!(e.target instanceof Element)) return;
      const btn = e.target.closest('button');
      if (!btn) return;

      const btnText = (btn.textContent || '').trim().toLowerCase();
      const isRegisterBtn =
        btnText.includes('submit registration') ||
        (btnText === 'register' && isInsideCreateAccountView(btn)) ||
        (btnText === 'sign up' && isInsideCreateAccountView(btn));

      if (!isRegisterBtn) return;

      const container = btn.closest('form') || btn.closest('.fixed') || document.body;
      const mobileInput = findActiveCreateAccountMobileInput(container);
      if (!mobileInput) return;

      const err = getMobileValidationError(mobileInput.value);
      if (err) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setInlineFieldError(mobileInput, err);
        mobileInput.focus();
        showValidationToast(err);
      } else {
        setInlineFieldError(mobileInput, null);
      }
    },
    true
  );

  document.addEventListener(
    'submit',
    (e) => {
      if (!(e.target instanceof Element)) return;
      const mobileInput = findActiveCreateAccountMobileInput(e.target);
      if (!mobileInput) return;

      const err = getMobileValidationError(mobileInput.value);
      if (err) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setInlineFieldError(mobileInput, err);
        mobileInput.focus();
        showValidationToast(err);
      } else {
        setInlineFieldError(mobileInput, null);
      }
    },
    true
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Enter' || !(e.target instanceof Element)) return;
      if (!isInsideCreateAccountView(e.target)) return;

      const container = e.target.closest('form') || e.target.closest('.fixed') || document.body;
      const mobileInput = findActiveCreateAccountMobileInput(container);
      if (!mobileInput) return;

      const err = getMobileValidationError(mobileInput.value);
      if (err) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setInlineFieldError(mobileInput, err);
        mobileInput.focus();
        showValidationToast(err);
      }
    },
    true
  );
}

function applyPortalCleanupRules() {
  if (!document.getElementById('sj-hide-cert-style')) {
    const style = document.createElement('style');
    style.id = 'sj-hide-cert-style';
    style.textContent = `[data-sj-hide-cert="1"], [data-sj-hide-ui="1"] { display: none !important; }`;
    document.head.appendChild(style);
  }

  document.querySelectorAll('button').forEach((btn) => {
    const txt = (btn.textContent || '').trim().toLowerCase();
    if (txt === 'view image') {
      btn.setAttribute('data-sj-hide-ui', '1');
    }
    const titleAttr = (btn.getAttribute('title') || '').toLowerCase();
    if (titleAttr.includes('print / view official document')) {
      btn.setAttribute('data-sj-hide-ui', '1');
    }
  });

  if (latestHandlers?.role === 'admin') {
    document.querySelectorAll('[data-sj-hide-cert="1"]').forEach((el) => {
      el.removeAttribute('data-sj-hide-cert');
    });
    return;
  }

  const tables = Array.from(document.querySelectorAll('table'));
  for (const table of tables) {
    const headers = Array.from(table.querySelectorAll('thead th, tr th'));
    let certColIndex = -1;

    headers.forEach((th, idx) => {
      const label = (th.textContent || '').trim().toUpperCase();
      if (label === 'CERTIFICATE' || label === 'PREVIEW') {
        certColIndex = idx;
        th.setAttribute('data-sj-hide-cert', '1');
      }
    });

    if (certColIndex >= 0) {
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      for (const row of rows) {
        const cells = Array.from(row.children);
        const targetCell = cells[certColIndex];
        if (targetCell) {
          targetCell.setAttribute('data-sj-hide-cert', '1');
        }
      }
    }
  }
}

function installCertificateColumnHider() {
  if (certHiderInstalled) return;
  certHiderInstalled = true;

  applyPortalCleanupRules();
  const observer = new MutationObserver(() => {
    applyPortalCleanupRules();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function handleAdminApprovedResident(approved: Resident) {
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ type: 'SJ_APPROVED', resident: approved });
    bc.close();
  } catch {
    // ignore BroadcastChannel errors
  }

  let otherTabWaiting = false;
  try {
    const hbRaw = localStorage.getItem(HEARTBEAT_KEY);
    if (hbRaw) {
      const hb = JSON.parse(hbRaw) as { id?: string; tabId?: string; ts?: number };
      if (
        hb.id === approved.id &&
        hb.tabId !== TAB_ID &&
        typeof hb.ts === 'number' &&
        Date.now() - hb.ts < 3500
      ) {
        otherTabWaiting = true;
      }
    }
  } catch {
    // ignore heartbeat parse errors
  }

  if (otherTabWaiting) {
    try {
      localStorage.removeItem(WAITING_KEY);
    } catch {
      // ignore storage errors
    }
    if (setOverlayToast) {
      setOverlayToast({
        message:
          approved.fullName +
          ' has been approved! Their Resident Portal tab has opened automatically.',
        variant: 'success',
      });
    }
  } else {
    const waitingHere = readWaitingResident();
    if (waitingHere && waitingHere.id === approved.id) {
      if (setOverlayToast) {
        setOverlayToast({
          message: 'Approved! Opening the Resident Portal for ' + approved.fullName + '...',
          variant: 'success',
        });
      }
      setTimeout(() => enterResidentPortalDirectly(approved), 450);
    } else if (setOverlayToast) {
      setOverlayToast({
        message: approved.fullName + ' has been approved!',
        resident: approved,
        variant: 'success',
      });
    }
  }
}

function installFetchInterceptor() {
  if (approvalFetchInstalled) return;
  approvalFetchInstalled = true;
  const origFetch = window.fetch.bind(window);
  rawFetchRef = origFetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = (init?.method || 'GET').toUpperCase();
    const isRegisterCall =
      method === 'POST' && (url.includes('/api/auth/register') || url.endsWith('/api/residents'));

    if (isRegisterCall && latestHandlers?.role !== 'admin') {
      let candidateMobile: string | null = null;
      if (typeof init?.body === 'string') {
        try {
          const parsedBody = JSON.parse(init.body) as Record<string, unknown>;
          const rawPhone =
            parsedBody?.contactNo ??
            parsedBody?.contactNumber ??
            parsedBody?.mobile ??
            parsedBody?.phone ??
            parsedBody?.contact ??
            parsedBody?.mobileNumber ??
            parsedBody?.phoneNumber;
          if (typeof rawPhone === 'string' || typeof rawPhone === 'number') {
            candidateMobile = String(rawPhone);
          }
        } catch {
          // ignore body parse errors
        }
      }

      const domMobileInput = findActiveCreateAccountMobileInput();
      if (domMobileInput) {
        candidateMobile = domMobileInput.value;
      }

      if (candidateMobile !== null) {
        const mobileErr = getMobileValidationError(candidateMobile);
        if (mobileErr) {
          if (domMobileInput) {
            setInlineFieldError(domMobileInput, mobileErr);
            domMobileInput.focus();
          }
          showValidationToast(mobileErr);
          return new Response(
            JSON.stringify({ success: false, error: mobileErr, message: mobileErr }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }

    const res = await origFetch(input, init);
    try {
      const isAuthRoute = url.includes('/api/auth/');

      if (
        (url.includes('/api/auth/register') ||
          (url.endsWith('/api/residents') && method === 'POST')) &&
        res.ok
      ) {
        const data = (await res.clone().json()) as AuthApiPayload;
        const regUser: Resident | undefined =
          data?.resident ||
          data?.user ||
          (data?.id && data?.status === 'Pending' ? (data as unknown as Resident) : undefined);
        if (regUser && regUser.status === 'Pending') {
          setTimeout(async () => {
            if (latestHandlers) await latestHandlers.fetchData();
            interceptPendingLogin(regUser);
          }, 60);
        }
      } else if (url.includes('/api/auth/login') && res.ok) {
        const data = (await res.clone().json()) as AuthApiPayload;
        const loginUser: Resident | undefined = data?.user || data?.resident || data?.admin;
        const loginRole: 'admin' | 'resident' =
          data?.role === 'admin' || loginUser?.role === 'admin' ? 'admin' : 'resident';

        if (loginRole === 'admin') {
          const adminUser = buildFallbackAdminUser(loginUser);
          try {
            sessionStorage.setItem(
              SESSION_KEY,
              JSON.stringify({ user: adminUser, role: 'admin' })
            );
          } catch {
            // ignore storage errors
          }
        } else if (loginUser) {
          const normalizedLoginUser: Resident = {
            ...loginUser,
            avatarUrl: resolveUserAvatar(loginUser.avatarUrl),
          };
          if (normalizedLoginUser.status === 'Pending' || data?.pendingApproval) {
            setTimeout(() => interceptPendingLogin(normalizedLoginUser), 40);
          } else {
            try {
              sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify({ user: normalizedLoginUser, role: 'resident' })
              );
            } catch {
              // ignore storage errors
            }
          }
        }
      } else if (
        method !== 'GET' &&
        !isAuthRoute &&
        !url.includes('reject') &&
        !url.includes('decline') &&
        (url.includes('approv') ||
          (latestHandlers?.role === 'admin' && url.includes('/residents/'))) &&
        res.ok
      ) {
        const data = (await res.clone().json()) as AuthApiPayload;
        let approved: Resident | undefined =
          data?.resident ||
          data?.user ||
          (data?.id && data?.status === 'Approved' ? (data as unknown as Resident) : undefined);

        if (!approved) {
          const waiting = readWaitingResident();
          if (waiting && url.includes(waiting.id)) {
            approved = { ...waiting, status: 'Approved' };
          }
        }

        if (approved && approved.status === 'Approved') {
          handleAdminApprovedResident(approved);
        }
      }
    } catch {
      // ignore non-JSON responses
    }

    return res;
  };
}

function ApprovalSyncBridge(handlers: SyncBridgeHandlers) {
  const [waitingUser, setWaitingUser] = useState<Resident | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const prevViewRef = useRef<'landing' | 'portal'>(handlers.currentView);

  useEffect(() => {
    latestHandlers = handlers;
  });

  useEffect(() => {
    setOverlayWaiting = setWaitingUser;
    setOverlayToast = setToast;
    return () => {
      setOverlayWaiting = null;
      setOverlayToast = null;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (ev: MessageEvent<{ type?: string; resident?: Resident }>) => {
        if (ev.data?.type === 'SJ_APPROVED' && ev.data?.resident) {
          const approved = ev.data.resident;
          if (waitingUser && waitingUser.id === approved.id && latestHandlers?.role !== 'admin') {
            enterResidentPortalDirectly(approved);
          }
        }
      };
    } catch {
      // ignore BroadcastChannel errors
    }
    return () => {
      if (bc) bc.close();
    };
  }, [waitingUser]);

  useEffect(() => {
    if (!waitingUser) return;

    const beat = () => {
      try {
        localStorage.setItem(
          HEARTBEAT_KEY,
          JSON.stringify({ id: waitingUser.id, tabId: TAB_ID, ts: Date.now() })
        );
      } catch {
        // ignore storage errors
      }
    };
    beat();
    const hbInterval = setInterval(beat, 1200);

    const pollInterval = setInterval(async () => {
      try {
        const doFetch = rawFetchRef || window.fetch.bind(window);
        const res = await doFetch('/api/residents');
        if (!res.ok) return;
        const list = (await res.json()) as Resident[];
        const found = Array.isArray(list) ? list.find((r) => r.id === waitingUser.id) : undefined;
        if (found && found.status === 'Approved') {
          enterResidentPortalDirectly(found);
        } else if (found && found.status === 'Rejected') {
          try {
            localStorage.removeItem(WAITING_KEY);
            localStorage.removeItem(HEARTBEAT_KEY);
          } catch {
            // ignore storage errors
          }
          setWaitingUser(null);
        }
      } catch {
        // ignore polling errors
      }
    }, 1400);

    return () => {
      clearInterval(hbInterval);
      clearInterval(pollInterval);
    };
  }, [waitingUser]);

  useEffect(() => {
    applyPortalCleanupRules();

    if (handlers.currentView === 'portal') {
      if (handlers.role === 'admin') {
        const adminUser = buildFallbackAdminUser(handlers.currentUser);
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: adminUser, role: 'admin' }));
        } catch {
          // ignore storage errors
        }
      } else if (handlers.currentUser && handlers.currentUser.status !== 'Pending') {
        try {
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({ user: handlers.currentUser, role: 'resident' })
          );
        } catch {
          // ignore storage errors
        }
      }
    } else if (
      prevViewRef.current === 'portal' &&
      handlers.currentView === 'landing' &&
      !handlers.currentUser
    ) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // ignore storage errors
      }
    }

    prevViewRef.current = handlers.currentView;
  }, [handlers.role, handlers.currentView, handlers.currentUser]);

  useEffect(() => {
    installFetchInterceptor();
    installMobileValidationBridge();
    installCertificateColumnHider();

    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved && handlers.currentView === 'landing') {
        const parsed = JSON.parse(saved) as { role?: 'admin' | 'resident'; user?: Resident };
        if (parsed?.role === 'admin') {
          const adminUser = buildFallbackAdminUser(parsed?.user);
          handlers.loginAs(adminUser, 'admin');
          void handlers.fetchData();
        } else if (parsed?.user && parsed?.role === 'resident') {
          const savedUser = parsed.user;
          const doFetch = rawFetchRef || window.fetch.bind(window);
          doFetch('/api/residents')
            .then((r) => (r.ok ? r.json() : []))
            .then((list: Resident[]) => {
              const fresh = Array.isArray(list) ? list.find((x) => x.id === savedUser.id) : null;
              if (fresh && fresh.status === 'Approved') {
                latestHandlers?.loginAs(
                  { ...fresh, avatarUrl: resolveUserAvatar(fresh.avatarUrl) },
                  'resident'
                );
              } else if (!fresh && savedUser.status === 'Approved') {
                latestHandlers?.loginAs(
                  { ...savedUser, avatarUrl: resolveUserAvatar(savedUser.avatarUrl) },
                  'resident'
                );
              } else {
                sessionStorage.removeItem(SESSION_KEY);
              }
            })
            .catch(() => {
              if (savedUser.status === 'Approved') {
                latestHandlers?.loginAs(
                  { ...savedUser, avatarUrl: resolveUserAvatar(savedUser.avatarUrl) },
                  'resident'
                );
              }
            });
        }
      }
    } catch {
      // ignore session restore errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeWaitingModal = () => {
    try {
      localStorage.removeItem(WAITING_KEY);
      localStorage.removeItem(HEARTBEAT_KEY);
    } catch {
      // ignore storage errors
    }
    setWaitingUser(null);
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[10000] max-w-md text-white px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${
            toast.variant === 'error'
              ? 'bg-red-600 border-red-400'
              : 'bg-emerald-700 border-emerald-500'
          }`}
        >
          <CheckCircle className="w-6 h-6 text-white shrink-0" />
          <div className="flex-1 text-sm font-semibold leading-snug">{toast.message}</div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {waitingUser && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#007BFF] text-white rounded-3xl shadow-2xl p-8 border border-white/20">
            <button
              type="button"
              onClick={closeWaitingModal}
              aria-label="Close"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white text-slate-800 hover:bg-slate-100 flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-lg mb-5 flex items-center justify-center">
                <img
                  src={BARANGAY_SEAL_IMG}
                  onError={onSealError}
                  alt="Barangay San Juan Seal"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight mb-6">Waiting for Approval</h2>

              <div className="w-full bg-white/15 border border-white/25 rounded-2xl p-4 flex items-center gap-4 text-left">
                <img
                  src={resolveUserAvatar(waitingUser.avatarUrl)}
                  onError={onResidentError}
                  alt={waitingUser.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shrink-0 bg-black"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-base truncate">{waitingUser.fullName}</p>
                  <p className="text-xs text-white/85 truncate mt-0.5">
                    {waitingUser.address || 'Barangay San Juan, Licab, Nueva Ecija'}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Admin Approval
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  // Navigation & session state
  const [currentView, setCurrentView] = useState<'landing' | 'portal'>('landing');
  const [currentUser, setCurrentUser] = useState<Resident | null>(null);
  const [role, setRole] = useState<'admin' | 'resident'>('resident');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'split'>('signin');
  const [previewDocument, setPreviewDocument] = useState<DocumentRequestItem | null>(null);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<StatsOverview>({
    totalPopulation: 0,
    pendingApprovals: 0,
    pendingDocuments: 0,
    totalDocuments: 0,
    totalMessages: 0,
    registeredVoters: 0,
  });
  const [residents, setResidents] = useState<Resident[]>([]);
  const [documents, setDocuments] = useState<DocumentRequestItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [messages, setMessages] = useState<ResidentMessageItem[]>([]);

  // Load data from Express backend
  const fetchData = async () => {
    try {
      const [statsRes, resRes, docRes, annRes, msgRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/residents'),
        fetch('/api/documents'),
        fetch('/api/announcements'),
        fetch('/api/messages'),
      ]);

      if (statsRes.ok) {
        const rawStats = (await statsRes.json()) as Partial<StatsOverview>;
        if (rawStats && typeof rawStats === 'object') {
          setStats({
            totalPopulation: Number(rawStats.totalPopulation) || 0,
            pendingApprovals: Number(rawStats.pendingApprovals) || 0,
            pendingDocuments: Number(rawStats.pendingDocuments) || 0,
            totalDocuments: Number(rawStats.totalDocuments) || 0,
            totalMessages: Number(rawStats.totalMessages) || 0,
            registeredVoters: Number(rawStats.registeredVoters) || 0,
          });
        }
      }
      if (resRes.ok) {
        const rawRes = (await resRes.json()) as Resident[];
        if (Array.isArray(rawRes)) setResidents(rawRes);
      }
      if (docRes.ok) {
        const rawDocs = (await docRes.json()) as DocumentRequestItem[];
        if (Array.isArray(rawDocs)) setDocuments(rawDocs);
      }
      if (annRes.ok) {
        const rawAnns = (await annRes.json()) as AnnouncementItem[];
        if (Array.isArray(rawAnns)) {
          setAnnouncements(
            rawAnns.map((a: AnnouncementItem) => ({
              ...a,
              comments: Array.isArray(a?.comments) ? a.comments : [],
            }))
          );
        }
      }
      if (msgRes.ok) {
        const rawMsgs = (await msgRes.json()) as ResidentMessageItem[];
        if (Array.isArray(rawMsgs)) {
          setMessages(
            rawMsgs.map((m: ResidentMessageItem) => ({
              ...m,
              replies: Array.isArray(m?.replies) ? m.replies : [],
            }))
          );
        }
      }
    } catch (err) {
      console.warn('API sync warning; using fallback state', err);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // Auth handlers
  const handleOpenAuth = (mode: 'signin' | 'register' | 'split' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user: Resident, userRole: 'admin' | 'resident') => {
    setCurrentUser({
      ...user,
      avatarUrl: resolveUserAvatar(user.avatarUrl),
    });
    setRole(userRole);
    setCurrentView('portal');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    clearActiveSession();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Admin Handlers
  const handleApproveResident = async (id: string) => {
    try {
      const res = await fetch(`/api/approvals/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectResident = async (id: string) => {
    try {
      const res = await fetch(`/api/approvals/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveResident = async (id: string) => {
    try {
      const res = await fetch(`/api/residents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddResident = async (newRes: Partial<Resident>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRes),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDocStatus = async (
    id: string,
    status: DocumentRequestItem['status']
  ) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchiveToggle = async (id: string, isArchived: boolean) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (data: {
    title: string;
    subtitle?: string;
    description: string;
    eventTime?: string;
  }) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (id: string, content: string) => {
    try {
      const resolvedAvatar = resolveUserAvatar(currentUser?.avatarUrl);
      const res = await fetch(`/api/announcements/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: currentUser?.fullName || (role === 'admin' ? 'Barangay Admin' : 'Resident'),
          authorAvatar:
            resolvedAvatar === USER_PROFILE_DEFAULT_IMG ? DEFAULT_AVATAR_PATH : resolvedAvatar,
          content,
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyMessage = async (id: string, replyText: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Barangay Admin',
          message: replyText,
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resident actions
  const handleSubmitDocumentRequest = async (
    types: string[],
    purpose: string,
    address: string
  ) => {
    try {
      const resolvedAvatar = resolveUserAvatar(currentUser?.avatarUrl);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: currentUser?.id || 'res-1',
          fullName: currentUser?.fullName || 'Resident',
          contactNo: currentUser?.contactNo || '',
          profileUrl:
            resolvedAvatar === USER_PROFILE_DEFAULT_IMG ? DEFAULT_AVATAR_PATH : resolvedAvatar,
          address,
          documentTypes: types,
          purpose,
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendResidentMessage = async (data: { message: string; category?: string }) => {
    try {
      const resolvedAvatar = resolveUserAvatar(currentUser?.avatarUrl);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: currentUser?.id || 'res-1',
          residentName: currentUser?.fullName || 'Resident',
          contactNo: currentUser?.contactNo || '',
          residentAvatar:
            resolvedAvatar === USER_PROFILE_DEFAULT_IMG ? DEFAULT_AVATAR_PATH : resolvedAvatar,
          message: data.message,
          category: data.category || 'General',
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (updated: Partial<Resident>) => {
    if (currentUser) {
      const payload: Partial<Resident> = { ...updated };
      if ('avatarUrl' in payload) {
        const resolved = resolveUserAvatar(payload.avatarUrl);
        payload.avatarUrl =
          resolved === USER_PROFILE_DEFAULT_IMG ? DEFAULT_AVATAR_PATH : resolved;
      }
      const merged: Resident = {
        ...currentUser,
        ...payload,
        avatarUrl: resolveUserAvatar(payload.avatarUrl ?? currentUser.avatarUrl),
      };
      setCurrentUser(merged);
      try {
        const res = await fetch(`/api/residents/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = (await res.json()) as { resident?: Resident };
          if (data.resident) {
            const normalizedRes: Resident = {
              ...data.resident,
              avatarUrl: resolveUserAvatar(data.resident.avatarUrl),
            };
            setCurrentUser(normalizedRes);
            setResidents((prev) =>
              prev.map((r) => (r.id === normalizedRes.id ? normalizedRes : r))
            );
          }
        }
      } catch (err) {
        console.warn('Failed to sync updated profile to server', err);
      }
    }
  };

  // Landing page quick service click
  const handleLandingServiceClick = (service: 'document' | 'report' | 'announcements') => {
    if (!currentUser) {
      handleOpenAuth('signin');
      return;
    }
    setCurrentView('portal');
    if (service === 'document') setActiveTab('documents');
    if (service === 'report') setActiveTab('messages');
    if (service === 'announcements') setActiveTab('announcements');
  };

  // Current resident filtered data
  const myDocs = currentUser
    ? documents.filter((d) => d.residentId === currentUser.id || role === 'admin')
    : documents;
  const myMsgs = currentUser
    ? messages.filter((m) => m.residentId === currentUser.id || role === 'admin')
    : messages;

  return (
    <div className="min-h-screen bg-[#0084ff] flex flex-col font-sans">
      {/* 1. PUBLIC LANDING VIEW */}
      {currentView === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onSelectService={handleLandingServiceClick}
          onEnterPortal={() => {
            if (currentUser) {
              setCurrentView('portal');
            } else {
              handleOpenAuth('signin');
            }
          }}
          stats={stats}
        />
      ) : (
        /* 2. PORTAL VIEW (Admin or Resident) */
        <div className="flex-1 flex flex-col lg:flex-row h-screen overflow-hidden">
          {/* Shared Responsive Sidebar */}
          <Sidebar
            role={role}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onLogout={handleLogout}
            currentUser={currentUser}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onGoToLanding={() => setCurrentView('landing')}
            onOpenEditAvatar={() => setIsEditAvatarOpen(true)}
          />

          {/* Main Content Pane */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0084ff]">
            {/* Top Bar with Responsive Hamburger, Barangay Logo & Role Switcher */}
            <header className="bg-[#0084ff] px-4 sm:px-6 py-3 flex items-center justify-between border-b border-blue-400/40 text-white shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-blue-700/60 hover:bg-blue-700 text-white cursor-pointer"
                  title="Open Navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Barangay Logo & Title in Portal Header */}
                <button
                  onClick={() => setCurrentView('landing')}
                  className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-95 transition-opacity"
                  title="Go to Public Portal"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white/90 shadow-xs shrink-0 bg-white">
                    <img
                      src={BARANGAY_SEAL_IMG}
                      onError={onSealError}
                      alt="Barangay Seal"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm sm:text-base hidden sm:inline">
                      Barangay San Juan Management System
                    </span>
                    <span className="font-mono font-bold text-sm sm:hidden">
                      Brgy. San Juan
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold">
                      {role === 'admin' ? 'Admin Mode' : 'Resident Mode'}
                    </span>
                  </div>
                </button>
              </div>

              {/* User Avatar Edit & Public Page Link */}
              <div className="flex items-center gap-3">
                {currentUser && (
                  <button
                    onClick={() => setIsEditAvatarOpen(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer border border-white/20 text-xs font-mono font-bold"
                    title="Click to change your profile picture"
                  >
                    <img
                      src={resolveUserAvatar(currentUser.avatarUrl)}
                      onError={onResidentError}
                      alt={currentUser.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-white bg-black shrink-0"
                    />
                    <span className="hidden md:inline truncate max-w-[160px]">
                      {currentUser.role === 'admin'
                        ? 'Hon. Harold Villaroman'
                        : currentUser.firstName || currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-[#d7e635] underline font-bold">Edit</span>
                  </button>
                )}

                <button
                  onClick={() => setCurrentView('landing')}
                  className="hidden sm:flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-blue-700/60 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Public Page</span>
                </button>
              </div>
            </header>

            {/* Scrollable Page Body */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto">
                {/* ADMIN ROUTES */}
                {role === 'admin' && (
                  <>
                    {activeTab === 'dashboard' && (
                      <AdminDashboard
                        stats={stats}
                        recentDocuments={documents}
                        recentMessages={messages}
                        onNavigate={(tab) => setActiveTab(tab)}
                      />
                    )}
                    {activeTab === 'approval' && (
                      <AdminApproval
                        residents={residents}
                        onApprove={handleApproveResident}
                        onReject={handleRejectResident}
                      />
                    )}
                    {activeTab === 'documents' && (
                      <AdminDocuments
                        documents={documents}
                        onUpdateStatus={handleUpdateDocStatus}
                        onArchiveToggle={handleArchiveToggle}
                        onPreviewClearance={(doc) => setPreviewDocument(doc)}
                      />
                    )}
                    {activeTab === 'announcements' && (
                      <AdminAnnouncements
                        announcements={announcements}
                        onCreateAnnouncement={handleCreateAnnouncement}
                        onDeleteAnnouncement={handleDeleteAnnouncement}
                        onAddComment={handleAddComment}
                      />
                    )}
                    {activeTab === 'messages' && (
                      <AdminMessages
                        messages={messages}
                        onReplyMessage={handleReplyMessage}
                        onDeleteMessage={handleDeleteMessage}
                      />
                    )}
                    {activeTab === 'population' && (
                      <AdminPopulation
                        residents={residents}
                        isVotersMode={false}
                        onRemoveResident={handleRemoveResident}
                        onAddResident={handleAddResident}
                      />
                    )}
                    {activeTab === 'voters' && (
                      <AdminPopulation
                        residents={residents}
                        isVotersMode={true}
                        onRemoveResident={handleRemoveResident}
                        onAddResident={handleAddResident}
                      />
                    )}
                  </>
                )}

                {/* RESIDENT ROUTES */}
                {role === 'resident' && currentUser && (
                  <>
                    {activeTab === 'dashboard' && (
                      <ResidentDashboard
                        resident={currentUser}
                        myDocuments={myDocs}
                        announcements={announcements}
                        myMessages={myMsgs}
                        onNavigate={(tab) => setActiveTab(tab)}
                        onOpenEditAvatar={() => setIsEditAvatarOpen(true)}
                      />
                    )}
                    {activeTab === 'documents' && (
                      <ResidentRequestDoc
                        resident={currentUser}
                        myDocuments={myDocs}
                        onSubmitRequest={handleSubmitDocumentRequest}
                        onPreviewClearance={(doc) => setPreviewDocument(doc)}
                      />
                    )}
                    {activeTab === 'announcements' && (
                      <ResidentAnnouncements
                        resident={currentUser}
                        announcements={announcements}
                        onAddComment={handleAddComment}
                      />
                    )}
                    {activeTab === 'messages' && (
                      <ResidentMessages
                        resident={currentUser}
                        myMessages={myMsgs}
                        onSendMessage={handleSendResidentMessage}
                      />
                    )}
                    {activeTab === 'profile' && (
                      <ResidentProfile
                        resident={currentUser}
                        onUpdateProfile={handleUpdateProfile}
                      />
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Global Auth Modal (Sign in / Register / Submitted / Split view) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegistered={fetchData}
        initialMode={authMode}
      />

      {/* Official Certificate Preview & Print Modal */}
      <OfficialClearanceModal
        document={previewDocument}
        onClose={() => setPreviewDocument(null)}
      />

      {/* Edit Profile Picture Modal */}
      {currentUser && (
        <EditProfilePhotoModal
          isOpen={isEditAvatarOpen}
          onClose={() => setIsEditAvatarOpen(false)}
          currentAvatar={resolveUserAvatar(currentUser.avatarUrl)}
          userName={currentUser.fullName}
          onSaveAvatar={async (newAvatarUrl) => {
            await handleUpdateProfile({ avatarUrl: newAvatarUrl });
          }}
        />
      )}

      <ApprovalSyncBridge
        currentUser={currentUser}
        role={role}
        currentView={currentView}
        loginAs={handleLoginSuccess}
        setActiveTab={setActiveTab}
        setIsAuthOpen={setIsAuthOpen}
        fetchData={fetchData}
      />
    </div>
  );
}
