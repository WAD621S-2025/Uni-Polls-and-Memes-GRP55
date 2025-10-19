<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 


$host = 'localhost';
$db   = 'campus_polls_db';
$user = 'root';   
$pass = '';   
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
/ --- Execute Query: No Aliases Needed! ---
try 
        SELECT 
            poll_id AS id,        
            question, 
            option_a,            
            option_b,             
            option_c,          
            option_d             
        FROM 
            polls 
        ORDER BY 
            created_at DESC
    ";
    
    $stmt = $pdo->query($sql);
    $polls = $stmt->fetchAll();

    // Return the data as JSON
    echo json_encode($polls);

} catch (\PDOException $e) {
    http_response_code(500);
    error_log("Poll fetch error: " . $e->getMessage());
    echo json_encode(["error" => "Could not retrieve polls from the database."]);
}