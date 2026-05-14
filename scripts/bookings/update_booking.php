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
$types = "";
$values = [];

foreach ($allowed as $field) {
    if (isset($data->$field)) {
        if ($field === 'no_of_guests' || $field === 'booking_id') {
            $sets[] = "$field = ?";
            $types .= "i";
            $values[] = (int) $data->$field;
        } elseif ($field === 'budget') {
            $sets[] = "$field = ?";
            $types .= "d";
            $values[] = (float) $data->$field;
        } else {
            $sets[] = "$field = ?";
            $types .= "s";
            $values[] = $data->$field;
        }
    }
}

if (empty($sets)) {
    echo json_encode(["ok" => false, "message" => "No fields to update."]);
    exit;
}

$sets[] = "updated_at = NOW()";

// Add booking_id for WHERE clause
$types .= "i";
$values[] = $booking_id;

$sql = "UPDATE booking SET " . implode(', ', $sets) . " WHERE booking_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$values);
$result = $stmt->execute();

if ($result) {
    echo json_encode(["ok" => true, "message" => "Booking updated."]);
} else {
    echo json_encode(["ok" => false, "message" => "Update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
