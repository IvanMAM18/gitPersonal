<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Http;

class validapredial implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    private $uso_p;

    private $folio_p;

    public function __construct($uso_predio, $folio_predio)
    {

        $this->uso_p = $uso_predio;
        $this->folio_p = $folio_predio;
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
        $validapredial1 = Http::post('200.200.200.18:8080/catastro/authenticate', [
            'username' => 'prueba2',
            'password' => 'prueba2?54',
        ]);

        $validapredial2 = Http::withToken($validapredial1->json(['token']))->accept('application/json')->post('200.200.200.18:8080/catastro/otros', [
            'query' => $this->folio_p,
            'tipo' => $this->uso_p,
            'hasta' => '',
        ]);

        if ($validapredial2->successful() == 1) {
            $periodopago = $validapredial2->json(['ult_pago_periodo']);
            $bimestre_pago = substr($periodopago, 8, 2);
            $ano_pago = substr($periodopago, 10, strlen($periodopago));

            $fechaactual = now();
            $mes_actual = $fechaactual->format('m');
            $ano_ctual = $fechaactual->format('Y');
            $bimestre = 0;

            switch ($mes_actual) {
                case '01':
                    $bimestre = 1;
                    break;
                case '02':
                    $bimestre = 1;
                    break;
                case '03':
                    $bimestre = 2;
                    break;
                case '04':
                    $bimestre = 2;
                    break;
                case '05':
                    $bimestre = 3;
                    break;
                case '06':
                    $bimestre = 3;
                    break;
                case '07':
                    $bimestre = 4;
                    break;
                case '08':
                    $bimestre = 4;
                    break;
                case '09':
                    $bimestre = 5;
                    break;
                case '10':
                    $bimestre = 5;
                    break;
                case '11':
                    $bimestre = 6;
                    break;
                case '12':
                    $bimestre = 6;
                    break;
            }

            if ($ano_pago == $ano_ctual) {
                if ($bimestre_pago >= $bimestre) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'el predial no esta pagado';
    }
}
