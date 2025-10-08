import React from "react";
import DotGrid from "@/Components/Effects/DotGrid";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b79cff] to-[#7bbcff] font-sans">
            {/* CARD WRAPPER */}
            <div className="relative flex flex-col md:flex-row w-[90%] max-w-5xl rounded-3xl overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.15)] bg-white/80 backdrop-blur-md">
                {/* LEFT: Illustration + DotGrid */}
                <div className="relative md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#7A5FFF] to-[#43B3FF] p-10 overflow-hidden">
                    {/* DotGrid */}
                    <div className="absolute inset-0 z-0">
                        <DotGrid
                            dotColor="rgba(255,255,255,0.2)"
                            dotSize={2}
                            dotGap={22}
                            animate={true}
                            className="opacity-80"
                        />
                    </div>

                    {/* Illustration */}
                    <img
                        src="https://assets-v2.lottiefiles.com/a/fe0a9612-83f3-11ee-9945-27ca59862aef/gMMelbR6U7.gif"
                        alt="3D Illustration"
                        className="relative z-10 w-[75%] h-auto object-contain drop-shadow-2xl"
                    />

                    {/* Optional overlay text */}
                    <div className="absolute bottom-6 text-center text-white/80 text-sm z-10">
                        Upgrade your account to get full user experience
                    </div>
                </div>

                {/* RIGHT: Login Form */}
                <div className="md:w-1/2 w-full p-8 sm:p-10 flex flex-col justify-center bg-white z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
