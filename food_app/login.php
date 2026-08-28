<?php
include 'header.php';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if (!$conn) {
        echo "<div class='alert alert-warning'>The database is not configured yet. Please set up the food_app_db database first.</div>";
    } else {
        $email = $_POST['email'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if($row = $result->fetch_assoc()){
            if(password_verify($password, $row['password'])){
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_name'] = $row['name'];
                header("Location: dashboard.php");
                exit;
            }
        }
        echo "<div class='alert alert-danger'>Invalid credentials!</div>";
    }
}
?>

<div class="row justify-content-center py-4">
  <div class="col-lg-5 col-md-7">
    <div class="card card-custom p-4 p-md-5 shadow-sm border-0">
      <div class="text-center mb-4">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning-subtle text-warning" style="width:70px; height:70px; font-size: 1.8rem;">
          <i class="fa-solid fa-user"></i>
        </div>
        <h3 class="mt-3 mb-1 fw-bold">Welcome back</h3>
        <p class="text-muted mb-0">Sign in to continue your food order</p>
      </div>
      <form method="POST" action="login.php">
        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input type="email" name="email" class="form-control form-control-lg" placeholder="you@example.com" required>
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold">Password</label>
          <input type="password" name="password" class="form-control form-control-lg" placeholder="Enter password" required>
        </div>
        <button type="submit" class="btn btn-warning btn-lg w-100 fw-bold">Login</button>
        <p class="text-center mt-3 mb-0 text-muted">Need an account? <a href="register.php" class="text-warning fw-bold">Create one</a></p>
      </form>
    </div>
  </div>
</div>

<?php include 'footer.php'; ?>