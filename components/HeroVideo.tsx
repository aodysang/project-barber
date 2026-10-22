"use client";

import { useEffect, useState } from "react";

export default function HeroVideo() {
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const saveData = nav.connection?.saveData === true;
        const timer = setTimeout(() => {
            setShowVideo(!reduceMotion && !saveData);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <img
                src="/videos/hero-poster.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />

            {showVideo && (
                <video
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/videos/hero-poster.jpg"
                    onError={() => setShowVideo(false)}
                >
                    <source src="/videos/hero.mp4" type="video/mp4" />
                </video>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#081416]/85 via-[#081416]/40 to-[#081416]/20 pointer-events-none" />
        </div>
    );
}