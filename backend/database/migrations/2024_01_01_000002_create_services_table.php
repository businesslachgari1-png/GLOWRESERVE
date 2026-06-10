<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $col) {
            $col->id();
            $col->foreignId('salon_id')->constrained()->onDelete('cascade');
            $col->string('name');
            $col->text('description')->nullable();
            $col->decimal('price', 10, 2);
            $col->integer('duration_minutes');
            $col->string('category')->nullable(); // e.g., Coiffure, Esthétique
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
