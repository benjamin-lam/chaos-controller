<?php
// Pseudo database for deterministic test data
$fakeUsers = [
    ['id' => 1, 'username' => 'admin', 'email' => 'admin@test.com', 'role' => 'admin'],
    ['id' => 2, 'username' => 'editor', 'email' => 'editor@test.com', 'role' => 'editor'],
    ['id' => 3, 'username' => 'viewer', 'email' => 'viewer@test.com', 'role' => 'viewer'],
    ['id' => 4, 'username' => 'tester', 'email' => 'tester@test.com', 'role' => 'tester'],
];

$fakePosts = [
    ['id' => 1, 'title' => 'Hello World', 'status' => 'published'],
    ['id' => 2, 'title' => 'Draft Post', 'status' => 'draft'],
    ['id' => 3, 'title' => 'Another Post', 'status' => 'published'],
];
