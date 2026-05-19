<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'reason')) {
                $table->string('reason', 255)->nullable()->after('type');
            }
        });

        // Index common availability lookups. Conflict rules live in application code
        // so cancelled appointments can release their slots.
        Schema::table('appointments', function (Blueprint $table) {
            $table->index(['doctor_id', 'date'], 'appointments_doctor_date_index');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'reason')) {
                $table->dropColumn('reason');
            }
            $table->dropIndex('appointments_doctor_date_index');
        });
    }
};
