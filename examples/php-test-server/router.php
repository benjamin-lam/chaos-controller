<?php
// Simple router for the PHP built-in server to mirror .htaccess rules.
$publicDir = __DIR__ . '/public';
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$target = realpath($publicDir . $path);

if ($target && is_file($target)) {
    // Serve static files directly.
    return false;
}

if (strpos($path, '/api/') === 0) {
    $apiFile = $publicDir . $path . '.php';
    if (is_file($apiFile)) {
        require $apiFile;
        return true;
    }
    http_response_code(404);
    echo 'API endpoint not found';
    return true;
}

// Map clean URLs to their PHP counterparts.
$cleanPath = rtrim($path, '/');
$page = $cleanPath === '' ? '/index' : $cleanPath;
$file = $publicDir . $page . '.php';

if (is_file($file)) {
    require $file;
    return true;
}

// Default to index.php for unknown routes.
require $publicDir . '/index.php';
