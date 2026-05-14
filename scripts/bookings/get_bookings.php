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

$sql = "SELECT b.booking_id, b.name, b.type, b.client_id, u.name AS client_name,
               b.email, b.phone, b.date_from, b.date_to,
               b.no_of_guests, b.venue, b.theme, b.status, b.budget,
               b.created_at, b.updated_at
        FROM booking b
        INNER JOIN users u ON u.user_id = b.client_id
        ORDER BY b.created_at DESC";

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
