<?php
require_once __DIR__ . '/../utils/response-builder.php';

$responseBuilder = new ResponseBuilder(__DIR__ . '/../logs');
$responseBuilder->logRequest();

$products = [
    ['name' => 'Pizza Margherita', 'price' => '8.90€'],
    ['name' => 'Veggie Burger', 'price' => '10.50€'],
    ['name' => 'Pasta Carbonara', 'price' => '12.00€'],
];
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Shop</title>
</head>
<body>
<?php include __DIR__ . '/components/header.php'; ?>
<main>
    <h1 data-testid="shop-title">Shop</h1>
    <ul data-testid="shop-list">
        <?php foreach ($products as $product): ?>
            <li>
                <span data-testid="shop-item-name"><?php echo htmlspecialchars($product['name']); ?></span>
                <strong data-testid="shop-item-price"><?php echo htmlspecialchars($product['price']); ?></strong>
            </li>
        <?php endforeach; ?>
    </ul>
</main>
<?php include __DIR__ . '/components/footer.php'; ?>
</body>
</html>
