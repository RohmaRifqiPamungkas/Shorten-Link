<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use FurqanSiddiqui\Ethereum\Packages\Keccak\Keccak;
use kornrunner\Secp256k1;
use Elliptic\EC;

/**
 * @property \kornrunner\Secp256k1 $secp256k1
 * @method \kornrunner\PublicKey recoverPublicKey(string $hash, array $signature)
 */

class Web3AuthController extends Controller
{
    // Step 1: Request nonce
    public function nonce(Request $request)
    {
        $request->validate(['wallet_address' => 'required|string']);
        $address = strtolower($request->wallet_address);

        $user = User::firstOrCreate(
            ['wallet_address' => $address],
            [
                'nonce' => Str::random(24),
                'name' => 'Web3 User ' . substr($address, 0, 6),
                'email' => $address . '@web3.local',
                'password' => bcrypt(Str::random(16)),
            ]
        );

        $user->nonce = Str::random(24);
        $user->save();

        return response()->json(['nonce' => $user->nonce]);
    }

    // Step 2: Verify signature
    public function verify(Request $request)
    {
        $request->validate([
            'wallet_address' => 'required|string',
            'signature' => 'required|string',
        ]);

        $address = strtolower($request->wallet_address);
        $user = User::whereRaw('LOWER(wallet_address) = ?', [$address])->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        try {
            $message = $user->nonce;
            $msgHashHex = Keccak::hash($message, 256);
            $msgHashBin = hex2bin($msgHashHex);

            $sig = substr($request->signature, 2);
            $r = substr($sig, 0, 64);
            $s = substr($sig, 64, 64);
            $v = hexdec(substr($sig, 128, 2));
            if ($v < 27) $v += 27;

            // 🔧 bersihkan r/s agar valid untuk GMP
            $sanitizeHex = function ($val) {
                $val = strtolower(trim($val));
                $val = str_replace('0x', '', $val);
                $val = ltrim($val, '0');      // hapus leading zero
                return $val === '' ? '0' : $val;
            };

            $rSafe = $sanitizeHex($r);
            $sSafe = $sanitizeHex($s);

            Log::debug('Web3 Verify - Sanitized', compact('rSafe', 'sSafe', 'v'));

            Log::debug('Lengths', [
                'len_r' => strlen($rSafe),
                'len_s' => strlen($sSafe),
                'ctype_r' => ctype_xdigit($rSafe),
                'ctype_s' => ctype_xdigit($sSafe),
            ]);

            $ec = new EC('secp256k1');
            $pubKey = $ec->recoverPubKey(
                $msgHashBin,
                ['r' => $rSafe, 's' => $sSafe],
                $v - 27
            );

            $pubKeyHex = $pubKey->encode('hex');
            $derived = '0x' . substr(
                Keccak::hash(hex2bin(substr($pubKeyHex, 2)), 256),
                24
            );

            if (strtolower($derived) !== strtolower($user->wallet_address)) {
                return response()->json([
                    'error' => 'Invalid signature',
                    'expected' => $derived,
                ], 401);
            }

            auth()->login($user);
            $user->nonce = Str::random(24);
            $user->save();

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            Log::error('Web3 Verify - Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->all(),
            ]);
            return response()->json([
                'error' => 'Verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
