<?php
header("Content-Type: application/json");

$host    = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "jazz_events";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["ok" => false, "message" => "Database connection failed."]);
    exit;
}

// ── All payments with client + event info ──
$sql = "SELECT p.payment_id, p.invoice_number, p.amount, p.payment_method,
               p.payment_status, p.payment_date, p.due_date, p.reference_number, p.notes,
               p.created_at,
               u.user_id AS client_id, u.name AS client_name, u.initials AS client_initials,
               e.event_id, e.name AS event_name
        FROM payments p
        INNER JOIN users u ON u.user_id = p.client_id
        INNER JOIN events e ON e.event_id = p.event_id
        ORDER BY p.created_at DESC";

$result = $conn->query($sql);
$payments = [];
if ($result) {
    $payments = mysqli_fetch_all($result, MYSQLI_ASSOC);
}

// ── Stats aggregation ──
$totalRevenue   = 0;
$collectedAmt   = 0;
$collectedCount = 0;
$pendingAmt     = 0;
$pendingCount   = 0;
$overdueAmt     = 0;
$overdueCount   = 0;

// Payment method buckets: CREDIT_CARD, BANK_TRANSFER, GCASH, PAYMAYA, CASH
$pmTotals = [
    'CREDIT_CARD'   => 0,
    'BANK_TRANSFER' => 0,
    'GCASH'         => 0,
    'PAYMAYA'       => 0,
    'CASH'          => 0,
];

foreach ($payments as $p) {
    $amt = (float) $p['amount'];
    $totalRevenue += $amt;

    if ($p['payment_status'] === 'PAID') {
        $collectedAmt   += $amt;
        $collectedCount++;
    } elseif ($p['payment_status'] === 'PENDING' || $p['payment_status'] === 'PARTIAL') {
        $pendingAmt   += $amt;
        $pendingCount++;
    } elseif ($p['payment_status'] === 'OVERDUE') {
        $overdueAmt   += $amt;
        $overdueCount++;
    }

    $method = $p['payment_method'];
    if (isset($pmTotals[$method])) {
        $pmTotals[$method] += $amt;
    }
}

// Combine GCash + PayMaya as one bucket for the UI (both show on same row)
$pmDisplay = [
    'CREDIT_CARD'   => $pmTotals['CREDIT_CARD'],
    'BANK_TRANSFER' => $pmTotals['BANK_TRANSFER'],
    'GCASH_PAYMAYA' => $pmTotals['GCASH'] + $pmTotals['PAYMAYA'],
    'CASH'          => $pmTotals['CASH'],
];

echo json_encode([
    "ok"       => true,
    "empty"    => count($payments) === 0,
    "payments" => $payments,
    "stats"    => [
        "total_revenue"    => $totalRevenue,
        "collected_amount" => $collectedAmt,
        "collected_count"  => $collectedCount,
        "pending_amount"   => $pendingAmt,
        "pending_count"    => $pendingCount,
        "overdue_amount"   => $overdueAmt,
        "overdue_count"    => $overdueCount,
        "payment_methods"  => $pmDisplay,
    ]
]);

$conn->close();
?>
