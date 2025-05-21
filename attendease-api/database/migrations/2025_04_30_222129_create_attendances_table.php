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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('student_code_apogee');
            $table->foreign('student_code_apogee')->references('code_apogee')->on('students')->onDelete('cascade');
            $table->foreignId('exam_room_id')->constrained('exam_rooms')->onDelete('cascade');
            $table->string('status')->default('present');
            $table->string('course')->nullable();
            $table->timestamp('attended_at');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
