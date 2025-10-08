import React, { useState } from "react";
import Web3 from "web3";
import { Icon } from "@iconify/react";
import ToastAlert from "@/Components/Notification/ToastAlert"; // pastikan path ini sesuai struktur project kamu

export default function Web3LoginButton() {
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [connecting, setConnecting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 4000);
  };

  const connectMetaMask = async () => {
    setConnecting(true);
    showToast("🔗 Connecting to MetaMask...", "success");

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Install it at metamask.io");
      }

      const web3 = new Web3(window.ethereum);

      // Step 1: Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0].toLowerCase();
      showToast(`Connected: ${address.substring(0, 6)}...${address.substring(38)}`);

      // Step 2: Ambil CSRF token dari meta Laravel
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      // Step 3: Request nonce dari backend
      const nonceResponse = await fetch("/metamask-get-nonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          Accept: "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const nonceData = await nonceResponse.json();
      if (!nonceResponse.ok) throw new Error(nonceData.error || "Failed to get nonce");

      const nonce = nonceData.nonce;
      showToast("🪙 Please sign message in MetaMask...");

      // Step 4: Tanda tangani nonce
      const signature = await web3.eth.personal.sign(nonce, address, "");
      showToast("✅ Message signed, verifying...");

      // Step 5: Kirim hasil ke backend untuk verifikasi
      const authResponse = await fetch("/metamask-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          Accept: "application/json",
        },
        body: JSON.stringify({ address, signature }),
      });

      const authData = await authResponse.json();
      if (!authResponse.ok) throw new Error(authData.error || "Verification failed");

      if (authData.success) {
        showToast("✅ Authentication successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1200);
      } else {
        throw new Error(authData.error || "Authentication failed");
      }
    } catch (error) {
      console.error("MetaMask login error:", error);
      showToast(error.message || "Error connecting MetaMask", "error");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Tombol Login */}
      <button
        onClick={connectMetaMask}
        disabled={connecting}
        className={`flex items-center justify-center gap-2 px-5 py-3 mt-3 rounded-md font-semibold transition-all duration-150 w-full
                    ${connecting
            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:brightness-110 shadow-md hover:shadow-lg"
          }`}
      >
        <Icon icon="logos:metamask-icon" width="22" />
        {connecting ? "Connecting..." : "Login with MetaMask"}
      </button>

      {/* Notifikasi Toast */}
      {toast.message && (
        <ToastAlert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      )}
    </div>
  );
}
