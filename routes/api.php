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

Route::group([ 'middleware' => 'api', 'prefix' => 'auth' ], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    // Route::post('me', 'AuthController@me');
});

// Route::middleware('auth')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group( [ 'prefix' => 'data', 'middleware' => 'auth:api' ], function() {
    Route::get('/dashboard', 'UserController@userDashboard');
    Route::get('/classified', 'ClassifiedController@index');
    Route::get('/raw', 'RawController@index');
});

Route::group( [ 'middleware' => 'doctor' ], function() {
    Route::get('/user', 'UserController@index');
    Route::patch('/user', 'UserController@update');
    Route::post('/user/search', 'UserController@search');
    Route::get('/data/raw/{id}', 'RawController@showUser');
    Route::get('/data/classified/{id}', 'ClassifiedController@showUser');
    Route::get('/abnormal', 'ClassifiedController@showAbnormal');
    Route::get('/doctor/dashboard', 'UserController@doctorDashboard');
});

Route::group( [ 'middleware' => 'admin', 'prefix' => 'admin' ], function() {
    Route::get('/dashboard', 'UserController@adminDashboard');
    Route::get('/doctor', 'UserController@indexDoctor');
    Route::post('/promote', 'UserController@promote');
    Route::get('/applicant', 'UserController@indexDoctorApplicant');
    Route::get('/user/{id}', 'UserController@show');
    Route::get('/doctor/{id}', 'UserController@showDoctor');
});

Route::post( '/register', 'UserController@register' );
Route::get( '/active', 'UserController@active' )->middleware('auth');
Route::get( '/device', 'DeviceController@index' )->middleware('auth');
Route::post( '/device/refresh', 'DeviceController@refreshToken' )->middleware('auth');
Route::put('/classifier', 'ClassifiedController@store');