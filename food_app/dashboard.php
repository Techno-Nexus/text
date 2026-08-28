<?php 
include 'header.php'; 
if(!isset($_SESSION['user_id'])) { header("Location: login.php"); exit; }
?>

<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
  <div>
    <p class="text-uppercase text-warning fw-bold mb-2" style="letter-spacing:0.14em; font-size: 0.72rem;">Welcome back</p>
    <h2 class="fw-bold mb-0" style="letter-spacing:-0.05em;">Hello, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</h2>
  </div>
  <a href="index.php" class="btn btn-outline-dark mt-3 mt-md-0">Explore Specials</a>
</div>

<div class="row g-4">
  <div class="col-lg-8">
    <div class="section-heading mb-3">
      <h3>Available menu</h3>
      <span>Freshly prepared today</span>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="meal-card">
          <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80');">
            <span class="meal-badge">Popular</span>
          </div>
          <div class="meal-card-body">
            <div class="meal-meta">
              <h5 class="mb-0">Jollof Rice + Chicken</h5>
              <div class="rating"><i class="fa-solid fa-star"></i> 4.9</div>
            </div>
            <p class="text-muted mb-3">Classic Nigerian jollof served with roasted chicken and salad.</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="meal-price">₦3,500</div>
              <button class="btn btn-warning btn-sm" onclick="addToCart('Jollof Rice + Chicken', 3500)">Add</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="meal-card">
          <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80');">
            <span class="meal-badge">Chef pick</span>
          </div>
          <div class="meal-card-body">
            <div class="meal-meta">
              <h5 class="mb-0">Fish Stew Container</h5>
              <div class="rating"><i class="fa-solid fa-star"></i> 4.8</div>
            </div>
            <p class="text-muted mb-3">A rich seafood stew with pepper sauce and choice carbs.</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="meal-price">₦5,000</div>
              <button class="btn btn-warning btn-sm" onclick="addToCart('Fish Stew Container', 5000)">Add</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="meal-card">
          <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80');">
            <span class="meal-badge">Fresh</span>
          </div>
          <div class="meal-card-body">
            <div class="meal-meta">
              <h5 class="mb-0">Shrimp Pasta</h5>
              <div class="rating"><i class="fa-solid fa-star"></i> 4.7</div>
            </div>
            <p class="text-muted mb-3">Creamy shrimp pasta with garlic herbs and lemon finish.</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="meal-price">₦4,200</div>
              <button class="btn btn-warning btn-sm" onclick="addToCart('Shrimp Pasta', 4200)">Add</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="meal-card">
          <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80');">
            <span class="meal-badge">Combo</span>
          </div>
          <div class="meal-card-body">
            <div class="meal-meta">
              <h5 class="mb-0">Burger Combo</h5>
              <div class="rating"><i class="fa-solid fa-star"></i> 4.6</div>
            </div>
            <p class="text-muted mb-3">Double patty burger, fries, and chilled drink bundle.</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="meal-price">₦3,100</div>
              <button class="btn btn-warning btn-sm" onclick="addToCart('Burger Combo', 3100)">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="col-lg-4">
    <div class="cart-panel">
      <h4 class="fw-bold mb-3">Your order cart</h4>
      <ul id="cartItems" class="list-group list-group-flush my-3"></ul>
      <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
        <span class="text-muted">Subtotal</span>
        <h5 class="mb-0">₦<span id="cartTotal">0</span></h5>
      </div>
      <button class="btn btn-success w-100 mt-2" onclick="checkout()">Checkout</button>
    </div>
  </div>
</div>

<script>
let cart = [];

function addToCart(name, price){
  cart.push({ name, price });
  renderCart();
}

function renderCart(){
  const list = document.getElementById('cartItems');
  const totalValue = document.getElementById('cartTotal');
  let total = 0;
  list.innerHTML = '';

  cart.forEach((item) => {
    total += Number(item.price);
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${item.name}</span>
        <strong>₦${item.price}</strong>
      </li>
    `;
  });

  if (cart.length === 0) {
    list.innerHTML = '<li class="list-group-item text-muted">Your cart is empty.</li>';
  }

  totalValue.innerText = total;
}

function checkout(){
  if (cart.length === 0) {
    alert('Your cart is empty. Add a meal first.');
    return;
  }
  alert('Order placed successfully!');
  cart = [];
  renderCart();
}
</script>

<?php include 'footer.php'; ?>