<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $userRole = $request->user()->role; 

        if (!in_array($userRole, $roles)) {
            return response()->json(['message' => 'Forbidden: Anda tidak memiliki hak akses.'], 403);
        }

        return $next($request);
    }
}