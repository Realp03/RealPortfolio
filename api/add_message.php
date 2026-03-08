<?php
header("Content-Type: application/json");
require_once "../config/db.php";

$name = trim($_POST["name"] ?? "");
$message = trim($_POST["message"] ?? "");
$isAnonymous = isset($_POST["anonymous"]) ? 1 : 0;

if ($message === "") {
    echo json_encode([
        "success" => false,
        "message" => "Message is required."
    ]);
    exit;
}

if (mb_strlen($name) > 100) {
    $name = mb_substr($name, 0, 100);
}

if (mb_strlen($message) > 1000) {
    $message = mb_substr($message, 0, 1000);
}

$stmt = $conn->prepare("INSERT INTO guestbook_messages (display_name, message, is_anonymous) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $name, $message, $isAnonymous);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Message sent successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to save message."
    ]);
}

$stmt->close();
$conn->close();
exit;