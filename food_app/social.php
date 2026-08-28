<?php include 'header.php'; ?>

<div class="row justify-content-center py-3">
  <div class="col-lg-7">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-uppercase text-warning fw-bold mb-2" style="letter-spacing: 0.12em; font-size: 0.72rem;">Community</p>
        <h3 class="fw-bold mb-0">Foodie feed</h3>
      </div>
      <button class="btn btn-warning">Share post</button>
    </div>

    <div class="card card-custom mb-4 p-3 border-0">
      <textarea class="form-control mb-3 border-0 bg-light" rows="4" placeholder="Share your meal review or food photo..."></textarea>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">Trending with #FoodExpress</small>
        <button class="btn btn-warning btn-sm px-3">Post</button>
      </div>
    </div>

    <div class="card card-custom mb-4 border-0 overflow-hidden">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-3">
          <div class="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-3" style="width: 42px; height: 42px; font-weight: 700;">P</div>
          <div>
            <h6 class="mb-0 fw-bold">Praise Chimuanya</h6>
            <small class="text-muted">@praisefoodie</small>
          </div>
        </div>
        <p class="mb-3">The Fish Stew container from FoodExpress is top quality! Highly recommended. 🍲</p>
        <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80" class="img-fluid rounded-4 mb-3" alt="Food review" style="height: 260px; object-fit: cover; width: 100%;">
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-heart me-1"></i> Like</button>
          <button class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-comment me-1"></i> Comment</button>
        </div>
      </div>
    </div>
  </div>
</div>

<?php include 'footer.php'; ?>