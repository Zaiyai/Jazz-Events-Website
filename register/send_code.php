<?php
header("Content-Type: application/json");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {

    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed."
    ]);

    exit;
}

function sendVerificationCode($recipientEmail, $recipientName, $code)
{
    $mail = new PHPMailer(true);

    try {

        $mail->isSMTP();
        $mail->Host       = 'smtp.mailersend.net';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'MS_CQfumx@test-q3enl6k3n5742vwr.mlsender.net';
        $mail->Password   = 'mssp.7r4ySxr.3zxk54vx1mpgjy6v.7qg8nO1';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('test@test-q3enl6k3n5742vwr.mlsender.net', 'Jazz Events');
        $mail->addAddress($recipientEmail, $recipientName);

        $mail->isHTML(true);

        $mail->Subject = 'Email Verification';

        $mail->Body = "
            <h2>Email Verification</h2>

            <p>Hello <b>$recipientName</b>,</p>

            <p>Your verification code is:</p>

            <h1>$code</h1>
        ";

        return $mail->send();

    } catch (Exception $e) {

        return $mail->ErrorInfo;
    }
}

$json = file_get_contents("php://input");
$data = json_decode($json);

$name = trim($data->name ?? '');
$email = trim($data->email ?? '');

if (
    empty($name) ||
    empty($email)
) {

    echo json_encode([
        "status" => "error",
        "message" => "All fields are required."
    ]);

    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        "status" => "error",
        "message" => "Invalid email format."
    ]);

    exit;
}

$email = $conn->real_escape_string($email);

$checkSQL = "
    SELECT email
    FROM users
    WHERE email = '$email'
";

$result = $conn->query($checkSQL);

if ($result->num_rows > 0) {

    echo json_encode([
        "status" => "error",
        "message" => "Email already taken."
    ]);

    exit;
}

$verificationCode = rand(100000, 999999);

$name = $conn->real_escape_string($name);

$insertSQL = "
    INSERT INTO users (
        name,
        email,
        verification_code,
        is_verified
    )
    VALUES (
        '$name',
        '$email',
        '$verificationCode',
        0
    )
";

if ($conn->query($insertSQL)) {

    $sent = sendVerificationCode(
        $email,
        $name,
        $verificationCode
    );

    if ($sent === true) {

        echo json_encode([
            "status" => "success",
            "message" => "Verification code sent."
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => $sent
        ]);
    }

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Registration failed."
    ]);
}

$conn->close();
?>