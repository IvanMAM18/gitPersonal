<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateTemporalUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('temporal_users', function ($table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido_pat');
            $table->string('apellido_mot')->nullable();
            $table->integer('role_id')->nullable();
            $table->integer('entidad_revision_id')->nullable();
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('curp')->nullable();
            $table->string('rfc')->nullable();
            $table->string('telefono')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('temporal_users');
    }
}
