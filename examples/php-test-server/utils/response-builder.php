<?php
class ResponseBuilder
{
    private string $logDirectory;

    public function __construct(string $logDirectory = __DIR__ . '/../logs')
    {
        $this->logDirectory = $logDirectory;
        if (!is_dir($this->logDirectory)) {
            mkdir($this->logDirectory, 0777, true);
        }
    }

    public function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $status >= 200 && $status < 300,
            'timestamp' => time(),
            'data' => $data,
        ], JSON_PRETTY_PRINT);
        exit;
    }

    public function logRequest(?string $body = null): string
    {
        $body = $body ?? file_get_contents('php://input');

        $entry = sprintf(
            "%s %s %s\nHeaders: %s\nBody: %s\n----\n",
            date(DATE_ATOM),
            $_SERVER['REQUEST_METHOD'] ?? 'CLI',
            $_SERVER['REQUEST_URI'] ?? '-',
            json_encode(function_exists('getallheaders') ? getallheaders() : []),
            $body
        );

        file_put_contents($this->logDirectory . '/access.log', $entry, FILE_APPEND);

        return $body;
    }

    public function simulateDelay(?int $delayMs): void
    {
        if ($delayMs !== null && $delayMs > 0 && $delayMs <= 10000) {
            usleep($delayMs * 1000);
        }
    }
}
