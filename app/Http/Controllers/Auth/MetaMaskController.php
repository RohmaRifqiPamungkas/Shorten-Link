<?php

namespace App\Http\Controllers\Auth;

use Elliptic\EC;
use App\Models\User;
use kornrunner\Keccak;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MetaMaskController extends Controller
{
    /**
     * Generate and return a nonce for the user.
     */
    public function getNonce(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'address' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $address = strtolower($request->input('address'));

        // Find or create user
        $user = User::firstOrCreate(
            ['wallet_address' => $address],
            ['name' => 'MetaMask User', 'email' => $address . '@example.com', 'password' => bcrypt(Str::random(16))]
        );

        // Generate new nonce
        $user->nonce = Str::random(32);
        $user->save();

        return response()->json(['nonce' => $user->nonce]);
    }

    /**
     * Verify the signature and log the user in.
     */
    public function authenticate(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'address' => 'required|string',
                'signature' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $address = strtolower($request->input('address'));
            $signature = $request->input('signature');

            // Find user
            $user = User::where('wallet_address', $address)->first();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Verify signature
            $isValid = $this->verifySignature($user->nonce, $signature, $address);
            if (!$isValid) {
                return response()->json(['error' => 'Signature verification failed'], 403);
            }

            // Reset nonce for security
            $user->nonce = Str::random(32);
            $user->save();

            // Log the user in
            Auth::login($user);

            return response()->json(['success' => true, 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('MetaMask authentication error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verify the Ethereum signature.
     */
    private function verifySignature($message, $signature, $address)
    {
        try {
            // Check if the required packages are installed
            if (!class_exists('kornrunner\Keccak') || !class_exists('Elliptic\EC')) {
                Log::error('Required packages not installed: kornrunner/keccak or simplito/elliptic-php');
                return false;
            }

            // Convert message to string to ensure proper encoding
            $message = (string) $message;

            // Hash the message with Ethereum's standard prefix
            $prefixedMessage = "\x19Ethereum Signed Message:\n" . strlen($message) . $message;
            $messageHash = Keccak::hash($prefixedMessage, 256);

            // Ensure signature has the correct format (0x + 130 characters)
            if (substr($signature, 0, 2) !== '0x' || strlen($signature) !== 132) {
                Log::error('Invalid signature format: ' . $signature);
                return false;
            }

            // Split the signature into r, s, and v components
            $r = substr($signature, 2, 64);
            $s = substr($signature, 66, 64);
            $v = hexdec(substr($signature, 130, 2));

            // Adjust v for Ethereum's implementation
            if ($v < 27) {
                $v += 27;
            }

            // Create EC instance for secp256k1 curve
            $ec = new EC('secp256k1');

            // Recover the public key
            $recid = $v - 27;
            if ($recid !== 0 && $recid !== 1) {
                Log::error('Invalid recovery ID: ' . $recid);
                return false;
            }

            $pubKey = $ec->recoverPubKey($messageHash, [
                'r' => $r,
                's' => $s
            ], $recid);

            // Derive the Ethereum address from the public key
            $publicKeyHex = $pubKey->encode('hex');

            // Remove the first two characters (04 prefix) and convert to binary
            $publicKeyBin = hex2bin(substr($publicKeyHex, 2));

            // Hash the public key
            $addressHash = Keccak::hash($publicKeyBin, 256);

            // Take the last 40 characters to get the address
            $recoveredAddress = '0x' . substr($addressHash, -40);

            // Compare the addresses (case-insensitive)
            return strtolower($recoveredAddress) === strtolower($address);
        } catch (\Exception $e) {
            // Log the error with more details
            Log::error('Signature verification failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Message: ' . $message);
            Log::error('Signature: ' . $signature);
            Log::error('Address: ' . $address);
            return false;
        }
    }
}
