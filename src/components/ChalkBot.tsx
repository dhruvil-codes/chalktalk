import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, Minimize2, Maximize2, Lock } from 'lucide-react';
import UnifiedChatVoiceIcon from './ui/UnifiedChatVoiceIcon';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface InstitutionData {
  name: string;
  type: 'Engineering' | 'Medical' | 'Management' | 'Arts' | 'Science';
  location: string;
  established: number;
  ranking: {
    nirf: number;
    overall: number;
  };
  placements: {
    year: number;
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
    topRecruiters: string[];
  };
  faculty: {
    totalFaculty: number;
    phdHolders: number;
    researchPapers: number;
    studentFacultyRatio: number;
  };
  infrastructure: {
    campusSize: number;
    hostels: number;
    libraries: number;
    labs: number;
    sportsComplex: boolean;
  };
  programs: string[];
}

interface ChalkBotProps {
  isAuthenticated?: boolean;
  userProfile?: any;
}

// Enhanced university database with detailed comparison data
const institutionsDB: { [key: string]: InstitutionData } = {
  'mit': {
    name: 'Massachusetts Institute of Technology',
    type: 'Engineering',
    location: 'Cambridge, Massachusetts',
    established: 1861,
    ranking: { nirf: 1, overall: 1 },
    placements: {
      year: 2023,
      averagePackage: 95.0,
      highestPackage: 300.0,
      placementRate: 99.2,
      topRecruiters: ['Google', 'Microsoft', 'Apple', 'Amazon', 'SpaceX']
    },
    faculty: {
      totalFaculty: 1000,
      phdHolders: 980,
      researchPapers: 6800,
      studentFacultyRatio: 3.0
    },
    infrastructure: {
      campusSize: 168,
      hostels: 11,
      libraries: 5,
      labs: 150,
      sportsComplex: true
    },
    programs: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Aerospace Engineering', 'Chemical Engineering']
  },
  'harvard': {
    name: 'Harvard University',
    type: 'Arts',
    location: 'Cambridge, Massachusetts',
    established: 1636,
    ranking: { nirf: 1, overall: 1 },
    placements: {
      year: 2023,
      averagePackage: 85.0,
      highestPackage: 250.0,
      placementRate: 98.5,
      topRecruiters: ['McKinsey & Company', 'Goldman Sachs', 'Google', 'Microsoft', 'Bain & Company']
    },
    faculty: {
      totalFaculty: 2400,
      phdHolders: 2350,
      researchPapers: 8500,
      studentFacultyRatio: 6.0
    },
    infrastructure: {
      campusSize: 5076,
      hostels: 12,
      libraries: 17,
      labs: 200,
      sportsComplex: true
    },
    programs: ['Economics', 'Computer Science', 'Political Science', 'Psychology', 'Biology']
  },
  'stanford': {
    name: 'Stanford University',
    type: 'Engineering',
    location: 'Stanford, California',
    established: 1885,
    ranking: { nirf: 2, overall: 2 },
    placements: {
      year: 2023,
      averagePackage: 90.0,
      highestPackage: 280.0,
      placementRate: 97.8,
      topRecruiters: ['Google', 'Apple', 'Tesla', 'Meta', 'Netflix']
    },
    faculty: {
      totalFaculty: 2180,
      phdHolders: 2100,
      researchPapers: 7200,
      studentFacultyRatio: 5.5
    },
    infrastructure: {
      campusSize: 8180,
      hostels: 15,
      libraries: 20,
      labs: 180,
      sportsComplex: true
    },
    programs: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Bioengineering', 'Materials Science']
  },
  'oxford': {
    name: 'University of Oxford',
    type: 'Arts',
    location: 'Oxford, England',
    established: 1096,
    ranking: { nirf: 1, overall: 1 },
    placements: {
      year: 2023,
      averagePackage: 65.0,
      highestPackage: 180.0,
      placementRate: 96.5,
      topRecruiters: ['McKinsey', 'BCG', 'Goldman Sachs', 'JP Morgan', 'Deloitte']
    },
    faculty: {
      totalFaculty: 1800,
      phdHolders: 1750,
      researchPapers: 5200,
      studentFacultyRatio: 11.0
    },
    infrastructure: {
      campusSize: 0, // City university
      hostels: 39,
      libraries: 100,
      labs: 120,
      sportsComplex: true
    },
    programs: ['Philosophy Politics Economics', 'English Literature', 'History', 'Mathematics', 'Physics', 'Medicine']
  },
  'cambridge': {
    name: 'University of Cambridge',
    type: 'Science',
    location: 'Cambridge, England',
    established: 1209,
    ranking: { nirf: 2, overall: 2 },
    placements: {
      year: 2023,
      averagePackage: 68.0,
      highestPackage: 190.0,
      placementRate: 97.2,
      topRecruiters: ['McKinsey', 'BCG', 'Goldman Sachs', 'Google', 'Microsoft']
    },
    faculty: {
      totalFaculty: 1500,
      phdHolders: 1450,
      researchPapers: 4800,
      studentFacultyRatio: 10.5
    },
    infrastructure: {
      campusSize: 0, // City university
      hostels: 31,
      libraries: 114,
      labs: 100,
      sportsComplex: true
    },
    programs: ['Natural Sciences', 'Mathematics', 'Engineering', 'Computer Science', 'Medicine', 'Economics']
  },
  'toronto': {
    name: 'University of Toronto',
    type: 'Science',
    location: 'Toronto, Ontario, Canada',
    established: 1827,
    ranking: { nirf: 18, overall: 18 },
    placements: {
      year: 2023,
      averagePackage: 55.0,
      highestPackage: 150.0,
      placementRate: 94.8,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'RBC', 'TD Bank']
    },
    faculty: {
      totalFaculty: 2500,
      phdHolders: 2300,
      researchPapers: 6200,
      studentFacultyRatio: 18.0
    },
    infrastructure: {
      campusSize: 714,
      hostels: 12,
      libraries: 44,
      labs: 180,
      sportsComplex: true
    },
    programs: ['Computer Science', 'Engineering', 'Medicine', 'Business', 'Arts & Science', 'Applied Science']
  }
};

export default function ChalkBot({ isAuthenticated = false, userProfile }: ChalkBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: isAuthenticated 
        ? `Hello${userProfile ? ` ${userProfile.firstName}` : ''}! I'm ChalkBot, your AI assistant for university information. I can help you with details about universities in our database, including academic programs, admission requirements, campus facilities, and more. You can interact with me through text or voice. What would you like to know?`
        : 'Hello! I\'m ChalkBot, your university information assistant. To access detailed university information, please sign in to your account first. I support both text and voice interactions once you\'re logged in.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findInstitution = (query: string): InstitutionData | null => {
    const normalizedQuery = query.toLowerCase();
    return Object.values(institutionsDB).find(inst => 
      inst.name.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(inst.name.toLowerCase().split(' ').slice(-1)[0]) ||
      (normalizedQuery.includes('harvard') && inst.name.includes('Harvard')) ||
      (normalizedQuery.includes('stanford') && inst.name.includes('Stanford')) ||
      (normalizedQuery.includes('mit') && inst.name.includes('MIT')) ||
      (normalizedQuery.includes('oxford') && inst.name.includes('Oxford')) ||
      (normalizedQuery.includes('cambridge') && inst.name.includes('Cambridge')) ||
      (normalizedQuery.includes('toronto') && inst.name.includes('Toronto'))
    ) || null;
  };

  const compareInstitutions = (inst1: InstitutionData, inst2: InstitutionData): string => {
    return `**Comparison between ${inst1.name} and ${inst2.name}:**

**Rankings:**
• ${inst1.name}: Overall Rank ${inst1.ranking.overall}
• ${inst2.name}: Overall Rank ${inst2.ranking.overall}

**Placements (${inst1.placements.year}):**
• ${inst1.name}: Average $${inst1.placements.averagePackage}K, Highest $${inst1.placements.highestPackage}K, Placement Rate ${inst1.placements.placementRate}%
• ${inst2.name}: Average $${inst2.placements.averagePackage}K, Highest $${inst2.placements.highestPackage}K, Placement Rate ${inst2.placements.placementRate}%

**Faculty:**
• ${inst1.name}: ${inst1.faculty.totalFaculty} faculty, ${inst1.faculty.phdHolders} PhD holders, Student-Faculty Ratio 1:${inst1.faculty.studentFacultyRatio}
• ${inst2.name}: ${inst2.faculty.totalFaculty} faculty, ${inst2.faculty.phdHolders} PhD holders, Student-Faculty Ratio 1:${inst2.faculty.studentFacultyRatio}

**Infrastructure:**
• ${inst1.name}: ${inst1.infrastructure.campusSize > 0 ? `${inst1.infrastructure.campusSize} acres` : 'City campus'}, ${inst1.infrastructure.hostels} colleges/hostels, ${inst1.infrastructure.labs} labs
• ${inst2.name}: ${inst2.infrastructure.campusSize > 0 ? `${inst2.infrastructure.campusSize} acres` : 'City campus'}, ${inst2.infrastructure.hostels} colleges/hostels, ${inst2.infrastructure.labs} labs`;
  };

  const generateMITHarvardComparison = (): string => {
    return `Hello! I'm delighted to provide you with a comprehensive comparison between MIT and Harvard, two of the world's most prestigious institutions, both located in Cambridge, Massachusetts.

Academic Programs and Specialties: MIT is renowned globally for its STEM excellence, particularly in engineering, computer science, and technology innovation. Their hands-on approach emphasizes practical problem-solving and cutting-edge research. Harvard, on the other hand, offers exceptional strength across liberal arts, with outstanding programs in economics, political science, and pre-professional tracks like pre-med and pre-law.

Research Opportunities and Funding: Harvard leads with 1.2 billion dollars in annual research funding compared to MIT's 800 million, but both offer exceptional undergraduate research opportunities. MIT's research is heavily concentrated in technology and engineering, while Harvard's research spans diverse fields from medical research to policy research.

Campus Culture and Student Life: The cultures are distinctly different. MIT has a collaborative, maker-focused environment where students embrace innovation and entrepreneurship. Harvard maintains a more traditional academic atmosphere with its historic house system fostering close-knit communities.

Admission Requirements: Harvard is more selective with a 3.4% acceptance rate compared to MIT's 6.7%. Harvard typically looks for SAT scores of 1460 to 1580 and exceptional well-rounded profiles, while MIT seeks 1520 to 1580 SAT scores with demonstrated STEM excellence.

Career Outcomes: Both schools boast impressive career outcomes. MIT graduates average 95,000 dollars starting salaries with 95% employment within six months, often joining tech giants. Harvard graduates average 85,000 dollars with 94% employment, frequently entering consulting, finance, and diverse professional fields.

My Recommendation: Choose MIT if you're passionate about STEM fields and want to be at the forefront of technological innovation. Choose Harvard if you prefer broader academic exploration or are interested in fields like politics, business, or medicine. Both will provide world-class education and exceptional opportunities.`;
  };

  const processUniversityQuery = async (query: string): Promise<string> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const normalizedQuery = query.toLowerCase();
    
    // Check for MIT vs Harvard comparison
    if ((normalizedQuery.includes('mit') && normalizedQuery.includes('harvard')) || 
        (normalizedQuery.includes('compare') && (normalizedQuery.includes('mit') || normalizedQuery.includes('harvard')))) {
      return generateMITHarvardComparison();
    }

    // Extract university name from query
    const institution = findInstitution(query);
    if (!institution) {
      return "I can provide detailed information about top universities including MIT, Harvard, Stanford, Yale, Princeton, and Oxford. I'm particularly knowledgeable about comparing MIT and Harvard. Please ask about a specific university, such as 'What is MIT's acceptance rate?' or 'Compare MIT and Harvard.' You can interact with me through text or voice!";
    }

    // Handle different types of queries with enhanced responses
    if (normalizedQuery.includes('acceptance rate') || normalizedQuery.includes('admission')) {
      return `${institution.name} has an acceptance rate of ${institution.placements.placementRate}%, making it ${institution.placements.placementRate < 5 ? 'extremely competitive' : institution.placements.placementRate < 10 ? 'highly competitive' : 'competitive'}. The admission process is rigorous and requires exceptional academic performance, strong test scores, and demonstrated leadership experience.`;
    }

    if (normalizedQuery.includes('tuition') || normalizedQuery.includes('fee') || normalizedQuery.includes('cost')) {
      const tuitionInfo = institution.name.includes('Harvard') ? '$54,002' :
                         institution.name.includes('Stanford') ? '$56,169' :
                         institution.name.includes('MIT') ? '$53,790' :
                         institution.name.includes('Oxford') ? '£9,250' :
                         institution.name.includes('Cambridge') ? '£9,250' :
                         institution.name.includes('Toronto') ? 'CAD $58,160' : 'Contact university';

      return `The annual tuition at ${institution.name} is ${tuitionInfo}. However, extensive financial aid programs are available for qualified students, with many families paying significantly less than the sticker price.`;
    }

    if (normalizedQuery.includes('placement') || normalizedQuery.includes('career') || normalizedQuery.includes('job')) {
      return `Career outcomes at ${institution.name} are excellent, with ${institution.placements.placementRate}% placement rate and an average starting salary of $${institution.placements.averagePackage}K. Top employers include ${institution.placements.topRecruiters.slice(0, 3).join(', ')}.`;
    }

    // General information
    return `${institution.name} is a prestigious institution located in ${institution.location}, established in ${institution.established}. With ${institution.faculty.totalFaculty} faculty members and a student-faculty ratio of 1:${institution.faculty.studentFacultyRatio}, it's renowned for excellence in ${institution.programs.slice(0, 2).join(' and ')}.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const response = isAuthenticated 
        ? await processUniversityQuery(inputValue)
        : "Please sign in to access university information and voice features.";

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        title="ChalkBot - AI Assistant with Voice Support"
      >
        <UnifiedChatVoiceIcon 
          className="w-10 h-10" 
          isActive={true}
          showVoiceIndicator={isAuthenticated}
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
              />
            </div>
            <div>
              <h3 className="font-semibold">ChalkBot</h3>
              <p className="text-xs opacity-90">
                {isAuthenticated ? 'AI Assistant with Voice Support' : 'Sign in required'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
                        ? 'bg-primary-500 text-white' 
                        : isAuthenticated 
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <UnifiedChatVoiceIcon 
                          className="w-5 h-5" 
                          isActive={isAuthenticated}
                          showVoiceIndicator={isAuthenticated}
                        />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <UnifiedChatVoiceIcon className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                        <span className="text-sm text-gray-600">ChalkBot is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
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
                  onClick={handleSendMessage}
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