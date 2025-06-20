import React from 'react';

interface VoiceChatIconProps {
  className?: string;
  isActive?: boolean;
  showVoiceIndicator?: boolean;
}

export default function VoiceChatIcon({ 
  className = "w-8 h-8", 
  isActive = false,
  showVoiceIndicator = false 
}: VoiceChatIconProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Chat Bubble Base */}
        <path
          d="M6 8C6 6.89543 6.89543 6 8 6H24C25.1046 6 26 6.89543 26 8V18C26 19.1046 25.1046 20 24 20H12L8 24V20H8C6.89543 20 6 19.1046 6 18V8Z"
          fill={isActive ? "currentColor" : "currentColor"}
          className={isActive ? "text-white" : "text-white"}
          opacity={isActive ? "1" : "0.9"}
        />
        
        {/* Microphone Icon Inside Bubble */}
        <g transform="translate(11, 9)">
          {/* Mic Body */}
          <rect
            x="4"
            y="1"
            width="2"
            height="5"
            rx="1"
            fill={isActive ? "#4F46E5" : "#6366F1"}
          />
          
          {/* Mic Stand */}
          <path
            d="M5 8V9M3 6.5C3 7.88071 4.11929 9 5.5 9H5.5C6.88071 9 8 7.88071 8 6.5V6"
            stroke={isActive ? "#4F46E5" : "#6366F1"}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Base */}
          <line
            x1="3"
            y1="10"
            x2="7"
            y2="10"
            stroke={isActive ? "#4F46E5" : "#6366F1"}
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        {/* Sound Waves */}
        <g className={`${showVoiceIndicator ? 'animate-pulse' : ''}`}>
          {/* Wave 1 */}
          <path
            d="M18 11C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13"
            stroke={isActive ? "#10B981" : "#34D399"}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={showVoiceIndicator ? "1" : "0.7"}
          />
          
          {/* Wave 2 */}
          <path
            d="M20 9.5C21.1046 9.5 22 10.3954 22 11.5V12.5C22 13.6046 21.1046 14.5 20 14.5"
            stroke={isActive ? "#10B981" : "#34D399"}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={showVoiceIndicator ? "0.8" : "0.5"}
          />
          
          {/* Wave 3 */}
          <path
            d="M22.5 8C24.1569 8 25.5 9.34315 25.5 11V13C25.5 14.6569 24.1569 16 22.5 16"
            stroke={isActive ? "#10B981" : "#34D399"}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={showVoiceIndicator ? "0.6" : "0.3"}
          />
        </g>

        {/* Active Indicator Dot */}
        {isActive && (
          <circle
            cx="24"
            cy="8"
            r="3"
            fill="#10B981"
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
}