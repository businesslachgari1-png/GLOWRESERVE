<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_service', function (Blueprint $col) {
            $col->id();
            $col->foreignId('employee_id')->constrained()->onDelete('cascade');
            $col->foreignId('service_id')->constrained()->onDelete('cascade');
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_service');
    }
};
