<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experts', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('title');
            $table->json('bio_i18n')->nullable();
            $table->json('expertise')->nullable();
            $table->string('country', 255)->default('Morocco');
            $table->json('languages')->nullable();
            $table->string('status')->default('draft');
            $table->string('email')->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('image')->nullable();
            $table->json('socials')->nullable();
            $table->string('cv_path')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experts');
    }
};
