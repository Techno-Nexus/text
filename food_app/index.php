<?php include 'header.php'; ?>

<div class="hero-banner">
  <div class="hero-content">
    <span class="tag-pill">Fresh • Fast • Flavorful</span>
    <h1 class="hero-title">Crave-worthy meals, delivered in minutes.</h1>
    <p class="hero-subtitle">From spicy jollof and grilled chicken to healthy bowls and desserts, enjoy restaurant-quality meals without leaving home.</p>
    <div class="d-flex flex-wrap gap-3">
      <a class="btn btn-warning btn-lg px-4" href="dashboard.php">Order Now</a>
      <a class="btn btn-outline-light btn-lg px-4" href="chatbot.php">Try AI Assistant</a>
    </div>
  </div>
  <div class="floating-badge">
    <div class="small text-uppercase text-white-50 mb-1">Today’s deal</div>
    <strong>Save 20% on combo meals</strong>
  </div>
</div>

<div class="row g-4 my-4">
  <div class="col-md-4">
    <div class="feature-card">
      <i class="fa-solid fa-bolt"></i>
      <h4>Fast Delivery</h4>
      <p class="text-muted mb-0">Hot meals delivered in under 30 minutes across the city.</p>
    </div>
  </div>
  <div class="col-md-4">
    <div class="feature-card">
      <i class="fa-solid fa-robot"></i>
      <h4>Smart Recommendations</h4>
      <p class="text-muted mb-0">Our AI assistant suggests meals based on your budget and cravings.</p>
    </div>
  </div>
  <div class="col-md-4">
    <div class="feature-card">
      <i class="fa-solid fa-shield-halved"></i>
      <h4>Secure Checkout</h4>
      <p class="text-muted mb-0">Safe, reliable payments with card or mobile wallet support.</p>
    </div>
  </div>
</div>

<div class="section-heading">
  <h3>Popular picks</h3>
  <span>Made fresh every day</span>
</div>

<div class="row g-4">
  <div class="col-md-6 col-xl-3">
    <div class="meal-card">
      <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80');">
        <span class="meal-badge">Best seller</span>
      </div>
      <div class="meal-card-body">
        <div class="meal-meta">
          <h5 class="mb-0">Jollof Bowl</h5>
          <div class="rating"><i class="fa-solid fa-star"></i> 4.9</div>
        </div>
        <p class="text-muted mb-3">Spicy Nigerian jollof rice with grilled chicken and vegetables.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="meal-price">₦3,500</div>
          <a href="dashboard.php" class="btn btn-warning btn-sm">Add</a>
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-xl-3">
    <div class="meal-card">
      <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80');">
        <span class="meal-badge">Healthy</span>
      </div>
      <div class="meal-card-body">
        <div class="meal-meta">
          <h5 class="mb-0">Salmon Plate</h5>
          <div class="rating"><i class="fa-solid fa-star"></i> 4.8</div>
        </div>
        <p class="text-muted mb-3">Lean protein, greens, roasted potatoes, and herb dressing.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="meal-price">₦4,800</div>
          <a href="dashboard.php" class="btn btn-warning btn-sm">Add</a>
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-xl-3">
    <div class="meal-card">
      <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80');">
        <span class="meal-badge">Trending</span>
      </div>
      <div class="meal-card-body">
        <div class="meal-meta">
          <h5 class="mb-0">Seafood Stew</h5>
          <div class="rating"><i class="fa-solid fa-star"></i> 4.9</div>
        </div>
        <p class="text-muted mb-3">Rich stew with prawns, fish, peppers, and soft plantain.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="meal-price">₦5,300</div>
          <a href="dashboard.php" class="btn btn-warning btn-sm">Add</a>
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-6 col-xl-3">
    <div class="meal-card">
      <div class="meal-image" style="background-image: url('https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80');">
        <span class="meal-badge">Sweet</span>
      </div>
      <div class="meal-card-body">
        <div class="meal-meta">
          <h5 class="mb-0">Cinnamon Burger</h5>
          <div class="rating"><i class="fa-solid fa-star"></i> 4.7</div>
        </div>
        <p class="text-muted mb-3">Juicy grilled patty with cheddar, lettuce, and potato wedges.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="meal-price">₦2,900</div>
          <a href="dashboard.php" class="btn btn-warning btn-sm">Add</a>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="promo-panel row align-items-center g-4">
  <div class="col-lg-7">
    <span class="tag-pill text-dark" style="background: rgba(255,122,26,0.1); border-color: rgba(255,122,26,0.18);">Meal plans</span>
    <h3 class="fw-bold mb-3" style="letter-spacing:-0.04em;">Build a smarter routine with healthy bundles.</h3>
    <p class="text-muted mb-0">Choose lunch, dinner, and snack packs tailored to workdays, family meals, or post-work treats.</p>
  </div>
  <div class="col-lg-5 text-lg-end">
    <a class="btn btn-warning btn-lg" href="dashboard.php">View Plans</a>
  </div>
</div>

<?php include 'footer.php'; ?>