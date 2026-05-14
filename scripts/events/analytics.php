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

// ── Total Revenue (sum of event amounts) ──
$revResult = $conn->query("SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM events");
$totalRevenue = $revResult ? $revResult->fetch_assoc()['total_revenue'] : 0;

// ── Total Events ──
$evCountResult = $conn->query("SELECT COUNT(*) AS cnt FROM events");
$totalEvents = $evCountResult ? $evCountResult->fetch_assoc()['cnt'] : 0;

// ── Average Event Value ──
$avgValue = $totalEvents > 0 ? round($totalRevenue / $totalEvents, 2) : 0;

// ── New Clients (count of clients) ──
$clientResult = $conn->query("SELECT COUNT(*) AS cnt FROM users WHERE user_type = 'CLIENT'");
$totalClients = $clientResult ? $clientResult->fetch_assoc()['cnt'] : 0;

// ── Total Bookings ──
$bookingCountResult = $conn->query("SELECT COUNT(*) AS cnt FROM booking");
$totalBookings = $bookingCountResult ? $bookingCountResult->fetch_assoc()['cnt'] : 0;

// ── Completed Events ──
$completedResult = $conn->query("SELECT COUNT(*) AS cnt FROM events WHERE status = 'COMPLETED'");
$completedEvents = $completedResult ? $completedResult->fetch_assoc()['cnt'] : 0;

// ── Event Type Distribution ──
$typeResult = $conn->query("SELECT type, COUNT(*) AS cnt FROM events GROUP BY type ORDER BY cnt DESC");
$eventTypes = [];
if ($typeResult) {
    while ($row = $typeResult->fetch_assoc()) {
        $eventTypes[] = $row;
    }
}

// ── Booking Type Distribution ──
$bookingTypeResult = $conn->query("SELECT type, COUNT(*) AS cnt FROM booking GROUP BY type ORDER BY cnt DESC");
$bookingTypes = [];
if ($bookingTypeResult) {
    while ($row = $bookingTypeResult->fetch_assoc()) {
        $bookingTypes[] = $row;
    }
}

// ── Monthly Revenue from events (last 6 months) ──
$monthlyRevenue = [];
$revenueQuery = $conn->query("
    SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month_key,
        DATE_FORMAT(date, '%b') AS month_label,
        SUM(amount) AS revenue
    FROM events
    GROUP BY month_key, month_label
    ORDER BY month_key DESC
    LIMIT 6
");
if ($revenueQuery) {
    while ($row = $revenueQuery->fetch_assoc()) {
        $monthlyRevenue[] = $row;
    }
    $monthlyRevenue = array_reverse($monthlyRevenue);
}

// ── Monthly Bookings vs Completed Events (last 6 months) ──
$monthlyBookings = [];
$bookingsQuery = $conn->query("
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month_key,
        DATE_FORMAT(created_at, '%b') AS month_label,
        COUNT(*) AS total_bookings
    FROM booking
    GROUP BY month_key, month_label
    ORDER BY month_key DESC
    LIMIT 6
");
if ($bookingsQuery) {
    while ($row = $bookingsQuery->fetch_assoc()) {
        $monthlyBookings[] = $row;
    }
    $monthlyBookings = array_reverse($monthlyBookings);
}

$monthlyCompleted = [];
$completedQuery = $conn->query("
    SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month_key,
        DATE_FORMAT(date, '%b') AS month_label,
        COUNT(*) AS completed
    FROM events
    WHERE status = 'COMPLETED'
    GROUP BY month_key, month_label
    ORDER BY month_key DESC
    LIMIT 6
");
if ($completedQuery) {
    while ($row = $completedQuery->fetch_assoc()) {
        $monthlyCompleted[] = $row;
    }
    $monthlyCompleted = array_reverse($monthlyCompleted);
}

// ── Top Events by amount (all, sorted desc) ──
$topEventsQuery = $conn->query("
    SELECT 
        e.event_id, e.name, e.type, e.no_of_guests,
        e.date, e.venue, e.status, e.amount,
        u.name AS client_name
    FROM events e
    INNER JOIN users u ON u.user_id = e.client_id
    ORDER BY e.amount DESC
");
$topEvents = [];
if ($topEventsQuery) {
    while ($row = $topEventsQuery->fetch_assoc()) {
        $topEvents[] = $row;
    }
}

echo json_encode([
    "ok" => true,
    "stats" => [
        "total_revenue" => (float) $totalRevenue,
        "total_events" => (int) $totalEvents,
        "avg_event_value" => (float) $avgValue,
        "total_clients" => (int) $totalClients,
        "total_bookings" => (int) $totalBookings,
        "completed_events" => (int) $completedEvents,
    ],
    "event_types" => $eventTypes,
    "booking_types" => $bookingTypes,
    "monthly_revenue" => $monthlyRevenue,
    "monthly_bookings" => $monthlyBookings,
    "monthly_completed" => $monthlyCompleted,
    "top_events" => $topEvents,
]);

$conn->close();
?>
