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

$event_id = (int)$data->event_id;
$name = $conn->real_escape_string($data->name);
$type = $conn->real_escape_string($data->type);
$no_of_guests = (int)$data->no_of_guests;
$client_id = (int)$data->client_id;
$date = $conn->real_escape_string($data->date);
$venue = $conn->real_escape_string($data->venue);
$theme = $conn->real_escape_string($data->theme);
$status = $conn->real_escape_string($data->status);
$amount = (int)$data->amount;

$sql = "UPDATE events SET name = '$name', type = '$type', no_of_guests = $no_of_guests, client_id = $client_id, date = '$date', venue = '$venue', theme = '$theme', status = '$status', amount = $amount WHERE event_id = $event_id";
$result = $conn->query($sql);

if ($result) {
    echo json_encode([
        "status" => "success", 
        "message" => "Event updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Error updating record: " . $conn->error
    ]);
}

$conn->close();
?>