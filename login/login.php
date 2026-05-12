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
$raw_password = $conn->real_escape_string($data->password);
$hashed_password = password_hash($raw_password, PASSWORD_DEFAULT);

// Look up the user by email
$sql = "SELECT user_id, email, user_type FROM users WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows === 1) {
    // Matching Password
    if (password_verify($raw_password, $hashed_password)) {
        $row = $result->fetch_assoc();
        $user_type = $row["user_type"];
        if ($user_type == "CLIENT") {
            echo json_encode([
                "status"   => "success",
                "message"  => "Login successful!",
                "user_type"=> $user_type
                ]);
        } else {
            echo json_encode([
                "status"   => "success",
                "message"  => "Login successful!",
                "user_type"=> $user_type,
                "redirect" => "dashboard/dashboard.html"
            ]);
        }
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Email and Password do not match."
        ]);
    }
} else { 
    echo json_encode([
        "status"  => "error",
        "message" => "No Account Found with this email."
    ]);
}

$conn->close();
?>