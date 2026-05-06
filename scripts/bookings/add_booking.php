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
$type = $conn->real_escape_string($data->type);
$client_id = $conn->real_escape_string($data->client_id);
$client_name = $conn->real_escape_string($data->client_name);
$date_from = $conn->real_escape_string($data->date_from);
$date_to = $conn->real_escape_string($data->date_to);
$no_of_guests = $conn->real_escape_string($data->no_of_guests);
$venue = $conn->real_escape_string($data->venue);
$theme = $conn->real_escape_string($data->theme);
$budget = $conn->real_escape_string($data->budget);
$personal_request = $conn->real_escape_string($data->personal_request);
$user_confirmation_token = bin2hex(random_bytes(16));

$confirmBookingLink = 'http://localhost/jazz%20events%20website/scripts/bookings/booking_confirmation.php?action=confirm&user_confirmation_token=' . $user_confirmation_token;
$cancelBookingLink  = 'http://localhost/jazz%20events%20website/scripts/bookings/booking_confirmation.php?action=cancel&user_confirmation_token=' . $user_confirmation_token;

$email_confirmation_body = "<h3>Confirm Jazz Event booking details:</h3><br>
<p><strong>Name:</strong> $name<br>
<p><strong>Type:</strong> $type<br>
<p><strong>Date From:</strong> $date_from<br>
<p><strong>Date To:</strong> $date_to<br>
<p><strong>Number of Guests:</strong> $no_of_guests<br>
<p><strong>Venue:</strong> $venue<br>
<p><strong>Theme:</strong> $theme<br>
<p><strong>Personal Request:</strong> $personal_request<br>
<p>Is this Information Correct?</p>
    <a href=" . $confirmBookingLink . " style='padding: 10px; background: green; color: white;'>Yes</a>
    <a href=" . $cancelBookingLink  . " style='padding: 10px; background: red; color: white;'>No</a>
";

$sql = "INSERT INTO booking 
(name, type, client_id, client_name, email, date_from, date_to, no_of_guests, venue, theme, budget, personal_request, user_confirmation_token) 
VALUES ('$name', '$type', '$client_id', '$client_name', '$email', '$date_from', '$date_to', '$no_of_guests', '$venue', '$theme', '$budget', '$personal_request', '$user_confirmation_token')";

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
    $mail->addAddress($email);

    //Content
    $mail->isHTML(true);                                 
    $mail->Subject = 'Confirm Booking Details';
    $mail->Body    = $email_confirmation_body;
    $mail->AltBody = strip_tags($email_confirmation_body);

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

$conn->close();

?>