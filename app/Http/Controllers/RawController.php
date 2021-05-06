<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\User;

class RawController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
        ]);

        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        return response()->json( User::find( Auth::id() )->raws()
                                    ->whereDate( 'created_at', '=', $request->date)
                                    ->whereTime( 'created_at', '>=', $request->start_time)
                                    ->whereTime( 'created_at', '<=', $request->end_time)
                                    ->get() );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate( $request, [
            'data' => 'required'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function showUser( Request $request, $id)
    {
        $validator = Validator::make( $request->all(), [
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
        ]);

        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        return [
            'user' => User::select('id', 'first_name', 'last_name', 'birthday', 'address', 'city', 'province', 'country')->where( 'id', $id )->first(),
            'data' => User::find( $id )->raws()
                                        ->whereDate( 'created_at', '=', $request->date)
                                        ->whereTime( 'created_at', '>=', $request->start_time)
                                        ->whereTime( 'created_at', '<=', $request->end_time)
                                        ->get()
        ];
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
    public function update(Request $request, $id)
    {
        //
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
