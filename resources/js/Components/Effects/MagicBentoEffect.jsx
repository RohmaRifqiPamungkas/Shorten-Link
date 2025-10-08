import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * MagicBentoEffect (Top Layer Drop Edition)
 * Adds top-layer glow, tilt, ripple, and floating particle effects
 * Works as a wrapper for any card/form without blocking input
 */
export default function MagicBentoEffect({
    children,
    glowColor = "1,81,150", // RGB of #015196
    particleCount = 12,
    intensity = 10,
    className = "",
}) {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const overlay = overlayRef.current;
        if (!container || !overlay) return;

        const particles = [];

        // Create particles on top layer
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement("div");
            p.style.cssText = `
        position:absolute;
        width:4px;height:4px;
        border-radius:50%;
        background:rgba(${glowColor},0.9);
        box-shadow:0 0 8px rgba(${glowColor},0.6);
        opacity:0.6;
        pointer-events:none;
      `;
            overlay.appendChild(p);
            particles.push(p);

            gsap.set(p, {
                x: Math.random() * overlay.clientWidth,
                y: Math.random() * overlay.clientHeight,
            });

            gsap.to(p, {
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                opacity: 0.3 + Math.random() * 0.4,
                x: "+=" + (Math.random() * 50 - 25),
                y: "+=" + (Math.random() * 50 - 25),
                ease: "sine.inOut",
            });
        }

        // Tilt + Glow shadow
        const handleMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -intensity;
            const rotateY = ((x - centerX) / centerX) * intensity;

            gsap.to(container, {
                rotateX,
                rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out",
            });

            overlay.style.background = `radial-gradient(
        circle at ${x}px ${y}px,
        rgba(${glowColor},0.25) 0%,
        rgba(${glowColor},0.1) 30%,
        transparent 70%
      )`;
        };

        const handleLeave = () => {
            gsap.to(container, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });
            overlay.style.background = "transparent";
        };

        // Ripple (light pulse) effect
        const handleClick = (e) => {
            const rect = container.getBoundingClientRect();
            const ripple = document.createElement("div");
            const max = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - max / 2;
            const y = e.clientY - rect.top - max / 2;
            ripple.style.cssText = `
        position:absolute;
        width:${max}px;height:${max}px;
        border-radius:50%;
        left:${x}px;top:${y}px;
        background:radial-gradient(circle, rgba(${glowColor},0.35) 0%, transparent 70%);
        pointer-events:none;
        z-index:999;
      `;
            overlay.appendChild(ripple);

            gsap.fromTo(
                ripple,
                { scale: 0, opacity: 0.8 },
                {
                    scale: 2,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power2.out",
                    onComplete: () => ripple.remove(),
                }
            );
        };

        container.addEventListener("mousemove", handleMove);
        container.addEventListener("mouseleave", handleLeave);
        container.addEventListener("click", handleClick);

        return () => {
            container.removeEventListener("mousemove", handleMove);
            container.removeEventListener("mouseleave", handleLeave);
            container.removeEventListener("click", handleClick);
            particles.forEach((p) => p.remove());
        };
    }, [glowColor, particleCount, intensity]);

    return (
        <div
            ref={containerRef}
            className={`relative transition-transform duration-300 ${className}`}
            style={{
                transformStyle: "preserve-3d",
                borderRadius: "1rem",
                perspective: "1000px",
            }}
        >
            {/* === Content (form/card) === */}
            <div className="relative z-10">{children}</div>

            {/* === Top layer overlay === */}
            <div
                ref={overlayRef}
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                style={{
                    borderRadius: "inherit",
                    background: "transparent",
                    mixBlendMode: "screen",
                }}
            ></div>
        </div>
    );
}
