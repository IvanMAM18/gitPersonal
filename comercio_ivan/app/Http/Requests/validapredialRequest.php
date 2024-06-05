<?php

namespace App\Http\Requests;

use App\Rules\validapredial;
use Illuminate\Foundation\Http\FormRequest;

class validapredialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'txtfoliocata' => ['required', new validapredial('uso_pre', 'folio_pre')],

        ];
    }
}
