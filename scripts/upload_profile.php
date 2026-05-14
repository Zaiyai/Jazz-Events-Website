<?php
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}

// Ensure the upload directory exists
$uploadDir = realpath(dirname(__FILE__)) . "/../assets/profiles/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Check if a file was uploaded
if (!isset($_FILES['profile_picture']) || $_FILES['profile_picture']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["status" => "error", "message" => "No file uploaded or upload failed."]);
    exit;
}

$file = $_FILES['profile_picture'];
$email = isset($_POST['email']) ? $_POST['email'] : null;

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit;
}

// Validate file
$allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedMimes)) {
    echo json_encode(["status" => "error", "message" => "Only image files (JPEG, PNG, GIF, WebP) are allowed."]);
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
    echo json_encode(["status" => "error", "message" => "File size exceeds 5MB limit."]);
    exit;
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = md5($email . time()) . "." . $extension;
$filepath = $uploadDir . $filename;

// Move file
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    echo json_encode(["status" => "error", "message" => "Failed to save file."]);
    exit;
}

// Store relative path in database
$relativePath = "assets/profiles/" . $filename;
$stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE email = ?");
$stmt->bind_param("ss", $relativePath, $email);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Profile picture uploaded successfully.",
        "profile_picture" => $relativePath
    ]);
} else {
    // Delete the file if database update failed
    unlink($filepath);
    echo json_encode(["status" => "error", "message" => "Failed to update profile picture in database."]);
}

$stmt->close();
$conn->close();
?>
