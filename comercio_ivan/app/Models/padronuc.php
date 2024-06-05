<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class padronuc extends Model
{
    protected $conecction = 'oracle';

    protected $table = 'contribuyentes.padronuc'; // <-- El nombre personalizado

    protected $primaryKey = 'id_puc';

    protected $dateFormat = 'd-m-Y';
}
