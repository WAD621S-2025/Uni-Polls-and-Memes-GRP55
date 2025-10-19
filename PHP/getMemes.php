<?php
header("Content-Type: application/json");
include 'connect.php';

#Fetch memes from database
$sql = "SELECT meme_id, caption, image_path, uploaded_at FROM memes ORDER BY uploaded_at DESC";
$result = $conn->query($sql);

$memes = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $memes[] = $row;
    }
}

echo json_encode($memes);
$conn->close();
?>