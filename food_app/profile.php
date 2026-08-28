<?php 
include 'header.php'; 
if(!isset($_SESSION['user_id'])) { header("Location: login.php"); exit; }
?>

<div class="row justify-content-center py-3">
  <div class="col-lg-6">
    <div class="card card-custom p-4 p-md-5 border-0">
      <div class="d-flex align-items-center mb-4">
        <div class="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-3" style="width: 62px; height: 62px; font-weight: 700; font-size: 1.3rem;">
          <?php echo strtoupper(substr(htmlspecialchars($_SESSION['user_name']), 0, 1)); ?>
        </div>
        <div>
          <p class="text-uppercase text-warning fw-bold mb-1" style="letter-spacing:0.12em; font-size:0.7rem;">Profile</p>
          <h3 class="mb-0 fw-bold"><?php echo htmlspecialchars($_SESSION['user_name']); ?></h3>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6">
          <div class="feature-card text-start h-100">
            <i class="fa-solid fa-user"></i>
            <p class="text-muted mb-1">Full name</p>
            <h6 class="mb-0"><?php echo htmlspecialchars($_SESSION['user_name']); ?></h6>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="feature-card text-start h-100">
            <i class="fa-solid fa-id-card"></i>
            <p class="text-muted mb-1">User ID</p>
            <h6 class="mb-0">#<?php echo $_SESSION['user_id']; ?></h6>
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-outline-dark">Edit address</button>
        <button class="btn btn-outline-danger">Change password</button>
      </div>
    </div>
  </div>
</div>

<?php include 'footer.php'; ?>