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

$email = $conn->real_escape_string($data->email);

// Check if this is an update request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data->name) || isset($data->bio)) {
    // UPDATE request - update user profile fields
    
    // Validate email exists
    $checkSql = "SELECT user_id FROM users WHERE email = '$email' LIMIT 1";
    $checkResult = $conn->query($checkSql);
    
    if (!$checkResult || $checkResult->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "User not found."]);
        $conn->close();
        exit;
    }
    
    $user = $checkResult->fetch_assoc();
    $user_id = $user['user_id'];
    
    // Build update query
    $updates = [];
    $params = [];
    
    if (isset($data->name) && !empty($data->name)) {
        $name = $conn->real_escape_string($data->name);
        $updates[] = "name = '$name'";
    }
    
    if (isset($data->email) && !empty($data->email) && $data->email !== $email) {
        // Check if new email already exists
        $newEmail = $conn->real_escape_string($data->email);
        $emailCheck = $conn->query("SELECT user_id FROM users WHERE email = '$newEmail' AND user_id != $user_id LIMIT 1");
        
        if ($emailCheck && $emailCheck->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Email already in use."]);
            $conn->close();
            exit;
        }
        
        $updates[] = "email = '$newEmail'";
    }
    
    if (isset($data->bio)) {
        $bio = $conn->real_escape_string($data->bio);
        $updates[] = "bio = '$bio'";
    }
    
    if (empty($updates)) {
        echo json_encode(["status" => "error", "message" => "No valid fields to update."]);
        $conn->close();
        exit;
    }
    
    $updateSql = "UPDATE users SET " . implode(", ", $updates) . " WHERE user_id = $user_id";
    
    if ($conn->query($updateSql)) {
        echo json_encode([
            "status" => "success",
            "message" => "Profile updated successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update profile: " . $conn->error
        ]);
    }
} else {
    // GET request - retrieve user data
    
    // Look up the user by email
    $sql = "SELECT user_id, email, name, initials, profile_picture, bio FROM users WHERE email = '$email' LIMIT 1";
    $result = $conn->query($sql);

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
}

$conn->close();
?>