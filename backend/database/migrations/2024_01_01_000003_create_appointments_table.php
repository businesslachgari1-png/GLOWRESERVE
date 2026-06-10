<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $col) {
            $col->id();
            $col->foreignId('client_id')->constrained('users');
            $col->foreignId('salon_id')->constrained();
            $col->foreignId('service_id')->constrained();
            $col->foreignId('employee_id')->nullable()->constrained('employees');
            $col->dateTime('appointment_time');
            $col->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $col->decimal('total_price', 10, 2);
            $col->text('notes')->nullable();
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
