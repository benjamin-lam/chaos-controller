<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/response-builder.php';

$responseBuilder = new ResponseBuilder(__DIR__ . '/../logs');
$responseBuilder->logRequest();

$delay = isset($_GET['delay']) ? intval($_GET['delay']) : 0;
$errorMode = $_GET['error'] ?? null;
$language = $_GET['lang'] ?? 'de';
$theme = $_GET['mode'] ?? 'light';
$searchQuery = trim($_GET['q'] ?? '');

$searchItems = [
    ['title' => 'Pizza Margherita'],
    ['title' => 'Veggie Burger'],
    ['title' => 'Salat'],
    ['title' => 'Pasta Carbonara'],
];

$searchResults = [];
if ($searchQuery !== '') {
    $searchResults = array_values(array_filter($searchItems, function ($item) use ($searchQuery) {
        return stripos($item['title'], $searchQuery) !== false;
    }));
}

$responseBuilder->simulateDelay($delay);

if ($errorMode === '404') {
    header('HTTP/1.0 404 Not Found');
    include __DIR__ . '/errors/404.php';
    exit;
} elseif ($errorMode === '500') {
    header('HTTP/1.0 500 Internal Server Error');
    include __DIR__ . '/errors/500.php';
    exit;
} elseif ($errorMode === 'timeout') {
    sleep(30);
    exit;
}

session_start();
if (!isset($_SESSION['visits'])) {
    $_SESSION['visits'] = 0;
}
$_SESSION['visits']++;
?>
<!DOCTYPE html>
<html lang="<?php echo htmlspecialchars($language); ?>" data-theme="<?php echo $theme; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧪 Playwright Test Server</title>
    <style>
        :root {
            --primary-color: <?php echo $theme === 'dark' ? '#1a1a1a' : '#ffffff'; ?>;
            --text-color: <?php echo $theme === 'dark' ? '#ffffff' : '#000000'; ?>;
        }
        body { background: var(--primary-color); color: var(--text-color); font-family: sans-serif; }
        .test-element { border: 2px dashed #4CAF50; padding: 20px; margin: 10px; }
        [data-testid] { background-color: #f0f8ff; }
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            align-items: center;
            justify-content: center;
        }
        .modal.open { display: flex; }
        .modal__dialog { background: #fff; color: #000; padding: 20px; min-width: 280px; border-radius: 8px; }
    </style>
</head>
<body>
    <?php include __DIR__ . '/components/header.php'; ?>
    <main>
        <h1 data-testid="page-title">🧪 Playwright Test Server</h1>
        <div class="test-element" data-testid="session-info">
            <h2>Session Information</h2>
            <p>Visits: <span data-testid="visit-count"><?php echo $_SESSION['visits']; ?></span></p>
            <p>Session ID: <span data-testid="session-id"><?php echo session_id(); ?></span></p>
        </div>
        <div class="test-element">
            <h2>Test Forms</h2>
            <ul>
                <li><a href="/login.php" data-testid="login-link">Login Test</a></li>
                <li><a href="/forms/registration.php" data-testid="register-link">Registration Form</a></li>
                <li><a href="/forms/contact.php" data-testid="contact-link">Contact Form</a></li>
                <li><a href="/forms/upload.php" data-testid="upload-link">File Upload</a></li>
            </ul>
        </div>
        <div class="test-element" data-testid="dynamic-content">
            <h2>Dynamic Content Area</h2>
            <button onclick="loadContent()" data-testid="load-content-btn">Load Content</button>
            <div id="ajax-content" data-testid="ajax-response-area"></div>
        </div>
        <div class="test-element" data-testid="search-area">
            <h2>Suche</h2>
            <form method="GET" action="/" aria-label="Schnellsuche">
                <input id="search" name="q" value="<?php echo htmlspecialchars($searchQuery); ?>" aria-label="Suchfeld">
                <button type="submit">Suchen</button>
            </form>
            <ul class="search-results" data-testid="search-results">
                <?php if ($searchQuery === ''): ?>
                    <li data-testid="search-placeholder">Bitte Suchbegriff eingeben.</li>
                <?php elseif (empty($searchResults)): ?>
                    <li data-testid="search-empty">Keine Treffer gefunden.</li>
                <?php else: ?>
                    <?php foreach ($searchResults as $result): ?>
                        <li><?php echo htmlspecialchars($result['title']); ?></li>
                    <?php endforeach; ?>
                <?php endif; ?>
            </ul>
        </div>
        <div class="test-element" data-testid="modal-area">
            <h2>Modal Test</h2>
            <button id="open-modal" data-testid="open-modal">Modal öffnen</button>
            <div class="modal" id="demo-modal" role="dialog" aria-modal="true">
                <div class="modal__dialog">
                    <h3>Modal Inhalt</h3>
                    <p>Dies ist ein Beispiel-Modal.</p>
                    <button class="modal-close" data-testid="modal-close">Schließen</button>
                </div>
            </div>
        </div>
        <div class="test-element">
            <h2>Test Data Table</h2>
            <table data-testid="user-table">
                <thead>
                    <tr>
                        <th data-testid="col-id">ID</th>
                        <th data-testid="col-name">Name</th>
                        <th data-testid="col-email">Email</th>
                        <th data-testid="col-role">Role</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $testUsers = [
                        ['id' => 1, 'name' => 'Admin User', 'email' => 'admin@test.com', 'role' => 'Admin'],
                        ['id' => 2, 'name' => 'Editor User', 'email' => 'editor@test.com', 'role' => 'Editor'],
                        ['id' => 3, 'name' => 'Viewer User', 'email' => 'viewer@test.com', 'role' => 'Viewer'],
                    ];
                    foreach ($testUsers as $user) {
                        echo '<tr data-testid="user-row-' . $user['id'] . '">';
                        echo '<td data-testid="user-id">' . $user['id'] . '</td>';
                        echo '<td data-testid="user-name">' . $user['name'] . '</td>';
                        echo '<td data-testid="user-email">' . $user['email'] . '</td>';
                        echo '<td data-testid="user-role">' . $user['role'] . '</td>';
                        echo '</tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <div class="test-element">
            <h2>Error Simulation</h2>
            <ul>
                <li><a href="/?error=404" data-testid="error-404-link">404 Not Found</a></li>
                <li><a href="/?error=500" data-testid="error-500-link">500 Server Error</a></li>
                <li><a href="/?delay=5000" data-testid="slow-load-link">Slow Load (5s)</a></li>
                <li><a href="/?error=timeout" data-testid="timeout-link">Timeout (30s)</a></li>
            </ul>
        </div>
    </main>
    <?php include __DIR__ . '/components/footer.php'; ?>
    <script>
    function loadContent() {
        const area = document.getElementById('ajax-content');
        area.innerHTML = '<p data-testid="loading-text">Loading...</p>';
        setTimeout(() => {
            area.innerHTML = `
                <div data-testid="loaded-content">
                    <h3>✅ Content Loaded Successfully</h3>
                    <p>Timestamp: ${new Date().toISOString()}</p>
                    <button onclick="updateContent()" data-testid="update-btn">Update Content</button>
                </div>
            `;
        }, 1000);
    }
    function updateContent() {
        const event = new CustomEvent('contentUpdated', { detail: { time: new Date().toISOString() } });
        document.dispatchEvent(event);
    }
    (function setupModal() {
        const openButton = document.getElementById('open-modal');
        const modal = document.getElementById('demo-modal');
        const closeButton = modal?.querySelector('.modal-close');

        if (!openButton || !modal || !closeButton) return;

        const closeModal = () => modal.classList.remove('open');

        openButton.addEventListener('click', () => {
            modal.classList.add('open');
        });

        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    })();
    document.addEventListener('contentUpdated', (e) => console.log('Content updated at:', e.detail.time));
    </script>
</body>
</html>
