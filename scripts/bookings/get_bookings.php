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

// Read and decode JSON from JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json);
$booking_id = isset($data->booking_id) ? $conn->real_escape_string($data->booking_id) : null;

$sql = "SELECT b.booking_id, b.name, b.type, b.client_id, u.name AS client_name,
               b.email, b.phone, b.date_from, b.date_to,
               b.no_of_guests, b.venue, b.theme, b.status, b.budget,
               b.created_at, b.updated_at
        FROM booking b
        INNER JOIN users u ON u.user_id = b.client_id";

if ($booking_id) {
    $sql .= " WHERE b.booking_id = $booking_id";
} else {
    $sql .= " ORDER BY b.created_at DESC";
}

$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $bookings = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode([
            "ok"       => true,
            "empty"    => false,
            "bookings" => $bookings
        ]);
    } else {
        echo json_encode(["ok" => true, "empty" => true, "bookings" => []]);
    }
} else {
    echo json_encode(["ok" => false, "message" => "Query failed: " . $conn->error]);
}

$conn->close();
?>
