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

if (!$data || !isset($data->booking_id)) {
    echo json_encode(["ok" => false, "message" => "Missing booking_id."]);
    exit;
}

$booking_id = (int) $data->booking_id;

// Build dynamic SET clause from provided fields
$allowed = ['name', 'type', 'email', 'phone', 'date_from', 'date_to',
            'no_of_guests', 'venue', 'theme', 'status', 'budget'];
$sets = [];

foreach ($allowed as $field) {
    if (isset($data->$field)) {
        if ($field === 'no_of_guests' || $field === 'booking_id') {
            $sets[] = "$field = " . (int) $data->$field;
        } elseif ($field === 'budget') {
            $sets[] = "$field = " . (float) $data->$field;
        } else {
            $sets[] = "$field = '" . $conn->real_escape_string($data->$field) . "'";
        }
    }
}

if (empty($sets)) {
    echo json_encode(["ok" => false, "message" => "No fields to update."]);
    exit;
}

$sets[] = "updated_at = NOW()";
$sql = "UPDATE booking SET " . implode(', ', $sets) . " WHERE booking_id = $booking_id";
$result = $conn->query($sql);

if ($result) {
    echo json_encode(["ok" => true, "message" => "Booking updated."]);
} else {
    echo json_encode(["ok" => false, "message" => "Update failed: " . $conn->error]);
}

$conn->close();
?>
