<?php
header("Content-Type: text/plain");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["poll_id"]) || !isset($data["option"])) {
    echo "error: missing data";
    exit;
}

$poll_id = intval($data["poll_id"]);
$option = $data["option"]; 


include 'connect.php';


$stmt = $conn->prepare("INSERT INTO votes (poll_id, option_chosen) VALUES (?, ?)");
$stmt->bind_param("is", $poll_id, $option);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>