"use client";

import { useState, useEffect } from "react";
import { CyberRobot } from "@/components/CyberRobot";
import Link from "next/link";

function ColorPickerControl({ label, value, setValue }: {
    label: string,
    value: string,
    setValue: (c: string) => void,
}) {
    return (
        <div className="flex-1 space-y-2">
            <div className="text-xs tracking-wider text-gray-300">{label}</div>
            <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg border border-white/10 w-[140px]">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-8 h-8 rounded shrink-0 cursor-pointer bg-transparent border-none p-0 outline-none"
                />
                <span className="text-xs text-gray-400 font-mono uppercase tracking-widest px-1">{value}</span>
            </div>
        </div>
    );
}

export default function GroupPage() {
    const [groupX, setGroupX] = useState(0);
    const [bgColor, setBgColor] = useState("#000000");
    const [lineColor, setLineColor] = useState("#39FF14");

    // Group sway animation logic
    useEffect(() => {
        let animationFrameId: number;
        let startTime = Date.now();
        const loop = () => {
            const elapsed = Date.now() - startTime;
            const offset = Math.sin(elapsed / 2500) * 150;
            setGroupX(offset);
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <main className="min-h-screen overflow-hidden relative flex flex-col items-center justify-center font-mono" style={{ backgroundColor: bgColor }}>
            {/* Navigation Layer */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                <Link
                    href="/"
                    className="text-green-500 border border-green-500 bg-black/50 hover:bg-green-500 hover:text-white px-6 py-2 rounded uppercase tracking-wider transition-colors backdrop-blur-md text-sm shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                >
                    &lt; Back to Solo Mode
                </Link>
            </div>

            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at bottom, ${lineColor}25 0%, transparent 60%)` }} />

            {/* Swaying Container */}
            <div
                className="flex items-center justify-center w-[150vw]"
                style={{ transform: `translateX(${groupX}px)` }}
            >
                {/* The Wave! Same math sequence, just a 500ms follow-the-leader delay and staggering Y heights */}
                <div className="flex -space-x-12 sm:-space-x-20 md:-space-x-24" style={{ filter: `drop-shadow(0 0 15px ${lineColor}4D)` }}>
                    <div className="translate-y-8"><CyberRobot scale={1.2} color={lineColor} timeOffset={0} danceSpeed={25} /></div>
                    <div className="-translate-y-4"><CyberRobot scale={1.3} color={lineColor} timeOffset={-500} danceSpeed={25} /></div>
                    <div className="-translate-y-16"><CyberRobot scale={1.4} color={lineColor} timeOffset={-1000} danceSpeed={25} /></div>
                    <div className="translate-y-2"><CyberRobot scale={1.25} color={lineColor} timeOffset={-1500} danceSpeed={25} /></div>
                    <div className="-translate-y-12"><CyberRobot scale={1.3} color={lineColor} timeOffset={-2000} danceSpeed={25} /></div>
                    <div className="translate-y-12"><CyberRobot scale={1.1} color={lineColor} timeOffset={-2500} danceSpeed={25} /></div>
                    <div className="-translate-y-6"><CyberRobot scale={1.2} color={lineColor} timeOffset={-3000} danceSpeed={25} /></div>
                </div>
            </div>

            {/* Control Panel Floating at Bottom Right */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md flex gap-4 z-50">
                <ColorPickerControl label="Background" value={bgColor} setValue={setBgColor} />
                <ColorPickerControl label="Line Color" value={lineColor} setValue={setLineColor} />
            </div>

        </main>
    );
}
