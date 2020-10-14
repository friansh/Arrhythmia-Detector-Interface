<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;
use Closure;

class Doctor extends Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $this->authenticate($request, $guards);
        if ( Auth::user()->doctor()->exists() and Auth::user()->doctor()->first()->verified )
            return $next($request);
        
        return response()->json( [
            'status' => false,
            'message' => 'You are not a doctor'
        ], 401);
        
    }
}
