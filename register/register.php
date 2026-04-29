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

$name = $conn->real_escape_string($data->name);
$email = $conn->real_escape_string($data->email);
$password = $conn->real_escape_string($data->password);

$validateEmailSQL = "SELECT email FROM users WHERE email = '$email'";
$result = $conn->query($validateEmailSQL);

// If email already registered
if ($result->num_rows > 0) {
    echo json_encode([
        "status"  => "error",
        "message" => "Email already taken."
    ]);
    exit;
}

$insertSQL = "INSERT INTO users (name, email, password, user_type)
VALUES ('$name', '$email', '$password', 'CLIENT')";
$result = $conn->query($insertSQL);

if ($result) {
    echo json_encode([
        "status"   => "success",
        "message"  => "Account successfully created!",
        "redirect" => "../home.html"
    ]);
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "Something went wrong."
    ]);
}

$conn->close();
?>