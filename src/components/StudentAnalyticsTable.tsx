'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Target,
  Search
} from 'lucide-react';

interface AnalyticsRow {
  id: string;
  node_name: string;
  completion: number;
  avg_score: number;
  time_invested: string;
  status: 'ACTIVE' | 'SYNCED' | 'IDLE';
  pinn_status: boolean;
}

export default function StudentAnalyticsTable({ data }: { data: AnalyticsRow[] }) {
  const [sortKey, setSortKey] = useState<keyof AnalyticsRow>('avg_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: keyof AnalyticsRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredData = data
    .filter(row => row.node_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

  return (
    <div className="bg-[#0F0F12] border border-white/5 rounded-2xl overflow-hidden">
      {/* Table Header / Filter Bar */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Target className="text-blue-500" size={14} /> Node Performance Engine
          </h3>
          <span className="hidden md:inline px-2 py-1 bg-blue-600/10 text-blue-500 rounded font-mono text-[9px] uppercase">
            {filteredData.length} Indexed Nodes
          </span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
          <input 
            type="text"
            placeholder="Search node id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/20 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white outline-none focus:border-blue-500/50 transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5">
              <HeaderCell label="Module Node" />
              <HeaderCell 
                label="Completion" 
                sortable 
                active={sortKey === 'completion'} 
                order={sortOrder}
                onClick={() => handleSort('completion')} 
              />
              <HeaderCell 
                label="Avg Score" 
                sortable 
                active={sortKey === 'avg_score'} 
                order={sortOrder}
                onClick={() => handleSort('avg_score')} 
              />
              <HeaderCell label="Operational Time" />
              <HeaderCell label="Registry Status" />
              <HeaderCell label="PINN Sync" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                    <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{row.node_name}</span>
                  </div>
                </td>
                <td className="p-4 py-5">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
                      <span>Sync</span>
                      <span>{row.completion}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.completion}%` }} />
                    </div>
                  </div>
                </td>
                <td className="p-4 py-5 font-mono text-sm">
                  <span className={`${row.avg_score >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {row.avg_score.toFixed(1)}%
                  </span>
                </td>
                <td className="p-4 py-5 font-mono text-xs text-gray-500 flex items-center gap-2">
                  <Clock size={12} className="opacity-40" /> {row.time_invested}
                </td>
                <td className="p-4 py-5">
                  <span className={`px-2 py-1 rounded text-[9px] font-mono font-black border uppercase tracking-widest ${
                    row.status === 'ACTIVE' 
                      ? 'bg-blue-600/10 text-blue-500 border-blue-500/20' 
                      : 'bg-white/5 text-gray-500 border-white/10'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-4 py-5">
                  <div className="flex items-center gap-1.5">
                    {row.pinn_status ? (
                      <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-mono uppercase">
                        <CheckCircle2 size={12} /> Encoded
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-600 text-[10px] font-mono uppercase">
                        <TrendingUp size={12} className="animate-pulse" /> Pending
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Telemetry */}
      <div className="p-4 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
         <div className="flex gap-4">
            <span className="text-[9px] font-mono text-gray-600 uppercase flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API: Latency 14ms
            </span>
            <span className="text-[9px] font-mono text-gray-600 uppercase flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Buffer: Optimal
            </span>
         </div>
         <button className="text-[9px] font-mono text-gray-500 hover:text-white uppercase transition-colors">
            Protocol Documentation
         </button>
      </div>
    </div>
  );
}

function HeaderCell({ label, sortable, active, order, onClick }: any) {
  return (
    <th 
      onClick={sortable ? onClick : undefined}
      className={`p-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest ${sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortable && active && (
          order === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />
        )}
      </div>
    </th>
  );
}
