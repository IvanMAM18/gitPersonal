<?php

use Doctrine\DBAL\Types\Type;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateImpactoGiroComercialToNegociosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement("ALTER TABLE negocios ALTER COLUMN impacto_giro_comercial ENUM('bajo_impacto', 'mediano_alto_impacto') NOT NULL");
        // DB::statement("CREATE TYPE impacto_giro_comercial_enum AS ENUM ('bajo_impacto', 'mediano_alto_impacto');");
        // DB::statement("ALTER TABLE negocios ALTER COLUMN impacto_giro_comercial TYPE impacto_giro_comercial_enum  USING impacto_giro_comercial::text::impacto_giro_comercial_enum;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('negocios', function (Blueprint $table) {
            // $table->dropColumn('impacto_giro_comercial');
        });
    }
}
