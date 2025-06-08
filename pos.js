const PRODUCTS_KEY = 'products';
const TRANSACTIONS_KEY = 'transactions';

let productList = loadProducts();
let transactions = loadTransactions();
let cart = [];

// Load products (array of objects with id,name,price)
function loadProducts() {
  const data = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  if (Array.isArray(data) && data.length) return data;
  // default products if none saved
  return [
    { id: 1, name: 'Itlog', price: 8 },
    { id: 2, name: 'Tinapay', price: 12 },
    { id: 3, name: 'Gatas', price: 50 },
    { id: 4, name: 'Bigas', price: 40 },
    { id: 5, name: 'Kape', price: 20 },
    { id: 6, name: 'Asukal', price: 35 },
    { id: 7, name: 'Sardinas', price: 25 }
  ];
}

function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productList));
}

function loadTransactions() {
  const data = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY));
  return Array.isArray(data) ? data : [];
}

function saveTransactions() {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

function renderProductButtons() {
  const container = document.getElementById('productButtons');
  container.innerHTML = '';
  productList.forEach(({ name }) => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => addToCart(name);
    container.appendChild(btn);
  });
}

function renderCart() {
  const body = document.getElementById('cartBody');
  body.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>₱${item.price.toFixed(2)}</td>
      <td>${item.qty}</td>
      <td>₱${(item.price * item.qty).toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${index}">Remove</button></td>
    `;
    body.appendChild(tr);
    total += item.price * item.qty;
  });
  document.getElementById('totalDisplay').innerText = `Total: ₱${total.toFixed(2)}`;

  // Attach remove event listeners
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      cart.splice(idx, 1);
      renderCart();
    });
  });
}

function addToCart(productName) {
  const qtyInput = document.getElementById('qtyInput');
  let qty = parseInt(qtyInput.value);
  if (isNaN(qty) || qty <= 0) {
    alert('Please enter a valid quantity');
    return;
  }

  const product = productList.find(p => p.name === productName);
  if (!product) {
    alert('Product not found');
    return;
  }

  // Check if product already in cart
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ name: product.name, price: product.price, qty });
  }

  qtyInput.value = 1;
  renderCart();
}

function completeTransaction() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  // Save transaction with timestamp and items
  const now = new Date();
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  transactions.push({
    id: Date.now(),
    date: now.toISOString(),
    items: JSON.parse(JSON.stringify(cart)), // deep copy
    total
  });

  saveTransactions();

  cart = [];
  renderCart();
  renderSummary();
  renderHistory();
  alert('Transaction completed!');
}

function renderSummary() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const monthStr = now.toISOString().slice(0, 7);  // YYYY-MM
  const yearStr = now.getFullYear().toString();

  let dailyTotal = 0;
  let monthlyTotal = 0;
  let yearlyTotal = 0;

  transactions.forEach(t => {
    const date = t.date;
    if (date.startsWith(todayStr)) dailyTotal += t.total;
    if (date.startsWith(monthStr)) monthlyTotal += t.total;
    if (date.startsWith(yearStr)) yearlyTotal += t.total;
  });

  document.getElementById('dailyTotal').textContent = `Today: ₱${dailyTotal.toFixed(2)}`;
  document.getElementById('monthlyTotal').textContent = `This Month: ₱${monthlyTotal.toFixed(2)}`;
  document.getElementById('yearlyTotal').textContent = `This Year: ₱${yearlyTotal.toFixed(2)}`;
}

function renderHistory() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

  const todayTransactions = transactions.filter(t => t.date.startsWith(todayStr));
  if (todayTransactions.length === 0) {
    historyList.innerHTML = '<i>No transactions today.</i>';
    return;
  }

  todayTransactions.forEach(t => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const time = new Date(t.date).toLocaleTimeString();
    div.innerHTML = `
      <span>${time}</span>
      <span>₱${t.total.toFixed(2)}</span>
    `;
    historyList.appendChild(div);
  });
}

// Button events
document.getElementById('newTransBtn').addEventListener('click', completeTransaction);
document.getElementById('adminPanelBtn').addEventListener('click', () => {
  window.location.href = 'admin.html';
});

// Initialize
renderProductButtons();
renderCart();
renderSummary();
renderHistory();
