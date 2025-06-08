// auth.js
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Login function - admin email & password based
export const loginAdmin = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch(() => {
      alert("Invalid credentials");
    });
};

// Logout function
export const logoutAdmin = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// Protect admin page (redirect if not logged in)
export const protectAdminPage = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
};

// For login page
if (window.location.pathname.endsWith("login.html")) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    loginAdmin(email, password);
  });
}

// For admin page
if (window.location.pathname.endsWith("admin.html")) {
  protectAdminPage();
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutAdmin();
    });
  }
}
