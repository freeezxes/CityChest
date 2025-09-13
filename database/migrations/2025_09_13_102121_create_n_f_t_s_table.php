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
        Schema::create('n_f_t_s', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary']);
            $table->unsignedBigInteger('attraction_id');
            $table->foreign('attraction_id')->references('id')->on('attractions');
            $table->integer('drop_chance'); // Value from 1-100 representing percentage chance
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('n_f_t_s');
    }
};
