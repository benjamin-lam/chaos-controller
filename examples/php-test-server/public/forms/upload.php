<?php
session_start();
require_once __DIR__ . '/../../utils/response-builder.php';

$responseBuilder = new ResponseBuilder(__DIR__ . '/../../logs');
$responseBuilder->logRequest();

$uploadDir = __DIR__ . '/../../logs/uploads';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$message = '';
$error = '';
$delay = isset($_GET['delay']) ? intval($_GET['delay']) : null;
$responseBuilder->simulateDelay($delay);

$allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'txt'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_FILES['testfile']['name'])) {
        $filename = basename($_FILES['testfile']['name']);
        $target = $uploadDir . '/' . $filename;
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions, true)) {
            $error = 'Ungültiger Dateityp';
        } elseif (move_uploaded_file($_FILES['testfile']['tmp_name'], $target)) {
            $message = 'File uploaded: ' . $filename;
        } else {
            $error = 'Upload failed';
        }
    } else {
        $error = 'No file selected';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Upload</title></head>
<body>
<?php include __DIR__ . '/../components/header.php'; ?>
<main>
    <h1 data-testid="upload-title">File Upload</h1>
    <?php if ($message): ?><div class="upload-progress" data-testid="upload-success"><?php echo htmlspecialchars($message); ?></div><?php endif; ?>
    <?php if ($error): ?><div class="fileuploaderror" data-testid="upload-error"><?php echo htmlspecialchars($error); ?></div><?php endif; ?>
    <form method="POST" action="" enctype="multipart/form-data" data-testid="upload-form">
        <input type="file" name="testfile" data-testid="upload-input">
        <button type="submit" data-testid="upload-submit">Upload</button>
    </form>
</main>
<?php include __DIR__ . '/../components/footer.php'; ?>
</body>
</html>
