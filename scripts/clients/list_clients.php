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

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || empty($data->email)) {
    echo json_encode(["ok" => false, "message" => "Email required."]);
    $conn->close();
    exit;
}

$email = $conn->real_escape_string($data->email);
$adminSql = "SELECT user_id, user_type FROM users WHERE email = '$email' LIMIT 1";
$adminRes = $conn->query($adminSql);

if (!$adminRes || $adminRes->num_rows === 0) {
    echo json_encode(["ok" => false, "message" => "Unauthorized."]);
    $conn->close();
    exit;
}

$admin = $adminRes->fetch_assoc();
if ($admin["user_type"] !== "ADMIN") {
    echo json_encode(["ok" => false, "message" => "Forbidden."]);
    $conn->close();
    exit;
}

$sql = "SELECT user_id, name FROM users WHERE user_type = 'CLIENT' ORDER BY name ASC";
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
