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

$sql = "SELECT e.event_id, e.name, e.type, e.no_of_guests, e.client_id, u.name AS client_name, e.date, e.venue, e.theme, e.status, e.amount
        FROM events e
        INNER JOIN users u ON u.user_id = e.client_id";
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