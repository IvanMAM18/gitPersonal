<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Validation\Validator;

class UsuarioUnicoVerificado
{
    private $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Run the validation rule.
     */
    public function __invoke(Validator $validator)
    {
        if ($this->elRequestEstaVacio()) {
            return;
        }

        $user = User::where('rfc', 'ilike', $this->data['rfc'] ?? '')
            ->orWhere('curp', 'ilike', $this->data['curp'] ?? '')
            ->first();

        if ($user instanceof User) {
            $validator->errors()->add('rfc_curp', $this->errorMessage($user->email));
        }
    }

    protected function errorMessage($email)
    {
        return __('Este RFC o CURP está vinculado al correo :email puede dar clic en recuperar contraseña o si lo requiere, acudir a las oficinas del Ayuntamiento para su cambio o corrección.', [
            'email' => censurarCorreo($email),
        ]);
    }

    /**
     * Regresa true si no se mando el rfc o el curp.
     */
    protected function elRequestEstaVacio()
    {
        return !isset($this->data['rfc']) || $this->data['rfc'] == null && !isset($this->data['curp']) || !$this->data['curp'];
    }
}
