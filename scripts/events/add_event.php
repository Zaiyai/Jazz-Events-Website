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
$type = $conn->real_escape_string($data->type);
$no_of_guests = $conn->real_escape_string($data->no_of_guests);
$client_name = $conn->real_escape_string($data->client_name);
$date = $conn->real_escape_string($data->date);
$venue = $conn->real_escape_string($data->venue);
$theme = $conn->real_escape_string($data->theme);
$status = $conn->real_escape_string($data->status);
$amount = $conn->real_escape_string($data->amount);

$sql = "INSERT INTO events (name, type, no_of_guests, client_name, date, venue, theme, status, amount)
VALUES ('$name', '$type', '$no_of_guests', '$client_name', '$date', '$venue', '$theme', '$status', '$amount')";
$result = $conn->query($sql);

if ($result) {
    echo json_encode([
        "status"   => "success"
    ]);
} else {
    echo json_encode([
        "status"  => "error"
    ]);
}

$conn->close();
?>