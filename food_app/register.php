<?php
include 'header.php';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if (!$conn) {
        echo "<div class='alert alert-warning'>The database is not connected yet. Please create the database to complete registration.</div>";
    } else {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password);
        if($stmt->execute()){
            echo "<div class='alert alert-success'>Registration successful! <a href='login.php'>Login here</a></div>";
        } else {
            echo "<div class='alert alert-danger'>Error registering account.</div>";
        }
    }
}
?>

<div class="row justify-content-center py-4">
  <div class="col-lg-5 col-md-7">
    <div class="card card-custom p-4 p-md-5 shadow-sm border-0">
      <div class="text-center mb-4">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning-subtle text-warning" style="width:70px; height:70px; font-size: 1.8rem;">
          <i class="fa-solid fa-user-plus"></i>
        </div>
        <h3 class="mt-3 mb-1 fw-bold">Create your account</h3>
        <p class="text-muted mb-0">Start ordering your favorite meals today</p>
      </div>
      <form method="POST" action="register.php">
        <div class="mb-3">
          <label class="form-label fw-semibold">Full Name</label>
          <input type="text" name="name" class="form-control form-control-lg" placeholder="Your full name" required>
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Email Address</label>
          <input type="email" name="email" class="form-control form-control-lg" placeholder="you@example.com" required>
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold">Password</label>
          <input type="password" name="password" class="form-control form-control-lg" placeholder="Create a secure password" required>
        </div>
        <button type="submit" class="btn btn-warning btn-lg w-100 fw-bold">Register</button>
        <p class="text-center mt-3 mb-0 text-muted">Already have an account? <a href="login.php" class="text-warning fw-bold">Sign in</a></p>
      </form>
    </div>
  </div>
</div>

<?php include 'footer.php'; ?>