<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change status enum to include 'in-progress'
        DB::statement("ALTER TABLE appointments MODIFY COLUMN status ENUM('upcoming', 'completed', 'cancelled', 'in-progress') DEFAULT 'upcoming'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE appointments MODIFY COLUMN status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming'");
    }
};
