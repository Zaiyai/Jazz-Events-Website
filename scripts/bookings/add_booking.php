<?php
header("Content-Type: application/json");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

$mail = new PHPMailer(true);

$host = "localhost";
$db_user = "root";
$db_pass = "";     
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "Connected successfully</br>";

// Read and decode JSON from JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json);

$name = $conn->real_escape_string($data->name);
$email = $conn->real_escape_string($data->email);
$phone = $conn->real_escape_string($data->phone_number);
$type = $conn->real_escape_string($data->type);
$client_id = isset($data->client_id) ? (int) $data->client_id : 0;

$client_label = '';
if ($client_id > 0) {
    $cid = $client_id;
    if ($res = $conn->query("SELECT name FROM users WHERE user_id = $cid LIMIT 1")) {
        if ($row = $res->fetch_assoc()) {
            $client_label = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8');
        }
        $res->free();
    }
}

$date_from = $conn->real_escape_string($data->date_from);
$date_to = $conn->real_escape_string($data->date_to);
$no_of_guests = $conn->real_escape_string($data->no_of_guests);
$venue = $conn->real_escape_string($data->venue);
$theme = $conn->real_escape_string($data->theme);
$budget = $conn->real_escape_string($data->budget);

$sql = "INSERT INTO booking 
(name, type, client_id, email, phone, date_from, date_to, no_of_guests, venue, theme, budget) 
VALUES ('$name', '$type', $client_id, '$email', '$phone', '$date_from', '$date_to', '$no_of_guests', '$venue', '$theme', '$budget')";

$today = date("Y-m-d H:i:s");

$booking_details = "<h3>New Booking on Jazz Events Website</h3><br>
<p><strong>Name:</strong> $name<br>
<p><strong>Client account:</strong> " . ($client_label !== '' ? "$client_label (user #$client_id)" : "user #$client_id") . "<br>
<p><strong>Type:</strong> $type<br>
<p><strong>Date From:</strong> $date_from<br>
<p><strong>Date To:</strong> $date_to<br>
<p><strong>Number of Guests:</strong> $no_of_guests<br>
<p><strong>Venue:</strong> $venue<br>
<p><strong>Theme:</strong> $theme<br>
<p><strong>Created at:</strong> $today<br>";

$result = $conn->query($sql);

if ($result) {
    echo json_encode([
        "status"   => "success"
    ]);
} else {
    echo json_encode([
        "status"  => "error"
    ]);
}

try {
    //Server settings
    $mail->SMTPDebug = 1;
    $mail->isSMTP();
    $mail->Host       = 'smtp.mailersend.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'MS_CQfumx@test-q3enl6k3n5742vwr.mlsender.net';
    $mail->Password   = 'mssp.7r4ySxr.3zxk54vx1mpgjy6v.7qg8nO1';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('test@test-q3enl6k3n5742vwr.mlsender.net', 'Jazz Events');
    $mail->addAddress("edrian.albero0@gmail.com");

    //Content
    $mail->isHTML(true);                                 
    $mail->Subject = 'New Booking Submission!';
    $mail->Body    = $booking_details;
    $mail->AltBody = strip_tags($booking_details);

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

$conn->close();

?>