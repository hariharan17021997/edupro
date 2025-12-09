const BASE_URL = "https://restcountries.com/v3.1";

const ENDPOINTS = {
  COUNTRIES: `${BASE_URL}/all`,
};

// Example social login endpoints. Replace these with your backend's
// OAuth redirect endpoints (these are placeholders for local/dev).
ENDPOINTS.SOCIAL_LOGIN = {
  // Backend route that starts Google OAuth (should redirect to provider)
  google: "http://localhost:4000/auth/google",
  // Backend route that starts GitHub OAuth
  github: "http://localhost:4000/auth/github",
};

// Generic social auth URL (optional). If present AuthPage will append
// a `provider=` query param when redirecting.
ENDPOINTS.SOCIAL_AUTH_URL = "http://localhost:4000/auth/social";

export default ENDPOINTS;
