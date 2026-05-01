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

$sql = "SELECT event_id, name, type, no_of_guests, client_name, date, venue, amount status FROM events";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $eventsArray[] = mysqli_fetch_all($result, MYSQLI_ASSOC);

        echo json_encode([
            "ok"     => true,
            "empty"  => false,
            "events" => $eventsArray
            
        ]);
    } else { echo json_encode([ "ok" => true, "empty" => true ]); }
} else {
    echo json_encode([
        "ok"  => false
    ]);
}

$conn->close();
?>