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

        // Generate data 30 hari terakhir
        foreach (range(0, 29) as $i) {
            $date = Carbon::now()->subDays($i);

            // Untuk setiap ShortenedLink, buat random klik harian
            foreach ($links as $link) {
                $count = rand(10, 50); // jumlah klik random per hari
                for ($j = 0; $j < $count; $j++) {
                    DB::table('url_clicks')->insert([
                        'shortened_link_id' => $link->id,
                        'ip_address'        => $faker->ipv4,
                        'user_agent'        => $faker->userAgent,
                        'referer'           => $faker->url,
                        'country'           => $faker->country,
                        'created_at'        => $date->copy()->setTime(rand(0, 23), rand(0, 59), rand(0, 59)),
                        'updated_at'        => now(),
                    ]);
                }
            }

            // Untuk setiap Project, buat random klik harian
            foreach ($projects as $project) {
                $count = rand(5, 30);
                for ($j = 0; $j < $count; $j++) {
                    DB::table('project_clicks')->insert([
                        'project_id'  => $project->id,
                        'ip_address'  => $faker->ipv4,
                        'user_agent'  => $faker->userAgent,
                        'referer'     => $faker->url,
                        'country'     => $faker->country,
                        'created_at'  => $date->copy()->setTime(rand(0, 23), rand(0, 59), rand(0, 59)),
                        'updated_at'  => now(),
                    ]);
                }
            }
        }
    }
}
