// Simple auth helper using localStorage for the demo
// In a real app, replace with context or secure storage

export function setToken(token) {
  try {
    localStorage.setItem("token", token);
  } catch (e) {
    // ignore or implement fallback
    console.warn("Unable to set token in localStorage", e);
  }
}

export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem("token");
  } catch (e) {
    console.warn("Unable to remove token from localStorage", e);
  }
}

export function isLoggedIn() {
  return !!getToken();
}
