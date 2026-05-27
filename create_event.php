<?php
use Illuminate\Support\Facades\DB;

// Event ID 5 was already created - just add product and price
$eventId = 5;

$productId = DB::table('products')->insertGetId([
    'event_id' => $eventId,
    'title' => 'Inscrição 10km',
    'type' => 'PAID',
    'product_type' => 'TICKET',
    'sale_start_date' => '2026-05-01 00:00:00',
    'sale_end_date' => '2026-07-10 23:59:59',
    'is_hidden' => false,
    'order' => 1,
    'lot_mode_enabled' => false,
    'created_at' => now(),
    'updated_at' => now(),
]);
echo "Product ID: $productId\n";

DB::table('product_prices')->insert([
    'product_id' => $productId,
    'label' => 'Lote 1',
    'price' => 89.00,
    'is_hidden' => false,
    'initial_quantity_available' => 500,
    'quantity_available' => 500,
    'order' => 1,
    'created_at' => now(),
    'updated_at' => now(),
]);
echo "Price created\n";
echo "Done!\n";
