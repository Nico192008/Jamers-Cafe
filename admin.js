// admin.js
import { database } from "./firebase-config.js";
import { ref, onValue, set, push, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const adminProductTableBody = document.querySelector("#adminProductTable tbody");
const adminTransactionHistory = document.getElementById("adminTransactionHistory");
const adminAddProductForm = document.getElementById("adminAddProduct");

let products = [];
let transactions = [];

// Load products from Firebase
const loadProducts = () => {
  const productsRef = ref(database, "products");
  onValue(productsRef, (snapshot) => {
    products = [];
    snapshot.forEach((childSnap) => {
      products.push({ id: childSnap.key, ...childSnap.val() });
    });
    renderAdminProducts();
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
    renderTransactions();
  });
};

// Render current products in admin table
const renderAdminProducts = () => {
  adminProductTableBody.innerHTML = "";
  products.forEach((p, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.name}</td>
      <td>₱${p.price.toFixed(2)}</td>
      <td><button class="remove-btn" data-id="${p.id}">Remove</button></td>
    `;

    adminProductTableBody.appendChild(tr);
  });

  // Remove product event
  adminProductTableBody.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("Remove this product?")) {
        await remove(ref(database, `products/${id}`));
      }
    });
  });
};

// Render transaction history grouped by date with totals
const renderTransactions = () => {
  if (transactions.length === 0) {
    adminTransactionHistory.innerHTML = "<p>No transactions yet.</p>";
    return;
  }

  // Group transactions by date string
  const grouped = {};
  transactions.forEach((t) => {
    const dateStr = new Date(t.date).toLocaleDateString();
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(t);
  });

  adminTransactionHistory.innerHTML = "";

  for (const [date, transList] of Object.entries(grouped)) {
    const dateDiv = document.createElement("div");
    dateDiv.style.marginBottom = "20px";

    let dayTotal = transList.reduce((sum, t) => sum + t.total, 0);

    dateDiv.innerHTML = `<h4>${date} — Total: ₱${dayTotal.toFixed(2)}</h4>`;

    transList.forEach((t, idx) => {
      const div = document.createElement("div");
      div.style.borderBottom = "1px solid #ddd";
      div.style.padding = "8px 0";

      let html = `<strong>Transaction #${idx + 1}</strong><br>`;
      html += `Date/Time: ${new Date(t.date).toLocaleTimeString()}<br>`;
      html += `Items:<br><ul>`;
      t.items.forEach((item) => {
        html += `<li>${item.name} x ${item.qty} = ₱${(item.price * item.qty).toFixed(2)}</li>`;
      });
      html += `</ul><strong>Total: ₱${t.total.toFixed(2)}</strong>`;

      div.innerHTML = html;
      dateDiv.appendChild(div);
    });

    adminTransactionHistory.appendChild(dateDiv);
  }
};

// Add product handler
adminAddProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("adminProdName");
  const priceInput = document.getElementById("adminProdPrice");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Please enter valid product name and price.");
    return;
  }

  const productsRef = ref(database, "products");
  await push(productsRef, { name, price });

  nameInput.value = "";
  priceInput.value = "";
});

loadProducts();
loadTransactions();
