export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getUserData() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

export function setUserData(userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
}

export function removeUserData() {
  localStorage.removeItem("userData");
}

export function logout() {
  removeToken();
  removeUserData();
}
