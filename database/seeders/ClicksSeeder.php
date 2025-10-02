<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ShortenedLink;
use Illuminate\Support\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClicksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $links = ShortenedLink::all();
        $projects = Project::all();

        // Buat 10 record saja
        foreach (range(1, 10) as $i) {
            if (rand(0, 1) === 0 && $links->count() > 0) {
                // Insert ke url_clicks
                $link = $links->random();
                DB::table('url_clicks')->insert([
                    'shortened_link_id' => $link->id,
                    'ip_address'        => $faker->ipv4,
                    'user_agent'        => $faker->userAgent,
                    'referer'           => $faker->url,
                    'country'           => $faker->country,
                    'created_at'        => now()->subDays(rand(0, 29))->setTime(rand(0, 23), rand(0, 59), rand(0, 59)),
                    'updated_at'        => now(),
                ]);
            } elseif ($projects->count() > 0) {
                // Insert ke project_clicks
                $project = $projects->random();
                DB::table('project_clicks')->insert([
                    'project_id'  => $project->id,
                    'ip_address'  => $faker->ipv4,
                    'user_agent'  => $faker->userAgent,
                    'referer'     => $faker->url,
                    'country'     => $faker->country,
                    'created_at'  => now()->subDays(rand(0, 29))->setTime(rand(0, 23), rand(0, 59), rand(0, 59)),
                    'updated_at'  => now(),
                ]);
            }
        }
    }
}
