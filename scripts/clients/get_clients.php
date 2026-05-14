<?php
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["ok" => false, "message" => "Database connection failed."]);
    exit;
}

// ── Clients with event count & total spent ──────────────────────────
$sql = "SELECT u.user_id, u.name, u.initials, u.email, u.profile_picture, u.created_at,
               COUNT(DISTINCT e.event_id) AS event_count,
               COALESCE(SUM(e.amount), 0)  AS total_spent
        FROM users u
        LEFT JOIN events e ON e.client_id = u.user_id
        WHERE u.user_type = 'CLIENT'
        GROUP BY u.user_id
        ORDER BY u.name ASC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["ok" => false, "message" => $conn->error]);
    $conn->close();
    exit;
}

$clients = [];
while ($row = $result->fetch_assoc()) {
    $clients[] = $row;
}

// ── Stats ───────────────────────────────────────────────────────────
$totalClients = count($clients);

// Active clients = clients who have at least one event
$activeClients = 0;
foreach ($clients as $c) {
    if ((int)$c['event_count'] > 0) $activeClients++;
}

// New clients this month
$newThisMonth = 0;
$currentMonth = date('Y-m');
foreach ($clients as $c) {
    if (substr($c['created_at'], 0, 7) === $currentMonth) $newThisMonth++;
}

// Retention rate: clients with >1 event / clients with >=1 event
$returningClients = 0;
$clientsWithEvents = 0;
foreach ($clients as $c) {
    $ec = (int)$c['event_count'];
    if ($ec >= 1) {
        $clientsWithEvents++;
        if ($ec > 1) $returningClients++;
    }
}
$retentionRate = $clientsWithEvents > 0
    ? round(($returningClients / $clientsWithEvents) * 100, 1)
    : 0;

echo json_encode([
    "ok"      => true,
    "clients" => $clients,
    "stats"   => [
        "total_clients"   => $totalClients,
        "active_clients"  => $activeClients,
        "new_this_month"  => $newThisMonth,
        "retention_rate"  => $retentionRate
    ]
]);

$conn->close();
