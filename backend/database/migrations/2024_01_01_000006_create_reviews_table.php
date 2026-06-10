<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $col) {
            $col->id();
            $col->foreignId('appointment_id')->constrained()->onDelete('cascade');
            $col->foreignId('client_id')->constrained('users');
            $col->foreignId('salon_id')->constrained();
            $col->integer('rating'); // 1-5
            $col->text('comment')->nullable();
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
