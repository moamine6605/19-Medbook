<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            if (!Schema::hasColumn('doctors', 'status')) {
                $table->enum('status', ['actif', 'desactive'])->default('actif')->after('user_id');
            }
        });

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'is_active')) {
            DB::table('doctors')
                ->leftJoin('users', 'users.id', '=', 'doctors.user_id')
                ->whereNotNull('doctors.user_id')
                ->where('users.is_active', false)
                ->update(['doctors.status' => 'desactive']);
        }

        if (!Schema::hasTable('archived_doctors')) {
            Schema::create('archived_doctors', function (Blueprint $table) {
                $table->id();
                $table->foreignId('doctor_id')->nullable()->constrained('doctors')->nullOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('name');
                $table->string('specialty')->nullable();
                $table->decimal('rating', 2, 1)->default(0);
                $table->unsignedInteger('reviews')->default(0);
                $table->string('experience')->nullable();
                $table->string('phone', 30)->nullable();
                $table->string('address', 255)->nullable();
                $table->text('bio')->nullable();
                $table->timestamp('archived_at')->useCurrent();
                $table->timestamps();

                $table->unique('doctor_id');
                $table->index('name');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('archived_doctors');

        Schema::table('doctors', function (Blueprint $table) {
            if (Schema::hasColumn('doctors', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
