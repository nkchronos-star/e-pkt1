import { useState, useRef, useEffect } from 'react';
import { Search, XCircle, ChevronDown, Check, Users, Lock, AlertCircle, X } from 'lucide-react';
import { Candidate } from '../../types';

interface SearchableCandidateSelectProps {
  candidates: Candidate[];
  selectedCandidate: string; // IC
  onSelect: (ic: string) => void;
  currentUserName?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchableCandidateSelect({
  candidates,
  selectedCandidate,
  onSelect,
  currentUserName = '',
  placeholder = '-- Pilih / Cari Calon (Taip Nama atau No. KP) --',
  disabled = false,
}: SearchableCandidateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Selected candidate object
  const currentCandidate = candidates.find(c => c.ic === selectedCandidate);

  // Filter candidates based on search
  const filteredCandidates = candidates.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const icRaw = c.ic?.toLowerCase() || '';
    const icClean = c.ic?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    const qClean = q.replace(/[^a-zA-Z0-9]/g, '');
    const icMatch = icRaw.includes(q) || (qClean.length > 0 && icClean.includes(qClean));
    return nameMatch || icMatch;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Helper: check if in-progress by another teacher within 20 mins
  const getInProgressInfo = (c: Candidate) => {
    if (!c.sedangDinilaiTahfiz || !c.sedangDinilaiTahfiz.dinilaiOleh) return null;
    if (c.sedangDinilaiTahfiz.dinilaiOleh === currentUserName) return null;
    const dimula = new Date(c.sedangDinilaiTahfiz.dimulaPada).getTime();
    if (isNaN(dimula)) return null;
    const isWithin20Mins = Date.now() - dimula < 20 * 60 * 1000;
    if (isWithin20Mins) {
      return c.sedangDinilaiTahfiz.dinilaiOleh;
    }
    return null;
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    const lockedBy = getInProgressInfo(candidate);
    if (lockedBy) {
      alert(`Amaran: Calon ${candidate.name} sedang dinilai oleh ${lockedBy}. Anda tidak boleh mengisi markah untuk calon yang sama secara serentak.`);
      return;
    }
    onSelect(candidate.ic);
    setIsOpen(false);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Bar */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[56px] border-2 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 select-none shadow-xs ${
          disabled
            ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-70'
            : isOpen
            ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/10'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        {currentCandidate ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              {currentCandidate.name?.charAt(0) || 'C'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-extrabold text-slate-900 text-sm truncate">
                {currentCandidate.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentCandidate.ic}
                </span>
                {currentCandidate.jantina && (
                  <span className="text-[11px] font-semibold text-slate-400">
                    • {currentCandidate.jantina}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-slate-400 flex-1 min-w-0">
            <Search className="w-5 h-5 shrink-0 text-slate-400" />
            <span className="text-sm font-semibold truncate text-slate-500">
              {placeholder}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {currentCandidate ? (
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-xs font-bold text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              title="Tukar calon"
            >
              <X className="w-3.5 h-3.5" />
              <span>Tukar</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hidden sm:inline-block">
              {candidates.length} Calon Belum Dinilai
            </span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu with Search */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Box Header */}
          <div className="p-3 bg-slate-50 border-b border-slate-200/80">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama calon atau No. Kad Pengenalan..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Kosongkan carian"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1 mt-2 text-xs font-bold text-slate-500">
              <span>Senarai Calon Layak Dinilai:</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {filteredCandidates.length} daripada {candidates.length} calon
              </span>
            </div>
          </div>

          {/* Candidates List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredCandidates.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">
                  Tiada calon sepadan dengan carian "{searchQuery}"
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Sila pastikan ejaan nama atau nombor kad pengenalan adalah betul.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-800 underline"
                >
                  Set Semula Carian
                </button>
              </div>
            ) : (
              filteredCandidates.map((candidate, idx) => {
                const isSelected = candidate.ic === selectedCandidate;
                const lockedBy = getInProgressInfo(candidate);

                return (
                  <div
                    key={candidate.id || candidate.ic}
                    role="button"
                    tabIndex={lockedBy ? -1 : 0}
                    onClick={() => !lockedBy && handleSelectCandidate(candidate)}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 border border-emerald-200'
                        : lockedBy
                        ? 'bg-slate-50/80 opacity-60 cursor-not-allowed'
                        : 'hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Bil Number */}
                      <span className="w-6 text-center text-xs font-bold text-slate-400 shrink-0">
                        {idx + 1}.
                      </span>

                      {/* Avatar / Photo */}
                      {candidate.gambarUrl ? (
                        <img
                          src={candidate.gambarUrl}
                          alt={candidate.name}
                          className="w-9 h-11 object-cover rounded-lg border border-slate-200 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-9 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                      )}

                      {/* Name & Details */}
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-sm text-slate-900 truncate">
                          {candidate.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {candidate.ic}
                          </span>
                          {candidate.jantina && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                candidate.jantina === 'Lelaki'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-pink-50 text-pink-700'
                              }`}
                            >
                              {candidate.jantina}
                            </span>
                          )}
                          {lockedBy && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              Sedang Dinilai ({lockedBy})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
