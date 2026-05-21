<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('experts', 'region_scope')) {
            Schema::table('experts', function (Blueprint $table): void {
                $table->string('region_scope', 32)->nullable()->after('country');
                $table->index('region_scope');
            });
        }

        if (! Schema::hasColumn('expert_applications', 'region_scope')) {
            Schema::table('expert_applications', function (Blueprint $table): void {
                $table->string('region_scope', 32)->nullable()->after('country');
                $table->index('region_scope');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('experts', 'region_scope')) {
            Schema::table('experts', function (Blueprint $table): void {
                $table->dropIndex(['region_scope']);
                $table->dropColumn('region_scope');
            });
        }

        if (Schema::hasColumn('expert_applications', 'region_scope')) {
            Schema::table('expert_applications', function (Blueprint $table): void {
                $table->dropIndex(['region_scope']);
                $table->dropColumn('region_scope');
            });
        }
    }
};
