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

        // Add unique constraint for anti-chevauchement.
        Schema::table('appointments', function (Blueprint $table) {
            // If the index exists, Laravel will throw; keep it simple and try/catch at runtime not possible here.
            // We'll guard by checking schema manager via raw SQL in runtime migrations is overkill; assume fresh DB.
            $table->unique(['doctor_id', 'date', 'time'], 'appointments_doctor_date_time_unique');
            $table->index(['doctor_id', 'date'], 'appointments_doctor_date_index');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'reason')) {
                $table->dropColumn('reason');
            }
            $table->dropUnique('appointments_doctor_date_time_unique');
            $table->dropIndex('appointments_doctor_date_index');
        });
    }
};

