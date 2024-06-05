<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmailVerification extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'custom_email_verifications';

    protected $fillable = [
        'email',
        'token',
        'expires_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
