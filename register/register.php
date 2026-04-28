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

$sql = "INSERT INTO users (name, email, password, user_type)
VALUES ('$name', '$email', '$password', 'CLIENT')";
$result = $conn->query($sql);

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