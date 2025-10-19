<?php
header('Content-Type: application/json');
require 'utils.php';

$userId = getCurrentUserId();
if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

if (!isset($_FILES['profilePhoto'])) {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

$image = $_FILES['profilePhoto'];
$uploadDir = __DIR__ . "/../uploads/profiles/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$extension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
$filename = "profile_" . $userId . "_" . time() . "." . $extension;
$targetFile = $uploadDir . $filename;
$relativePath = "uploads/profiles/" . $filename;

$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array($extension, $allowed)) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type']);
    exit;
}

if (move_uploaded_file($image['tmp_name'], $targetFile)) {
    $users = readJsonFile($usersDataPath);
    
    foreach ($users as &$user) {
        if ($user['id'] === $userId) {
            // Delete old photo if exists
            if (!empty($user['profilePhoto']) && file_exists(__DIR__ . '/../' . $user['profilePhoto'])) {
                unlink(__DIR__ . '/../' . $user['profilePhoto']);
            }
            
            $user['profilePhoto'] = $relativePath;
            break;
        }
    }
    
    if (writeJsonFile($usersDataPath, $users)) {
        echo json_encode(['success' => true, 'newPhotoPath' => $relativePath]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save photo path']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to upload photo']);
}
?>