<?php
$base = 'http://localhost:8080';
$endpoints = [
    $base . '/',
    $base . '/login.php',
    $base . '/api/data',
];

echo "Playwright test server smoke tests\n";
foreach ($endpoints as $endpoint) {
    $result = @file_get_contents($endpoint);
    if ($result === false) {
        echo "❌ Failed to reach {$endpoint}\n";
    } else {
        echo "✅ {$endpoint}\n";
    }
}
