<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Services\JwtService;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $role = 'patient';
        if (str_contains($validatedData['email'], 'doctor')) {
            $role = 'doctor';
        } elseif (str_contains($validatedData['email'], 'admin')) {
            $role = 'admin';
        }

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $role,
        ]);

        $token = JwtService::generateToken($user);
        $cookie = cookie('token', $token, 120, '/', null, false, true, false, 'Lax');

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ])->withCookie($cookie);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = JwtService::generateToken($user);
        $cookie = cookie('token', $token, 120, '/', null, false, true, false, 'Lax');

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ])->withCookie($cookie);
    }

    public function logout(Request $request)
    {
        $cookie = cookie()->forget('token');

        return response()->json([
            'message' => 'Logged out successfully'
        ])->withCookie($cookie);
    }
}
