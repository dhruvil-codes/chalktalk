import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Loader2, 
  X, 
  Minimize2, 
  Maximize2, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  AlertCircle
} from 'lucide-react';
import UnifiedChatVoiceIcon from './ui/UnifiedChatVoiceIcon';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  isPlaying?: boolean;
}

interface VoiceSettings {
  language: string;
  voice: string;
  speed: number;
  volume: number;
}

interface UnifiedAssistantProps {
  isAuthenticated?: boolean;
  userProfile?: any;
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' }
];

// Enhanced university database
const institutionsDB: { [key: string]: any } = {
  'mit': {
    name: 'Massachusetts Institute of Technology',
    acceptanceRate: 6.7,
    tuition: '$53,790',
    studentPopulation: 11520,
    ranking: 1,
    location: 'Cambridge, Massachusetts',
    established: 1861,
    programs: ['Computer Science', 'Engineering', 'Physics', 'Mathematics', 'Economics']
  },
  'harvard': {
    name: 'Harvard University',
    acceptanceRate: 3.4,
    tuition: '$54,002',
    studentPopulation: 23000,
    ranking: 1,
    location: 'Cambridge, Massachusetts',
    established: 1636,
    programs: ['Economics', 'Computer Science', 'Political Science', 'Psychology', 'Biology']
  },
  'stanford': {
    name: 'Stanford University',
    acceptanceRate: 4.3,
    tuition: '$56,169',
    studentPopulation: 17000,
    ranking: 2,
    location: 'Stanford, California',
    established: 1885,
    programs: ['Computer Science', 'Engineering', 'Business', 'Biology', 'Economics']
  },
  'oxford': {
    name: 'University of Oxford',
    acceptanceRate: 17.5,
    tuition: '£9,250',
    studentPopulation: 24000,
    ranking: 1,
    location: 'Oxford, England',
    established: 1096,
    programs: ['Philosophy Politics Economics', 'Medicine', 'Law', 'History', 'English Literature']
  }
};

export default function UnifiedAssistant({ isAuthenticated = false, userProfile }: UnifiedAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: isAuthenticated 
        ? `Hello${userProfile ? ` ${userProfile.firstName}` : ''}! I'm your AI assistant for university information. I can help you through both text and voice. Ask me about universities, programs, admissions, or request comparisons. What would you like to know?`
        : 'Hello! I\'m your university information assistant. To access detailed university information and voice features, please sign in to your account first.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioError, setAudioError] = useState<string>('');
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en',
    voice: 'default',
    speed: 1.0,
    volume: 0.8
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      setVoicesLoaded(true);
      
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan')
      );
      
      if (femaleVoices.length > 0) {
        setSettings(prev => ({ ...prev, voice: femaleVoices[0].name }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(settings.language);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setAudioError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [settings.language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLanguageCode = (lang: string): string => {
    const codes: { [key: string]: string } = {
      'en': 'en-US',
      'zh': 'zh-CN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE'
    };
    return codes[lang] || 'en-US';
  };

  const processUniversityQuery = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const normalizedQuery = query.toLowerCase();
    
    // Check for MIT vs Harvard comparison
    if ((normalizedQuery.includes('mit') && normalizedQuery.includes('harvard')) || 
        (normalizedQuery.includes('compare') && (normalizedQuery.includes('mit') || normalizedQuery.includes('harvard')))) {
      return `I'm delighted to provide you with a comprehensive comparison between MIT and Harvard. MIT excels in STEM fields with hands-on innovation and has a 6.7% acceptance rate, while Harvard offers exceptional liberal arts with traditional academic excellence and a 3.4% acceptance rate. MIT focuses on maker culture and entrepreneurship, while Harvard emphasizes broad intellectual exploration and prestigious networking. Both offer world-class education with different cultural approaches.`;
    }

    // Find mentioned university
    const universityNames = Object.keys(institutionsDB);
    const mentionedUniversity = universityNames.find(name => 
      normalizedQuery.includes(name) || 
      normalizedQuery.includes(institutionsDB[name].name.toLowerCase())
    );

    if (!mentionedUniversity) {
      return "I can provide detailed information about top universities including MIT, Harvard, Stanford, and Oxford. I'm particularly knowledgeable about comparing universities. Please ask about a specific university or request a comparison.";
    }

    const university = institutionsDB[mentionedUniversity];

    if (normalizedQuery.includes('acceptance rate') || normalizedQuery.includes('admission')) {
      return `${university.name} has an acceptance rate of ${university.acceptanceRate}%, making it ${university.acceptanceRate < 5 ? 'extremely competitive' : university.acceptanceRate < 10 ? 'highly competitive' : 'competitive'}. The admission process is rigorous and requires exceptional academic performance.`;
    }

    if (normalizedQuery.includes('tuition') || normalizedQuery.includes('cost')) {
      return `The annual tuition at ${university.name} is ${university.tuition}. However, extensive financial aid programs are available for qualified students.`;
    }

    return `${university.name} is a prestigious institution located in ${university.location}, established in ${university.established}. With ${university.studentPopulation.toLocaleString()} students and an acceptance rate of ${university.acceptanceRate}%, it's renowned for excellence in ${university.programs.slice(0, 2).join(' and ')}.`;
  };

  const handleTextInput = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      isVoice: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = isAuthenticated 
        ? await processUniversityQuery(inputValue)
        : "Please sign in to access university information and voice features.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isVoice: false
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = async (transcript: string) => {
    setIsProcessing(true);
    setAudioError('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: transcript,
      timestamp: new Date(),
      isVoice: true
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = isAuthenticated 
        ? await processUniversityQuery(transcript)
        : "Please sign in to access university information and voice features.";
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-play voice response
      setTimeout(() => {
        playTextToSpeech(response, assistantMessage.id);
      }, 500);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      setAudioError('Failed to process your request');
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = async () => {
    if (!isAuthenticated) {
      setAudioError('Please sign in to use voice features');
      return;
    }

    if (!recognitionRef.current) {
      setAudioError('Speech recognition is not supported in your browser');
      return;
    }

    try {
      setAudioError('');
      setIsListening(true);
      recognitionRef.current.lang = getLanguageCode(settings.language);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setAudioError('Failed to start speech recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const playTextToSpeech = (text: string, messageId: string) => {
    if (!isAuthenticated) return;

    try {
      speechSynthesis.cancel();
      
      setIsSpeaking(true);
      setAudioError('');
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
      ));

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;
      
      utterance.lang = getLanguageCode(settings.language);
      utterance.rate = settings.speed;
      utterance.volume = settings.volume;
      
      if (voicesLoaded && availableVoices.length > 0) {
        let selectedVoice = availableVoices.find(voice => voice.name === settings.voice);
        
        if (!selectedVoice) {
          selectedVoice = availableVoices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('samantha')
          );
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
        currentUtteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        // Only log errors that are not 'interrupted' to avoid console clutter
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event);
          setAudioError(`Speech error: ${event.error}`);
        }
        setIsSpeaking(false);
        setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
        currentUtteranceRef.current = null;
      };
      
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setAudioError('Failed to play audio. Please try again.');
      setIsSpeaking(false);
      setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
    }
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
    currentUtteranceRef.current = null;
  };

  const clearConversation = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: isAuthenticated 
        ? `Hello${userProfile ? ` ${userProfile.firstName}` : ''}! I'm your AI assistant for university information. I can help you through both text and voice. Ask me about universities, programs, admissions, or request comparisons. What would you like to know?`
        : 'Hello! I\'m your university information assistant. To access detailed university information and voice features, please sign in to your account first.',
      timestamp: new Date()
    }]);
    stopAudio();
    setAudioError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextInput();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        title="AI Assistant - Text & Voice Support"
      >
        <UnifiedChatVoiceIcon 
          className="w-10 h-10" 
          isActive={true}
          showVoiceIndicator={isAuthenticated}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`${isAuthenticated ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <UnifiedChatVoiceIcon 
                className="w-7 h-7" 
                isActive={true}
                showVoiceIndicator={isAuthenticated}
                isListening={isListening}
                isSpeaking={isSpeaking}
              />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs opacity-90">
                {isAuthenticated ? 'Text & Voice Support' : 'Sign in required'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Audio Error Display */}
            {audioError && (
              <div className="bg-red-50 border-b border-red-200 p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{audioError}</span>
                </div>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && isAuthenticated && (
              <div className="bg-gray-50 border-b border-gray-200 p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
                  <select
                    value={settings.voice}
                    onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="default">Default Voice</option>
                    {availableVoices
                      .filter(voice => voice.lang.startsWith(settings.language))
                      .map(voice => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} {voice.localService ? '(Local)' : '(Online)'}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speed: {settings.speed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume: {Math.round(settings.volume * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.volume}
                    onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : isAuthenticated 
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {message.type === 'user' ? (
                        message.isVoice ? <Mic className="h-4 w-4" /> : <User className="h-4 w-4" />
                      ) : (
                        <UnifiedChatVoiceIcon 
                          className="w-5 h-5" 
                          isActive={isAuthenticated}
                          showVoiceIndicator={message.isVoice}
                          isSpeaking={message.isPlaying}
                        />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs ${
                          message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {message.isVoice && <span className="ml-1">🎤</span>}
                        </div>
                        {message.type === 'assistant' && isAuthenticated && (
                          <button
                            onClick={() => message.isPlaying ? stopAudio() : playTextToSpeech(message.content, message.id)}
                            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            title={message.isPlaying ? "Stop speaking" : "Play audio"}
                          >
                            {message.isPlaying ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(isTyping || isProcessing) && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <UnifiedChatVoiceIcon className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {isProcessing ? 'Processing voice...' : 'Typing...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Controls */}
            <div className="p-4 border-t border-gray-200">
              {/* Voice Controls */}
              {isAuthenticated && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearConversation}
                      disabled={messages.length <= 1}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Clear conversation"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={isSpeaking ? stopAudio : () => {}}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title={isSpeaking ? "Stop speaking" : "Audio controls"}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing || isSpeaking}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isListening
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <MicOff className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        Voice
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isAuthenticated ? "Ask about universities, programs, admissions..." : "Please sign in to ask questions"}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isTyping || !isAuthenticated}
                />
                <button
                  onClick={handleTextInput}
                  disabled={!inputValue.trim() || isTyping || !isAuthenticated}
                  className="w-12 h-12 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Sign in to access detailed university information and voice features
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}