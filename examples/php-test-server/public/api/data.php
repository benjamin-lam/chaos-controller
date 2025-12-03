<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response-builder.php';

$responseBuilder = new ResponseBuilder(__DIR__ . '/../../logs');
$responseBuilder->logRequest();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$delay = isset($_GET['delay']) ? intval($_GET['delay']) : null;
$responseBuilder->simulateDelay($delay);

$type = $_GET['type'] ?? 'posts';
$error = $_GET['error'] ?? null;

if ($error === '500') {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Simulated server error']);
    exit;
}

if ($type === 'posts') {
    echo json_encode(['success' => true, 'data' => $fakePosts]);
    exit;
}

echo json_encode(['success' => true, 'data' => ['ping' => 'pong', 'timestamp' => time()]]);
