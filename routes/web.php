<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function() {
    return view('landing');
})->name('landing');

Route::group( [ 'prefix' => 'login' ], function() { 
    Route::get('/', function() {
        return view('login');
    })->name('login')->middleware('guest');
});

Route::group( [ 'prefix' => 'register' ], function() { 
    Route::get('/', function() {
        return view('register');
    });
    Route::post('/', 'UserController@register');
});

Route::group( ['prefix' => 'admin'], function() {
    Route::get('/', function() {
        return view('admin.dashboard');
    });
    Route::get('/promote', function() {
        return view('admin.promote');
    });
    Route::get('/manage/user', function() {
        return view('admin.manageuser');
    });
    Route::get('/manage/doctor', function() {
        return view('admin.managedoctor');
    });

} );

Route::group( [ 'prefix' => 'doctor' ], function() {
    Route::get('/', function() {
        return view('doctor.dashboard');
    });

    Route::get('/messages', function() {
        return view('doctor.messages');
    });

    Route::get('/history/{id}', function( $id ) {
        return view('doctor.history', [
            'user_id' => $id
        ]);
    });


    Route::get('/ecg/{id}', function( $id ){
        return view('doctor.raw', [
            'user_id' => $id
        ]);
    });


    Route::get('/classified/{id}', function( $id ) {
        return view('doctor.classified', [
            'user_id' => $id
        ]);
    });
});


Route::group( [ 'prefix' => 'user' ], function() {
    Route::get('/', function() {
        return view('dashboard');
    });

    Route::get('/history', function() {
        return view('history');
    });

    Route::get('/ecg', function() {
        return view('ecg');
    });

    Route::get('/classified', function() {
        return view('classified');
    });

    Route::get('/profile', function() {
        return view('profile');
    });

    Route::get('/message', 'UserController@message');
} );

Route::group( [ 'prefix' => 'data' ], function() {
    Route::post('/', 'RawController@index');
});
