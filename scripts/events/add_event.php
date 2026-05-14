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
$no_of_guests = (int)$data->no_of_guests;
$client_id = (int)$data->client_id;
$date = $conn->real_escape_string($data->date);
$venue = $conn->real_escape_string($data->venue);
$theme = $conn->real_escape_string($data->theme);
$status = $conn->real_escape_string($data->status);
$amount = (int)$data->amount;

$celebrantRaw = isset($data->celebrant) && $data->celebrant !== '' ? $data->celebrant : $data->name;
$celebrant = $conn->real_escape_string(substr($celebrantRaw, 0, 100));
$created_by = $conn->real_escape_string(isset($data->created_by) ? $data->created_by : 'Admin');

$sql = "INSERT INTO events (name, type, no_of_guests, celebrant, client_id, date, venue, theme, status, amount, created_by)
VALUES ('$name', '$type', $no_of_guests, '$celebrant', $client_id, '$date', '$venue', '$theme', '$status', $amount, '$created_by')";
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