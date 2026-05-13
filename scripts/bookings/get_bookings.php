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

// Fetch all bookings with their dates
$sql = "SELECT booking_id, date_from, date_to, status FROM booking WHERE status IN ('PENDING', 'CONFIRMED', 'PLANNING')";
$result = $conn->query($sql);

if ($result) {
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    
    echo json_encode([
        "ok" => true,
        "bookings" => $bookings
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "message" => "Query failed: " . $conn->error
    ]);
}

$conn->close();
?>
