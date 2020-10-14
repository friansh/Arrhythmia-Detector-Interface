@extends('layouts.material')

@section('content')
    <div id="register" data-csrf-token="{{ csrf_token() }}"></div>
@endsection