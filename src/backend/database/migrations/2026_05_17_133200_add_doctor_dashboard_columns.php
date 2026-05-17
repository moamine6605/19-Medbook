<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Link doctors to user accounts
        Schema::table('doctors', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('set null');
        });

        // Add reason to appointments
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('reason')->nullable()->after('type');
        });

        // Add birth_date to users (for patient age display)
        Schema::table('users', function (Blueprint $table) {
            $table->date('birth_date')->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('reason');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('birth_date');
        });
    }
};
