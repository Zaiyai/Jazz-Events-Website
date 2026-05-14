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
    $env = parse_ini_file(__DIR__ . '/../.env');
    $mail = new PHPMailer(true);

    try {

        $mail->isSMTP();
        $mail->Host       = $env['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $env['SMTP_USERNAME'];
        $mail->Password   = $env['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $env['SMTP_PORT'];

        // Recipients
        $mail->setFrom('edrian.albero0@gmail.com', 'Jazz Events');
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

if (empty($email)) {

    echo json_encode([
        "status" => "error",
        "message" => "Email is required."
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

// Check if email already exists
$checkStmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
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

$verificationCode = rand(100000, 999999);

// Insert new user
$insertStmt = $conn->prepare("
    INSERT INTO users (
        name,
        email,
        user_type,
        verification_code,
        is_verified
    )
    VALUES (?, ?, 'CLIENT', ?, 0)
");
$insertStmt->bind_param("sss", $name, $email, $verificationCode);

if ($insertStmt->execute()) {

    $insertStmt->close();

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

    $insertStmt->close();

    echo json_encode([
        "status" => "error",
        "message" => "Registration failed."
    ]);
}

$conn->close();
?>