import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  X,
  MessageSquare,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const FloatingCareerChatbot: React.FC = () => {
  const { currentUser, currentLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: currentLanguage === 'hi'
        ? `नमस्ते ${currentUser.name}! मैं आपका सहकार सहायक (AI Career & Training Advisor) हूँ। आप मुझसे पैक्स कंप्यूटरीकरण, दुग्ध सहकारी संघ, स्वयं सहायता समूह (SHG) या एनसीसीटी प्रमाणन से जुड़े रोजगार के बारे में कोई भी प्रश्न पूछ सकते हैं।`
        : currentLanguage === 'mr'
        ? `नमस्कार ${currentUser.name}! मी तुमचा सहकार सहायक (AI करिअर सल्लागार) आहे. तुम्ही मला पॅक्स संगणकीकरण, दुग्ध सहकारी संस्था किंवा एनसीसीटी प्रमाणपत्राच्या आधारे मिळणाऱ्या नोकऱ्यांबद्दल विचारू शकता.`
        : `Namaste ${currentUser.name}! I am your Sahakar Sahayak (AI Cooperative Career & Scheme Advisor). Ask me anything about PACS modernization roles, Dairy AMCS qualifications, SHG governance, or NCCT certificate career pathways.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Listen for custom event or navigation to open bot
  useEffect(() => {
    const handleOpenBot = () => setIsOpen(true);
    window.addEventListener('open-career-bot', handleOpenBot);
    return () => window.removeEventListener('open-career-bot', handleOpenBot);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'mr' ? 'mr-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const generateBotResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();

    if (query.includes('pacs') || query.includes('पैक्स') || query.includes('पॅक्स') || query.includes('manager')) {
      if (currentLanguage === 'hi') {
        return `पैक्स (PACS) प्रबंधक या ई-आरपी ऑपरेटर बनने के लिए मुख्य योग्यताएं:\n1. **एनसीसीटी राष्ट्रीय पैक्स ई-आरपी प्रमाणपत्र** (Module 1 & 2 उत्तीर्ण)।\n2. दैनिक रोकड़ बही (Cash Book) एवं केसीसी ऋण खाता संधारण का व्यावहारिक ज्ञान।\n3. सीएससी (CSC) ग्रामीण नागरिक सेवाएं प्रदान करने की दक्षता।\n\nइफको (IFFCO) एवं जिला सहकारी बैंकों में वर्तमान में पैक्स बिजनेस एसोसिएट के कई पद उपलब्ध हैं।`;
      } else if (currentLanguage === 'mr') {
        return `पॅक्स (PACS) व्यवस्थापक किंवा ऑपरेटरसाठी मुख्य कौशल्ये:\n१. **एनसीसीटी पॅक्स ई-आरपी प्रमाणपत्र**.\n२. दैनंदिन रोख नोंद आणि पीक कर्ज (KCC) वाटप प्रणाली.\n३. सीएससी डिजिटल नागरिक सेवा हाताळणी.\n\nतुम्ही 'Job Opportunities' विभागात जाऊन थेट अर्ज करू शकता.`;
      } else {
        return `To become a certified PACS Manager or ERP Operator:\n1. Complete NCCT's "PACS Computerization & ERP Operations" course with ≥75% score.\n2. Master Day-Open/Day-Close cash book posting & KCC credit limits under DLTC.\n3. Understand CSC e-governance service delivery.\n\nCheck out the IFFCO posting in your Job Opportunities tab!`;
      }
    }

    if (query.includes('dairy') || query.includes('milk') || query.includes('amul') || query.includes('दूध') || query.includes('डेयरी')) {
      if (currentLanguage === 'hi') {
        return `दुग्ध सहकारी क्षेत्र (जैसे अमूल, मदर डेयरी) में रोजगार के मुख्य अवसर:\n- **एएमसीएस (AMCS) एवं गुणवत्ता परीक्षक:** स्वचालित मिल्क एनालाइजर पर फैट/एसएनएफ परीक्षण एवं किसान डीबीटी भुगतान।\n- **बीएमसी (BMC) कोल्ड चेन ऑपरेटर:** बल्क मिल्क कूलर का 4°C पर रख-रखाव।\n\nएनसीसीटी का 'Dairy Cold Chain' कोर्स पूरा करने वाले उम्मीदवारों को प्राथमिकता दी जाती है।`;
      } else if (currentLanguage === 'mr') {
        return `दुग्ध व्यवसाय आणि अमूल/महानंद सारख्या सहकारी संघांमध्ये:\n- **AMCS गुणवत्ता निरीक्षक:** फॅट व एसएनएफ तपासणी आणि शेतकरी बिल वाटप.\n- **बीएमसी शीत साखळी तंत्रज्ञ:** दूध ४ अंश तापमानावर टिकवणे.`;
      } else {
        return `Opportunities in Dairy Cooperatives (AMUL / State Dairy Federations):\n- **AMCS Quality Testing Officer:** Operating ultrasonic milk analyzers, measuring FAT/SNF, and handling direct farmer bank settlements.\n- **Bulk Milk Cooler (BMC) Technician:** Maintaining chilling temperatures at 4°C.\n\nCheck out the AMUL posting in the Job Opportunities tab!`;
      }
    }

    if (query.includes('shg') || query.includes('महिला') || query.includes('बचत') || query.includes('credit')) {
      if (currentLanguage === 'hi') {
        return `स्वयं सहायता समूह (SHG) महासंघों में करियर:\n- **समुदाय संसाधन व्यक्ति (CRP) एवं बैंक सखी**\n- **पंचसूत्र एवं डिजिटल बुक-कीपिंग विशेषज्ञ**\n- बैंकों से ₹20 लाख तक के ऋण लिंकेज हेतु सूक्ष्म निवेश योजना (MIP) तैयार करना।`;
      } else {
        return `SHG Federation Leadership & Linkage Roles:\n- **Community Resource Person (CRP) & Bank Sakhi**\n- **Digital Bookkeeping & Panchasutra Compliance**\n- Facilitating bank credit linkage up to ₹20 Lakhs collateral-free for rural women.`;
      }
    }

    // Default Fallback
    if (currentLanguage === 'hi') {
      return `आपका प्रश्न सहकारी विकास की दृष्टि से बहुत महत्वपूर्ण है। एनसीसीटी के 20 संस्थान (वाम्निकॉम, 5 आरआईसीएम एवं 14 आईसीएम) ग्रामीण युवाओं एवं पैक्स कर्मियों को व्यावहारिक प्रशिक्षण प्रदान करते हैं। आप इस पोर्टल पर कोई भी कोर्स पूरा करके सीधे सरकारी एवं सहकारी नियोक्ताओं से जुड़ सकते हैं।`;
    } else if (currentLanguage === 'mr') {
      return `हा प्रश्न अतिशय महत्त्वाचा आहे. एनसीसीटीच्या २० संस्थांमधून प्रशिक्षण पूर्ण करून तुम्ही राष्ट्रीय स्तरावर मान्यताप्राप्त प्रमाणपत्र मिळवू शकता आणि सहकार क्षेत्रातील नामांकित संस्थांमध्ये नोकरी मिळवू शकता.`;
    } else {
      return `NCCT’s federated network of 20 institutes offers certified capacity building under Ministry of Cooperation guidelines. Upon passing our modular LMS quizzes, your verified digital credentials instantly appear to cooperative employers across India.`;
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseText = generateBotResponse(query);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);

      if (ttsEnabled) {
        speakText(responseText);
      }
    }, 600);
  };

  const suggestions = [
    'What skills do I need to become a PACS Manager?',
    'Tell me about Dairy Cooperative quality standards.',
    'How does SHG bank credit linkage work?',
    'Explain NCCT certificate validity.'
  ];

  return (
    <>
      {/* 1. Floating AI Chatbot Circular Button (Fixed bottom-right corner) */}
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_24px_rgba(0,91,70,0.35)] hover:shadow-[0_12px_32px_rgba(0,91,70,0.45)] hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen
              ? 'bg-[#073D32] text-white rotate-90'
              : 'bg-[#004D3B] hover:bg-[#003D2E] text-white'
          }`}
          aria-label="Toggle Career Sahayak AI Assistant"
          title="Ask Career Sahayak (AI Advisor)"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Speech bubble / Chat icon matching the reference image */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
              </svg>
              {/* Subtle spark motif */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#004D3B] animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* 2. Floating AI Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[calc(100vh-120px)] bg-white rounded-[24px] border border-[#D8E3DC] shadow-[0_20px_50px_rgba(7,61,50,0.22)] flex flex-col overflow-hidden animate-fadeIn select-none"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#005B46] to-[#0B6E4F] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shadow-xs flex-shrink-0">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="font-extrabold text-sm text-white font-devanagari">
                    सहकार सहायक
                  </h3>
                  <span className="text-[10px] font-bold text-amber-300 tracking-wider font-sans uppercase">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10.5px] text-emerald-100 font-medium">
                    NCCT Cooperative Domain Advisor
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  ttsEnabled ? 'bg-amber-400 text-[#005B46]' : 'text-emerald-100 hover:bg-white/10'
                }`}
                title={ttsEnabled ? 'Voice read-out is active' : 'Turn on voice read-out'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAF8]">
            {messages.map(msg => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[88%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                      isBot ? 'bg-[#005B46]' : 'bg-[#E98A28]'
                    }`}
                  >
                    {isBot ? <Bot className="w-3.5 h-3.5 text-amber-300" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs whitespace-pre-line leading-relaxed shadow-2xs ${
                      isBot
                        ? 'bg-white text-gray-800 border border-gray-100'
                        : 'bg-[#005B46] text-white'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isBot ? 'text-gray-400' : 'text-emerald-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 mr-auto max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-[#005B46] flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="bg-white p-2.5 rounded-2xl border border-gray-100 text-xs text-gray-500 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005B46] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005B46] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005B46] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="p-2.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(s);
                }}
                className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-[#005B46] rounded-full border border-gray-200 flex-shrink-0 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="truncate max-w-[200px]">{s}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask about PACS, Dairy, SHGs, Jobs..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005B46] bg-[#FBFDFB]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-[#005B46] hover:bg-[#004837] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
