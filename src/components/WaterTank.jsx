import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const WaterTank = ({ level = 50, capacity = 500000, size = "large", label = "Main Tank" }) => {
  const [displayLevel, setDisplayLevel] = useState(0);
  const motionLevel = useMotionValue(0);

  // Animate the level on mount or change
  useEffect(() => {
    const controls = animate(motionLevel, level, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayLevel(Math.round(v)),
    });
    return controls.stop;
  }, [level, motionLevel]);

  // Color based on level
  const getColor = (lvl) => {
    if (lvl >= 60) return { fill: "#00e676", glow: "rgba(0,230,118,0.3)", label: "Good" };
    if (lvl >= 30) return { fill: "#ffca28", glow: "rgba(255,202,40,0.3)", label: "Moderate" };
    return { fill: "#ff5252", glow: "rgba(255,82,82,0.4)", label: "Critical" };
  };

  const color = getColor(displayLevel);
  const isLarge = size === "large";
  const w = isLarge ? 220 : 140;
  const h = isLarge ? 280 : 180;
  const tankPadding = 10;
  const tankInnerW = w - tankPadding * 2;
  const tankInnerH = h - 50; // leave room for top cap
  const waterHeight = (tankInnerH * displayLevel) / 100;
  const waterY = 40 + tankInnerH - waterHeight;

  const idSafeLabel = label.replace(/[^a-zA-Z0-9]/g, "-");

  // Generate wave path
  const generateWavePath = (yBase, amplitude, phase, width) => {
    const startX = tankPadding - 20;
    const endX = tankPadding + width + 20;
    let path = `M ${startX} ${yBase}`;
    for (let x = startX; x <= endX; x += 2) {
      const relativeX = x - tankPadding;
      const y = yBase + Math.sin((relativeX / width) * Math.PI * 3 + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${endX} ${yBase + 200} L ${startX} ${yBase + 200} Z`;
    return path;
  };

  const formatCapacity = (cap) => {
    if (cap >= 1000000) return `${(cap / 1000000).toFixed(1)}M L`;
    return `${(cap / 1000).toFixed(0)}K L`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label */}
      <span className={`font-heading font-semibold text-text-secondary ${isLarge ? 'text-sm' : 'text-xs'}`}>
        {label}
      </span>

      {/* Tank SVG */}
      <div className="relative" style={{ width: w, height: h }}>
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="drop-shadow-lg"
        >
          <defs>
            {/* Tank gradient */}
            <linearGradient id={`tankGrad-${idSafeLabel}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>

            {/* Water gradient */}
            <linearGradient id={`waterGrad-${idSafeLabel}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color.fill} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color.fill} stopOpacity="0.5" />
            </linearGradient>

            {/* Glow filter */}
            <filter id={`glow-${idSafeLabel}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clip for water inside tank */}
            <clipPath id={`tankClip-${idSafeLabel}`}>
              <rect
                x={tankPadding}
                y={40}
                width={tankInnerW}
                height={tankInnerH}
                rx="8"
              />
            </clipPath>
          </defs>

          {/* Tank body */}
          <rect
            x={tankPadding}
            y={30}
            width={tankInnerW}
            height={tankInnerH + 15}
            rx="12"
            fill={`url(#tankGrad-${idSafeLabel})`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />

          {/* Tank top cap */}
          <rect
            x={w / 2 - 25}
            y={20}
            width={50}
            height={18}
            rx="6"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* Pipe */}
          <rect
            x={w / 2 - 4}
            y={8}
            width={8}
            height={16}
            rx="3"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* Water fill */}
          <g clipPath={`url(#tankClip-${idSafeLabel})`}>
            {/* Main water body */}
            <rect
              x={tankPadding}
              y={waterY}
              width={tankInnerW}
              height={waterHeight + 20}
              fill={`url(#waterGrad-${idSafeLabel})`}
            />

            {/* Wave 1 (front) */}
            <path
              d={generateWavePath(waterY, isLarge ? 4 : 3, 0, tankInnerW)}
              fill={color.fill}
              fillOpacity="0.6"
              filter={`url(#glow-${idSafeLabel})`}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-8 0; 8 0; -8 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            {/* Wave 2 (back, slower) */}
            <path
              d={generateWavePath(waterY, isLarge ? 3 : 2, 2, tankInnerW)}
              fill={color.fill}
              fillOpacity="0.3"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="6 0; -6 0; 6 0"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Level markings */}
          {[25, 50, 75].map((mark) => {
            const markY = 40 + tankInnerH - (tankInnerH * mark) / 100;
            return (
              <g key={mark}>
                <line
                  x1={tankPadding + 5}
                  y1={markY}
                  x2={tankPadding + 15}
                  y2={markY}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <text
                  x={tankPadding + 18}
                  y={markY + 3}
                  fill="rgba(255,255,255,0.25)"
                  fontSize={isLarge ? "8" : "6"}
                  fontFamily="Inter, sans-serif"
                >
                  {mark}%
                </text>
              </g>
            );
          })}

          {/* Percentage text center */}
          <text
            x={w / 2}
            y={40 + tankInnerH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={isLarge ? "32" : "20"}
            fontWeight="700"
            fontFamily="Outfit, sans-serif"
            filter={`url(#glow-${label})`}
          >
            {displayLevel}%
          </text>
        </svg>

        {/* Critical pulse ring */}
        {displayLevel < 30 && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-water-red"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Status pill */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: `${color.fill}15`,
          color: color.fill,
          border: `1px solid ${color.fill}30`,
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: color.fill }}
        />
        {color.label}
      </div>

      {/* Capacity */}
      <span className={`text-text-muted ${isLarge ? 'text-xs' : 'text-[10px]'}`}>
        {formatCapacity(capacity)}
      </span>
    </div>
  );
};

export default WaterTank;
