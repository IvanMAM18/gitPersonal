<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DenueCsv extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    /*id,
    clee,
    nom_estab,
    ENCONTRADOS,
    SARE-FOLIO,
    LICENCIA 2022,
    raz_social,
    codigo_act,
    nombre_act,
    per_ocu,
    tipo_vial,
    nom_vial,
    tipo_v_e_1,
    nom_v_e_1,
    tipo_v_e_2,
    nom_v_e_2,
    tipo_v_e_3,
    nom_v_e_3,
    numero_ext,
    letra_ext,
    edificio,
    edificio_e,
    numero_int,
    letra_int,
    tipo_asent,
    nomb_asent,
    tipoCenCom,
    nom_CenCom,
    num_local,
    cod_postal,
    cve_ent,
    entidad,
    cve_mun,
    municipio,
    cve_loc,
    localidad,
    ageb,
    manzana,
    telefono,
    correoelec,
    www,
    tipoUniEco,
    latitud,
    longitud,
    fecha_alta*/
    public function up()
    {
        Schema::create('denue_csv', function (Blueprint $table) {
            $table->id();
            $table->string('ENCONTRADOS')->nullable();
            $table->string('SARE_FOLIO')->nullable();
            $table->string('LICENCIA_2022')->nullable();

            $table->string('CLAVEMUN')->nullable();
            $table->string('FOLIO')->nullable();
            $table->string('CUENTAS')->nullable();
            $table->string('CURP')->nullable();
            $table->string('RFC')->nullable();
            $table->string('NOMBRE')->nullable();
            $table->string('APELLIDO1')->nullable();
            $table->string('APELLIDO2')->nullable();
            $table->string('ESTABLECIMIENTO')->nullable();
            $table->string('DIRECCION')->nullable();
            $table->string('ENTRE')->nullable();
            $table->string('YENTRE')->nullable();

            $table->double('LATITUDE', 13, 9)->nullable();
            $table->double('LONGITUDE', 13, 9)->nullable();
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('denue_csv');
    }
}
