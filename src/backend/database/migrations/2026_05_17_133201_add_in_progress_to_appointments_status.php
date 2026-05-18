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
        // MySQL-only enum alteration. SQLite doesn't support MODIFY COLUMN, and our
        // create_appointments_table migration already includes the value.
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE appointments MODIFY COLUMN status ENUM('upcoming', 'completed', 'cancelled', 'in-progress') DEFAULT 'upcoming'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE appointments MODIFY COLUMN status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming'");
    }
};
