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
$name = $data->name;
$type = $data->type;
$no_of_guests = (int)$data->no_of_guests;
$client_id = (int)$data->client_id;
$date = $data->date;
$venue = $data->venue;
$theme = $data->theme;
$status = $data->status;
$amount = (int)$data->amount;

$stmt = $conn->prepare("UPDATE events SET name = ?, type = ?, no_of_guests = ?, client_id = ?, date = ?, venue = ?, theme = ?, status = ?, amount = ? WHERE event_id = ?");
$stmt->bind_param("ssiissssii", $name, $type, $no_of_guests, $client_id, $date, $venue, $theme, $status, $amount, $event_id);
$result = $stmt->execute();

if ($result) {
    echo json_encode([
        "status" => "success", 
        "message" => "Event updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Error updating record: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>