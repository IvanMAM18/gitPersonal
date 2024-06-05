<?php

namespace App\Rules;

use App\Services\CatastroGateway;
use Illuminate\Contracts\Validation\Rule;

class ValidateRFC implements Rule
{
    private CatastroGateway $catastro;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->catastro = resolve(CatastroGateway::class);
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $response = $this->catastro->validarRfc($value);

        return $response['cancelado'] === false && $response['localizado'] === true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'El RFC que ingreso no es valido, no puede continuar con su registro';
    }
}
