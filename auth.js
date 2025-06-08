// Simple admin credentials (hardcoded for demo)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

const isAdminLoggedIn = () => {
  return localStorage.getItem("isAdmin") === "true";
};

const protectAdminPage = () => {
  if (!isAdminLoggedIn()) {
    window.location.href = "login.html";
  }
};

const loginAdmin = (username, password) => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Invalid credentials");
  }
};

const logoutAdmin = () => {
  localStorage.removeItem("isAdmin");
  window.location.href = "login.html";
};

// On login.html
if (window.location.pathname.endsWith("login.html")) {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    loginAdmin(username, password);
  });
}

// On admin.html
if (window.location.pathname.endsWith("admin.html")) {
  protectAdminPage();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutAdmin();
  });
}
