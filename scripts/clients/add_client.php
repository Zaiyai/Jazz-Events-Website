<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["ok" => false, "message" => "Method not allowed."]);
    exit;
}

$host    = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["ok" => false, "message" => "Database connection failed."]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["ok" => false, "message" => "Invalid JSON payload."]);
    exit;
}

$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$phone    = trim($data['phone'] ?? '');
$bio      = trim($data['bio'] ?? '');

// Validate required fields
if (!$name || !$email || !$password) {
    echo json_encode(["ok" => false, "message" => "Name, email and password are required."]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["ok" => false, "message" => "Invalid email address."]);
    exit;
}

// Check for duplicate email
$checkStmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();
if ($checkStmt->num_rows > 0) {
    echo json_encode(["ok" => false, "message" => "A user with this email already exists."]);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Derive initials from name (e.g. "Santos, Maria R." → "MS")
$parts    = explode(',', $name);
$lastName = trim($parts[0] ?? '');
$firstPart = trim($parts[1] ?? '');
$firstName = explode(' ', $firstPart)[0] ?? '';
$initials = strtoupper(substr($lastName, 0, 1) . substr($firstName, 0, 1));
if (strlen($initials) < 1) $initials = strtoupper(substr($name, 0, 2));

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare(
    "INSERT INTO users (name, initials, email, password, bio, user_type, is_online, is_verified)
     VALUES (?, ?, ?, ?, ?, 'CLIENT', 0, 0)"
);

if (!$stmt) {
    echo json_encode(["ok" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssss", $name, $initials, $email, $hashedPassword, $bio);

if ($stmt->execute()) {
    echo json_encode([
        "ok"      => true,
        "message" => "Client added successfully.",
        "user_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "ok"      => false,
        "message" => "Failed to add client: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
