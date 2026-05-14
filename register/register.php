<?php
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

$json = file_get_contents("php://input");
$data = json_decode($json);

$email = $data->email;
$code = $data->code;
$password = $data->password;

if (strlen($password) < 8 || 
    !preg_match('/[A-Z]/', $password) || 
    !preg_match('/[a-z]/', $password) || 
    !preg_match('/[0-9]/', $password) || 
    !preg_match('/[!@#$%^&*()_+{}\[\]:;<>,.?~\\\\\/-]/', $password)) {
    echo json_encode([
        "status" => "error",
        "message" => "Password does not meet complexity requirements."
    ]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if email is already verified
$checkStmt = $conn->prepare("SELECT email FROM users WHERE email = ? AND is_verified = 1");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already taken."
    ]);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Verify the code matches
$verifyStmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND verification_code = ?");
$verifyStmt->bind_param("ss", $email, $code);
$verifyStmt->execute();
$result = $verifyStmt->get_result();

if ($result->num_rows > 0) {

    $verifyStmt->close();

    $updateStmt = $conn->prepare("UPDATE users SET is_verified = 1, password = ? WHERE email = ?");
    $updateStmt->bind_param("ss", $hashed_password, $email);
    $updateStmt->execute();
    $updateStmt->close();

    echo json_encode([
        "status" => "success",
        "message"  => "Account successfully created!",
        "redirect" => "../home.html"
    ]);

} else {
    $verifyStmt->close();
    echo json_encode([
        "status" => "error",
        "message" => "Mismatched verification code."
    ]);
}

$conn->close();
?>