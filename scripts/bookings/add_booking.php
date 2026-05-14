<?php
header("Content-Type: application/json");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

$env = parse_ini_file(__DIR__ . '/../../.env');

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
$rawBudget = $data->budget ?? 0;
if (is_numeric($rawBudget)) {
    $budgetNum = (float) $rawBudget;
} else {
    $san = preg_replace('/[^0-9.,]/', '', (string) $rawBudget);
    $san = str_replace(',', '', $san);
    $budgetNum = (float) $san;
}
$budget = $conn->real_escape_string(number_format($budgetNum, 2, '.', ''));

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

// Send to admin email
try {
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST');
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USERNAME');
    $mail->Password   = getenv('SMTP_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = getenv('SMTP_PORT');

    // Recipients
    $mail->setFrom('edrian.albero0@gmail.com', 'Jazz Events');
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

$cleanName = htmlspecialchars(($client_label !== '' ? "$client_label" : "user #$client_id"), ENT_QUOTES, 'UTF-8');
$baseUrl = "http://localhost/Jazz%20Events%20Website";

$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:'Georgia',serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <!-- Main Card -->
    <div style="background-color:#ffffff;border-radius:12px;padding:40px 36px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.3);">

      <!-- Greeting -->
      <div style="margin-bottom:20px;">
        <span style="font-size:22px;color:#b8960c;font-weight:bold;">Dear $cleanName</span>
      </div>

      <!-- Success Message -->
      <p style="font-size:16px;color:#2c2c2c;margin:0 0 16px;">
        We've successfully received your event booking details.
      </p>

      <!-- Instruction -->
      <p style="font-size:14px;color:#555555;margin:0 0 28px;">
        If you would like to review the details, you may log in to our website here:
      </p>

      <!-- CTA Button -->
      <a href="#"
         style="display:inline-block;background-color:#b8960c;color:#ffffff;text-decoration:none;
                padding:14px 36px;border-radius:6px;font-size:15px;font-weight:bold;
                letter-spacing:0.5px;">
        View Details
      </a>
    </div>

    <!-- Footnotes -->
    <div style="margin-top:28px;text-align:center;">
      <p style="font-size:11px;color:#aaaaaa;margin:4px 0;">
        This confirmation is only for Jazz Events bookings.
      </p>
      <p style="font-size:11px;color:#aaaaaa;margin:4px 0;">
        Please ignore this email if you've never requested a booking confirmation.
      </p>
      <p style="font-size:11px;color:#aaaaaa;margin:4px 0;">
        This email is sent automatically by Jazz Events. Please do not reply.
      </p>
    </div>

    <!-- Footer Nav -->
    <div style="margin-top:20px;text-align:center;">
      <a href="#" style="font-size:12px;color:#b8960c;text-decoration:none;margin:0 12px;">Terms of Service</a>
      <a href="#" style="font-size:12px;color:#b8960c;text-decoration:none;margin:0 12px;">Privacy Policy</a>
      <a href="#" style="font-size:12px;color:#b8960c;text-decoration:none;margin:0 12px;">Contact</a>
    </div>

  </div>
</body>
</html>
HTML;

try {
    //Server settings
    $mail->SMTPDebug = 1;
    $mail->isSMTP();
    $mail->Host       = $env['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $env['SMTP_USERNAME'];
    $mail->Password   = $env['SMTP_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $env['SMTP_PORT'];

    // Recipients
    $mail->setFrom('edrian.albero0@gmail.com', 'Jazz Events');
    $mail->addAddress($email, $cleanName);

    //Content
    $mail->isHTML(true);
    $mail->Subject = 'New Booking Submission!';
    $mail->Body    = $html;
    $mail->AltBody = "Dear $cleanName, we've successfully received your event booking details. Please log in to our website to view your booking.";

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

$conn->close();

?>