export const isValidUrl = (str) => {
  try { new URL(str); return true; } catch { return false; }
};

export const getCollapsedList = (list, showAll, limit) => {
  if (showAll) {
    return list;
  } else {
    return list.slice(0, limit);
  }
}

export const buildNote = (name, url) => ({
  id: String(Date.now() + Math.random()), 
  name,
  url,
});