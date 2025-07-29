<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if(!Auth::check()){
            return response()->json([
                'success' => false,
                'message' => "user tidak terautentikasi"
            ],401);
        }
        
        $user = Auth::user();
        
        if(!$user->isSuperAdmin() && !$user->isAdmin()){
            return response()->json([
                'success' =>false,
                'message' => 'Akses Ditolak: hanya Admin atau Super Admin yang dapat mengakses.'
            ],403);
        }
        return $next($request);
    }
}
