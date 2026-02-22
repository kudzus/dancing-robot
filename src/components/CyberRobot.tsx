"use client";

import { useState, useEffect } from "react";
import { RobotDancer } from "./RobotDancer";

export function CyberRobot({
    timeOffset = 0,
    scale = 1,
    color = "#39FF14",
    danceSpeed = 25,
}: {
    timeOffset?: number,
    scale?: number,
    color?: string,
    danceSpeed?: number,
}) {
    const [headAngle, setHeadAngle] = useState(0);
    const [upperBodyAngle, setUpperBodyAngle] = useState(0);
    const [lowerBodyAngle, setLowerBodyAngle] = useState(0);
    const [leftUpperArmAngle, setLeftUpperArmAngle] = useState(60);
    const [leftLowerArmAngle, setLeftLowerArmAngle] = useState(15);
    const [rightUpperArmAngle, setRightUpperArmAngle] = useState(-60);
    const [rightLowerArmAngle, setRightLowerArmAngle] = useState(-15);
    const [leftUpperLegAngle, setLeftUpperLegAngle] = useState(0);
    const [leftLowerLegAngle, setLeftLowerLegAngle] = useState(0);
    const [rightUpperLegAngle, setRightUpperLegAngle] = useState(0);
    const [rightLowerLegAngle, setRightLowerLegAngle] = useState(0);

    useEffect(() => {
        let animationFrameId: number;

        const current = {
            head: 0, upperBody: 0, lowerBody: 0,
            leftUpperArm: 60, leftLowerArm: 15, rightUpperArm: -60, rightLowerArm: -15,
            leftUpperLeg: 0, leftLowerLeg: 0, rightUpperLeg: 0, rightLowerLeg: 0
        };

        const targets = { ...current };

        // This defines the TRUE pseudo-random sequence shared by ALL robots.
        // Given the same beatIndex (t) and same property offset (p), this always returns the exact same number [0, 1)
        const pseudoRandom = (t: number, p: number) => {
            const x = Math.sin(t * 12.9898 + p * 78.233) * 43758.5453;
            return x - Math.floor(x);
        };

        const pickTarget = (min: number, max: number, isExtrapolating: boolean, pseudoValue: number) => {
            const neutral = (min + max) / 2;
            const range = (max - min) / 2;

            if (!isExtrapolating) {
                return neutral + (pseudoValue * 0.4 - 0.2) * range;
            } else {
                return neutral + (pseudoValue * 1.8 - 0.9) * range;
            }
        };

        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

        let previousBeatIndex = -1;

        const renderLoop = () => {
            // Apply offset so this robot is looking slightly ahead or behind relative to the others
            const now = Date.now() + timeOffset;

            const currentBeatGap = 4000 - ((danceSpeed - 1) / 99) * 3700;
            const beatIndex = Math.floor(now / currentBeatGap);

            // Every time a robot enters a new beat gap window, it calculates the mathematically PERFECT sequence targets based entirely on the beatIndex!
            if (beatIndex !== previousBeatIndex) {
                previousBeatIndex = beatIndex;
                // 25% chance of wild motion
                const goWild = pseudoRandom(beatIndex, 99) > 0.75;

                targets.head = pickTarget(-10, 10, goWild, pseudoRandom(beatIndex, 1));
                targets.upperBody = pickTarget(-25, 25, goWild, pseudoRandom(beatIndex, 2));
                targets.lowerBody = pickTarget(-8, 8, goWild, pseudoRandom(beatIndex, 3));
                targets.leftUpperArm = pickTarget(-10, 180, goWild, pseudoRandom(beatIndex, 4));
                targets.leftLowerArm = pickTarget(-150, 150, goWild, pseudoRandom(beatIndex, 5));
                targets.rightUpperArm = pickTarget(-180, 10, goWild, pseudoRandom(beatIndex, 6));
                targets.rightLowerArm = pickTarget(-150, 150, goWild, pseudoRandom(beatIndex, 7));
                targets.leftUpperLeg = pickTarget(-10, 20, goWild, pseudoRandom(beatIndex, 8));
                targets.leftLowerLeg = pickTarget(-45, 65, goWild, pseudoRandom(beatIndex, 9));
                targets.rightUpperLeg = pickTarget(-20, 10, goWild, pseudoRandom(beatIndex, 10));
                targets.rightLowerLeg = pickTarget(-65, 45, goWild, pseudoRandom(beatIndex, 11));
            }

            const smoothFactor = 0.005 + ((danceSpeed - 1) / 99) * 0.115;

            // Because React isn't double-calling this inside a shared parent loop, the local frame interpolations will be 60fps and silky smooth
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

            const fastTime = now / 250;

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
    }, [danceSpeed, timeOffset]);

    return (
        <RobotDancer
            scale={scale}
            color={color}
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
    );
}
