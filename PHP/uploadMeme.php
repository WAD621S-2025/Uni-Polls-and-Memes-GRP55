<?php
#uploadMeme.php
include 'connect.php'; // connect to database

#Check if file and caption are sent
if (!isset($_FILES['imageInput']) || !isset($_POST['caption'])) {
    echo "error";
    exit;
}

$caption = $_POST['caption'];
$image = $_FILES['imageInput'];
# Create uploads folder if it doesn’t exist
$uploadDir = "uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

# Generate unique file name
$targetFile = $uploadDir . time() . "_" . basename($image['name']);
$fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'gif'];

# Validate file type
if (!in_array($fileType, $allowed)) {
    echo "error";
    exit;
}

# Move file to uploads folder
if (move_uploaded_file($image['tmp_name'], $targetFile)) {
    // Insert meme info into database
    $stmt = $conn->prepare("INSERT INTO memes (caption, image_path) VALUES (?, ?)");
    $stmt->bind_param("ss", $caption, $targetFile);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }

    $stmt->close();
} else {
    echo "error";
}

$conn->close();
?>