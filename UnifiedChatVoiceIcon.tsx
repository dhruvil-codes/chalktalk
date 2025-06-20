import React from 'react';

interface UnifiedChatVoiceIconProps {
  className?: string;
  isActive?: boolean;
  showVoiceIndicator?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export default function UnifiedChatVoiceIcon({ 
  className = "w-8 h-8", 
  isActive = false,
  showVoiceIndicator = false,
  isListening = false,
  isSpeaking = false
}: UnifiedChatVoiceIconProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Gradients */}
        <defs>
          <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isActive ? "#8B5CF6" : "#A78BFA"} />
            <stop offset="50%" stopColor={isActive ? "#3B82F6" : "#60A5FA"} />
            <stop offset="100%" stopColor={isActive ? "#10B981" : "#34D399"} />
          </linearGradient>
          <linearGradient id="voiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Main Robot Body */}
        <ellipse
          cx="32"
          cy="38"
          rx="22"
          ry="18"
          stroke="url(#botGradient)"
          strokeWidth="3"
          fill={isActive ? "url(#botGradient)" : "white"}
          opacity={isActive ? "0.9" : "1"}
        />

        {/* Robot Head/Face Container */}
        <rect
          x="18"
          y="28"
          width="28"
          height="20"
          rx="14"
          stroke={isActive ? "white" : "url(#botGradient)"}
          strokeWidth="2"
          fill={isActive ? "rgba(255,255,255,0.2)" : "white"}
        />

        {/* Robot Eyes */}
        <circle
          cx="26"
          cy="36"
          r="3"
          fill={isActive ? "white" : "url(#botGradient)"}
        />
        <circle
          cx="38"
          cy="36"
          r="3"
          fill={isActive ? "white" : "url(#botGradient)"}
        />

        {/* Robot Mouth/Expression */}
        <path
          d="M28 42 Q32 45 36 42"
          stroke={isActive ? "white" : "url(#botGradient)"}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Antenna with Microphone */}
        <line
          x1="32"
          y1="28"
          x2="32"
          y2="18"
          stroke="url(#botGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Antenna Top - Voice Microphone */}
        <ellipse
          cx="32"
          cy="14"
          rx="4"
          ry="6"
          stroke={showVoiceIndicator || isListening ? "url(#voiceGradient)" : "url(#botGradient)"}
          strokeWidth="2"
          fill={showVoiceIndicator || isListening ? "url(#voiceGradient)" : "white"}
          className={isListening ? "animate-pulse" : ""}
        />

        {/* Microphone Grille */}
        <line x1="30" y1="12" x2="34" y2="12" stroke="white" strokeWidth="1" opacity="0.8" />
        <line x1="30" y1="14" x2="34" y2="14" stroke="white" strokeWidth="1" opacity="0.8" />
        <line x1="30" y1="16" x2="34" y2="16" stroke="white" strokeWidth="1" opacity="0.8" />

        {/* Chat Bubble */}
        <path
          d="M48 12 L58 12 Q62 12 62 16 L62 24 Q62 28 58 28 L54 28 L50 32 L50 28 L48 28 Q44 28 44 24 L44 16 Q44 12 48 12 Z"
          stroke="url(#chatGradient)"
          strokeWidth="2"
          fill={isActive ? "url(#chatGradient)" : "white"}
          opacity={isActive ? "0.9" : "1"}
        />

        {/* Chat Typing Dots */}
        <circle 
          cx="49" 
          cy="20" 
          r="1.5" 
          fill={isActive ? "white" : "url(#chatGradient)"}
          className="animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <circle 
          cx="53" 
          cy="20" 
          r="1.5" 
          fill={isActive ? "white" : "url(#chatGradient)"}
          className="animate-pulse"
          style={{ animationDelay: '200ms' }}
        />
        <circle 
          cx="57" 
          cy="20" 
          r="1.5" 
          fill={isActive ? "white" : "url(#chatGradient)"}
          className="animate-pulse"
          style={{ animationDelay: '400ms' }}
        />

        {/* Voice Sound Waves */}
        {(showVoiceIndicator || isListening || isSpeaking) && (
          <g className={isListening || isSpeaking ? "animate-pulse" : ""}>
            {/* Left Side Waves */}
            <path
              d="M8 38 Q6 36 8 34"
              stroke="url(#voiceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M4 42 Q2 38 4 34"
              stroke="url(#voiceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M2 46 Q0 38 2 30"
              stroke="url(#voiceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
            
            {/* Right Side Waves */}
            <path
              d="M56 38 Q58 36 56 34"
              stroke="url(#voiceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M60 42 Q62 38 60 34"
              stroke="url(#voiceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M62 46 Q64 38 62 30"
              stroke="url(#voiceGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
          </g>
        )}

        {/* Robot Arms/Connectors */}
        <circle
          cx="12"
          cy="38"
          r="4"
          stroke="url(#botGradient)"
          strokeWidth="2"
          fill={isActive ? "url(#botGradient)" : "white"}
        />
        <circle
          cx="52"
          cy="38"
          r="4"
          stroke="url(#botGradient)"
          strokeWidth="2"
          fill={isActive ? "url(#botGradient)" : "white"}
        />

        {/* Active Status Indicator */}
        {isActive && (
          <circle
            cx="54"
            cy="18"
            r="3"
            fill="#10B981"
            className="animate-pulse"
          />
        )}

        {/* Listening Indicator */}
        {isListening && (
          <circle
            cx="10"
            cy="18"
            r="2"
            fill="#EF4444"
            className="animate-ping"
          />
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <circle
            cx="54"
            cy="54"
            r="2"
            fill="#10B981"
            className="animate-bounce"
          />
        )}
      </svg>
    </div>
  );
}