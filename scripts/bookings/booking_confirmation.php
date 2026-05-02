<?php
header("Content-Type: application/json");
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

// Read and decode JSON from JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json);

$email = ($data->email);
$name = ($data->name);
$type = ($data->type);
$date_from = $data->date_from;
$date_to = $data->date_to;
$no_of_guests = ($data->no_of_guests);
$venue = ($data->venue);
$theme = ($data->theme);
$status = ($data->status);
$budget = ($data->budget);
$personal_request = ($data->personal_request);

$body = "<h3>Confirm Jazz Event booking details:</h3><br>
<p><strong>Name:</strong> $name<br>
<p><strong>Type:</strong> $type<br>
<p><strong>Date From:</strong> $date_from<br>
<p><strong>Date To:</strong> $date_to<br>
<p><strong>Number of Guests:</strong> $no_of_guests<br>
<p><strong>Venue:</strong> $venue<br>
<p><strong>Theme:</strong> $theme<br>
<p><strong>Personal Request:</strong> $personal_request<br>";

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
    // $mail->addAddress('ellen@example.com');
    // $mail->addReplyTo('info@example.com', 'Information');
    // $mail->addCC('cc@example.com');
    // $mail->addBCC('bcc@example.com');

    // Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                 
    $mail->Subject = 'Confirm Booking Details';
    $mail->Body    = $body;
    $mail->AltBody = strip_tags($body);

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}