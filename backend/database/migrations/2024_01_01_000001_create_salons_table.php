<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salons', function (Blueprint $col) {
            $col->id();
            $col->foreignId('owner_id')->constrained('users');
            $col->string('name');
            $col->string('slug')->unique();
            $col->text('description')->nullable();
            $col->string('address');
            $col->string('city');
            $col->string('phone')->nullable();
            $col->string('email')->nullable();
            $col->string('image_url')->nullable();
            $col->string('logo')->nullable();
            $col->json('opening_hours')->nullable();
            $col->decimal('rating', 3, 2)->default(0);
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salons');
    }
};
