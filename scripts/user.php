<?php
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}

// Read and decode JSON from JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json);

$email = $conn->real_escape_string($data->email);

// Look up the user by email
$sql = "SELECT user_id, email, name, initials, profile_picture, bio FROM users WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "status"          => "success",
        "user_id"         => $row["user_id"],
        "email"           => $row["email"],
        "name"            => $row["name"],
        "initials"        => $row["initials"],
        "profile_picture" => $row["profile_picture"],
        "bio"             => $row["bio"],
    ]);
} else {
    echo json_encode([
        "status"  => "error"
    ]);
}

$conn->close();
?>