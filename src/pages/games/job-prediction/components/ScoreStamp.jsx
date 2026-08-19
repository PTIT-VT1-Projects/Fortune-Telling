import React, { useMemo, useState } from "react";

export default function ScoreStamp({
  score,
  tone = "red",
  size = 150,
  endRotate = -8,
  replayOnClick = true,
}) {
  const ink = TONES[tone] || TONES.red;
  const [playKey, setPlayKey] = useState(0);
  const uid = useMemo(() => `ss-${Math.random().toString(36).slice(2, 8)}`, []);

  const r = 84;
  const circumference = useMemo(() => 2 * Math.PI * r, []);

  return (
    <div
      className="ss-scene"
      style={{
        width: size,
        height: size,
        cursor: replayOnClick ? "pointer" : "default",
      }}
      onClick={() => replayOnClick && setPlayKey((k) => k + 1)}
    >
      <style>{CSS(circumference)}</style>

      <div key={playKey} className="ss-group">
        <div className="ss-shadow" />

        <svg
          className={`ss-svg ${uid}`}
          viewBox="0 0 200 200"
          style={{ "--ink": ink, "--rot": `${endRotate}deg` }}
        >
          {/* vòng ngoài — tự vẽ quanh lúc va chạm */}
          <circle
            className="ss-ring ss-ring-outer"
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* vòng trong nhỏ hơn, vẽ chậm hơn 1 nhịp cho có lớp lang */}
          <circle
            className="ss-ring ss-ring-inner"
            cx="100"
            cy="100"
            r={r - 16}
            fill="none"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* số điểm — bung ra đúng lúc vòng tròn khép kín */}
          <text
            className="ss-score"
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="central"
            fill={ink}
          >
            {score}
          </text>
        </svg>
      </div>
    </div>
  );
}

const TONES = {
  red: "#B3261E",
  green: "#1E7A3E",
  blue: "#1E4FB3",
  orange: "#C2570A",
};

const CSS = (circumference) => `
.ss-scene { position: relative; user-select: none; }
.ss-group { position: absolute; inset: 0; }

.ss-shadow {
  position: absolute;
  left: 50%; top: 50%;
  width: 70%; height: 18%;
  transform: translate(-50%, -50%) scale(0.4);
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0,0,0,0.30), transparent);
  opacity: 0;
  animation: ss-shadow-pop 750ms cubic-bezier(.3,.7,.2,1) both;
}
@keyframes ss-shadow-pop {
  0%, 40%  { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
  56%      { opacity: 0.15; }
  64%      { opacity: 0.45; transform: translate(-50%, -50%) scale(1.15); }
  100%     { opacity: 0.28; transform: translate(-50%, -50%) scale(1); }
}

.ss-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: multiply;
  /* toàn khối bay từ góc trên-phải, lao xuống, va chạm nảy nhẹ */
  animation: ss-fly-in 750ms cubic-bezier(.2,.6,.2,1) both;
}
@keyframes ss-fly-in {
  0%   { opacity: 0;   transform: translate(220px,-180px) rotate(20deg) scale(0.4); }
  10%  { opacity: 1; }
  48%  { transform: translate(-4px,-3px) rotate(calc(var(--rot) - 5deg)) scale(1.03); }
  58%  { transform: translate(0,0) rotate(var(--rot)) scale(1.08); }
  72%  { transform: translate(0,1.5px) rotate(calc(var(--rot) + 1deg)) scale(0.97); }
  84%  { transform: translate(0,-1px) rotate(calc(var(--rot) - 0.4deg)) scale(1.02); }
  100% { opacity: 1; transform: translate(0,0) rotate(var(--rot)) scale(1); }
}

/* nét mực tự "vẽ" quanh vòng tròn, khớp đúng lúc va chạm (48%-78%) */
.ss-ring {
  stroke-dasharray: ${circumference};
  stroke-dashoffset: ${circumference};
  opacity: 0;
  transform-origin: 100px 100px;
  transform: rotate(-90deg); /* bắt đầu vẽ từ đỉnh */
}
.ss-ring-outer {
  animation: ss-draw 750ms cubic-bezier(.65,0,.35,1) both;
}
.ss-ring-inner {
  animation: ss-draw 750ms cubic-bezier(.65,0,.35,1) both;
  animation-delay: 60ms;
}
@keyframes ss-draw {
  0%, 47%  { stroke-dashoffset: ${circumference}; opacity: 0; }
  50%      { opacity: 1; }
  78%      { stroke-dashoffset: 0; opacity: 1; }
  100%     { stroke-dashoffset: 0; opacity: 1; }
}

/* số điểm bung ra đúng lúc vòng khép kín */
.ss-score {
  font: 600 58px 'Courier New', ui-monospace, monospace;
  opacity: 0;
  transform-origin: 100px 100px;
  animation: ss-score-pop 750ms cubic-bezier(.2,.8,.2,1) both;
}
@keyframes ss-score-pop {
  0%, 62%  { opacity: 0; transform: scale(0.3); }
  76%      { opacity: 1; transform: scale(1.18); }
  88%      { transform: scale(0.94); }
  100%     { opacity: 1; transform: scale(1); }
}
`;
