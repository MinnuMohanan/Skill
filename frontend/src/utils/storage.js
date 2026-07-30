export const getStoredJson = (key, fallback = null) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};
