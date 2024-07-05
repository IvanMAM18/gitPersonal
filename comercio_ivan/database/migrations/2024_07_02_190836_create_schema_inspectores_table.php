<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $dbUser = config('database.connections.pgsql.username');
        DB::statement("CREATE SCHEMA IF NOT EXISTS inspectores");
        DB::statement("GRANT USAGE ON SCHEMA inspectores TO $dbUser");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP SCHEMA IF EXISTS inspectores CASCADE");
    }
};
