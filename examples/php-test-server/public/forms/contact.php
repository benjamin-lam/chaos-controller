<?php
session_start();
require_once __DIR__ . '/../../utils/form-validator.php';
require_once __DIR__ . '/../../utils/response-builder.php';

$validator = new FormValidator();
$responseBuilder = new ResponseBuilder(__DIR__ . '/../../logs');
$responseBuilder->logRequest();

$submitted = false;
$errors = [];
$delay = isset($_GET['delay']) ? intval($_GET['delay']) : null;
$responseBuilder->simulateDelay($delay);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'message' => $_POST['message'] ?? '',
    ];
    $errors = $validator->validateRequired($data, ['name', 'email', 'message']);
    $emailError = $validator->validateEmail($data['email']);
    if ($emailError) {
        $errors['email'] = $emailError;
    }
    if (empty($errors)) {
        $submitted = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Contact Form</title></head>
<body>
<?php include __DIR__ . '/../components/header.php'; ?>
<main>
    <h1 data-testid="contact-title">Contact Form</h1>
    <?php if ($submitted): ?>
        <div data-testid="contact-success">Form submitted successfully</div>
    <?php endif; ?>
    <form method="POST" action="" data-testid="contact-form">
        <label>Name <input type="text" name="name" data-testid="contact-name" value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>"></label>
        <?php if (isset($errors['name'])): ?><span data-testid="contact-name-error"><?php echo $errors['name']; ?></span><?php endif; ?>
        <br>
        <label>Email <input type="email" name="email" data-testid="contact-email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"></label>
        <?php if (isset($errors['email'])): ?><span data-testid="contact-email-error"><?php echo $errors['email']; ?></span><?php endif; ?>
        <br>
        <label>Message <textarea name="message" data-testid="contact-message"><?php echo htmlspecialchars($_POST['message'] ?? ''); ?></textarea></label>
        <?php if (isset($errors['message'])): ?><span data-testid="contact-message-error"><?php echo $errors['message']; ?></span><?php endif; ?>
        <br>
        <button type="submit" data-testid="contact-submit">Send</button>
    </form>
</main>
<?php include __DIR__ . '/../components/footer.php'; ?>
</body>
</html>
