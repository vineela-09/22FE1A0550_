// Local storage helpers
const KEY = 'am_urls_v1';

export function loadAll() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { urls: [], clicks: {} };
  try {
    const parsed = JSON.parse(raw);
    return { urls: parsed.urls || [], clicks: parsed.clicks || {} };
  } catch {
    return { urls: [], clicks: {} };
  }
}

export function saveAll(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function saveUrl(urlObj) {
  const data = loadAll();
  // upsert by code
  const idx = data.urls.findIndex(u => u.code === urlObj.code);
  if (idx >= 0) data.urls[idx] = urlObj;
  else data.urls.unshift(urlObj);
  saveAll(data);
}

export function getByCode(code) {
  const data = loadAll();
  return data.urls.find(u => u.code === code);
}

export function codeExists(code) {
  const data = loadAll();
  return data.urls.some(u => u.code === code);
}

export function allUrls() {
  return loadAll().urls;
}

export function recordClick(code, click) {
  const data = loadAll();
  if (!data.clicks[code]) data.clicks[code] = [];
  data.clicks[code].unshift(click);
  saveAll(data);
}

export function clicksFor(code) {
  return loadAll().clicks[code] || [];
}

export function clearAll() {
  saveAll({ urls: [], clicks: {} });
}
