<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Schema;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => 'patient',
        ]);

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Identifiants invalides.'], Response::HTTP_UNAUTHORIZED);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        if (Schema::hasColumn('users', 'is_active') && $user->getAttribute('is_active') === false) {
            return response()->json(['message' => 'Compte désactivé.'], Response::HTTP_FORBIDDEN);
        }

        // Revoke existing tokens for a clean SPA experience.
        $user->tokens()->delete();
        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()?->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
