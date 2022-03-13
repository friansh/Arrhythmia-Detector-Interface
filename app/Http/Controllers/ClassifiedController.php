<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Classified;
use App\Events\AnomalyDetected;
use App\User;

class ClassifiedController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        if ( $request->has('latest') )
            if ( $request->latest == 1 )
                return User::find( Auth::id() )->classifieds()->orderBy('created_at', 'desc')->first();

        if ( $request->has('data_per_page') )
            return User::find( Auth::id() )->classifieds()->paginate( $request->data_per_page );
        else
            return User::find( Auth::id() )->classifieds()->get();
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
        $validation = Validator::make( $request->all(), [
            'user_id' => 'required|integer|gte:0',
            'result' => 'required|integer|gte:0|lte:8'
        ]);

        if ($validation->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validation->errors()
            ]);

        $u = User::find ( $request->user_id );

        if ($request->result > 0){
            event( new AnomalyDetected( [
                'user' => $u,
                'result' => $request->result
            ]) );
        }

        $c = new Classified;
        $c->result = $request->result;
        
        if ( $u->classifieds()->save($c) )
            return response()->json(['status' => true ]);
        else
            return response()->json(['status' => false, 'message' => 'Server error' ], 500);
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function showUser( Request $request, $id )
    {

        if ( $request->has('latest') )
            if ( $request->latest == 1 )
                return User::find( $id )->classifieds()->orderBy('created_at', 'desc')->first();

            if ( $request->has('data_per_page') )
                return [
                    'user' => User::select('id', 'first_name', 'last_name', 'birthday', 'gender', 'address', 'city', 'province', 'country')->where( 'id', $id )->first(),
                    'data' => User::find( $id )->classifieds()->paginate( $request->data_per_page )
                ];
            else
                return [
                    'user' => User::select('id', 'first_name', 'last_name', 'birthday', 'gender', 'address', 'city', 'province', 'country')->where( 'id', $id )->first(),
                    'data' => User::find( $id )->classifieds()->get()
                ];
    }

    public function showAbnormal( Request $request ) {
        $data = [];

        foreach ( User::select()->get() as $u ) {
            $classifieds = $u->classifieds()->first();
            if ( $classifieds != null and $classifieds->result != 0 )
                array_push( $data, [ 
                    'user' => [ 
                        'id' => $u->id,
                        'name' => $u->first_name . ' ' . $u->last_name
                    ],
                    'classified' => $u->classifieds()->first()
                ]);
        }

        if ( $request->has('count') )
            if ( $request->count == 1 )
                return response()->json( [
                    'status' => true,
                    'data' => [ 
                        'count' => count($data)
                    ]
                ] );
                
        return response()->json( [
            'status' => true,
            'data' => $data
        ]);
        // return Classified::select()->with('user:id,first_name,last_name')->get();
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

    public function getRaws(Request $request, $id) {
        $result = [];
        foreach (Classified::find( $id )->raws()->get() as $r) {
            array_push($result, $r->data);
        }
        return response()->json([
            'analysis' => Classified::find( $id )->get()->first(),
            'ecg' => $result
        ]);
    }
}
