
import React, { useState, useMemo } from 'react';
import { Tournament, TournamentMatch, TournamentTeam, User, Court } from '../types.ts';
import { ArrowLeft, Trophy, UserPlus, Save, Edit2, CheckCircle, ShieldCheck, UserCheck, Shield, Zap, AlertCircle, X, MapPin, Users, Target } from 'lucide-react';
import { Button } from './Button.tsx';
import { getLevelMetadata } from '../constants.ts';

interface TournamentDetailProps {
  tournament: Tournament;
  availableUsers: User[];
  currentUser: User;
  isManager: boolean;
  onBack: () => void;
  onEdit: () => void;
  onRegisterTeam: (player1Id: string, player2Id: string) => void;
  onGenerateBracket: () => void;
  onUpdateMatch: (matchId: string, score: string, winnerId: string, courtId?: number | null) => void;
  clubCourts: Court[];
}

export const TournamentDetail: React.FC<TournamentDetailProps> = ({ 
  tournament, 
  availableUsers, 
  currentUser,
  isManager, 
  onBack,
  onEdit,
  onRegisterTeam,
  onGenerateBracket,
  onUpdateMatch,
  clubCourts
}) => {
  const [selectedP1, setSelectedP1] = useState('');
  const [selectedP2, setSelectedP2] = useState('');
  const [editingMatch, setEditingMatch] = useState<TournamentMatch | null>(null);
  const [matchScore, setMatchScore] = useState('');
  const [matchWinner, setMatchWinner] = useState('');
  const [matchCourt, setMatchCourt] = useState<number | null>(null);

  const min = tournament.minRating || 1.0;
  const max = tournament.maxRating || 7.0;

  const isRatingAdequate = useMemo(() => {
    return currentUser.rating >= min && currentUser.rating <= max;
  }, [currentUser.rating, min, max]);

  const isAlreadyRegistered = useMemo(() => {
    return tournament.teams.some(t => t.player1.id === currentUser.id || t.player2.id === currentUser.id);
  }, [tournament.teams, currentUser.id]);

  const isFull = tournament.teams.length >= tournament.maxTeams;

  const allEligibleUsers = useMemo(() => {
    return availableUsers.filter(u => {
        const isInRatingRange = u.rating >= min && u.rating <= max;
        const isAlreadyIn = tournament.teams.some(t => t.player1.id === u.id || t.player2.id === u.id);
        return isInRatingRange && !isAlreadyIn;
    });
  }, [availableUsers, min, max, tournament.teams]);

  const p2Options = useMemo(() => {
    const p1Id = isManager ? selectedP1 : currentUser.id;
    return allEligibleUsers.filter(u => u.id !== p1Id);
  }, [allEligibleUsers, isManager, selectedP1, currentUser.id]);

  const p1Options = useMemo(() => {
    return allEligibleUsers.filter(u => u.id !== selectedP2);
  }, [allEligibleUsers, selectedP2]);

  const handleAddTeam = () => {
    const p1 = isManager ? selectedP1 : currentUser.id;
    const p2 = selectedP2;
    if (p1 && p2 && p1 !== p2) {
      onRegisterTeam(p1, p2);
      setSelectedP1('');
      setSelectedP2('');
    }
  };

  const openMatchEdit = (match: TournamentMatch) => {
    if (!isManager) return;
    setEditingMatch(match);
    setMatchScore(match.score || '');
    setMatchWinner(match.winnerId || '');
    setMatchCourt(match.courtId || null);
  };

  const saveMatchResult = () => {
    if (editingMatch) {
      onUpdateMatch(editingMatch.id, matchScore, matchWinner, matchCourt);
      setEditingMatch(null);
    }
  };

  const getTeamName = (teamId: string | null | undefined) => {
    if (!teamId) return "Da definire";
    const team = tournament.teams.find(t => t.id === teamId);
    return team ? team.name : "Sconosciuto";
  };

  const getCourtName = (courtId: number | null | undefined) => {
    if (!courtId) return null;
    return clubCourts.find(c => c.id === courtId)?.name || "Campo non trovato";
  };

  const rounds: number[] = Array.from(new Set<number>(tournament.matches.map(m => m.round))).sort((a, b) => a - b);
  const maxRounds = Math.max(...rounds, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="sticky top-0 bg-slate-50 dark:bg-slate-950 pt-2 pb-4 z-20 border-b border-slate-100 dark:border-slate-800 -mx-4 px-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 min-w-0">
              <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full shrink-0">
                <ArrowLeft size={20} className="text-slate-700 dark:text-slate-200" />
              </button>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">{tournament.name}</h2>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <Target size={10} className="text-orange-500" />
                  R: {min.toFixed(1)}-{max.toFixed(1)}
                </div>
              </div>
          </div>
          {isManager && (
            <div className="flex gap-1.5 shrink-0">
              {tournament.status === 'open' && tournament.teams.length >= 2 && (
                <button onClick={onGenerateBracket} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">Tabellone</button>
              )}
              <button onClick={onEdit} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"><Edit2 size={16} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Sezione Iscrizione con padding per BottomNav */}
      <div className="mt-6 space-y-12 pb-48">
        {tournament.status === 'open' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Iscrivi Squadra</h3>
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Posti: {tournament.maxTeams - tournament.teams.length}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-xl text-orange-600">
                    <UserPlus size={20} />
                  </div>
                </div>

                {!isRatingAdequate && !isManager ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-6 text-center">
                    <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
                    <p className="text-red-800 dark:text-red-200 font-black uppercase tracking-widest text-[10px]">Livello non idoneo!</p>
                  </div>
                ) : isAlreadyRegistered && !isManager ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 text-center">
                    <ShieldCheck size={32} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-emerald-800 dark:text-emerald-200 font-black uppercase tracking-widest text-[10px]">Iscritto con successo!</p>
                  </div>
                ) : isFull ? (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 text-center">
                    <X size={32} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest text-[10px]">Iscrizioni Chiuse</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {isManager ? (
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">P1</label>
                          <select 
                            value={selectedP1} 
                            onChange={(e) => setSelectedP1(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Giocatore 1...</option>
                            {p1Options.map(u => (
                              <option key={u.id} value={u.id}>{u.name} (R: {u.rating.toFixed(2)})</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tu</label>
                          <div className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold text-slate-400 flex items-center gap-2">
                             <UserCheck size={14} /> {currentUser.name}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">P2 (Compagno)</label>
                        <select 
                          value={selectedP2} 
                          onChange={(e) => setSelectedP2(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Compagno...</option>
                          {p2Options.map(u => (
                            <option key={u.id} value={u.id}>{u.name} (R: {u.rating.toFixed(2)})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Button 
                      fullWidth 
                      onClick={handleAddTeam} 
                      disabled={(isManager && (!selectedP1 || !selectedP2)) || (!isManager && !selectedP2)}
                      className="h-12 rounded-xl text-xs font-black uppercase shadow-lg shadow-orange-500/20"
                    >
                      Conferma Iscrizione
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bracket / Matches Section */}
        <div className="space-y-8">
          {tournament.matches.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
               <Trophy size={40} className="text-slate-100 mx-auto mb-2" />
               <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">In attesa del tabellone</p>
            </div>
          ) : (
            rounds.map(roundNum => (
              <div key={roundNum} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {roundNum === maxRounds ? '🏆 Finale' : `Round ${roundNum}`}
                  </h4>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournament.matches.filter(m => m.round === roundNum).map(match => {
                    const courtName = getCourtName(match.courtId);
                    return (
                      <div key={match.id} className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Match #{match.matchNumber}</span>
                          {courtName && (
                            <span className="text-[8px] font-black text-indigo-500 uppercase flex items-center gap-1">
                              <MapPin size={10} /> {courtName}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                           <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${match.winnerId === match.team1Id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-slate-50 dark:bg-slate-900/50 border-transparent'}`}>
                              <span className={`font-black truncate pr-2 ${match.winnerId === match.team1Id ? 'text-emerald-700' : 'text-slate-500'}`}>
                                {getTeamName(match.team1Id)}
                              </span>
                              {match.winnerId === match.team1Id && <Trophy size={14} className="text-emerald-500 shrink-0" />}
                           </div>
                           <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${match.winnerId === match.team2Id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-slate-50 dark:bg-slate-900/50 border-transparent'}`}>
                              <span className={`font-black truncate pr-2 ${match.winnerId === match.team2Id ? 'text-emerald-700' : 'text-slate-500'}`}>
                                {getTeamName(match.team2Id)}
                              </span>
                              {match.winnerId === match.team2Id && <Trophy size={14} className="text-emerald-500 shrink-0" />}
                           </div>
                        </div>

                        {match.score && (
                          <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700 text-center">
                             <span className="text-[10px] font-black text-slate-400 uppercase">Score: </span>
                             <span className="text-[10px] font-black font-mono">{match.score}</span>
                          </div>
                        )}
                        
                        {isManager && (
                          <button onClick={() => openMatchEdit(match)} className="w-full mt-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:text-orange-500 transition-colors">
                            Gestisci
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal compatta per mobile */}
      {editingMatch && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto max-h-[90dvh]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                 <h3 className="text-sm font-black uppercase">Gestione Match</h3>
                 <button onClick={() => setEditingMatch(null)} className="p-2"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Campo</label>
                    <select value={matchCourt || ''} onChange={(e) => setMatchCourt(e.target.value ? Number(e.target.value) : null)} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold">
                      <option value="">Da definire</option>
                      {clubCourts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 
                 <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vincitore</label>
                    <select value={matchWinner} onChange={(e) => setMatchWinner(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold">
                      <option value="">Seleziona...</option>
                      {editingMatch.team1Id && <option value={editingMatch.team1Id}>{getTeamName(editingMatch.team1Id)}</option>}
                      {editingMatch.team2Id && <option value={editingMatch.team2Id}>{getTeamName(editingMatch.team2Id)}</option>}
                    </select>
                 </div>

                 <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Punteggio</label>
                    <input type="text" value={matchScore} onChange={(e) => setMatchScore(e.target.value)} placeholder="es. 6-4 6-2" className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-xs font-bold" />
                 </div>

                 <Button fullWidth onClick={saveMatchResult} className="h-10 rounded-xl text-xs font-black uppercase mt-4">Salva</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
