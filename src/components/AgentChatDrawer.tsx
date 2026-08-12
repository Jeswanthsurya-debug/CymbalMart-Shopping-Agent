import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Lightbulb } from 'lucide-react';
import { PartyPlan, ChatMessage } from '../types';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan | null;
}

const SAMPLE_PROMPTS = [
  "How can I cut $40-$50 off this budget?",
  "What non-alcoholic drinks work best for this theme?",
  "Suggest 3 quick budget appetizers for this guest count",
  "How many pounds of ice do I need?",
  "What music playlist fits this party vibe?"
];

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: "👋 Hi! I'm your AI Party Shopping Agent. Ask me anything about budget savings, recipe scaling, party games, or store ingredient swaps!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          partyPlan: currentPlan,
          history: messages.slice(-6)
        })
      });

      const data = await response.json();
      if (data.success) {
        const agentMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, agentMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: "I ran into a temporary issue connecting to Gemini. Try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-left">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              AI Party Shopping Agent
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentPlan ? `Linked to ${currentPlan.criteria.title}` : 'Ready for your questions'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick ask:</span>
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <div>{msg.text}</div>
              <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-300 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex gap-2.5 items-center text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-300 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask AI agent for party advice..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition shadow-md shadow-purple-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
