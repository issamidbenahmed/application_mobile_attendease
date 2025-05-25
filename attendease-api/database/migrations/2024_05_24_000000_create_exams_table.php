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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('intitule');
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('filiere');
            $table->string('niveau');
            $table->string('groupe');
            $table->string('matiere');
            $table->string('enseignant');
            $table->string('salle');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
