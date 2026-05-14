<?php
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

$json = file_get_contents("php://input");
$data = json_decode($json);

$email = $conn->real_escape_string($data->email);
$code = $conn->real_escape_string($data->code);
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

$checkSQL = "
    SELECT email
    FROM users
    WHERE email = '$email' AND is_verified = 1
";

$result = $conn->query($checkSQL);

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already taken."
    ]);
    exit;
}

$sql = "
    SELECT *
    FROM users
    WHERE email = '$email'
    AND verification_code = '$code'
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {

    $updateSQL = "
        UPDATE users
        SET is_verified = 1, password = '$hashed_password'
        WHERE email = '$email'
    ";

    $conn->query($updateSQL);

    echo json_encode([
        "status" => "success",
        "message"  => "Account successfully created!",
        "redirect" => "../home.html"
    ]);

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Mismatched verification code."
    ]);
}
?>