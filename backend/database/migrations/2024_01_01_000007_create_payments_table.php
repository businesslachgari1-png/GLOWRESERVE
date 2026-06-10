<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $col) {
            $col->id();
            $col->foreignId('appointment_id')->constrained();
            $col->string('payment_method'); // stripe, cash, etc.
            $col->string('transaction_id')->nullable();
            $col->decimal('amount', 10, 2);
            $col->string('status')->default('pending'); // pending, completed, failed, refunded
            $col->timestamp('paid_at')->nullable();
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
