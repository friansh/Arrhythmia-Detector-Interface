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
use PhpParser\Comment\Doc;

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
            'gender' => $activeUser->gender,
            'birthday' => $activeUser->birthday,
            'lastData' => $lastData,
            'condition' => $condition,
            'battery' => $battery,
            'dataSummary' => $dataSummary,
            'conditionSummary' => $conditionSummary
        ] );
    }

    public function indexDoctorApplicant(Request $request) {
        $applicant = Doctor::where('verified', false)->join('users', 'doctors.user_id', '=', 'users.id');
        
        if ( $request->has('data_per_page') )
            return $applicant->paginate( $request->data_per_page );
        else
            return $applicant->get();
    }

    public function doctorDashboard() {
        $activeUser = User::find( Auth::id() );

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
        if ( $request->has('data_per_page') )
            return User::where('first_name', 'like', $request->first_name . '%')
                        ->where('last_name', 'like', $request->last_name . '%')
                        ->paginate($request->data_per_page );
        else
            return User::where('first_name', 'like', $request->first_name . '%')
                        ->where('last_name', 'like', $request->last_name . '%')
                        ->get();
    }

    public function searchDoctor( Request $request ) {
        if ( $request->has('data_per_page') )
            return User::where('first_name', 'like', $request->first_name . '%')
                        ->where('last_name', 'like', $request->last_name . '%')
                        ->join('doctors', 'users.id', '=', 'doctors.user_id')
                        ->where('doctors.verified', true)
                        ->paginate( $request->data_per_page );
        else
            return User::where('first_name', 'like', $request->first_name . '%')
                        ->where('last_name', 'like', $request->last_name . '%')
                        ->join('doctors', 'users.id', '=', 'doctors.user_id')
                        ->where('doctors.verified', true)
                        ->get();

        
    }

    public function searchDoctorApplicant( Request $request ) {
        if ( $request->has('data_per_page') )
            return User::where('first_name', 'like', $request->first_name . '%')
                        ->where('last_name', 'like', $request->last_name . '%')
                        ->join('doctors', 'users.id', '=', 'doctors.user_id')
                        ->where('doctors.verified', false)
                        ->paginate( $request->data_per_page );
        else
            return User::where('first_name', 'like', $request->first_name . '%')
                        ->where('last_name', 'like', $request->last_name . '%')
                        ->join('doctors', 'users.id', '=', 'doctors.user_id')
                        ->where('doctors.verified', false)
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

    public function indexDoctor(Request $request) {
        $doctor = Doctor::where('verified', true)->join('users', 'doctors.user_id', '=', 'users.id');

        if ( $request->has('data_per_page') )
            return $doctor->paginate( $request->data_per_page );
        else
            return $doctor->get();

    }

    public function changePassword( Request $request ) {
        $validator = Validator::make( $request->all(), [
            'old_password' => 'required',
            'new_password' => 'required',
            'new_password_confirm' => 'required'
            ]);
            
            
        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);
        
        $u = Auth::user();

        if ( !Hash::check($request->old_password, $u->password) )
            return response()->json( [
                'status' => false,
                'message' => 'Incorrect old password.'
            ]);

        if ( $request->new_password !== $request->new_password_confirm ) 
            return response()->json( [
                'status' => false,
                'message' => 'Password and the confirmation value wasnt same.'
            ]);

        $u->password = Hash::make( $request->new_password );

        if ( $u->save() )
            return response()->json(['status' => true]);
        else
            return response()->json( [
                'status' => false,
                'message' => 'Failed to save.'
            ]);
    }

    public function rejectDoctorApplicant( $id ) {
        $u = User::find( $id );
        
        if ( $u == null )
        return response()->json( [
            'status' => false,
            'message' => 'User not found'
        ]);

        if ( $u->doctor()->doesntExist() )
            return response()->json( [
                'status' => false,
                'message' => 'Applicant does not exist.'
            ]);  

        if ( $u->doctor()->first()->verified )
            return response()->json( [
                'status' => false,
                'message' => 'Cannot reject validated doctor.'
            ]);   

        if ( $u->doctor()->first()->delete() ) 
            return response()->json(['status' => true]);
        else
            return response()->json( [
                'status' => false,
                'message' => 'Failed to reject.'
            ]);
    }

    public function demote( $id) {
        $user = User::find( $id );
        
        if ( $user == null )
            return response()->json( [
                'status' => false,
                'message' => 'User not found'
            ]);

        $d = $user->doctor();

        if ( $d->doesntExist() )
            return response()->json( [
                'status' => false,
                'message' => 'Applicant does not exist.'
            ]);  

        $d = $d->first();

        if ( !$d->verified )
            return response()->json( [
                'status' => false,
                'message' => 'Cannot demote unvalidated doctor.'
            ]);   

        $d->verified = false;

        if ( $d->save() ) 
            return response()->json(['status' => true]);
        else
            return response()->json( [
                'status' => false,
                'message' => 'Failed to demote.'
            ]);
    }

    public function applyDoctor( Request $request ) {
        $validator = Validator::make( $request->all(), [
            'qualification' => 'required|max:100',
            'str_number' => 'required|max:50',
            'file_number' => 'required|integer|gte:0',
            'application_date' => 'required|date',
            'valid_until' => 'required|date',
            'city' => 'required|max:100',
        ]);

        if ($validator->fails()) 
            return response()->json( [
                'status' => false,
                'message' => $validator->errors()
            ]);

        $d = Auth::user()->doctor();

        if ( $d->exists() )
            return response()->json( [
                'status' => false,
                'message' => "You already have a doctor application."
            ]);

        $a = new Doctor;
        $a->qualification = $request->qualification;
        $a->str_number = $request->str_number;
        $a->file_number = $request->file_number;

        $ad = new \DateTime($request->application_date);
        $a->application_date = $ad->format('Y-m-d H:i:s');

        $vu = new \DateTime($request->valid_until);
        $a->valid_until = $vu->format('Y-m-d H:i:s');

        $a->city = $request->city;
        $a->verified = false;

        if ( $d->save( $a ) )
            return response()->json(['status' => true]);
        else
            return response()->json( [
                'status' => false,
                'message' => "Failed to save."
            ]);

            
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
    public function update(Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'birthday' => 'required|date',
            'first_name' => 'required|max:20',
            'last_name' => 'required|max:50',
            'gender' => 'required|boolean',
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

        $user = User::find(auth()->id());
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->gender = $request->gender;
        $user->address = $request->address;
        $user->zip_code = $request->zip_code;
        $user->city = $request->city;
        $user->province = $request->province;
        $user->country = $request->country;

        $birthday = new \DateTime($request->birthday);
        $user->birthday = $birthday->format('Y-m-d H:i:s');

        if ( $user->save() ) 
            return response()->json( [
                'status' => true,
            ]);
        else 
            return response()->json( [
                'status' => false,
                'message' => 'Failed to save.'
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
        $u = User::find( $id );

        Raw::where('user_id', $u->id)->delete();
        Classified::where('user_id', $u->id)->delete();
        Doctor::where('user_id', $u->id)->delete();
        
        if ( $u->delete() ) 
            return response()->json( [
                'status' => true,
            ]);
        else 
            return response()->json( [
                'status' => false,
                'message' => 'Failed to delete.'
            ]);
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
        $user->email = $request->email;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->address = $request->address;
        $user->zip_code = $request->zip_code;
        $user->city = $request->city;
        $user->province = $request->province;
        $user->country = $request->country;

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

    public function promote( $id ) {
        $user = User::find( $id );

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

        if ( $doctor->verified )
            return response()->json( [
                'status' => false,
                'message' => 'Cannot promote validated doctor.'
            ]);   

        $doctor->verified = true;

        if ( $doctor->save() ) 
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
