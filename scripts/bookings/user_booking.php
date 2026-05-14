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

$user_id = (int) $data->user_id;

$stmt = $conn->prepare("SELECT booking_id, name, type, no_of_guests, date_from, date_to, venue, theme, status, budget FROM booking WHERE client_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    if ($result->num_rows > 0) {
        $bookingsArray[] = mysqli_fetch_all($result, MYSQLI_ASSOC);

        echo json_encode([
            "ok"     => true,
            "empty"  => false,
            "bookings" => $bookingsArray
            
        ]);
    } else { echo json_encode([ "ok" => true, "empty" => true ]); }
} else {
    echo json_encode([
        "ok"  => false
    ]);
}

$stmt->close();
$conn->close();
?>