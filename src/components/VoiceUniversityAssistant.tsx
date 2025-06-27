import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Loader2,
  MessageCircle,
  Globe,
  X,
  ChevronDown,
  AlertCircle,
  Settings
} from 'lucide-react';
import UnifiedChatVoiceIcon from './ui/UnifiedChatVoiceIcon';

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: Date;
  language?: string;
  isPlaying?: boolean;
}

interface VoiceSettings {
  language: string;
  voice: string;
  speed: number;
  volume: number;
}

interface UniversityData {
  name: string;
  acceptanceRate: number;
  tuition: string;
  studentPopulation: number;
  ranking: number;
  location: string;
  establishedYear: number;
  popularMajors: string[];
  researchFunding: string;
  financialAid: string;
  campusSize: string;
  notableAlumni: string[];
  academicStrengths: string[];
  campusCulture: string;
  careerOutcomes: {
    employmentRate: string;
    averageSalary: string;
    topEmployers: string[];
  };
  facilities: string[];
  admissionRequirements: string;
}

// Enhanced university database with detailed comparison data
const universityDatabase: { [key: string]: UniversityData } = {
  'mit': {
    name: 'Massachusetts Institute of Technology',
    acceptanceRate: 6.7,
    tuition: '$53,790',
    studentPopulation: 11520,
    ranking: 1,
    location: 'Cambridge, Massachusetts',
    establishedYear: 1861,
    popularMajors: ['Computer Science', 'Engineering', 'Physics', 'Mathematics', 'Economics'],
    researchFunding: '$800 million annually',
    financialAid: '91% of students receive financial aid, average aid package $53,450',
    campusSize: '168 acres',
    notableAlumni: ['Buzz Aldrin', 'Kofi Annan', 'Benjamin Netanyahu'],
    academicStrengths: ['STEM programs', 'Engineering excellence', 'Innovation and entrepreneurship', 'Hands-on learning'],
    campusCulture: 'Collaborative, innovation-focused, work-hard-play-hard mentality with strong maker culture',
    careerOutcomes: {
      employmentRate: '95% within 6 months',
      averageSalary: '$95,000',
      topEmployers: ['Google', 'Microsoft', 'Apple', 'Tesla', 'Goldman Sachs']
    },
    facilities: ['State-of-the-art labs', 'Media Lab', 'Computer Science and Artificial Intelligence Laboratory', 'Koch Institute'],
    admissionRequirements: 'SAT 1520-1580, ACT 34-36, strong STEM background, demonstrated innovation'
  },
  'harvard': {
    name: 'Harvard University',
    acceptanceRate: 3.4,
    tuition: '$54,002',
    studentPopulation: 23000,
    ranking: 1,
    location: 'Cambridge, Massachusetts',
    establishedYear: 1636,
    popularMajors: ['Economics', 'Computer Science', 'Political Science', 'Psychology', 'Biology'],
    researchFunding: '$1.2 billion annually',
    financialAid: '70% of students receive financial aid, families earning under $75,000 pay nothing',
    campusSize: '5,076 acres',
    notableAlumni: ['Barack Obama', 'Mark Zuckerberg', 'Bill Gates'],
    academicStrengths: ['Liberal arts excellence', 'Business and law preparation', 'Research opportunities', 'Interdisciplinary studies'],
    campusCulture: 'Prestigious, intellectually rigorous, diverse with strong house system fostering community',
    careerOutcomes: {
      employmentRate: '94% within 6 months',
      averageSalary: '$85,000',
      topEmployers: ['McKinsey & Company', 'Goldman Sachs', 'Google', 'Microsoft', 'Bain & Company']
    },
    facilities: ['Widener Library', 'Harvard Medical School', 'Harvard Business School', 'Multiple research institutes'],
    admissionRequirements: 'SAT 1460-1580, ACT 33-35, exceptional academic record, leadership experience'
  },
  'stanford': {
    name: 'Stanford University',
    acceptanceRate: 4.3,
    tuition: '$56,169',
    studentPopulation: 17000,
    ranking: 2,
    location: 'Stanford, California',
    establishedYear: 1885,
    popularMajors: ['Computer Science', 'Engineering', 'Business', 'Biology', 'Economics'],
    researchFunding: '$1.6 billion annually',
    financialAid: '80% of students receive financial aid',
    campusSize: '8,180 acres',
    notableAlumni: ['Elon Musk', 'Larry Page', 'Sergey Brin'],
    academicStrengths: ['Technology and innovation', 'Entrepreneurship', 'Silicon Valley connections'],
    campusCulture: 'Entrepreneurial, collaborative, California laid-back with intense academic focus',
    careerOutcomes: {
      employmentRate: '96% within 6 months',
      averageSalary: '$90,000',
      topEmployers: ['Google', 'Apple', 'Facebook', 'Tesla', 'McKinsey']
    },
    facilities: ['Stanford Research Park', 'Hoover Institution', 'SLAC National Accelerator'],
    admissionRequirements: 'SAT 1470-1570, ACT 33-35, innovation focus, leadership'
  },
  'oxford': {
    name: 'University of Oxford',
    acceptanceRate: 17.5,
    tuition: '£9,250',
    studentPopulation: 24000,
    ranking: 1,
    location: 'Oxford, England',
    establishedYear: 1096,
    popularMajors: ['Philosophy Politics Economics', 'Medicine', 'Law', 'History', 'English Literature'],
    researchFunding: '£600 million annually',
    financialAid: 'Need-based bursaries available',
    campusSize: 'City-wide collegiate system',
    notableAlumni: ['Stephen Hawking', 'Tony Blair', 'Oscar Wilde'],
    academicStrengths: ['Tutorial system', 'Liberal arts', 'Research excellence'],
    campusCulture: 'Traditional, academic, collegiate system with rich history',
    careerOutcomes: {
      employmentRate: '92% within 6 months',
      averageSalary: '£35,000',
      topEmployers: ['McKinsey', 'Goldman Sachs', 'BBC', 'Government']
    },
    facilities: ['Bodleian Library', 'Multiple colleges', 'Research institutes'],
    admissionRequirements: 'A-levels AAA, entrance exams, interviews, subject-specific requirements'
  }
};

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' }
];

export default function VoiceUniversityAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [audioError, setAudioError] = useState<string>('');
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en',
    voice: 'default',
    speed: 1.0,
    volume: 0.8
  });

  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      setVoicesLoaded(true);
      
      // Set default female voice if available
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel')
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

  const startListening = async () => {
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

  const handleVoiceInput = async (transcript: string) => {
    setIsProcessing(true);
    setAudioError('');
    
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: transcript,
      timestamp: new Date(),
      language: settings.language
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await processUniversityQuery(transcript);
      
      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: response,
        timestamp: new Date(),
        language: settings.language
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
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

  const processUniversityQuery = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const normalizedQuery = query.toLowerCase();
    
    if ((normalizedQuery.includes('mit') && normalizedQuery.includes('harvard')) || 
        (normalizedQuery.includes('compare') && (normalizedQuery.includes('mit') || normalizedQuery.includes('harvard')))) {
      return generateMITHarvardComparison();
    }

    const universityNames = Object.keys(universityDatabase);
    const mentionedUniversity = universityNames.find(name => 
      normalizedQuery.includes(name) || 
      normalizedQuery.includes(universityDatabase[name].name.toLowerCase())
    );

    if (!mentionedUniversity) {
      return "I can provide detailed information about top universities including MIT, Harvard, Stanford, and Oxford. I'm particularly knowledgeable about comparing MIT and Harvard. Please ask about a specific university or request a comparison.";
    }

    const university = universityDatabase[mentionedUniversity];

    if (normalizedQuery.includes('acceptance rate') || normalizedQuery.includes('admission')) {
      return `${university.name} has an acceptance rate of ${university.acceptanceRate}%, making it ${university.acceptanceRate < 5 ? 'extremely competitive' : university.acceptanceRate < 10 ? 'highly competitive' : 'competitive'}. ${university.admissionRequirements}`;
    }

    if (normalizedQuery.includes('tuition') || normalizedQuery.includes('cost')) {
      return `The annual tuition at ${university.name} is ${university.tuition}. ${university.financialAid}`;
    }

    return `${university.name} is a prestigious institution located in ${university.location}, established in ${university.establishedYear}. With ${university.studentPopulation.toLocaleString()} students and an acceptance rate of ${university.acceptanceRate}%, it's renowned for excellence in ${university.academicStrengths.slice(0, 2).join(' and ')}.`;
  };

  const generateMITHarvardComparison = (): string => {
    return `I'm delighted to provide you with a comprehensive comparison between MIT and Harvard. MIT excels in STEM fields with hands-on innovation, while Harvard offers exceptional liberal arts with traditional academic excellence. MIT has a 6.7% acceptance rate compared to Harvard's 3.4%. Both offer world-class education with different cultural approaches - MIT focuses on maker culture and entrepreneurship, while Harvard emphasizes broad intellectual exploration and prestigious networking.`;
  };

  const playTextToSpeech = (text: string, messageId: string) => {
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
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('karen')
          );
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
        currentUtteranceRef.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        if (event.error !== 'interrupted') {
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
    setMessages([]);
    stopAudio();
    setAudioError('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        title="Voice University Assistant"
      >
        <UnifiedChatVoiceIcon 
          className="w-10 h-10" 
          isActive={true}
          showVoiceIndicator={true}
          isListening={isListening}
        />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <UnifiedChatVoiceIcon 
              className="w-7 h-7" 
              isActive={true}
              showVoiceIndicator={true}
              isListening={isListening || isSpeaking}
            />
          </div>
          <div>
            <h3 className="font-semibold">Voice Assistant</h3>
            <p className="text-xs opacity-90">University Expert</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

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
      {showSettings && (
        <div className="bg-gray-50 border-b border-gray-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <UnifiedChatVoiceIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Ask me about university information!</p>
            <p className="text-xs mt-2">Try: "Compare MIT and Harvard"</p>
          </div>
        )}
        
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
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <UnifiedChatVoiceIcon 
                    className="w-5 h-5" 
                    isActive={true}
                    showVoiceIndicator={message.isPlaying}
                  />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="text-sm whitespace-pre-line">{message.text}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className={`text-xs ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {message.type === 'assistant' && (
                    <button
                      onClick={() => message.isPlaying ? stopAudio() : playTextToSpeech(message.text, message.id)}
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

        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <UnifiedChatVoiceIcon className="w-5 h-5" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">Analyzing your question...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              disabled={messages.length === 0}
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
          
          <div className="text-xs text-gray-500">
            {supportedLanguages.find(l => l.code === settings.language)?.flag} Voice Assistant
          </div>
        </div>
        
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing || isSpeaking}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isListening ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Listening...</span>
              <MicOff className="h-4 w-4" />
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>Ask about universities</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Try: "Compare MIT and Harvard" or "What's Stanford's culture?"
        </p>
      </div>
    </div>
  );
}