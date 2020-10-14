<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group( [ 'prefix' => 'data', 'middleware' => 'auth:api' ], function() {
    Route::get('/dashboard', 'UserController@userDashboard');
    Route::get('/classified', 'ClassifiedController@index');
    Route::get('/raw', 'RawController@index');
});

Route::group( [ 'middleware' => 'doctor:api' ], function() {
    Route::get('/user', 'UserController@index');
    Route::post('/user/search', 'UserController@search');
    Route::get('/data/raw/{id}', 'RawController@showUser');
    Route::get('/data/classified/{id}', 'ClassifiedController@showUser');
    Route::get('/abnormal', 'ClassifiedController@showAbnormal');
    Route::get('/doctor/dashboard', 'UserController@doctorDashboard');
});

Route::group( [ 'middleware' => 'admin:api', 'prefix' => 'admin' ], function() {
    Route::get('/dashboard', 'UserController@adminDashboard');
    Route::post('/promote', 'UserController@promote');
    Route::get('/applicant', 'UserController@indexDoctorApplicant');
});

Route::post( '/login', 'UserController@login' );
Route::post( '/register', 'UserController@register' );
Route::get( '/active', 'UserController@active' )->middleware('auth:api');
Route::get( '/device', 'DeviceController@index' )->middleware('auth:api');
Route::post( '/device/refresh', 'DeviceController@refreshToken' )->middleware('auth:api');