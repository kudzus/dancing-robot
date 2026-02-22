"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RobotDancer } from "@/components/RobotDancer";

export default function Home() {
  const [upperBodyAngle, setUpperBodyAngle] = useState(0);
  const [leftUpperArmAngle, setLeftUpperArmAngle] = useState(60);
  const [leftLowerArmAngle, setLeftLowerArmAngle] = useState(15);
  const [rightUpperArmAngle, setRightUpperArmAngle] = useState(-60);
  const [rightLowerArmAngle, setRightLowerArmAngle] = useState(-15);
  const [leftUpperLegAngle, setLeftUpperLegAngle] = useState(0);
  const [leftLowerLegAngle, setLeftLowerLegAngle] = useState(0);
  const [rightUpperLegAngle, setRightUpperLegAngle] = useState(0);
  const [rightLowerLegAngle, setRightLowerLegAngle] = useState(0);
  const [headAngle, setHeadAngle] = useState(0);
  const [lowerBodyAngle, setLowerBodyAngle] = useState(0);
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [lineColor, setLineColor] = useState("#39FF14");
  const [isDancing, setIsDancing] = useState(false);
  const [danceSpeed, setDanceSpeed] = useState(25);

  const resetPose = () => {
    setUpperBodyAngle(0);
    setLeftUpperArmAngle(60);
    setLeftLowerArmAngle(15);
    setRightUpperArmAngle(-60);
    setRightLowerArmAngle(-15);
    setLeftUpperLegAngle(0);
    setLeftLowerLegAngle(0);
    setRightUpperLegAngle(0);
    setRightLowerLegAngle(0);
    setHeadAngle(0);
    setLowerBodyAngle(0);
    setBgColor("#0a0a0a");
    setLineColor("#39FF14");
    setIsDancing(false);
  };

  useEffect(() => {
    if (!isDancing) return;

    let animationFrameId: number;

    // Snapshot the exact current angles so there's zero snapping when the dance starts
    const current = {
      head: headAngle,
      upperBody: upperBodyAngle,
      lowerBody: lowerBodyAngle,
      leftUpperArm: leftUpperArmAngle,
      leftLowerArm: leftLowerArmAngle,
      rightUpperArm: rightUpperArmAngle,
      rightLowerArm: rightLowerArmAngle,
      leftUpperLeg: leftUpperLegAngle,
      leftLowerLeg: leftLowerLegAngle,
      rightUpperLeg: rightUpperLegAngle,
      rightLowerLeg: rightLowerLegAngle
    };

    const targets = { ...current };

    const pickTarget = (min: number, max: number, isExtrapolating: boolean) => {
      const neutral = (min + max) / 2;
      const range = (max - min) / 2;

      // 75% of the time, pick a tight, repetitive groove near the neutral pose.
      // 25% of the time, throw a wild, random pose hitting the outer joint limits.
      if (!isExtrapolating) {
        return neutral + (Math.random() * 0.4 - 0.2) * range;
      } else {
        return neutral + (Math.random() * 1.8 - 0.9) * range;
      }
    };

    // Zeno's paradox lerp for incredibly buttery, organic ease-out motion
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    let lastBeat = 0;

    const renderLoop = () => {
      const now = Date.now();

      // Map the 1-100 danceSpeed state into physics factors
      const currentBeatGap = 4000 - ((danceSpeed - 1) / 99) * 3700; // 4000ms to 300ms
      const smoothFactor = 0.005 + ((danceSpeed - 1) / 99) * 0.115; // 0.005 to 0.12

      // Every 3000ms, generate a completely new target pose (the "beat")
      if (now - lastBeat > currentBeatGap) {
        lastBeat = now;
        const goWild = Math.random() > 0.75; // 25% chance of wild motion

        targets.head = pickTarget(-10, 10, goWild);
        targets.upperBody = pickTarget(-25, 25, goWild);
        targets.lowerBody = pickTarget(-8, 8, goWild);

        targets.leftUpperArm = pickTarget(-10, 180, goWild);
        targets.leftLowerArm = pickTarget(-150, 150, goWild);

        targets.rightUpperArm = pickTarget(-180, 10, goWild);
        targets.rightLowerArm = pickTarget(-150, 150, goWild);

        targets.leftUpperLeg = pickTarget(-10, 20, goWild);
        targets.leftLowerLeg = pickTarget(-45, 65, goWild);

        targets.rightUpperLeg = pickTarget(-20, 10, goWild);
        targets.rightLowerLeg = pickTarget(-65, 45, goWild);
      }

      // Move 1% of the remaining distance to the target every frame (approx 60fps)
      // This results in very slow, creeping, buttery motion that is super chill


      current.head = lerp(current.head, targets.head, smoothFactor);
      current.upperBody = lerp(current.upperBody, targets.upperBody, smoothFactor);
      current.lowerBody = lerp(current.lowerBody, targets.lowerBody, smoothFactor);

      current.leftUpperArm = lerp(current.leftUpperArm, targets.leftUpperArm, smoothFactor);
      current.leftLowerArm = lerp(current.leftLowerArm, targets.leftLowerArm, smoothFactor);

      current.rightUpperArm = lerp(current.rightUpperArm, targets.rightUpperArm, smoothFactor);
      current.rightLowerArm = lerp(current.rightLowerArm, targets.rightLowerArm, smoothFactor);

      current.leftUpperLeg = lerp(current.leftUpperLeg, targets.leftUpperLeg, smoothFactor);
      current.leftLowerLeg = lerp(current.leftLowerLeg, targets.leftLowerLeg, smoothFactor);

      current.rightUpperLeg = lerp(current.rightUpperLeg, targets.rightUpperLeg, smoothFactor);
      current.rightLowerLeg = lerp(current.rightLowerLeg, targets.rightLowerLeg, smoothFactor);

      const fastTime = now / 250; // Controls the speed of the small repetitive micro-movements

      // Apply the interpolated physics back into React state, combining the slow 
      // macro-movements with fast, repetitive micro-movements for constant groove.
      setHeadAngle(current.head + Math.sin(fastTime * 1.1) * 2);
      setUpperBodyAngle(current.upperBody + Math.sin(fastTime * 0.8) * 3);
      setLowerBodyAngle(current.lowerBody + Math.sin(fastTime * 0.8 + Math.PI) * 2);

      setLeftUpperArmAngle(current.leftUpperArm + Math.sin(fastTime * 1.5) * 5);
      setLeftLowerArmAngle(current.leftLowerArm + Math.cos(fastTime * 1.8) * 8);

      setRightUpperArmAngle(current.rightUpperArm + Math.sin(fastTime * 1.5 + Math.PI) * 5);
      setRightLowerArmAngle(current.rightLowerArm + Math.cos(fastTime * 1.8 + Math.PI) * 8);

      setLeftUpperLegAngle(current.leftUpperLeg + Math.sin(fastTime * 1.2) * 3);
      setLeftLowerLegAngle(current.leftLowerLeg + Math.sin(fastTime * 2.2) * 6);

      setRightUpperLegAngle(current.rightUpperLeg + Math.sin(fastTime * 1.2 + Math.PI) * 3);
      setRightLowerLegAngle(current.rightLowerLeg + Math.sin(fastTime * 2.2 + Math.PI) * 6);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDancing, danceSpeed]); // Restart loop dynamically if speed is changed live

  return (
    <main className="min-h-screen text-white flex flex-col md:flex-row p-4 md:p-8 font-mono" style={{ backgroundColor: bgColor }}>
      {/* Controls Panel */}
      <div className="w-full md:w-[400px] bg-black/50 border border-green-900/50 p-6 rounded-2xl flex flex-col gap-6 z-10 shrink-0 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#39FF14] uppercase mb-1 drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">
            Pose Controller
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Geometric Cybernetics</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetPose}
            className="flex-1 bg-transparent border border-green-500 hover:bg-green-500/20 text-green-500 px-4 py-2 rounded text-sm uppercase tracking-wider transition-colors"
          >
            Reset Pose
          </button>
          <button
            onClick={() => setIsDancing(!isDancing)}
            className={`flex-1 border px-4 py-2 rounded text-sm uppercase tracking-wider transition-colors ${isDancing
              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(57,255,20,0.5)]'
              : 'bg-transparent border-green-500 hover:bg-green-500/20 text-green-500'
              }`}
          >
            {isDancing ? 'Stop Dance' : 'Dance Mode'}
          </button>
        </div>

        {isDancing && (
          <div className="bg-green-900/10 p-4 rounded-lg border border-green-900/30 shadow-inner">
            <SliderControl label="Dance Speed" value={danceSpeed} setValue={setDanceSpeed} min={1} max={100} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 flex flex-col custom-scrollbar">

          <div className="flex gap-4">
            <ColorPickerControl label="Background" value={bgColor} setValue={setBgColor} />
            <ColorPickerControl label="Line Color" value={lineColor} setValue={setLineColor} />
          </div>

          <div className="h-px w-full bg-green-900/30" />

          <SliderControl disabled={isDancing} label="Head Tilt" value={headAngle} setValue={setHeadAngle} min={-10} max={10} />

          <div className="h-px w-full bg-green-900/30" />

          <SliderControl disabled={isDancing} label="Upper Body Tilt" value={upperBodyAngle} setValue={setUpperBodyAngle} min={-25} max={25} />
          <SliderControl disabled={isDancing} label="Lower Body Tilt" value={lowerBodyAngle} setValue={setLowerBodyAngle} min={-8} max={8} />

          <div className="h-px w-full bg-green-900/30" />

          <SliderControl disabled={isDancing} label="Left Upper Arm" value={leftUpperArmAngle} setValue={setLeftUpperArmAngle} min={-10} max={180} />
          <SliderControl disabled={isDancing} label="Left Lower Arm" value={leftLowerArmAngle} setValue={setLeftLowerArmAngle} min={-150} max={150} />

          <div className="h-px w-full bg-green-900/30" />

          <SliderControl disabled={isDancing} label="Right Upper Arm" value={rightUpperArmAngle} setValue={setRightUpperArmAngle} min={-180} max={10} />
          <SliderControl disabled={isDancing} label="Right Lower Arm" value={rightLowerArmAngle} setValue={setRightLowerArmAngle} min={-150} max={150} />

          <div className="h-px w-full bg-green-900/30" />

          <SliderControl disabled={isDancing} label="Left Upper Leg" value={leftUpperLegAngle} setValue={setLeftUpperLegAngle} min={-10} max={20} />
          <SliderControl disabled={isDancing} label="Left Lower Leg" value={leftLowerLegAngle} setValue={setLeftLowerLegAngle} min={-45} max={65} />

          <div className="h-px w-full bg-green-900/30" />

          <SliderControl disabled={isDancing} label="Right Upper Leg" value={rightUpperLegAngle} setValue={setRightUpperLegAngle} min={-20} max={10} />
          <SliderControl disabled={isDancing} label="Right Lower Leg" value={rightLowerLegAngle} setValue={setRightLowerLegAngle} min={-65} max={45} />

          <div className="h-px w-full bg-green-900/30 mt-4" />

          <Link
            href="/group"
            className="w-full text-center block bg-green-900/40 hover:bg-green-900/80 border border-green-500/50 text-green-100 py-3 rounded uppercase tracking-widest text-sm font-bold transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] mt-2"
          >
            Launch Group Dance
          </Link>

        </div>
      </div>

      {/* Render Canvas */}
      <div
        className="flex-1 flex items-center justify-center min-h-[500px] relative overflow-hidden rounded-2xl md:ml-8 mt-8 md:mt-0 border border-white/5"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${lineColor}15 0%, transparent 70%)` }}
        />

        <div style={{ filter: `drop-shadow(0 0 25px ${lineColor}66)` }}>
          <RobotDancer
            scale={1.5}
            color={lineColor}
            upperBodyAngle={upperBodyAngle}
            leftUpperArmAngle={leftUpperArmAngle}
            leftLowerArmAngle={leftLowerArmAngle}
            rightUpperArmAngle={rightUpperArmAngle}
            rightLowerArmAngle={rightLowerArmAngle}
            leftUpperLegAngle={leftUpperLegAngle}
            leftLowerLegAngle={leftLowerLegAngle}
            rightUpperLegAngle={rightUpperLegAngle}
            rightLowerLegAngle={rightLowerLegAngle}
            headAngle={headAngle}
            lowerBodyAngle={lowerBodyAngle}
          />
        </div>
      </div>
    </main>
  );
}

function SliderControl({ label, value, setValue, min, max, disabled }: {
  label: string,
  value: number,
  setValue: (n: number) => void,
  min: number,
  max: number,
  disabled?: boolean
}) {
  return (
    <div className={`space-y-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between text-xs tracking-wider text-gray-300">
        <span>{label}</span>
        <span className="text-green-400 font-bold">{Math.round(value)}°</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: 'var(--slider-color, #dc2626)' }}
        disabled={disabled}
      />
    </div>
  );
}

function ColorPickerControl({ label, value, setValue }: {
  label: string,
  value: string,
  setValue: (c: string) => void,
}) {
  return (
    <div className="flex-1 space-y-2">
      <div className="text-xs tracking-wider text-gray-300">{label}</div>
      <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg border border-white/10">
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
