<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Drop the table if it exists to avoid conflicts
        Schema::dropIfExists('exams');
        
        // Recreate the exams table with the correct structure
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

    public function down()
    {
        Schema::dropIfExists('exams');
    }
};
