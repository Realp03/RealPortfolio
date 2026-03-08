<?php
header("Content-Type: application/json");
require_once "../config/db.php";

$sql = "SELECT id, display_name, message, is_anonymous, created_at
        FROM guestbook_messages
        ORDER BY created_at DESC";

$result = $conn->query($sql);

$messages = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            "id" => (int)$row["id"],
            "display_name" => $row["display_name"],
            "message" => $row["message"],
            "is_anonymous" => (int)$row["is_anonymous"],
            "created_at" => $row["created_at"]
        ];
    }
}

echo json_encode($messages);
$conn->close();