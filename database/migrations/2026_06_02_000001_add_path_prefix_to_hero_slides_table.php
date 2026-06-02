<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->string('path_prefix')->nullable()->unique()->after('slide_key');
        });

        // Backfill existing rows using the known slide_key → path mapping.
        $map = [
            'home'          => '/',
            'about'         => '/about',
            'tililab'       => '/tililab',
            'tilila'        => '/tilila',
            'gouvernance'   => '/gouvernance',
            'experts'       => '/experts',
            'events'        => '/events',
            'opportunities' => '/opportunities',
            'media'         => '/media',
        ];

        foreach ($map as $slideKey => $pathPrefix) {
            DB::table('hero_slides')
                ->where('slide_key', $slideKey)
                ->whereNull('path_prefix')
                ->update(['path_prefix' => $pathPrefix]);
        }
    }

    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropUnique(['path_prefix']);
            $table->dropColumn('path_prefix');
        });
    }
};
