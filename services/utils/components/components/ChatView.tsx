import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageToAIStream } from '../services/geminiService';
import { ChatMessage, Sender } from '../types';
import { Spinner } from './ui/Spinner';

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM8.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3.5 4.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
    </svg>
);


const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', sender: Sender.AI, text: "Bonjour! Je suis Issam, votre assistant IA. Comment puis-je vous aider aujourd'hui?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: input,
      isAwaitingResponse: true,
    };
    const userMessageId = userMessage.id;

    const aiMessageId = (Date.now() + 1).toString();
    const aiPlaceholder: ChatMessage = {
      id: aiMessageId,
      sender: Sender.AI,
      text: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageToAIStream(input);
      let fullText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if(chunkText) {
          fullText += chunkText;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );

    } catch (error) {
      console.error(error);
      const errorMessage = "Désolé, une erreur s'est produite. Veuillez réessayer.";
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: errorMessage, isStreaming: false } : msg
        )
      );
    } finally {
      setIsLoading(false);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessageId ? { ...msg, isAwaitingResponse: false } : msg
        )
      );
    }
  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === Sender.USER ? 'justify-end' : ''}`}>
            {msg.sender === Sender.AI && <div className="flex-shrink-0"><BotIcon/></div>}
            
            {msg.sender === Sender.USER && msg.isAwaitingResponse && (
                <div className="flex-shrink-0 self-center">
                    <Spinner />
                </div>
            )}

            <div className={`max-w-xl p-4 rounded-2xl ${
                msg.sender === Sender.AI
                  ? 'bg-slate-800 text-slate-200 rounded-tl-none'
                  : 'bg-cyan-600 text-white rounded-br-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.isStreaming && <Spinner className="ml-2 inline-block"/>}
            </div>
            {msg.sender === Sender.USER && <div className="flex-shrink-0"><UserIcon/></div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question à Issam..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 text-white rounded-lg p-3 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
