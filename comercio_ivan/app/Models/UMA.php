<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UMA extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'umas';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'año',
        'diario',
        'mensual',
        'anual',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    /**
     * Return the current value (which is the lastest entry) for the UMAs record.
     *
     * @return mixed
     */
    public static function currentValue()
    {
        return self::orderByDesc('año')->first();
    }
}
