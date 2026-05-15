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

$conn->begin_transaction();

try {
    // Get booking data
    $stmt = $conn->prepare("SELECT b.*, u.name AS client_name FROM booking b INNER JOIN users u ON u.user_id = b.client_id WHERE b.booking_id = ?");
    $stmt->bind_param("i", $booking_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Booking not found.");
    }
    
    $booking = $result->fetch_assoc();
    $stmt->close();
    
    // Insert into events
    $name = $booking['name'];
    $type = $booking['type'];
    $no_of_guests = $booking['no_of_guests'];
    $celebrant = $booking['client_name'];
    $client_id = $booking['client_id'];
    $date = $booking['date_from'];
    $venue = $booking['venue'];
    $theme = $booking['theme'];
    $status = 'PLANNING';
    $amount = $booking['budget'] ? $booking['budget'] : 0;
    $created_by = 'Admin';
    
    $stmt2 = $conn->prepare("INSERT INTO events (name, type, no_of_guests, celebrant, client_id, date, venue, theme, status, amount, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt2->bind_param("ssissssssis", $name, $type, $no_of_guests, $celebrant, $client_id, $date, $venue, $theme, $status, $amount, $created_by);
    
    if (!$stmt2->execute()) {
        throw new Exception("Failed to create event.");
    }
    $stmt2->close();
    
    // Delete from bookings
    $stmt3 = $conn->prepare("DELETE FROM booking WHERE booking_id = ?");
    $stmt3->bind_param("i", $booking_id);
    
    if (!$stmt3->execute()) {
        throw new Exception("Failed to delete booking.");
    }
    $stmt3->close();
    
    $conn->commit();
    echo json_encode(["ok" => true, "message" => "Booking accepted and converted to event."]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["ok" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
