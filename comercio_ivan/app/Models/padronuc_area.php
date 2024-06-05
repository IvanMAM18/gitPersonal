<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padronuc_area extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.padronuc_area'; // <-- El nombre personalizado

    protected $primaryKey = 'id_padron_foraneo';
}
