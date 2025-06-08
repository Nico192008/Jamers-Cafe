const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

const loginContainer = document.getElementById('loginContainer');
const adminPanel = document.getElementById('adminPanel');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const productTableBody = document.querySelector('#adminProductTable tbody');
const addProductForm = document.getElementById('adminAddProductForm');
const adminProductName = document.getElementById('adminProductName');
const adminProductPrice = document.getElementById('adminProductPrice');

function isLoggedIn() {
  return sessionStorage.getItem('loggedIn') === 'true';
}

function setLoggedIn(val) {
  sessionStorage.setItem('loggedIn', val ? 'true' : 'false');
}

function loadProducts() {
  const data = JSON.parse(localStorage.getItem('products'));
  if (Array.isArray(data)) return data;
  return [];
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

function renderProductTable() {
  const products = loadProducts();
  productTableBody.innerHTML = '';
  products.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>₱${p.price.toFixed(2)}</td>
      <td><button class="delete-btn" data-index="${i}">Delete</button></td>
    `;
    productTableBody.appendChild(tr);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      products.splice(idx, 1);
      saveProducts(products);
      renderProductTable();
    };
  });
}

function showAdminPanel(show) {
  if (show) {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'block';
    renderProductTable();
  } else {
    loginContainer.style.display = 'block';
    adminPanel.style.display = 'none';
  }
}

loginBtn.addEventListener('click', () => {
  const u = usernameInput.value.trim();
  const p = passwordInput.value;
  if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    setLoggedIn(true);
    showAdminPanel(true);
  } else {
    alert('Incorrect username or password');
  }
});

logoutBtn.addEventListener('click', () => {
  setLoggedIn(false);
  showAdminPanel(false);
});

addProductForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = adminProductName.value.trim();
  const price = parseFloat(adminProductPrice.value);
  if (!name || isNaN(price) || price <= 0) {
    alert('Please enter valid product name and price');
    return;
  }

  const products = loadProducts();
  // Prevent duplicates by name
  if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    alert('Product already exists');
    return;
  }

  products.push({ id: Date.now(), name, price });
  saveProducts(products);
  renderProductTable();
  addProductForm.reset();
});

// On page load
if (isLoggedIn()) {
  showAdminPanel(true);
} else {
  showAdminPanel(false);
}
