<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusBackupColumnToNegocio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('negocios', function (Blueprint $table) {

            if (! isProduction()) {
                DB::statement('DROP TYPE IF EXISTS status_enum');
            }

            DB::statement("CREATE TYPE status_enum AS ENUM('VISTO BUENO', 'RECHAZADO', 'PAGADO', 'EN REVISION', 'APROBADO', 'ENVIADO')");

            DB::statement('ALTER TABLE negocios ADD COLUMN status_new status_enum;');
            DB::statement('UPDATE negocios SET status_new = status::status_enum');
            DB::statement('ALTER TABLE negocios DROP COLUMN status');

            DB::statement('ALTER TABLE negocios ADD COLUMN status status_enum');
            DB::statement('UPDATE negocios SET status = status_new::status_enum');

            DB::statement('ALTER TABLE negocios DROP COLUMN status_new');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('negocios', function (Blueprint $table) {
            //            DB::statement("DROP TYPE status_enum");
        });
    }
}
