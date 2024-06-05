<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class BotTelegramController extends Controller
{
    public function enviarMensaje($request)
    {
        $botToken = '6510858519:AAFsZDg59JGoV5WesZEtIhehTfBRXxW_4rE';
        $chatId = '-1001921616650';
        $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $request,
            'parse_mode' => 'HTML',
        ]);
    }
}
