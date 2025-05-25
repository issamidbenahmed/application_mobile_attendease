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
        Schema::table('exam_rooms', function (Blueprint $table) {
            $table->foreignId('exam_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_rooms', function (Blueprint $table) {
            $table->dropForeign(['exam_id']);
            $table->dropColumn(['exam_id', 'start_time', 'end_time']);
        });
    }
};
