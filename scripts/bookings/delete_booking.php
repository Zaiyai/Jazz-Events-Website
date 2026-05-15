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
$booking_id = isset($data->booking_id) ? (int)$data->booking_id : null;

if (!$booking_id) {
    echo json_encode(["ok" => false, "message" => "No booking ID provided."]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM booking WHERE booking_id = ?");
$stmt->bind_param("i", $booking_id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "message" => "Booking deleted."]);
} else {
    echo json_encode(["ok" => false, "message" => "Failed to delete booking."]);
}

$stmt->close();
$conn->close();
?>
