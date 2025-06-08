// pos.js
import { auth, database } from "./firebase-config.js";
import {
  ref,
  onValue,
  push,
  set,
  query,
  orderByChild,
  get,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const productButtonsDiv = document.getElementById("productButtons");
const qtyInput = document.getElementById("qtyInput");
const cartBody = document.getElementById("cartBody");
const totalDisplay = document.getElementById("totalDisplay");
const newTransBtn = document.getElementById("newTransBtn");
const historyList = document.getElementById("historyList");

const dailyTotalDiv = document.getElementById("dailyTotal");
const monthlyTotalDiv = document.getElementById("monthlyTotal");
const yearlyTotalDiv = document.getElementById("yearlyTotal");

const logoutBtn = document.getElementById("logoutBtn");

let products = [];
let transactions = [];
let cart = [];

// Logout button
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// Redirect to login if not authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadProducts();
    loadTransactions();
  }
});

// Clock
const updateClock = () => {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleString();
};
setInterval(updateClock, 1000);
updateClock();

// Load products from Firebase
const loadProducts = () => {
  const productsRef = ref(database, "products");
  onValue(productsRef, (snapshot) => {
    products = [];
    snapshot.forEach((childSnap) => {
      products.push({ id: childSnap.key, ...childSnap.val() });
    });
    renderProductButtons();
  });
};

// Load transactions from Firebase
const loadTransactions = () => {
  const transactionsRef = ref(database, "transactions");
  onValue(transactionsRef, (snapshot) => {
    transactions = [];
    snapshot.forEach((childSnap) => {
      transactions.push({ id: childSnap.key, ...childSnap.val() });
    });
    renderHistory();
    renderSummary();
  });
};

// Render product buttons
const renderProductButtons = () => {
  productButtonsDiv.innerHTML = "";
  products.forEach((p) => {
    const btn = document.createElement("button");
    btn.textContent = `${p.name} - ₱${p.price.toFixed(2)}`;
    btn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value);
      if (qty <= 0 || isNaN(qty)) return alert("Enter valid quantity");

      // Add to cart or increase qty
      const existing = cart.find((c) => c.name === p.name);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ ...p, qty });
      }
      renderCart();
    });
    productButtonsDiv.appendChild(btn);
  });
};

// Render cart items
const renderCart = () => {
  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const tr = document.createElement("tr");
    const subtotal = item.price * item.qty;
    total += subtotal;

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>₱${item.price.toFixed(2)}</td>
      <td>${item.qty}</td>
      <td>₱${subtotal.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${i}">Remove</button></td>
    `;

    cartBody.appendChild(tr);
  });

  totalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;

  // Remove from cart event
  cartBody.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      cart.splice(idx, 1);
      renderCart();
    });
  });
};

// Complete transaction and save to Firebase
newTransBtn.addEventListener("click", async () => {
  if (cart.length === 0) return alert("Cart is empty!");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const trans = {
    date: new Date().toISOString(),
    items: cart,
    total,
  };

  try {
    const transactionsRef = ref(database, "transactions");
    await push(transactionsRef, trans);

    cart = [];
    renderCart();
  } catch (e) {
    alert("Failed to save transaction. Try again.");
  }
});

// Show today's transaction history grouped by date
const renderHistory = () => {
  const todayStr = new Date().toDateString();
  historyList.innerHTML = "";

  const todayTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date).toDateString();
    return tDate === todayStr;
  });

  if (todayTransactions.length === 0) {
    historyList.textContent = "No transactions today.";
    return;
  }

  todayTransactions.forEach((t, idx) => {
    const div = document.createElement("div");
    div.className = "history-item";

    let summary = `#${idx + 1} (${new Date(t.date).toLocaleTimeString()}): ₱${t.total.toFixed(2)}`;
    div.textContent = summary;

    historyList.appendChild(div);
  });
};

// Sales summary
const renderSummary = () => {
  const now = new Date();

  const dailyTotal = transactions
    .filter((t) => new Date(t.date).toDateString() === now.toDateString())
    .reduce((sum, t) => sum + t.total, 0);

  const monthlyTotal = transactions
    .filter(
      (t) =>
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((sum, t) => sum + t.total, 0);

  const yearlyTotal = transactions
    .filter((t) => new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((sum, t) => sum + t.total, 0);

  dailyTotalDiv.textContent = `Today: ₱${dailyTotal.toFixed(2)}`;
  monthlyTotalDiv.textContent = `This Month: ₱${monthlyTotal.toFixed(2)}`;
  yearlyTotalDiv.textContent = `This Year: ₱${yearlyTotal.toFixed(2)}`;
};
