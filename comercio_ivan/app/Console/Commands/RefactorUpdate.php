<?php

namespace App\Console\Commands;

use App\Models\Negocio;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RefactorUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:refactor-update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refactor';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->moverTramites();
        $this->verificarUsuarios();

        return Command::SUCCESS;
    }

    protected function moverTramites()
    {
        DB::beginTransaction();

        $tramites = \App\Models\Tramite::whereNull('tramitable_type')->withTrashed()->get();

        foreach ($tramites as $tramite) {
            $tramiteDeComercio = DB::table('tramites_comercio')->where('tramite_id', $tramite->id)->first();
            if ($tramiteDeComercio) {
                $tramite->update([
                    'tramitable_type' => Negocio::class,
                    'tramitable_id' => $tramiteDeComercio->negocio_id,
                    'created_at' => $tramiteDeComercio->created_at,
                    'updated_at' => $tramiteDeComercio->updated_at,
                    'deleted_at' => $tramiteDeComercio->deleted_at,
                ]);
            }

            $tramitesPersona = DB::table('tramites_personas')->where('tramite_id', $tramite->id)->first();
            if ($tramitesPersona) {
                $tramite->update([
                    'tramitable_type' => $tramitesPersona->persona_type,
                    'tramitable_id' => $tramitesPersona->persona_id,
                    'created_at' => $tramitesPersona->created_at,
                    'updated_at' => $tramitesPersona->updated_at,
                    'deleted_at' => $tramitesPersona->deleted_at,
                ]);
            }
        }

        DB::commit();
    }

    protected function verificarUsuarios()
    {

        $users = User::whereNull('email_verified_at')->withTrashed()->get();

        DB::beginTransaction();

        foreach ($users as $user) {
            $user->update(['email_verified_at' => $user->created_at]);
        }

        DB::commit();
    }
}
