<?php
class FormValidator
{
    public function validateRequired(array $data, array $fields): array
    {
        $errors = [];
        foreach ($fields as $field) {
            if (empty($data[$field])) {
                $errors[$field] = ucfirst($field) . ' is required';
            }
        }
        return $errors;
    }

    public function validateEmail(string $email): ?string
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? null : 'Invalid email format';
    }
}
