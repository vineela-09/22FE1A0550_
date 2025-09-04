import dayjs from 'dayjs';
import { codeExists } from './storage';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'; // avoid confusing chars

function randomCode(len = 6) {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function generateCode(preferred) {
  if (preferred) {
    const ok = /^[A-Za-z0-9_-]{3,20}$/.test(preferred);
    if (!ok) return { error: 'Preferred shortcode must be 3–20 chars: letters, numbers, _ or -' };
    if (codeExists(preferred)) return { error: 'Shortcode already exists. Choose another.' };
    return { code: preferred };
  }
  // else random and ensure no collision
  let code;
  do {
    code = randomCode(6);
  } while (codeExists(code));
  return { code };
}

export function validateUrl(str) {
  try {
    const u = new URL(str);
    return !!u.protocol && (u.protocol === 'http:' || u.protocol === 'https:');
  } catch {
    return false;
  }
}

export function computeExpiry(minutes) {
  const m = parseInt(minutes, 10);
  if (Number.isNaN(m) || m <= 0) return null;
  return dayjs().add(m, 'minute').toISOString();
}

export function isExpired(urlObj) {
  if (!urlObj.expiresAt) return false;
  return dayjs().isAfter(dayjs(urlObj.expiresAt));
}
