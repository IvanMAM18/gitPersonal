<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InspectoresUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nombre' => 'inspectores_api_key',
            'email' => 'inspectores@api.key',
            'password' => bcrypt(Str::random(80)),
            'apellido_pat' => 'Inspectores',
            'api_token' => bcrypt(Str::random(80)),
        ]);
    }
}
