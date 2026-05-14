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

$name = $data->name;
$type = $data->type;
$no_of_guests = (int)$data->no_of_guests;
$client_id = (int)$data->client_id;
$date = $data->date;
$venue = $data->venue;
$theme = $data->theme;
$status = $data->status;
$amount = (int)$data->amount;

$celebrantRaw = isset($data->celebrant) && $data->celebrant !== '' ? $data->celebrant : $data->name;
$celebrant = substr($celebrantRaw, 0, 100);
$created_by = isset($data->created_by) ? $data->created_by : 'Admin';

$stmt = $conn->prepare("INSERT INTO events (name, type, no_of_guests, celebrant, client_id, date, venue, theme, status, amount, created_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssisssssis", $name, $type, $no_of_guests, $celebrant, $client_id, $date, $venue, $theme, $status, $amount, $created_by);
$result = $stmt->execute();

if ($result) {
    echo json_encode([
        "status"   => "success"
    ]);
} else {
    echo json_encode([
        "status"  => "error"
    ]);
}

$stmt->close();
$conn->close();
?>