<?php
session_start();
require_once __DIR__ . '/../utils/session-manager.php';
require_once __DIR__ . '/../utils/response-builder.php';

$sessionManager = new SessionManager();
$responseBuilder = new ResponseBuilder(__DIR__ . '/../logs');
$responseBuilder->logRequest();

$error = $_GET['error'] ?? null;
$delay = isset($_GET['delay']) ? intval($_GET['delay']) : 0;
$redirect = $_GET['redirect'] ?? '/dashboard.php';

$responseBuilder->simulateDelay($delay);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']);

    $validCredentials = [
        'admin' => 'admin123',
        'editor' => 'editor123',
        'viewer' => 'viewer123',
        'test' => 'test123',
    ];

    if (isset($validCredentials[$username]) && $validCredentials[$username] === $password) {
        $_SESSION['user'] = [
            'id' => rand(1000, 9999),
            'username' => $username,
            'role' => $username === 'admin' ? 'admin' : ($username === 'editor' ? 'editor' : 'user'),
            'login_time' => time(),
            'remember' => $remember,
        ];

        if ($remember) {
            setcookie('remember_token', bin2hex(random_bytes(32)), time() + 86400 * 30, '/');
        }

        header('Location: ' . $redirect);
        exit;
    }

    $error = 'wrong_credentials';
}

$errorMessage = '';
if ($error === 'wrong_credentials') {
    $errorMessage = '❌ Falscher Benutzername oder Passwort';
} elseif ($error === 'locked') {
    $errorMessage = '🔒 Account ist gesperrt. Bitte kontaktieren Sie den Administrator.';
} elseif ($error === 'captcha') {
    $errorMessage = '🤖 Bitte CAPTCHA lösen';
} elseif ($error === 'unauthorized') {
    $errorMessage = 'ℹ️ Bitte melden Sie sich an, um fortzufahren.';
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>🔐 Login Test</title>
    <style>
        .error { color: red; border: 1px solid red; padding: 10px; }
        .success { color: green; border: 1px solid green; padding: 10px; }
        .test-form { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; }
        [data-testid] { margin: 10px 0; }
    </style>
</head>
<body>
    <?php include __DIR__ . '/components/header.php'; ?>
    <div class="test-form">
        <h1 data-testid="login-title">🔐 Login Test Seite</h1>
        <?php if ($errorMessage): ?>
            <div class="error" data-testid="error-message"><?php echo htmlspecialchars($errorMessage); ?></div>
        <?php endif; ?>
        <form method="POST" action="" data-testid="login-form">
            <div data-testid="username-field">
                <label for="username">Benutzername:</label>
                <input type="text" id="username" name="username" data-testid="username-input" placeholder="admin, editor, viewer, test" required>
            </div>
            <div data-testid="password-field">
                <label for="password">Passwort:</label>
                <input type="password" id="password" name="password" data-testid="password-input" placeholder="admin123, editor123, etc." required>
            </div>
            <div data-testid="remember-field">
                <label>
                    <input type="checkbox" name="remember" data-testid="remember-checkbox"> Remember me
                </label>
            </div>
            <button type="submit" data-testid="login-submit-btn">Anmelden</button>
        </form>
        <div style="margin-top: 30px;">
            <h3>Test Credentials:</h3>
            <ul data-testid="test-credentials">
                <li>admin / admin123 (Admin Role)</li>
                <li>editor / editor123 (Editor Role)</li>
                <li>viewer / viewer123 (Viewer Role)</li>
                <li>test / test123 (Standard User)</li>
            </ul>
        </div>
        <div style="margin-top: 20px;">
            <h3>Test Szenarien:</h3>
            <ul>
                <li><a href="/login.php?error=wrong_credentials" data-testid="test-wrong-creds">Test wrong credentials</a></li>
                <li><a href="/login.php?error=locked" data-testid="test-locked-account">Test locked account</a></li>
                <li><a href="/login.php?delay=3000" data-testid="test-slow-login">Test slow login (3s delay)</a></li>
            </ul>
        </div>
    </div>
    <?php include __DIR__ . '/components/footer.php'; ?>
</body>
</html>
