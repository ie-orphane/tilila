<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('slide_key')->unique();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0)->index();

            // Display options
            $table->string('display_mode')->default('normal'); // 'normal' | 'banner_image'
            $table->boolean('image_contain')->default(false);
            $table->boolean('banner_image_contain')->default(false);
            $table->string('image_position')->nullable(); // 'right' | 'center' | null
            $table->string('image_bg')->nullable(); // 'white' | null
            $table->string('image_path')->nullable();

            // Multilingual JSON columns
            $table->json('image_alt')->nullable();   // {en,fr,ar}
            $table->json('badge')->nullable();        // {en,fr,ar}
            $table->json('kicker')->nullable();       // {en,fr,ar}  (was cardKicker)
            $table->json('title_before')->nullable(); // {en,fr,ar}
            $table->json('title_accent')->nullable(); // {en,fr,ar}
            $table->json('description')->nullable();  // {en,fr,ar}
            $table->json('card_line')->nullable();    // {en,fr,ar}

            // Embedded CTAs: [{label:{en,fr,ar}, url, style:'primary'|'secondary', is_active}]
            $table->json('ctas')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
