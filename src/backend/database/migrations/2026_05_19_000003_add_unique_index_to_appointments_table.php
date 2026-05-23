<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const INDEX_NAME = 'appointments_doctor_date_time_unique';

    private function indexExists(): bool
    {
        if (!Schema::hasTable('appointments')) {
            return false;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            $rows = DB::select("PRAGMA index_list('appointments')");
            foreach ($rows as $row) {
                // SQLite returns: seq, name, unique, origin, partial
                if (($row->name ?? null) === self::INDEX_NAME) {
                    return true;
                }
            }
            return false;
        }

        if ($driver === 'pgsql') {
            $rows = DB::select(
                "SELECT 1 FROM pg_indexes WHERE tablename = 'appointments' AND indexname = ? LIMIT 1",
                [self::INDEX_NAME]
            );
            return !empty($rows);
        }

        // MySQL / MariaDB default.
        $rows = DB::select(
            "SELECT 1
             FROM information_schema.statistics
             WHERE table_schema = DATABASE()
               AND table_name = 'appointments'
               AND index_name = ? LIMIT 1",
            [self::INDEX_NAME]
        );
        return !empty($rows);
    }

    public function up(): void
    {
        if (!Schema::hasTable('appointments')) {
            return;
        }

        if ($this->indexExists()) {
            return;
        }

        try {
            Schema::table('appointments', function (Blueprint $table) {
                // Enforce "no double booking" at the DB level for concurrent requests.
                $table->unique(['doctor_id', 'date', 'time'], self::INDEX_NAME);
            });
        } catch (\Throwable $e) {
            // If another environment already has the index (or concurrent deploy), don't fail the migration.
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('appointments')) {
            return;
        }

        if (!$this->indexExists()) {
            return;
        }

        try {
            Schema::table('appointments', function (Blueprint $table) {
                $table->dropUnique(self::INDEX_NAME);
            });
        } catch (\Throwable $e) {
            // Ignore if the index is already gone in this environment.
        }
    }
};
