<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $col) {
            $col->id();
            $col->string('name');
            $col->string('email')->unique();
            $col->timestamp('email_verified_at')->nullable();
            $col->string('password')->nullable(); // Nullable for social login
            $col->string('google_id')->nullable()->unique();
            $col->string('avatar')->nullable();
            $col->string('role')->default('client'); // client, owner, admin
            $col->rememberToken();
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
