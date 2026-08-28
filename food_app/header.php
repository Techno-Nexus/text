<?php require_once 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="FoodExpress is a modern food ordering website with fresh meals, AI recommendations, and secure checkout.">
  <title>FoodExpress | Fresh Meals Delivered Fast</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg: #fff7f0;
      --soft: #fff3e8;
      --card: #ffffff;
      --brand: #ff7a1a;
      --brand-dark: #db5d00;
      --brand-soft: #ffd8b1;
      --dark: #1c1a19;
      --muted: #665f5a;
      --text: #2b2b2b;
      --success: #1ea76d;
      --shadow: 0 20px 40px rgba(35, 24, 18, 0.12);
    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
      background: linear-gradient(180deg, #fffaf6 0%, #fff7ef 40%, #fff 100%);
      color: var(--text);
      overflow-x: hidden;
    }

    a { text-decoration: none; }

    .navbar {
      background: rgba(23, 19, 18, 0.78);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      position: sticky;
      top: 0;
      z-index: 1030;
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffb066 !important;
      letter-spacing: -0.04em;
    }

    .navbar-nav .nav-link {
      color: rgba(255,255,255,0.85) !important;
      font-weight: 600;
      transition: 0.25s ease;
      padding-inline: 0.85rem !important;
    }

    .navbar-nav .nav-link:hover,
    .navbar-nav .nav-link.active {
      color: var(--brand-soft) !important;
    }

    .btn,
    .form-control,
    .form-select,
    .card {
      border-radius: 18px !important;
    }

    .btn-warning,
    .btn-amber {
      background: linear-gradient(135deg, var(--brand) 0%, #ff9e45 100%);
      color: #fff;
      border: none;
      font-weight: 700;
      box-shadow: 0 12px 20px rgba(255, 122, 26, 0.22);
    }

    .btn-warning:hover,
    .btn-amber:hover {
      background: linear-gradient(135deg, var(--brand-dark) 0%, #f07c14 100%);
      color: #fff;
    }

    .btn-outline-light:hover {
      background: rgba(255,255,255,0.14);
    }

    .content-shell {
      padding-top: 1.5rem;
      padding-bottom: 2rem;
    }

    .hero-banner {
      position: relative;
      overflow: hidden;
      border-radius: 32px;
      background: linear-gradient(135deg, rgba(17,17,17,0.74), rgba(28,26,25,0.22)),
                  url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
      min-height: 520px;
      box-shadow: var(--shadow);
      padding: 4rem 3rem;
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
    }

    .hero-banner::before {
      content: "";
      position: absolute;
      inset: -20% auto auto -10%;
      width: 220px;
      height: 220px;
      background: rgba(255, 176, 102, 0.18);
      filter: blur(10px);
      border-radius: 50%;
      animation: floaty 6s ease-in-out infinite;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      color: white;
      max-width: 600px;
    }

    .tag-pill {
      display: inline-flex;
      padding: 0.6rem 1rem;
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      backdrop-filter: blur(8px);
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .hero-title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: -0.06em;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      color: rgba(255,255,255,0.8);
      font-size: 1.15rem;
      margin-bottom: 2rem;
      max-width: 540px;
    }

    .section-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
      margin: 3rem 0 1.5rem;
    }

    .section-heading h3 {
      font-weight: 800;
      letter-spacing: -0.05em;
      margin: 0;
      color: var(--dark);
    }

    .section-heading span {
      color: var(--muted);
      font-weight: 600;
    }

    .feature-card,
    .card-custom,
    .meal-card {
      background: var(--card);
      border: none;
      border-radius: 24px;
      box-shadow: var(--shadow);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .feature-card:hover,
    .meal-card:hover,
    .card-custom:hover {
      transform: translateY(-5px);
      box-shadow: 0 18px 30px rgba(35, 24, 18, 0.15);
    }

    .feature-card {
      padding: 1.8rem 1.2rem;
      text-align: center;
      height: 100%;
    }

    .feature-card .fa-solid,
    .feature-card .fa-brands {
      font-size: 2.2rem;
      margin-bottom: 1rem;
      color: var(--brand);
    }

    .meal-card {
      overflow: hidden;
      border: 1px solid rgba(20,20,20,0.04);
    }

    .meal-image {
      height: 240px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .meal-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255,255,255,0.9);
      color: var(--dark);
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .meal-card-body {
      padding: 1.2rem 1.2rem 1.4rem;
    }

    .meal-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.9rem;
    }

    .meal-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--brand-dark);
    }

    .rating {
      color: #ffb000;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
    }

    .promo-panel {
      background: linear-gradient(135deg, #fff5ed 0%, #fff1d8 100%);
      border-radius: 28px;
      padding: 2rem;
      box-shadow: var(--shadow);
      margin-top: 2.5rem;
    }

    .cart-panel {
      background: linear-gradient(180deg, #fff 0%, #fff8f1 100%);
      border: 1px solid rgba(255,122,26,0.12);
      border-radius: 28px;
      padding: 1.5rem;
      box-shadow: var(--shadow);
      position: sticky;
      top: 88px;
    }

    .list-group-item {
      border: none;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      padding-left: 0;
      padding-right: 0;
      background: transparent;
    }

    .list-group-item:last-child {
      border-bottom: none;
    }

    .toast-card {
      background: #1b1b1b;
      color: #fff;
      border: none;
      border-radius: 18px;
      box-shadow: 0 16px 30px rgba(0,0,0,0.22);
    }

    .footer-shell {
      margin-top: 4rem;
      background: #181312;
      color: rgba(255,255,255,0.85);
      padding-top: 2rem;
    }

    .footer-shell a {
      color: rgba(255,255,255,0.8);
    }

    .footer-shell a:hover {
      color: var(--brand-soft);
    }

    .social-link {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      transition: 0.25s ease;
    }

    .social-link:hover {
      background: rgba(255,122,26,0.16);
      color: #fff;
    }

    .floating-badge {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      color: white;
      padding: 1rem 1.2rem;
      border-radius: 20px;
      backdrop-filter: blur(8px);
      animation: floaty 4s ease-in-out infinite;
    }

    @keyframes floaty {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    @media (max-width: 991.98px) {
      .hero-banner {
        min-height: 440px;
        padding: 3rem 1.5rem;
      }

      .cart-panel {
        position: static;
        margin-top: 1.5rem;
      }
    }

    @media (max-width: 767.98px) {
      .hero-banner {
        min-height: 380px;
      }

      .section-heading {
        display: block;
      }
    }
  </style>
</head>
<body class="d-flex flex-column min-vh-100">

<nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm">
  <div class="container">
    <a class="navbar-brand" href="index.php"><i class="fa-solid fa-utensils me-2"></i>FoodExpress</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" href="index.php">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="dashboard.php">Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="chatbot.php"><i class="fa-solid fa-robot me-1"></i> AI Assistant</a></li>
        <li class="nav-item"><a class="nav-link" href="social.php"><i class="fa-solid fa-users me-1"></i> Foodie Feed</a></li>
        <li class="nav-item"><a class="nav-link" href="support.php"><i class="fa-solid fa-headset me-1"></i> Support</a></li>
      </ul>
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <?php if(isset($_SESSION['user_id'])): ?>
          <li class="nav-item"><a class="nav-link" href="profile.php"><i class="fa-solid fa-user me-1"></i> Profile</a></li>
          <li class="nav-item"><a class="btn btn-outline-light btn-sm ms-2" href="logout.php">Logout</a></li>
        <?php else: ?>
          <li class="nav-item"><a class="nav-link" href="login.php">Login</a></li>
          <li class="nav-item"><a class="btn btn-warning btn-sm ms-2" href="register.php">Register</a></li>
        <?php endif; ?>
      </ul>
    </div>
  </div>
</nav>
<div class="container py-4 flex-grow-1 content-shell">