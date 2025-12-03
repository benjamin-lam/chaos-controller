<?php
require_once __DIR__ . '/../utils/response-builder.php';

$responseBuilder = new ResponseBuilder(__DIR__ . '/../logs');
$responseBuilder->logRequest();

$allProducts = [
    ['name' => 'Produkt 1'],
    ['name' => 'Produkt 2'],
    ['name' => 'Produkt 3'],
    ['name' => 'Produkt 4'],
    ['name' => 'Produkt 5'],
    ['name' => 'Produkt 6'],
    ['name' => 'Produkt 7'],
    ['name' => 'Produkt 8'],
];

$perPage = 4;
$page = max(1, intval($_GET['page'] ?? 1));
$start = ($page - 1) * $perPage;
$items = array_slice($allProducts, $start, $perPage);
$totalPages = (int) ceil(count($allProducts) / $perPage);
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Produkte</title>
</head>
<body>
<?php include __DIR__ . '/components/header.php'; ?>
<main>
    <h1 data-testid="products-title">Produkte</h1>
    <ul data-testid="product-list">
        <?php foreach ($items as $product): ?>
            <li class="product-item"><?php echo htmlspecialchars($product['name']); ?></li>
        <?php endforeach; ?>
    </ul>
    <nav class="pagination" aria-label="Pagination">
        <?php for ($p = 1; $p <= $totalPages; $p++): ?>
            <a href="/products.php?page=<?php echo $p; ?>" data-testid="pagination-link"<?php if ($p === $page) echo ' aria-current="page"'; ?>><?php echo $p; ?></a>
        <?php endfor; ?>
    </nav>
</main>
<?php include __DIR__ . '/components/footer.php'; ?>
</body>
</html>
