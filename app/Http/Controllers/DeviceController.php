<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\User;

class DeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::find( Auth::id() )->device()->first();
    }

    public function refreshToken() {
        $user = User::find( Auth::id() );
        $device = $user->device()->first();
        $device->token = Str::random(256);

        if ( $user->device()->save( $device ) ) 
            return response()->json([
                'status' => true,
                'token' => $device->token
            ]);

        return response()->json([
            'status' => false,
            'message' => 'Server error'
        ], 500);

    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateBattery(Request $request, $id)
    {
        $validator = Validator::make( $request->all(), [
            'value' => 'required|integer|gte:0|lte:100',
            ]);
            
            
        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        $device = User::find( $id )->device()->first();
        $device->battery = $request->value;

        if ( $device->save() ) 
            return response()->json([
                'status' => true,
                'token' => 'The devices battery value has been updated.'
            ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
