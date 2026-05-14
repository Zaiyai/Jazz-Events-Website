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

$email = $data->email;

// Check if this is an update request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data->name) || isset($data->bio)) {
    // UPDATE request - update user profile fields
    
    // Validate email exists
    $checkStmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? LIMIT 1");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if (!$checkResult || $checkResult->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "User not found."]);
        $checkStmt->close();
        $conn->close();
        exit;
    }
    
    $user = $checkResult->fetch_assoc();
    $user_id = $user['user_id'];
    $checkStmt->close();
    
    // Build update query dynamically with prepared statements
    $updates = [];
    $types = "";
    $values = [];
    
    if (isset($data->name) && !empty($data->name)) {
        $updates[] = "name = ?";
        $types .= "s";
        $values[] = $data->name;
    }
    
    if (isset($data->email) && !empty($data->email) && $data->email !== $email) {
        // Check if new email already exists
        $emailCheckStmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? AND user_id != ? LIMIT 1");
        $newEmail = $data->email;
        $emailCheckStmt->bind_param("si", $newEmail, $user_id);
        $emailCheckStmt->execute();
        $emailCheckStmt->store_result();
        
        if ($emailCheckStmt->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Email already in use."]);
            $emailCheckStmt->close();
            $conn->close();
            exit;
        }
        $emailCheckStmt->close();
        
        $updates[] = "email = ?";
        $types .= "s";
        $values[] = $newEmail;
    }
    
    if (isset($data->bio)) {
        $updates[] = "bio = ?";
        $types .= "s";
        $values[] = $data->bio;
    }
    
    if (empty($updates)) {
        echo json_encode(["status" => "error", "message" => "No valid fields to update."]);
        $conn->close();
        exit;
    }
    
    // Add user_id to WHERE clause
    $types .= "i";
    $values[] = $user_id;
    
    $updateSql = "UPDATE users SET " . implode(", ", $updates) . " WHERE user_id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param($types, ...$values);
    
    if ($updateStmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Profile updated successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update profile: " . $updateStmt->error
        ]);
    }
    $updateStmt->close();
} else {
    // GET request - retrieve user data
    
    // Look up the user by email
    $stmt = $conn->prepare("SELECT user_id, email, name, initials, profile_picture, bio FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "status"          => "success",
            "user_id"         => $row["user_id"],
            "email"           => $row["email"],
            "name"            => $row["name"],
            "initials"        => $row["initials"],
            "profile_picture" => $row["profile_picture"],
            "bio"             => $row["bio"],
        ]);
    } else {
        echo json_encode([
            "status"  => "error"
        ]);
    }
    $stmt->close();
}

$conn->close();
?>