
import { Bot, Siren, Users, X, Send, Bell, Shield, MessageSquareText, ImageIcon, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CRMService } from '../crmService.ts';
import { ChatMessage, User } from '../types.ts';
import botAvatarImg from '../assets/images/assistant-padellotto.png';
import confirmImg from '../assets/images/confirm-padello.png';
import emergencyImg from '../assets/images/emergency-padello.png';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  clubId: string;
  systemMessage?: string | null;
  onEmergencyRequest?: (message: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle, user, clubId, systemMessage, onEmergencyRequest }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isManager = user?.role === 'manager' || user?.role === 'super_admin';
  
  // Immagine illustrativa di un cavaliere mascot di alta qualità
  const botAvatar = botAvatarImg;
const botName = "Sir Padellotto";

const CONFIRM_IMG = confirmImg;
const EMERGENCY_IMG = emergencyImg;

  const getStorageKey = () => user ? `padello_chat_history_${user.id}` : null;

  useEffect(() => {
    if (!user) return;
    
    const key = getStorageKey();
    if (!key) return;

    const savedHistory = localStorage.getItem(key);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const hydratedMessages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(hydratedMessages);
      } catch (error) {
        console.error("Errore nel caricamento della cronologia chat:", error);
      }
    } else {
      const initialMsgs: ChatMessage[] = isManager ? [
        {
          id: '1',
          sender: 'bot',
          text: `Saluti, Mio Signore ${user.name}! 🛡️\nSono ${botName}, il tuo scudiero di fiducia. Come posso servirti oggi nel Regno del Padel?`,
          timestamp: new Date()
        }
      ] : [
        {
          id: '1',
          sender: 'bot',
          text: `Salve, Valoroso ${user.name}! Sono ${botName}. 🎾\nSono qui per assisterti nella tua ascesa alla gloria. Chiedimi pure di trovare uno sfidante!`,
          timestamp: new Date(),
        }
      ];
      setMessages(initialMsgs);
    }
  }, [user?.id, isManager]);

  useEffect(() => {
    const key = getStorageKey();
    if (key && messages.length > 0) {
      localStorage.setItem(key, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

  useEffect(() => {
    if (systemMessage) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              sender: 'bot',
              text: systemMessage,
              timestamp: new Date()
          }]);
          setIsTyping(false);
        }, 1200);
    }
  }, [systemMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, messages, isTyping]);

  const botResponse = (text: string, imageUrl?: string, delay: number = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text,
        imageUrl,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const lowerInput = inputValue.toLowerCase();
    const isSearchIntent = lowerInput.includes('cerca') || lowerInput.includes('giocatore') || lowerInput.includes('trova') || lowerInput.includes('compagno');
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      isEmergency: isEmergency,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    
    if (isSearchIntent) {
        botResponse(`Udite, udite! ⚔️ I miei messaggeri reali stanno cercando uno sfidante degno della vostra fama.`, CONFIRM_IMG);
        if (user) {
          CRMService.syncEmergencyRequest(user, clubId, `RICHIESTA GIOCATORE: ${currentInput}`);
          if (onEmergencyRequest) onEmergencyRequest(`Ricerca compagno da ${user.name}`);
        }
    } else if (isEmergency) {
        botResponse(`Allerta ricevuta! 🚨 Avviso subito il Gran Maestro. Restate in guardia!`, EMERGENCY_IMG);
        if (user) {
          CRMService.syncEmergencyRequest(user, clubId, `SOS UTENTE: ${currentInput}`);
          if (onEmergencyRequest) onEmergencyRequest(`SOS da ${user.name}: "${currentInput}"`);
        }
    } else {
        botResponse(`Per la gloria del Padel! Come posso aiutarvi, Mio Signore? Prova a chiedermi di cercare un compagno.`);
    }

    setIsEmergency(false);
  };

  return (
    <>
      <button
        onClick={onToggle}
        className={`
          fixed bottom-24 right-6 z-[120] p-0 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 border-4 border-white dark:border-slate-800 overflow-hidden group
          ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'animate-bounce-slow'}
        `}
      >
        <div className={`relative w-16 h-16 ${isManager ? 'bg-indigo-600' : 'bg-orange-500'} flex items-center justify-center p-0.5`}>
          <img 
            src={botAvatar} 
            alt="Sir Padellotto" 
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
      </button>

      <div 
        className={`
          fixed bottom-24 right-6 z-[130] w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        `}
        style={{ height: '550px', maxHeight: '80vh' }}
      >
        <div className={`p-5 flex justify-between items-center text-white relative overflow-hidden ${isManager ? 'bg-indigo-900' : 'bg-orange-600'}`}>
          <div className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white p-0.5 overflow-hidden shrink-0 flex items-center justify-center shadow-lg border-2 border-white/30">
               <img src={botAvatar} alt="Bot" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">{botName}</h3>
              <p className="text-[10px] text-white/70 font-black uppercase tracking-widest">Scudiero Reale</p>
            </div>
          </div>
          <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-xl transition-colors z-10">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-slate-950/50 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {msg.sender === 'bot' && (
                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-2 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700 bg-white p-0.5`}>
                    <img src={botAvatar} alt="Bot" className="w-full h-full object-cover" />
                 </div>
              )}
              <div 
                className={`
                  max-w-[85%] rounded-[1.5rem] overflow-hidden shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-slate-800 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-none'}
                `}
              >
                {msg.imageUrl && (
                  <div className="w-full bg-slate-100 dark:bg-slate-900/50">
                    <img src={msg.imageUrl} alt="Contenuto" className="w-full h-40 object-cover" />
                  </div>
                )}
                <div className="p-4 text-sm font-medium">
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] opacity-40 mt-2 block text-right font-black">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start items-center gap-1 p-4 bg-white dark:bg-slate-700 rounded-2xl w-fit shadow-sm">
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-75" />
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-150" />
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Chiedi a Sir Padellotto..."
              className="flex-1 rounded-2xl px-5 py-4 text-sm font-bold bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              className="p-4 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-500/20 active:scale-90 transition-all"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
};
