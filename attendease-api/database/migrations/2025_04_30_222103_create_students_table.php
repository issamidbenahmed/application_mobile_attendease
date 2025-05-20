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
        Schema::create('students', function (Blueprint $table) {
            $table->string('code_apogee')->primary();
            $table->string('prenom');
            $table->string('nom');
            $table->string('email')->unique();
            $table->string('filiere');
            $table->string('niveau');
            $table->string('cne')->unique();
            $table->string('cin')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
