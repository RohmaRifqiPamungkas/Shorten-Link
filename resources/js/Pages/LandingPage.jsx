import React from "react";
import Navbar from "@/Components/Navbar/Navbar";
import HeroSection from "@/Components/Landing/HeroSection";
import FeaturesSection from "@/Components/Sections/FeaturesSection";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />
        </div>
    );
}
