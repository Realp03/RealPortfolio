<?php
session_start();
require_once "../config/db.php";

if (empty($_SESSION["is_admin"])) {
    header("Location: login.php");
    exit;
}

$result = $conn->query("SELECT id, display_name, message, is_anonymous, created_at FROM guestbook_messages ORDER BY created_at DESC");
$messages = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Guestbook Admin</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0b1220;
      color: #fff;
      padding: 24px;
    }

    .wrap {
      max-width: 1100px;
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    h1 {
      margin: 0;
    }

    .logout {
      text-decoration: none;
      color: #fff;
      background: #ef4444;
      padding: 12px 18px;
      border-radius: 999px;
      font-weight: 700;
    }

    .grid {
      display: grid;
      gap: 16px;
    }

    .card {
      background: #111b31;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 18px;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 14px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .name {
      font-weight: 700;
      font-size: 18px;
    }

    .meta {
      color: #b8c7e6;
      font-size: 14px;
      margin-top: 6px;
    }

    .message {
      margin: 12px 0;
      line-height: 1.7;
      color: #e5edff;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      border: 0;
      border-radius: 999px;
      padding: 10px 16px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-delete {
      background: #ef4444;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="topbar">
      <h1>Guestbook Admin Panel</h1>
      <a href="logout.php" class="logout">Logout</a>
    </div>

    <div class="grid">
      <?php foreach ($messages as $msg): ?>
        <div class="card">
          <div class="card-top">
            <div>
              <div class="name">
                <?php
                  echo htmlspecialchars(
                    ((int)$msg["is_anonymous"] === 1 ? "Anonymous" : ($msg["display_name"] !== "" ? $msg["display_name"] : "Guest")),
                    ENT_QUOTES,
                    "UTF-8"
                  );
                ?>
              </div>
              <div class="meta"><?php echo htmlspecialchars($msg["created_at"], ENT_QUOTES, "UTF-8"); ?></div>
            </div>

            <div class="actions">
              <form method="POST" action="../api/delete_message.php" onsubmit="return confirm('Delete this message permanently?');">
                <input type="hidden" name="id" value="<?php echo (int)$msg["id"]; ?>">
                <button type="submit" class="btn btn-delete">Delete</button>
              </form>
            </div>
          </div>

          <div class="message"><?php echo htmlspecialchars($msg["message"], ENT_QUOTES, "UTF-8"); ?></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</body>
</html>