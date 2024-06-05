<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacturasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('pago_id');
            $table->unsignedInteger('persona_id');
            $table->unsignedInteger('person_moral_id');
            $table->string('folio_fiscal');
            $table->string('certificado_sat');
            $table->date('fecha_emision');
            $table->date('fecha_certificacion');
            $table->string('forma_de_pago');
            $table->string('regimen');
            $table->string('uso_de_cfdi');
            $table->string('ruta_pdf');
            $table->string('ruta_xml');
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
        Schema::dropIfExists('facturas');
    }
}
