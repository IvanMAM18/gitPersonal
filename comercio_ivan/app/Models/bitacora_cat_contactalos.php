<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class bitacora_cat_contactalos extends Model
{
    protected $connection = 'pgsql';

    protected $table = 'public.bitacora_cat_contactalos'; // <-- El nombre personalizado

    protected $primaryKey = 'id_contactalos';
}
