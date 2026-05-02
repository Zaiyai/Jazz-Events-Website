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

// Read and decode JSON from JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json);

$name = $conn->real_escape_string($data->name);
$type = $conn->real_escape_string($data->type);
$date_from = $conn->real_escape_string($data->date_from);
$date_to = $conn->real_escape_string($data->date_to);
$no_of_guests = $conn->real_escape_string($data->no_of_guests);
$venue = $conn->real_escape_string($data->venue);
$theme = $conn->real_escape_string($data->theme);
$budget = $conn->real_escape_string($data->budget);
$personal_request = $conn->real_escape_string($data->personal_request);

$sql = "INSERT INTO booking 
(type, name, date_from, date_to, no_of_guests, venue, theme, budget, personal_request) 
VALUES ('$type', '$name', '$date_from', '$date_to', '$no_of_guests', '$venue', '$theme', '$budget', '$personal_request')";

if ($result) {
    echo json_encode([
        "status"   => "success"
    ]);
} else {
    echo json_encode([
        "status"  => "error"
    ]);
}

$conn->close();

?>