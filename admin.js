<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Jamers Café Admin Panel</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="loginContainer" class="login-container">
    <h2>Admin Login</h2>
    <input type="text" id="username" placeholder="Username" autocomplete="off" />
    <input type="password" id="password" placeholder="Password" autocomplete="off" />
    <button id="loginBtn">Login</button>
  </div>

  <div id="adminPanel" style="display:none;">
    <header class="admin-header">
      <h1>Admin Panel</h1>
      <button class="logout-btn" id="logoutBtn">Logout</button>
    </header>
    <div class="container">
      <div class="panel" style="flex: 1 1 100%;">
        <h2>Manage Products</h2>
        <form id="adminAddProductForm">
          <input type="text" id="adminProductName" placeholder="Product Name" required />
          <input type="number" id="adminProductPrice" placeholder="Price" min="0" step="0.01" required />
          <button type="submit">Add Product</button>
        </form>

        <table class="admin-table" id="adminProductTable">
          <thead>
            <tr><th>Name</th><th>Price</th><th>Action</th></tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>

  <script src="admin.js"></script>
</body>
</html>
