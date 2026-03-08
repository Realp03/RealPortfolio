<?php
session_start();
require_once "../config/db.php";

if (!empty($_SESSION["is_admin"])) {
    header("Location: dashboard.php");
    exit;
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"] ?? "");
    $password = trim($_POST["password"] ?? "");

    $stmt = $conn->prepare("SELECT id, username, password FROM admins WHERE username = ? LIMIT 1");
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    if ($admin && password_verify($password, $admin["password"])) {
        $_SESSION["is_admin"] = true;
        $_SESSION["admin_id"] = (int)$admin["id"];
        $_SESSION["admin_username"] = $admin["username"];

        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid username or password.";
    }

    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0b1220;
      color: #fff;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: #111b31;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }

    h1 {
      margin: 0 0 10px;
      font-size: 28px;
    }

    p {
      margin: 0 0 20px;
      color: #b8c7e6;
    }

    .error {
      margin-bottom: 14px;
      color: #f87171;
      font-size: 14px;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 14px;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.1);
      background: #0a1428;
      color: #fff;
      outline: none;
    }

    button {
      width: 100%;
      border: 0;
      border-radius: 999px;
      padding: 14px 18px;
      font-weight: 700;
      cursor: pointer;
      color: #fff;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
    }
  </style>
</head>
<body>
  <form method="POST" class="login-card">
    <h1>Admin Login</h1>
    <p>Sign in to manage guestbook messages.</p>

    <?php if ($error !== ""): ?>
      <div class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, "UTF-8"); ?></div>
    <?php endif; ?>

    <input type="text" name="username" placeholder="Username" required autocomplete="username" />
    <input type="password" name="password" placeholder="Password" required autocomplete="current-password" />
    <button type="submit">Login</button>
  </form>
</body>
</html>