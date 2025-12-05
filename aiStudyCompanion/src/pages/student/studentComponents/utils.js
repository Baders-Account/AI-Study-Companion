// MOCK DATA  (front-end only)
export const isValidUrl = (str) => {
  try { new URL(str); return true; } catch { return false; }
};

export const buildNote = (name, url) => ({ id: Date.now() + Math.random(), name, url });

export const getCollapsedList = (arr, showAll, limit = 3) => (showAll ? arr : arr.slice(0, limit));

export const SAMPLE_QUIZZES = [
  { id: 1, title: "Quiz 1 – React Basics", topic: "React", link: "#" },
  { id: 2, title: "Quiz 2 – State & Props", topic: "React", link: "#" },
  { id: 3, title: "Quiz 3 – Routing", topic: "React Router", link: "#" },
  { id: 4, title: "Quiz 4 – JS Fundamentals", topic: "JavaScript", link: "#" },
  { id: 5, title: "Quiz 5 – CSS & Layout", topic: "CSS", link: "#" },
  { id: 6, title: "Quiz 6 – Accessibility", topic: "A11y", link: "#" },
  { id: 7, title: "Quiz 7 – Async JS", topic: "JavaScript", link: "#" },
  { id: 8, title: "Quiz 8 – Testing", topic: "Testing", link: "#" },
];
