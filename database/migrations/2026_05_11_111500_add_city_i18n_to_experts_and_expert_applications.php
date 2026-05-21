<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('expert_applications') && ! Schema::hasColumn('expert_applications', 'city_i18n')) {
            Schema::table('expert_applications', function (Blueprint $table): void {
                $table->json('city_i18n')->nullable()->after('city');
            });

            DB::table('expert_applications')
                ->select(['id', 'city'])
                ->orderBy('id')
                ->chunkById(200, function ($rows): void {
                    foreach ($rows as $row) {
                        $city = trim((string) ($row->city ?? ''));
                        DB::table('expert_applications')
                            ->where('id', $row->id)
                            ->update([
                                'city_i18n' => json_encode([
                                    'en' => $city,
                                    'fr' => $city,
                                    'ar' => $city,
                                ], JSON_UNESCAPED_UNICODE),
                            ]);
                    }
                });
        }

        if (Schema::hasTable('experts') && ! Schema::hasColumn('experts', 'city_i18n')) {
            $after = Schema::hasColumn('experts', 'country') ? 'country' : 'title';

            Schema::table('experts', function (Blueprint $table) use ($after): void {
                $table->json('city_i18n')->nullable()->after($after);
            });

            if (Schema::hasColumn('experts', 'location')) {
                DB::table('experts')
                    ->select(['id', 'location'])
                    ->orderBy('id')
                    ->chunkById(200, function ($rows): void {
                        foreach ($rows as $row) {
                            $city = trim((string) ($row->location ?? ''));
                            DB::table('experts')
                                ->where('id', $row->id)
                                ->update([
                                    'city_i18n' => json_encode([
                                        'en' => $city,
                                        'fr' => $city,
                                        'ar' => $city,
                                    ], JSON_UNESCAPED_UNICODE),
                                ]);
                        }
                    });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('expert_applications') && Schema::hasColumn('expert_applications', 'city_i18n')) {
            Schema::table('expert_applications', function (Blueprint $table): void {
                $table->dropColumn('city_i18n');
            });
        }

        if (Schema::hasTable('experts') && Schema::hasColumn('experts', 'city_i18n')) {
            Schema::table('experts', function (Blueprint $table): void {
                $table->dropColumn('city_i18n');
            });
        }
    }
};
