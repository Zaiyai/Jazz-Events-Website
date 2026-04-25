<?php

$host = "127.0.0.1";
$db_user = "root";
$db_pass = "";     
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

$json = file_get_contents('php://input');
$data = json_decode($json);

echo "Received " . $data->email;

if (isset($data->email)) {
    $user = $conn->real_escape_string($data->email);
    
    $sql = "INSERT INTO accounts (email) VALUES ('$user')";
    
    if ($conn->query($sql) === TRUE) {
        echo "Successfully saved to MySQL!";
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();

?>