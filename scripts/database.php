<?php

$host = "localhost";
$db_user = "root";
$db_pass = "";     
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

// 2. Read the JSON from JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json);

if (isset($data->username)) {
    $user = $conn->real_escape_string($data->username);
    
    // 3. Insert into MySQL
    $sql = "INSERT INTO users (username) VALUES ('$user')";
    
    if ($conn->query($sql) === TRUE) {
        echo "Successfully saved to MySQL!";
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();

?>