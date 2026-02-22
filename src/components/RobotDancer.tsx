"use client";

import React from "react";

export interface RobotDancerProps {
    scale?: number;
    className?: string;
    upperBodyAngle?: number;
    leftUpperArmAngle?: number;
    leftLowerArmAngle?: number;
    rightUpperArmAngle?: number;
    rightLowerArmAngle?: number;
    leftUpperLegAngle?: number;
    leftLowerLegAngle?: number;
    rightUpperLegAngle?: number;
    rightLowerLegAngle?: number;
    headAngle?: number;
    lowerBodyAngle?: number;
    color?: string;
}

// A helper to strictly rotate SVG elements around an exact absolute coordinate
function RotateGroup({ cx, cy, angle, children }: {
    cx: number;
    cy: number;
    angle: number;
    children: React.ReactNode;
}) {
    // If no rotation, just return the children (optimization)
    if (angle === 0) return <>{children}</>;

    return (
        <g transform={`translate(${cx}, ${cy}) rotate(${angle}) translate(${-cx}, ${-cy})`}>
            {children}
        </g>
    );
}

export function RobotDancer({
    scale = 1,
    className = "",
    upperBodyAngle = 0,
    leftUpperArmAngle = 60,   // Default to pointing somewhat outwards
    leftLowerArmAngle = 15,
    rightUpperArmAngle = -60, // Default to pointing somewhat outwards
    rightLowerArmAngle = -15,
    leftUpperLegAngle = 0,
    leftLowerLegAngle = 0,
    rightUpperLegAngle = 0,
    rightLowerLegAngle = 0,
    headAngle = 0,
    lowerBodyAngle = 0,
    color = "#FF0000",
}: RobotDancerProps) {
    return (
        <div
            className={`relative inline-block overflow-visible ${className}`}
            style={{
                width: 200 * scale,
                height: 450 * scale,
            }}
        >
            <svg
                viewBox="0 0 200 450"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                }}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Visual debug dots for all pivots! */}

                {/* UPPER BODY (Pivots around Center: 100, 200) */}
                <RotateGroup cx={100} cy={200} angle={upperBodyAngle}>

                    {/* Neck (Static to Upper Body) */}
                    <line x1="92" y1="80" x2="92" y2="100" />
                    <line x1="108" y1="80" x2="108" y2="100" />

                    {/* Head & Face (Tilts independently) */}
                    <RotateGroup cx={100} cy={80} angle={headAngle}>
                        {/* Triangle Head (Narrower top) */}
                        <polygon points="70,30 130,30 100,95" strokeLinejoin="round" />
                        {/* Left Antenna */}
                        <line x1="77" y1="5" x2="83" y2="30" />
                        <circle cx="77" cy="5" r="3" fill={color} />
                        {/* Right Antenna */}
                        <line x1="123" y1="5" x2="117" y2="30" />
                        <circle cx="123" cy="5" r="3" fill={color} />

                        {/* Face (Eyes only) */}
                        <line x1="88" y1="44" x2="96" y2="44" strokeWidth="4" />
                        <line x1="104" y1="44" x2="112" y2="44" strokeWidth="4" />
                    </RotateGroup>

                    {/* Torso */}
                    <polygon points="40,100 160,100 100,200" strokeLinejoin="round" />

                    {/* JULAB - Custom Monoline Runic Lettering */}
                    <g transform="translate(1, 118)">
                        {/* J */}
                        <polyline points="72,0 72,12 62,12 62,6" />
                        {/* U */}
                        <polyline points="78,0 78,12 88,12 88,0" />
                        {/* L */}
                        <polyline points="94,0 94,12 104,12" />
                        {/* A */}
                        <polyline points="110,12 115,0 120,12" />
                        <line x1="112.5" y1="6" x2="117.5" y2="6" />
                        {/* B */}
                        <polyline points="126,12 126,0 134,0 136,3 134,6 126,6" />
                        <polyline points="126,6 134,6 136,9 134,12 126,12" />
                    </g>

                    <line x1="85" y1="145" x2="115" y2="145" />
                    <line x1="93" y1="165" x2="107" y2="165" />

                    {/* Left Arm (Shoulder Pivot: 40, 100) */}
                    <RotateGroup cx={40} cy={100} angle={leftUpperArmAngle}>
                        {/* Upper Left Arm */}
                        <polygon points="40,100 45,130 40,160 35,130" strokeLinejoin="round" />

                        {/* Left Elbow (Pivot: 40, 160) */}
                        <RotateGroup cx={40} cy={160} angle={leftLowerArmAngle}>
                            {/* Lower Left Arm */}
                            <polygon points="40,160 45,190 40,220 35,190" strokeLinejoin="round" />
                            {/* Left Hand */}
                            <rect x="30" y="220" width="20" height="20" rx="4" />
                        </RotateGroup>
                    </RotateGroup>

                    {/* Right Arm (Shoulder Pivot: 160, 100) */}
                    <RotateGroup cx={160} cy={100} angle={rightUpperArmAngle}>
                        {/* Upper Right Arm */}
                        <polygon points="160,100 165,130 160,160 155,130" strokeLinejoin="round" />

                        {/* Right Elbow (Pivot: 160, 160) */}
                        <RotateGroup cx={160} cy={160} angle={rightLowerArmAngle}>
                            {/* Lower Right Arm */}
                            <polygon points="160,160 165,190 160,220 155,190" strokeLinejoin="round" />
                            {/* Right Hand */}
                            <rect x="150" y="220" width="20" height="20" rx="4" />
                        </RotateGroup>
                    </RotateGroup>

                </RotateGroup>

                {/* Central Pivot Dot */}

                {/* LOWER BODY */}
                <RotateGroup cx={100} cy={200} angle={lowerBodyAngle}>
                    {/* Pelvis */}
                    <polygon points="70,200 130,200 100,240" strokeLinejoin="round" />

                    {/* Left Leg (Hip Pivot: 70, 200) */}
                    <RotateGroup cx={70} cy={200} angle={leftUpperLegAngle}>
                        {/* Upper Left Leg */}
                        <polygon points="70,200 75,250 70,300 65,250" strokeLinejoin="round" />

                        {/* Left Knee (Pivot: 70, 300) */}
                        <RotateGroup cx={70} cy={300} angle={leftLowerLegAngle}>
                            {/* Lower Left Leg */}
                            <polygon points="70,300 75,350 70,400 65,350" strokeLinejoin="round" />
                            {/* Left Foot */}
                            <line x1="70" y1="400" x2="50" y2="400" strokeWidth="8" />
                        </RotateGroup>
                    </RotateGroup>

                    {/* Right Leg (Hip Pivot: 130, 200) */}
                    <RotateGroup cx={130} cy={200} angle={rightUpperLegAngle}>
                        {/* Upper Right Leg */}
                        <polygon points="130,200 135,250 130,300 125,250" strokeLinejoin="round" />

                        {/* Right Knee (Pivot: 130, 300) */}
                        <RotateGroup cx={130} cy={300} angle={rightLowerLegAngle}>
                            {/* Lower Right Leg */}
                            <polygon points="130,300 135,350 130,400 125,350" strokeLinejoin="round" />
                            {/* Right Foot */}
                            <line x1="130" y1="400" x2="150" y2="400" strokeWidth="8" />
                        </RotateGroup>
                    </RotateGroup>
                </RotateGroup>

            </svg>
        </div>
    );
}
