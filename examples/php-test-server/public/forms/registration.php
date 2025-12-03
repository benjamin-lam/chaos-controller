<?php
session_start();
require_once __DIR__ . '/../../utils/form-validator.php';
require_once __DIR__ . '/../../utils/response-builder.php';

$validator = new FormValidator();
$responseBuilder = new ResponseBuilder(__DIR__ . '/../../logs');
$responseBuilder->logRequest();

$errors = [];
$registered = false;
$delay = isset($_GET['delay']) ? intval($_GET['delay']) : null;
$responseBuilder->simulateDelay($delay);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'username' => $_POST['username'] ?? '',
        'email' => $_POST['email'] ?? '',
        'password' => $_POST['password'] ?? '',
        'confirm' => $_POST['confirm'] ?? '',
    ];

    $errors = $validator->validateRequired($data, ['username', 'email', 'password', 'confirm']);
    $emailError = $validator->validateEmail($data['email']);
    if ($emailError) {
        $errors['email'] = $emailError;
    }
    if ($data['password'] !== $data['confirm']) {
        $errors['confirm'] = 'Passwords do not match';
    }

    if (empty($errors)) {
        $registered = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Registration</title></head>
<body>
<?php include __DIR__ . '/../components/header.php'; ?>
<main>
    <h1 data-testid="registration-title">Registration Form</h1>
    <?php if ($registered): ?><div data-testid="registration-success">Registration complete</div><?php endif; ?>
    <form method="POST" action="" data-testid="registration-form">
        <label>Username <input type="text" name="username" data-testid="registration-username" value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"></label>
        <?php if (isset($errors['username'])): ?><span data-testid="registration-username-error"><?php echo $errors['username']; ?></span><?php endif; ?>
        <br>
        <label>Email <input type="email" name="email" data-testid="registration-email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"></label>
        <?php if (isset($errors['email'])): ?><span data-testid="registration-email-error"><?php echo $errors['email']; ?></span><?php endif; ?>
        <br>
        <label>Password <input type="password" name="password" data-testid="registration-password"></label>
        <?php if (isset($errors['password'])): ?><span data-testid="registration-password-error"><?php echo $errors['password']; ?></span><?php endif; ?>
        <br>
        <label>Confirm <input type="password" name="confirm" data-testid="registration-confirm"></label>
        <?php if (isset($errors['confirm'])): ?><span data-testid="registration-confirm-error"><?php echo $errors['confirm']; ?></span><?php endif; ?>
        <br>
        <button type="submit" data-testid="registration-submit">Register</button>
    </form>
</main>
<?php include __DIR__ . '/../components/footer.php'; ?>
</body>
</html>
