<?php
session_start();
require_once __DIR__ . '/../utils/session-manager.php';

$sessionManager = new SessionManager();
$sessionManager->requireAuth();
$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
</head>
<body>
    <?php include __DIR__ . '/components/header.php'; ?>
    <main>
        <h1 data-testid="dashboard-title">Willkommen, <?php echo htmlspecialchars($user['username']); ?></h1>
        <p data-testid="dashboard-role">Role: <?php echo htmlspecialchars($user['role']); ?></p>
        <p data-testid="dashboard-login-time">Login Time: <?php echo date('c', $user['login_time']); ?></p>
        <a href="/api/auth/logout" data-testid="logout-link">API Logout</a>
    </main>
    <?php include __DIR__ . '/components/footer.php'; ?>
</body>
</html>
