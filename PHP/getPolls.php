<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 


$host = 'localhost';
$db   = 'campus_polls_db';
$user = 'YOUR_DB_USERNAME';    // <-- UPDATE THIS!
$pass = 'YOUR_DB_PASSWORD';    // <-- UPDATE THIS!
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];