// Talks to the Product Feedback API. Every call uses a relative /api/...
// path: in dev, Vite's proxy (vite.config.js) forwards /api/* to the local
// Express server on :3000; in production, Netlify's _redirects file proxies
// /api/* to the deployed Render backend. The frontend never needs to know
// which one it's talking to.

const BASE = "/api";

async function parseJsonOrThrow(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // Response had no JSON body (e.g. a network-level failure page) - fall
    // through and throw a generic error below.
  }

  if (!response.ok) {
    const message = body?.error || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return body;
}

export async function getAllSuggestions() {
  const response = await fetch(`${BASE}/get-all-suggestions`);
  return parseJsonOrThrow(response);
}

export async function getSuggestionsByCategory(category) {
  const response = await fetch(
    `${BASE}/get-suggestions-by-category/${encodeURIComponent(category)}`
  );
  return parseJsonOrThrow(response);
}

export async function addSuggestion({ title, category, description }) {
  const response = await fetch(`${BASE}/add-one-suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, category, description }),
  });
  return parseJsonOrThrow(response);
}
