'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Sparkles, Cpu, Search, Trash2 } from 'lucide-react';

interface LogEntry {
  type: 'system' | 'user' | 'ai';
  message: string;
  timestamp: string;
}

export default function PINNCli() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', message: 'PINN-AI v2.0.4 Protocol Initialized.', timestamp: '04:11:11' },
    { type: 'system', message: 'Waiting for operator command...', timestamp: '04:11:12' }
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [...prev, { type, message, timestamp }]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    addLog('user', cmd);
    setInput('');

    // Command Logic
    setTimeout(() => {
      if (cmd.startsWith('/summarize')) {
        addLog('ai', 'Scanning active video node for atomic takeaways...');
        setTimeout(() => addLog('ai', 'SUMMARY: This lesson focuses on neural state optimization and async persistence loops. Key constraint: keep latency < 40ms.'), 800);
      } else if (cmd.startsWith('/quiz')) {
        addLog('ai', 'Generating video-to-question evaluation set...');
        setTimeout(() => addLog('ai', 'EVAL: 5 questions generated and synced to registry.'), 1200);
      } else if (cmd === '/help') {
        addLog('system', 'AVAILABLE COMMANDS: /summarize, /quiz, /clear, /analyze');
      } else if (cmd === '/clear') {
        setLogs([{ type: 'system', message: 'Logs purged.', timestamp: '---' }]);
      } else {
        addLog('ai', `Unknown command: "${cmd}". Type /help for operational manual.`);
      }
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-[#0F0F12] border-l border-white/5">
       <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2">
             <Cpu className="text-blue-500" size={14} />
             <span className="text-[10px] font-sans text-white font-black  tracking-widest leading-none">PINN-AI CLI</span>
          </div>
          <div className="flex gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <button onClick={() => setLogs([])} className="text-gray-600 hover:text-red-500 transition-colors">
                <Trash2 size={12} />
             </button>
          </div>
       </div>

       {/* CLI Log Output */}
       <div className="flex-1 overflow-y-auto p-4 font-sans text-[11px] space-y-3 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
              <span className="text-gray-700 shrink-0 select-none">[{log.timestamp}]</span>
              <div className="flex-1 min-w-0">
                <span className={` font-black mr-2 ${
                  log.type === 'system' ? 'text-blue-500' :
                  log.type === 'user' ? 'text-gray-500' :
                  'text-purple-400'
                }`}>
                  {log.type === 'ai' ? 'PINN-AI' : log.type}:
                </span>
                <span className={`${log.type === 'user' ? 'text-white' : 'text-gray-400'}`}>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={logEndRef} />
       </div>

       {/* CLI Input Terminal */}
       <div className="p-4 bg-black/20 border-t border-white/5">
          <form onSubmit={handleCommand} className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-sans text-[11px] font-black select-none">{'>'}</div>
             <input 
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Type /help for command list..."
               className="w-full bg-white/5 border border-white/5 rounded-lg pl-10 pr-12 py-3 text-[11px] font-sans text-white outline-none focus:border-blue-500/50 transition-all placeholder-gray-700"
               autoFocus
             />
             <button 
               type="submit" 
               className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-md transition-all text-gray-500 hover:text-blue-400"
             >
                <Send size={12} />
             </button>
          </form>
          <div className="mt-4 flex items-center justify-between">
             <div className="flex gap-4">
                <span className="text-[8px] font-sans text-gray-600  flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-blue-500" /> Neural Link
                </span>
                <span className="text-[8px] font-sans text-gray-600  flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-purple-500" /> GPT-4o Optimized
                </span>
             </div>
             <Sparkles className="text-gray-800" size={10} />
          </div>
       </div>
    </div>
  );
}
