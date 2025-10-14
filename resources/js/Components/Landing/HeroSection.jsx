import React from "react";
import RippleGrid from "@/Components/Background/RippleGrid";
import ButtonShort from "@/Components/Button/ButtonShort";
import ShinyText from "@/Components/Effects/ShinyText";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import TransparentButton from "@/Components/Button/TransparentButton";
import GlassBadge from "@/Components/Badge/GlassBadge";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F2F6FF] via-[#EAE7FF] to-[#F8F6FF] text-gray-900 py-20">
            {/* Background */}
            <div className="absolute inset-0">
                {/* <RippleGrid
                    gridColor="rgba(0,0,0,0.05)"
                    rippleColor="rgba(1,81,150,0.15)"
                    className="w-full h-full opacity-30"
                /> */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#6E60FF]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00B3FF]/10 rounded-full blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Copywriting */}
                <div>
                    <GlassBadge>
                        ✨ AI-powered Shortening
                    </GlassBadge>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 space-y-1">
                        <div>The intuitive</div>
                        <ShinyText
                            text="Link Shortener & URL Management"
                            speed={4}
                        />
                        <div>for modern startups</div>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-lg">
                        Automate your short-link management with custom domains, analytics, and
                        AI-powered slugs — built for speed, scale, and simplicity.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <PrimaryButton className="px-8 py-3 text-base font-semibold rounded-full shadow-md hover:shadow-lg bg-[#015196] hover:bg-[#0A6BEA] text-white transition">
                            Get started free
                        </PrimaryButton>
                        <TransparentButton className="px-8 py-3 text-base font-semibold rounded-full shadow-md border border-gray-300 bg-white hover:bg-gray-50 transition">
                            Learn more
                        </TransparentButton>
                    </div>

                    <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
                        ⭐⭐⭐⭐⭐ <span>5-Star Rating — No credit card required</span>
                    </div>
                </div>

                {/* Right: Illustration / Mockup */}
                <div className="relative animate-fadeInUp">
                    <div className="relative rounded-3xl p-6 w-full max-w-md mx-auto">
                        <img
                            src="https://i.pinimg.com/originals/19/1f/1b/191f1b2978a23ed3f4f130f9f1fa4e18.gif"
                            alt="Dashboard Preview"
                            className="#"
                        />

                        {/* Floating Card 1 */}
                        <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-3 w-40 animate-float">
                            <p className="text-sm font-semibold">AI Slug Generator</p>
                            <p className="text-xs text-gray-500">Save time with one click</p>
                        </div>

                        {/* Floating Card 2 */}
                        <div className="absolute bottom-6 -right-8 bg-white rounded-xl shadow-lg p-4 w-48 animate-float-delayed">
                            <p className="text-sm italic text-gray-700">
                                “Super simple yet powerful — love it!”
                            </p>
                            <p className="text-xs mt-2 font-medium text-gray-500">
                                — Rohma, Founder of Shorten-Link
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
