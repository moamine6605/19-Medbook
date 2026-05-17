<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\JwtService;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Check for token in cookie
        $token = $request->cookie('token');

        // 2. Fallback: check Authorization header
        if (!$token) {
            $header = $request->header('Authorization');
            if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
            }
        }

        if (!$token) {
            return response()->json(['message' => 'Non authentifié. Token manquant.'], 401);
        }

        $payload = JwtService::verifyToken($token);

        if (!$payload) {
            return response()->json(['message' => 'Non authentifié. Token invalide ou expiré.'], 401);
        }

        // Fetch user
        $user = \App\Models\User::find($payload['sub']);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 401);
        }

        // Authenticate user for the current request
        Auth::setUser($user);

        return $next($request);
    }
}
