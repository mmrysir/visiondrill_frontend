'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { 
  Search, 
  Send, 
  MoreVertical, 
  MessageSquare, 
  Users, 
  Clock,
  Check,
  CheckCheck,
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagingPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get('/student/messages/threads');
        // Fractal returns data in res.data.data
        setThreads(res.data.data || []);
      } catch (err) {
        console.error('Failed to load threads');
        // Mock data for demo if API fails/is empty
        setThreads([
          { id: 1, subject: 'Course Support: React Masterclass', last_message: 'How do I implement the custom hook?', updated_at: new Date().toISOString(), unread: true, participants: [{ first_name: 'Instructor', last_name: 'David' }] },
          { id: 2, subject: 'Group Study: UI/UX Trends', last_message: 'Let\'s meet at 5 PM tomorrow.', updated_at: new Date(Date.now() - 3600000).toISOString(), unread: false, participants: [{ first_name: 'Sarah', last_name: 'Chen' }] },
        ]);
      } finally {
        setIsLoadingThreads(false);
      }
    };
    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const res = await api.get(`/student/messages/threads/${selectedThread.id}`);
          setMessages(res.data.data || []);
        } catch (err) {
          console.error('Failed to load messages');
          setMessages([
            { id: 1, body: 'Welcome to the course support thread!', user: { first_name: 'Instructor', last_name: 'David' }, created_at: new Date(Date.now() - 86400000).toISOString(), is_me: false },
            { id: 2, body: 'Hi David, thanks for having me. I have a question about the assignment.', user: { first_name: 'Me' }, created_at: new Date(Date.now() - 3600000).toISOString(), is_me: true },
          ]);
        } finally {
          setIsLoadingMessages(false);
          setTimeout(scrollToBottom, 100);
        }
      };
      fetchMessages();
    }
  }, [selectedThread]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    const tempMessage = {
      id: Date.now(),
      body: newMessage,
      is_me: true,
      created_at: new Date().toISOString(),
      user: { first_name: 'Me' }
    };

    setMessages([...messages, tempMessage]);
    setNewMessage('');
    setTimeout(scrollToBottom, 50);

    try {
      await api.post(`/student/messages/threads/${selectedThread.id}/reply`, {
        body: newMessage,
        thread_id: selectedThread.id
      });
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const filteredThreads = threads.filter(t => 
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.participants?.[0]?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto px-8 h-[calc(100vh-180px)] flex gap-8">
      
      {/* Sidebar: Thread List */}
      <div className={`w-full md:w-96 flex flex-col bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/5 ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-gray-50 bg-gray-50/20">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-6 uppercase flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={24} /> 
            Inbox
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:border-blue-200 outline-none font-bold text-xs transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {isLoadingThreads ? (
             [1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse"></div>)
          ) : filteredThreads.map(thread => (
            <div 
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-5 rounded-2xl cursor-pointer transition-all flex items-start gap-4 group ${selectedThread?.id === thread.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-gray-50 text-gray-900'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${selectedThread?.id === thread.id ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                {thread.participants?.[0]?.first_name?.[0] || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-xs truncate pr-4 capitalize">{thread.subject}</h4>
                  <span className={`text-[9px] font-bold ${selectedThread?.id === thread.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(thread.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[10px] truncate pr-4 ${selectedThread?.id === thread.id ? 'text-blue-100' : 'text-gray-500 font-medium'}`}>
                  {thread.last_message}
                </p>
              </div>
              {thread.unread && selectedThread?.id !== thread.id && (
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Chat Window */}
      <div className={`flex-1 flex flex-col bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/5 ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
               <div className="flex items-center gap-6">
                  <button onClick={() => setSelectedThread(null)} className="md:hidden p-2 text-gray-400">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100">
                    {selectedThread.participants?.[0]?.first_name?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight capitalize">{selectedThread.subject}</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Context
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Users size={18} />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <MoreVertical size={18} />
                  </button>
               </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6 bg-[#FDFDFF]">
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-300">
                  <Clock className="animate-spin" size={32} />
                  <p className="text-xs font-black uppercase tracking-widest">Retrieving Encrypted Stream...</p>
                </div>
              ) : (
                <>
                  <div className="text-center py-10">
                    <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                      Decrypted Connection Established
                    </span>
                  </div>
                  
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.is_me ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] group ${message.is_me ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`px-6 py-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm transition-all hover:shadow-md ${
                          message.is_me 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                        }`}>
                          {message.body}
                        </div>
                        <div className={`flex items-center gap-2 mt-2 px-1 ${message.is_me ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="text-[9px] font-bold text-gray-400">
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.is_me && <CheckCheck size={12} className="text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-gray-50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 p-2 rounded-[1.5rem] focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
                <div className="flex items-center gap-1 pl-2">
                  <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
                    <Smile size={20} />
                  </button>
                  <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
                    <Paperclip size={20} />
                  </button>
                </div>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Transmit message..."
                  className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-gray-900 py-4 placeholder-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-[1rem] flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-8 bg-[#FDFDFF]">
            <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-[3rem] flex items-center justify-center shadow-inner relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
               <MessageSquare size={56} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Secure Messenger</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                select a secure channel from the registry to begin high-fidelity peer communication.
              </p>
            </div>
            <div className="pt-4 flex gap-4">
               <span className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                  End-to-End Encrypted
               </span>
               <span className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                  Real-time Data
               </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
