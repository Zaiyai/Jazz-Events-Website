<?php
header("Content-Type: application/json");

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["ok" => false, "message" => "Method not allowed."]);
    exit;
}

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["ok" => false, "message" => "Database connection failed."]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["ok" => false, "message" => "Invalid JSON payload."]);
    exit;
}

$event_id = $data['event_id'] ?? null;
$client_id = $data['client_id'] ?? null;
$invoice_number = $data['invoice_number'] ?? null;
$amount = $data['amount'] ?? null;
$payment_method = $data['payment_method'] ?? null;
$payment_status = $data['payment_status'] ?? 'PENDING';
$payment_date = !empty($data['payment_date']) ? $data['payment_date'] : null;
$due_date = $data['due_date'] ?? null;
$reference_number = !empty($data['reference_number']) ? $data['reference_number'] : null;
$notes = !empty($data['notes']) ? $data['notes'] : null;

// Validate required fields
if (!$event_id || !$client_id || !$invoice_number || !$amount || !$payment_method || !$due_date) {
    echo json_encode(["ok" => false, "message" => "Missing required fields."]);
    exit;
}

// Prepare statement
$stmt = $conn->prepare("INSERT INTO payments (event_id, client_id, invoice_number, amount, payment_method, payment_status, payment_date, due_date, reference_number, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["ok" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("iissssssss", 
    $event_id, 
    $client_id, 
    $invoice_number, 
    $amount, 
    $payment_method, 
    $payment_status, 
    $payment_date, 
    $due_date, 
    $reference_number, 
    $notes
);

if ($stmt->execute()) {
    echo json_encode([
        "ok" => true,
        "message" => "Payment recorded successfully",
        "payment_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "message" => "Failed to record payment: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
