<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChirpController;
use Illuminate\Support\Facades\Route;
use App\Models\Chirp;

// Route::get('/', function () {
//     return view('welcome');
// });
//Lo de arriba es lo mismo que lo de abajo pero simplificado

Route::view('/','Welcome')->name('welcome');

// Reedireccion de rutas con nombre

// Route::get('/twitter', function(){
//     return 'Welcome twwitter';
// })->name('chirps.index');

// Route::get('/chirps/{chirps}', function($chirp){
//     if($chirp === '2'){
//         return to_route('chirps.index');
//     }
//     return 'Chirp detail '. $chirp;
// });

Route::middleware('auth')->group(function () {
    Route::view('/dashboard', 'dashboard')->name('dashboard');

    Route::get('/chirps', [ChirpController::class, 'index'])->name('chirps.index');
    Route::post('/chirps', [ChirpController::class,'store'])->name('chirps.store');
    Route::get('/chirps/{chirp}/edit', [ChirpController::class,'edit'])->name('chirps.edit');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
