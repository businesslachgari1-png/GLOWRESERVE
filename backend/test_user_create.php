<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing User Creation...\n";

try {
    $user = User::create([
        'name' => 'Test Manual User',
        'email' => 'manualtest_' . time() . '@example.com',
        'password' => Hash::make('password123'),
        'role' => 'client',
        'email_verified_at' => now(),
    ]);
    
    echo "User created successfully! ID: " . $user->id . "\n";
    echo "Email Verified At: " . $user->email_verified_at . "\n";
    
} catch (\Exception $e) {
    echo "Error creating user: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
