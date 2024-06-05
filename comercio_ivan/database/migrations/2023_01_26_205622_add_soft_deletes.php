<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class AddSoftDeletes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('condicionante_entidad', function ($table) {
            $table->timestamp('deleted_at')->nullable();
        });
        Schema::table('condicionantes_revisions', function ($table) {
            $table->timestamp('deleted_at')->nullable();
        });
        Schema::table('incisos', function ($table) {
            $table->timestamp('deleted_at')->nullable();
        });
        Schema::table('refrendos', function ($table) {
            $table->timestamp('deleted_at')->nullable();
        });
        Schema::table('resolutivos', function ($table) {
            $table->timestamp('deleted_at')->nullable();
        });
        Schema::table('tramites', function ($table) {
            $table->timestamp('deleted_at')->nullable();
        });
        Schema::table('validar_refrendos', function ($table) {
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
        //
    }
}
