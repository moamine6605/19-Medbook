<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const INDEX_NAME = 'appointments_doctor_date_time_unique';

    public function up(): void
    {
        if (!Schema::hasTable('appointments')) {
            return;
        }

        $exists = DB::select(
            "SELECT 1
             FROM information_schema.statistics
             WHERE table_schema = DATABASE()
               AND table_name = 'appointments'
               AND index_name = ? LIMIT 1",
            [self::INDEX_NAME]
        );

        if (!empty($exists)) {
            return;
        }

        Schema::table('appointments', function (Blueprint $table) {
            // Enforce "no double booking" at the DB level for concurrent requests.
            $table->unique(['doctor_id', 'date', 'time'], self::INDEX_NAME);
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('appointments')) {
            return;
        }

        $exists = DB::select(
            "SELECT 1
             FROM information_schema.statistics
             WHERE table_schema = DATABASE()
               AND table_name = 'appointments'
               AND index_name = ? LIMIT 1",
            [self::INDEX_NAME]
        );

        if (empty($exists)) {
            return;
        }

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropUnique(self::INDEX_NAME);
        });
    }
};

