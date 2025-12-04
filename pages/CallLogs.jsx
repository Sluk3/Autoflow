
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 50;

export default function CallLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: callLogs = [], isLoading } = useQuery({
    queryKey: ['callLogs'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/220571c6-1906-441d-8f40-1ea3739181fe', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      const data = await response.json();
      // Sort by created_at descending (most recent first)
      return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
  });

  const filteredCallLogs = callLogs.filter(log =>
    `${log.caller_name || ''} ${log.caller_number || ''} ${log.summary || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCallLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCallLogs = filteredCallLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <p className="text-slate-300 text-sm">
        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCallLogs.length)} of {filteredCallLogs.length}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-white text-sm flex items-center px-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Call Logs</h1>
          <p className="text-slate-400">{callLogs.length} total calls</p>
        </div>
      </div>

      <div className="glass-morphism-card rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search call logs..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {totalPages > 1 && <div className="mb-4"><PaginationControls /></div>}

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {paginatedCallLogs.map((log) => (
              <div
                key={log.call_id}
                className="glass-morphism-card rounded-xl p-6 glass-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                    <Phone className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {log.caller_name || 'Unknown Caller'}
                        </h3>
                        {log.caller_number && (
                          <p className="text-slate-300 text-sm">{log.caller_number}</p>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">
                        {format(new Date(log.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {log.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && <div className="mt-4 pt-4 border-t border-slate-700"><PaginationControls /></div>}
      </div>
    </div>
  );
}
