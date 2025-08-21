<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi'
            ], 401);
        }
        
        $user = Auth::user();
        if (!$user->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Hanya Super Admin yang dapat mengakses fitur ini.'
            ], 403);
        }   
        return $next($request);
    }
}
