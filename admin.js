// Load products & transactions from localStorage
let products = JSON.parse(localStorage.getItem("products") || "[]");
let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

const adminProductTableBody = document.querySelector("#adminProductTable tbody");
const adminTransactionHistory = document.getElementById("adminTransactionHistory");
const adminAddProductForm = document.getElementById("adminAddProduct");

// Render current products in admin table
const renderAdminProducts = () => {
  adminProductTableBody.innerHTML = "";
  products.forEach((p, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.name}</td>
      <td>₱${p.price.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${i}">Remove</button></td>
    `;

    adminProductTableBody.appendChild(tr);
  });

  // Remove product event
  adminProductTableBody.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      renderAdminProducts();
    });
  });
};

// Render transaction history
const renderTransactions = () => {
  if (transactions.length === 0) {
    adminTransactionHistory.innerHTML = "<p>No transactions yet.</p>";
    return;
  }

  adminTransactionHistory.innerHTML = "";
  transactions.forEach((t, idx) => {
    const div = document.createElement("div");
    div.style.borderBottom = "1px solid #ddd";
    div.style.padding = "8px 0";

    let html = `<strong>Transaction #${idx + 1}</strong><br>`;
    html += `Date: ${new Date(t.date).toLocaleString()}<br>`;
    html += `Items:<br><ul>`;
    t.items.forEach((item) => {
      html += `<li>${item.name} x ${item.qty} = ₱${(item.price * item.qty).toFixed(2)}</li>`;
    });
    html += `</ul><strong>Total: ₱${t.total.toFixed(2)}</strong>`;

    div.innerHTML = html;
    adminTransactionHistory.appendChild(div);
  });
};

// Add product handler
adminAddProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("adminProdName");
  const priceInput = document.getElementById("adminProdPrice");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Please enter valid product name and price.");
    return;
  }

  products.push({ name, price });
  localStorage.setItem("products", JSON.stringify(products));
  nameInput.value = "";
  priceInput.value = "";

  renderAdminProducts();
});

// Initial render
renderAdminProducts();
renderTransactions();
