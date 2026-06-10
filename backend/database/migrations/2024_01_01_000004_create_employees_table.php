<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $col) {
            $col->id();
            $col->foreignId('salon_id')->constrained()->onDelete('cascade');
            $col->string('name');
            $col->string('role')->nullable(); // Coiffeur, Esthéticienne, etc.
            $col->string('photo')->nullable();
            $col->text('bio')->nullable();
            $col->json('working_hours')->nullable(); // Horaires de travail spécifiques
            $col->boolean('is_active')->default(true);
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
