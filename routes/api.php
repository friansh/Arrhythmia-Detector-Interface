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

Route::group( [ 'prefix' => 'data', 'middleware' => 'auth' ], function() {
    Route::get('/dashboard', 'UserController@userDashboard');
    Route::get('/classified/raw/{id}', 'ClassifiedController@getRaws');
    Route::get('/classified', 'ClassifiedController@index');
    Route::get('/raw', 'RawController@index');
});

Route::group( [ 'middleware' => 'doctor' ], function() {
    Route::get('/user', 'UserController@index');
    Route::post('/user/search', 'UserController@search');
    Route::get('/data/raw/{id}', 'RawController@showUser');
    Route::get('/data/classified/{id}', 'ClassifiedController@showUser');
    Route::get('/abnormal', 'ClassifiedController@showAbnormal');
    Route::get('/doctor/dashboard', 'UserController@doctorDashboard');
});

Route::group( [ 'middleware' => 'admin', 'prefix' => 'admin' ], function() {
    Route::get('/doctor', 'UserController@indexDoctor');
    Route::get('/doctor/search', 'UserController@searchDoctor');
    Route::get('/doctor/{id}', 'UserController@showDoctor');
    Route::delete('/doctor/{id}', 'UserController@rejectDoctorApplicant');
    Route::get('/dashboard', 'UserController@adminDashboard');
    Route::post('/promote/{id}', 'UserController@promote');
    Route::post('/demote/{id}', 'UserController@demote');
    Route::get('/applicant', 'UserController@indexDoctorApplicant');
    Route::get('/applicant/search', 'UserController@searchDoctorApplicant');
    Route::get('/user/search', 'UserController@search');
    Route::get('/user/{id}', 'UserController@show');
    Route::delete('/user/{id}', 'UserController@destroy');
});

Route::group( [ 'middleware' => 'auth' ], function() {
    Route::patch( '/password', 'UserController@changePassword');
    Route::patch('/user', 'UserController@update');
    Route::put( '/doctor', 'UserController@applyDoctor');
    Route::get( '/active', 'UserController@active' );
    Route::get( '/device', 'DeviceController@index' );
    Route::post( '/device/refresh', 'DeviceController@refreshToken' );
} );

Route::post( '/register', 'UserController@register' );
Route::put('/classifier', 'ClassifiedController@store');
Route::patch('/battery/{id}', 'DeviceController@updateBattery');