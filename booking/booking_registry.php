<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Successful</title>
</head>
<body>
<?php

$host = "localhost";
$db_user = "root";
$db_pass = "";     
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "Connected successfully</br>";

if (!isset($_POST['submit'])) {
    $type = $_POST['type'];
    $celebrant_name = $_POST['celebrant_name'];
    $event_date_from = $_POST['event_date_from'];
    $event_date_to = $_POST['event_date_to'];
    $no_of_guests = $_POST['no_of_guests'];
    $venue = $_POST['venue'];
    $theme = $_POST['theme'];
    $budget = $_POST['budget'];
    $message = $_POST['message'];
    
    $sql = "INSERT INTO booking 
    (type, celebrant_name, event_date_from, event_date_to, no_of_guests, venue, theme, budget, message) 
    VALUES ('$type', '$celebrant_name', '$event_date_from', '$event_date_to', '$no_of_guests', '$venue', '$theme', '$budget', '$message')";
    
    if ($conn->query($sql) === TRUE) {
        echo "Successfully saved to MySQL!";
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();

?>
<br><br>
<a href="../home.html">Go back</a>
</body>
</html>