import type { SyntheticEvent } from 'react';
import sealImg from '../assets/images/barangay_seal_logo_1792164527116.jpg';

export const BARANGAY_SEAL_IMG = sealImg;
export const BARANGAY_HALL_IMG =
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=600';

export const DEFAULT_AVATAR_PATH = '/user_profile_default.png';

export const USER_PROFILE_DATA_URI =
  'data:image/png;base64,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';

export const USER_PROFILE_FILE_IMG = DEFAULT_AVATAR_PATH;
export const USER_PROFILE_DEFAULT_IMG = USER_PROFILE_DATA_URI;
export const RESIDENT_DEFAULT_IMG = USER_PROFILE_DEFAULT_IMG;

export const resolveUserAvatar = (url?: string | null): string => {
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

export const onSealError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (e?.currentTarget) e.currentTarget.style.display = 'none';
};

export const onResidentError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (e?.currentTarget && e.currentTarget.src !== USER_PROFILE_DATA_URI) {
    e.currentTarget.src = USER_PROFILE_DATA_URI;
  }
};

export const onHallError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (e?.currentTarget) e.currentTarget.style.display = 'none';
};
