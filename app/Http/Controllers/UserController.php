<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Classified;
use App\Doctor;
use App\Device;
use App\User;
use App\Raw;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function userDashboard() {
        $activeUser = User::find( Auth::id() );

        $userFullName = $activeUser->first_name . ' ' . $activeUser->last_name;
        $lastData = $activeUser->raws()->select('id', 'user_id', 'created_at')->orderBy('created_at', 'desc')->first();
        $condition = $activeUser->classifieds()->select('id', 'user_id', 'result')->orderBy('created_at', 'desc')->first();
        $battery = $activeUser->device()->select('id', 'user_id', 'battery')->first();
        $dataSummary = $activeUser->classifieds()->select('id', 'user_id', 'result')->orderBy('created_at', 'desc')->take(10)->get();
        $conditionSummary = [
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 0)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 1)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 2)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 3)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 4)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 5)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 6)->count(),
            $activeUser->classifieds()->select('id', 'user_id', 'result')->where('result', 7)->count(),
        ];

        return response()->json( [
            'fullName' => $userFullName,
            'lastData' => $lastData,
            'condition' => $condition,
            'battery' => $battery,
            'dataSummary' => $dataSummary,
            'conditionSummary' => $conditionSummary
        ] );
    }

    public function indexDoctorApplicant() {
        $applicant = Doctor::where('verified', false)->with('user')->get();
        return response()->json(['status' => true, 'data' => $applicant]);
    }

    public function doctorDashboard() {
        $activeUser = User::find( Auth::id() );
        $userFullName = $activeUser->first_name . ' ' . $activeUser->last_name;

        return response()->json( [
            'summary' => [
                'user' => User::all()->count()
            ],
            'user' => $activeUser,
            'doctor' => $activeUser->doctor()->first()
        ] );
    }

    public function adminDashboard() {
        $activeUser = User::find( Auth::id() );
        $userFullName = $activeUser->first_name . ' ' . $activeUser->last_name;

        return response()->json( [
            'summary' => [
                'user' => User::all()->count(),
                'doctor' => Doctor::where('verified', true)->count(),
                'applicants' => Doctor::where('verified', false)->count(),
            ],
            'user' => $activeUser,
            'doctor' => $activeUser->doctor()->first()
        ] );
    }

    public function search( Request $request ) {
        return User::where('first_name', 'like', $request->first_name . '%')
                    ->where('last_name', 'like', $request->last_name . '%')
                    ->get();
    }

    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request  )
    {
        if ( $request->has('data_per_page') )
            return User::select()->paginate( $request->data_per_page );
        else
            return User::all();
    }

    public function indexDoctor() {
        $applicant = Doctor::where('verified', true)->with('user')->get();
        return response()->json(['status' => true, 'data' => $applicant]);
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
        return response()->json( User::find($id) );
    }

    public function showDoctor($id)
    {
        return response()->json( User::find($id)->doctor()->first() );
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

    public function login( Request $request ) {
        $validator = Validator::make( $request->all(), [
            'email' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        $credentials = $request->only('email', 'password');
        if ( Auth::attempt( $credentials ) ) 
            return response()->json( [ 
                'status' => true,
                'message' => 'Logged in.',
                'token' => User::find( Auth::id() )->api_token
            ] );
        else
            return response()->json( [ 
                'status' => false,
                'message' => 'Incorrect credential.'
            ] );
    }

    public function logout() {
        Auth::logout();
        return redirect(route('landing'));
    }

    public function register( Request $request ) {
        $validator = Validator::make( $request->all(), [
            'password' => 'required',
            'birthday' => 'required|date',
            'email' => 'required|email|unique:users,email',
            'first_name' => 'required|max:20',
            'last_name' => 'required|max:50',
            'address' => 'required|max:200',
            'zip_code' => 'required|gte:0|integer',
            'city' => 'required',
            'province' => 'required',
            'country' => 'required',
        ]);

        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        $user = new User;
        $user->password = Hash::make($request->password);
        $user->api_token = Str::random(256);
        $user->email = $request->email;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->address = $request->address;
        $user->zip_code = $request->zip_code;
        $user->city = $request->city;
        $user->province = $request->province;
        $user->country = $request->country;
        $user->api_token_generated = time();

        $birthday = new \DateTime($request->birthday);
        $user->birthday = $birthday->format('Y-m-d H:i:s');
        
        $saveUser = $user->save();

        $device = new Device;
        $device->token = Str::random(256);
        $device->battery = 0;

        $saveDevice = $user->device()->save( $device );

        if ( $saveUser && $saveDevice ) 
            return response()->json( [
                'status' => true,
            ]);
        else 
            return response()->json( [
                'status' => false,
                'message' => 'Failed to save.'
            ]);
    }

    public function active() {
        if ( Auth::check() )
            return response()->json([
                'user' => Auth::user(),
                'doctor' => Doctor::where( 'user_id', Auth::id() )->first()
            ]);
            // return response()->json([ Auth::user()]);
        else 
            return response()->json([
                'status' => 'false',
                'message' => 'There is no user has logged in.'
            ]);
    }

    public function promote( Request $request ) {
        $validator = Validator::make( $request->all(), [
            'user_id' => 'required|integer|gte:0'
        ]);

        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        $user = User::find( $request->user_id );

        if ( $user == null )
            return response()->json( [
                'status' => false,
                'message' => 'User not found'
            ]);

        $doctor = $user->doctor();

        if ( !$doctor->exists() )
            return response()->json( [
                'status' => false,
                'message' => 'Doctor application does not found'
            ]);

        $doctor = $doctor->first();
        $doctor->verified = true;

        if ( $user->doctor()->save( $doctor ) ) 
            return response()->json( [
                'status' => true,
            ]);
        else 
            return response()->json( [
                'status' => false,
                'message' => 'Failed to promote.'
            ]);
    }
}
