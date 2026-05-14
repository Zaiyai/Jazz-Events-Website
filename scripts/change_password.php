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

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!isset($data->email) || !isset($data->current_password) || !isset($data->new_password)) {
    echo json_encode(["status" => "error", "message" => "Invalid request data."]);
    exit;
}

$email = $conn->real_escape_string($data->email);
$current_password = $data->current_password;
$new_password = $data->new_password;

// Fetch user password
$sql = "SELECT password FROM users WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $hashed_password = $user['password'];

    // Verify current password
    if (password_verify($current_password, $hashed_password)) {
        // Complex password validation (matching register.php)
        // Complex password validation (matching register.js/php logic)
        if (strlen($new_password) < 8) {
            echo json_encode(["status" => "error", "message" => "Must be at least 8 characters."]);
            exit;
        }
        if (!preg_match('/[A-Z]/', $new_password)) {
            echo json_encode(["status" => "error", "message" => "Must contain at least one uppercase letter."]);
            exit;
        }
        if (!preg_match('/[a-z]/', $new_password)) {
            echo json_encode(["status" => "error", "message" => "Must contain at least one lowercase letter."]);
            exit;
        }
        if (!preg_match('/[0-9]/', $new_password)) {
            echo json_encode(["status" => "error", "message" => "Must contain at least one number."]);
            exit;
        }
        if (!preg_match('/[!@#$%^&*()_+{}\[\]:;<>,.?~\\\\\/-]/', $new_password)) {
            echo json_encode(["status" => "error", "message" => "Must contain at least one special character."]);
            exit;
        }

        $new_hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $update_sql = "UPDATE users SET password = '$new_hashed_password' WHERE email = '$email'";

        if ($conn->query($update_sql)) {
            echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update password."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Incorrect current password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found."]);
}

$conn->close();
?>
