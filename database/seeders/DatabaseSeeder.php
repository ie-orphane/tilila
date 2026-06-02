<?php

namespace Database\Seeders;

use App\Models\HomeHighlight;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Schema::hasTable('home_highlights')) {
            HomeHighlight::query()->delete();
        }

        User::query()->updateOrCreate(
            ['email' => 'test.admin@example.com'],
            [
                'name' => 'Test Admin',
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
        );

        $this->call(ExpertSeeder::class);
        $this->call(OpportunitySeeder::class);
        $this->call(EventSeeder::class);
        $this->call(TililaEditionSeeder::class);
        $this->call(TililabEditionSeeder::class);
        $this->call(MediaItemSeeder::class);
        $this->call(MediaSidebarSettingSeeder::class);
        $this->call(HeroSlideSeeder::class);
        $this->call(TililaConnectRequestSeeder::class);
        $this->call(NewsletterSubscriptionSeeder::class);
    }
}
