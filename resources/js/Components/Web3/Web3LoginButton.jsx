import React, { useState } from "react";
import { ethers } from "ethers";
import { Icon } from "@iconify/react";

export default function Web3LoginButton() {
    const [connecting, setConnecting] = useState(false);

    const handleWeb3Login = async () => {
        try {
            if (!window.ethereum) {
                alert("MetaMask belum terpasang!");
                return;
            }

            setConnecting(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();

            // Step 1: ambil nonce dari server
            const nonceResponse = await fetch("/web3/nonce", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({ wallet_address: walletAddress }),
            });

            const nonceData = await nonceResponse.json();
            if (!nonceResponse.ok) throw new Error("Gagal ambil nonce");

            // Step 2: tanda tangani nonce
            const signature = await signer.signMessage(nonceData.nonce);

            // ✅ DEBUG: pastikan hasil signature valid
            try {
                const recovered = ethers.verifyMessage(nonceData.nonce, signature);
                console.log("Recovered address:", recovered);
                console.log("Wallet address:", walletAddress);
                console.log(
                    "Address match:",
                    recovered.toLowerCase() === walletAddress.toLowerCase()
                );
            } catch (verifyError) {
                console.error("Error verifying message on frontend:", verifyError);
            }

            // Step 3: verifikasi signature di backend
            const verifyResponse = await fetch("/web3/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    signature,
                }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
                window.location.href = "/dashboard";
            } else {
                alert(verifyData.error || "Verifikasi gagal!");
            }
        } catch (error) {
            console.error("Web3 Login error:", error);
            alert("Terjadi kesalahan saat login wallet!");
        } finally {
            setConnecting(false);
        }
    };

    return (
        <button
            onClick={handleWeb3Login}
            disabled={connecting}
            className="w-full mt-3 flex justify-center items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition duration-150 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            <Icon icon="logos:metamask-icon" width="20" />
            {connecting ? "Connecting..." : "Login with MetaMask"}
        </button>
    );
}
