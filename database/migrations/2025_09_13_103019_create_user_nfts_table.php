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
        Schema::create('user_nfts', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_id');
            $table->unsignedBigInteger('nft_id');
            $table->foreign('nft_id')->references('id')->on('n_f_t_s');
            $table->timestamp('won_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_nfts');
    }
};
