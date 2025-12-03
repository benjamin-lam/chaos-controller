<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../utils/response-builder.php';
$responseBuilder = new ResponseBuilder(__DIR__ . '/../../logs');
$rawBody = file_get_contents('php://input');
$responseBuilder->logRequest($rawBody);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$endpoint = basename($path);
$input = json_decode($rawBody, true) ?? [];

function jsonResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode([
        'success' => $status >= 200 && $status < 300,
        'timestamp' => time(),
        'data' => $data,
    ], JSON_PRETTY_PRINT);
    exit;
}

function errorResponse(string $message, int $status = 400): void
{
    jsonResponse(['error' => $message], $status);
}

switch ($method) {
    case 'POST':
        if ($endpoint === 'auth.php' || $endpoint === 'login') {
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            $validUsers = [
                'api_admin' => 'api_pass123',
                'api_user' => 'api_pass456',
            ];
            if (isset($validUsers[$username]) && $validUsers[$username] === $password) {
                $token = bin2hex(random_bytes(32));
                $_SESSION['api_token'] = $token;
                $_SESSION['api_user'] = $username;
                $_SESSION['login_time'] = time();
                jsonResponse([
                    'token' => $token,
                    'user' => [
                        'username' => $username,
                        'role' => strpos($username, 'admin') !== false ? 'admin' : 'user',
                    ],
                    'expires_in' => 3600,
                ]);
            }
            errorResponse('Invalid credentials', 401);
        }
        break;
    case 'GET':
        if ($endpoint === 'status') {
            if (isset($_SESSION['api_token'])) {
                jsonResponse([
                    'authenticated' => true,
                    'user' => $_SESSION['api_user'] ?? null,
                    'session_age' => time() - ($_SESSION['login_time'] ?? time()),
                ]);
            }
            jsonResponse(['authenticated' => false]);
        }
        break;
    case 'DELETE':
        if ($endpoint === 'logout') {
            session_destroy();
            jsonResponse(['message' => 'Logged out successfully']);
        }
        break;
    default:
        errorResponse('Method not allowed', 405);
}
