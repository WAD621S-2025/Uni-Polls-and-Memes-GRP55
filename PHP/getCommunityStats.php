<?php
require 'utils.php';

$stats = readJsonFile($statsDataPath);

$defaultStats = [
    'members' => 100, 
    'discussions' => 0,
    'polls' => 0,
    'memes' => 0
];

echo json_encode(array_merge($defaultStats, $stats));
?>