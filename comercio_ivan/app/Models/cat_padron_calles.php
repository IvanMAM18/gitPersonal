<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cat_padron_calles extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.cat_inegi_vialidades_bcs'; // <-- El nombre personalizado
}
