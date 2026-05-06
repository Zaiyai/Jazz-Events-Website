<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed!</title>
</head>
<body>
    <p>Booking Status:</p>
    
<?php

$action = $_GET['action']; 

$host = "localhost";
$db_user = "root";
$db_pass = "";     
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$action = $_GET['action'] ?? null;
$user_confirmation_token  = $_GET['user_confirmation_token']  ?? null;

if (!$action || !$user_confirmation_token) {
    die("Invalid request.");
}

$booking = $conn->query("SELECT * FROM booking WHERE user_confirmation_token = '$user_confirmation_token'");

if (!$booking) {
    die("Invalid or expired link.");
}

$booking_status = "<h1>CONFIRMED!</h1>";

if ($action === 'cancel') {
    $conn->query("DELETE FROM booking WHERE user_confirmation_token = '$user_confirmation_token'");
    $booking_status = "<h1>CANCELLED!</h1>";
} else {
    $conn->query("UPDATE booking SET user_confirmation_token = NULL, user_confirmed = 1 WHERE user_confirmation_token = '$user_confirmation_token'");
}

echo $booking_status;

$conn->close();
?>

<a href="../../home.html">Go back to home page</a>

</body>
</html>
