<?php
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["ok" => false, "message" => "Database connection failed."]);
    exit;
}

$sql = "SELECT user_id, name, email, profile_picture FROM users WHERE user_type = 'CLIENT' ORDER BY name ASC";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["ok" => false, "message" => $conn->error]);
    $conn->close();
    exit;
}

$clients = [];
while ($row = $result->fetch_assoc()) {
    $clients[] = $row;
}

echo json_encode([
    "ok" => true,
    "clients" => $clients,
]);

$conn->close();
