<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response-builder.php';

$responseBuilder = new ResponseBuilder(__DIR__ . '/../../logs');
$rawBody = file_get_contents('php://input');
$responseBuilder->logRequest($rawBody);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode($rawBody, true) ?? [];

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode([
        'success' => $status >= 200 && $status < 300,
        'data' => $payload,
        'timestamp' => time(),
    ], JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'GET') {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 2;
    $offset = ($page - 1) * $perPage;
    $slice = array_slice($fakeUsers, $offset, $perPage);
    respond([
        'users' => $slice,
        'pagination' => [
            'page' => $page,
            'per_page' => $perPage,
            'total' => count($fakeUsers),
        ],
    ]);
}

if ($method === 'POST') {
    $newUser = [
        'id' => count($fakeUsers) + 1,
        'username' => $input['username'] ?? 'user' . rand(100, 999),
        'email' => $input['email'] ?? 'user@example.com',
        'role' => $input['role'] ?? 'tester',
    ];
    respond(['created' => $newUser], 201);
}

respond(['error' => 'Method not allowed'], 405);
