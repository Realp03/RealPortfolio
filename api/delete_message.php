<?php
session_start();
require_once "../config/db.php";

if (empty($_SESSION["is_admin"])) {
    die("Unauthorized access.");
}

$id = intval($_POST["id"] ?? 0);

if ($id <= 0) {
    die("Invalid message ID.");
}

$stmt = $conn->prepare("DELETE FROM guestbook_messages WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$stmt->close();
$conn->close();

header("Location: ../admin/dashboard.php");
exit;