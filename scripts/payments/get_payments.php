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

$sql = "SELECT p.payment_id, p.invoice_number, p.amount, p.payment_method,
               p.payment_status, p.payment_date, p.due_date, p.reference_number, p.notes,
               p.created_at,
               u.user_id AS client_id, u.name AS client_name, u.initials AS client_initials,
               e.event_id, e.name AS event_name
        FROM payments p
        INNER JOIN users u ON u.user_id = p.client_id
        INNER JOIN events e ON e.event_id = p.event_id
        ORDER BY p.created_at DESC";

$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $payments = mysqli_fetch_all($result, MYSQLI_ASSOC);

        echo json_encode([
            "ok"       => true,
            "empty"    => false,
            "payments" => $payments
        ]);
    } else {
        echo json_encode(["ok" => true, "empty" => true, "payments" => []]);
    }
} else {
    echo json_encode(["ok" => false, "message" => $conn->error]);
}

$conn->close();
?>
