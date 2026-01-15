import React, { useState, useEffect } from 'react';

const ScoreCard = ({ confidence, modelUsed }) => {
  const [displayedConfidence, setDisplayedConfidence] = useState(0);

  // Map confidence text to percentage
  const getConfidencePercentage = (conf) => {
    if (typeof conf === 'number') return conf;
    const mapping = {
      'High': 85,
      'Medium': 60,
      'Low': 35,
    };
    return mapping[conf] || 70;
  };

  const percentage = getConfidencePercentage(confidence);

  // Animate the confidence bar
  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayedConfidence(Math.round(percentage * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [percentage]);

  // Get color based on confidence
  const getConfidenceColor = () => {
    if (displayedConfidence >= 70) return { from: '#22c55e', to: '#10b981' }; // Green
    if (displayedConfidence >= 40) return { from: '#ffd23f', to: '#f59e0b' }; // Yellow
    return { from: '#ff6b35', to: '#ff2e63' }; // Orange/Pink
  };

  const colors = getConfidenceColor();

  return (
    <div className="glass rounded-xl p-4 neon-border animate-slide-up mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-neon-yellow"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold text-gray-200">Response Quality</span>
        </div>
        <span
          className="text-2xl font-bold font-display"
          style={{
            background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 20px ${colors.from}40`,
          }}
        >
          {displayedConfidence}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-dark-bg rounded-full overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `linear-gradient(90deg, ${colors.from}20, ${colors.to}20)`,
          }}
        />

        {/* Animated fill */}
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{
            width: `${displayedConfidence}%`,
            background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
            boxShadow: `0 0 20px ${colors.from}80`,
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>

      {/* Model info */}
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span>Model: </span>
        <span className="text-neon-purple font-medium">{modelUsed || 'gpt-4o-mini'}</span>
      </div>

      {/* Confidence level label */}
      <div className="flex items-center gap-2 mt-2 text-sm">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: colors.from }}
        />
        <span className="text-gray-400">
          Confidence Level:{' '}
          <span
            className="font-semibold"
            style={{ color: colors.from }}
          >
            {displayedConfidence >= 70 ? 'High' : displayedConfidence >= 40 ? 'Medium' : 'Low'}
          </span>
        </span>
      </div>

      {/* Add shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ScoreCard;
