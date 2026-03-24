
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { DateSelector } from './components/DateSelector.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { BookingList } from './components/BookingList.tsx';
import { AdminManageModal } from './components/AdminManageModal.tsx';
import { ChatWidget } from './components/ChatWidget.tsx';
import { SuccessModal } from './components/SuccessModal.tsx';
import { Toast } from './components/Toast.tsx';
import { CourtCard } from './components/CourtCard.tsx';
import { AuthForm } from './components/AuthForm.tsx';
import { IntroSlide } from './components/IntroSlide.tsx';
import { ResultModal } from './components/ResultModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { Leaderboard } from './components/Leaderboard.tsx';
import { ClubList } from './components/ClubList.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CourtEditorModal } from './components/CourtEditorModal.tsx';
import { ClubEditorModal } from './components/ClubEditorModal.tsx';
import { TournamentList } from './components/TournamentList.tsx';
import { TournamentEditorModal } from './components/TournamentEditorModal.tsx';
import { TournamentDetail } from './components/TournamentDetail.tsx';
import { Explore } from './components/Explore.tsx';
import { Community } from './components/Community.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { COURTS as INITIAL_COURTS, TIME_SLOTS, MOCK_USERS, CLUBS as INITIAL_CLUBS, MOCK_TOURNAMENTS, formatDate, formatCurrency, RACKET_PRICE as INITIAL_RACKET_PRICE, INSTRUCTOR_PRICE as INITIAL_INSTRUCTOR_PRICE } from './constants.ts';
import { Booking, BookingDraft, Court, TimeSlot, PaymentMethod, BookingStatus, User, Club, Tournament, TournamentTeam, TournamentMatch, ManagerNotification, UserRole, PlayerNotification } from './types.ts';
import { Info, GraduationCap, LayoutGrid, Filter } from 'lucide-react';
import { CRMService } from './crmService.ts';

type ViewType = 'home' | 'bookings' | 'leaderboard' | 'admin_dashboard' | 'tournaments' | 'tournament_detail' | 'explore' | 'community';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [showIntro, setShowIntro] = useState(true);
  
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [racketPrice, setRacketPrice] = useState(INITIAL_RACKET_PRICE);
  const [instructorPrice, setInstructorPrice] = useState(INITIAL_INSTRUCTOR_PRICE);
  const [tournaments, setTournaments] = useState(MOCK_TOURNAMENTS);
  
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingMode, setBookingMode] = useState<'match' | 'lesson'>('match');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [managerNotifications, setManagerNotifications] = useState<ManagerNotification[]>([]);
  const [playerNotifications, setPlayerNotifications] = useState<PlayerNotification[]>([]);
  const [resolvedMatchIds, setResolvedMatchIds] = useState<string[]>([]); 
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSystemMessage, setChatSystemMessage] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | undefined | null>(null);
  const [editingClub, setEditingClub] = useState<Club | undefined>(undefined);
  const [isCreatingClub, setIsCreatingClub] = useState(false);
  
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | undefined>(undefined);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [movingBookingId, setMovingBookingId] = useState<string | null>(null);
  const [selectedAdminBooking, setSelectedAdminBooking] = useState<{booking: Booking, court: Court, slot: TimeSlot} | null>(null);
  const [resultBookingId, setResultBookingId] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('padello_user_email');
    const savedName = localStorage.getItem('padello_user_name');
    if (savedEmail && savedName) {
      handleLogin(savedEmail, savedName);
      setShowIntro(false);
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (email: string, name: string, role?: UserRole) => {
    const existingUser = allUsers.find(u => u.email === email);
    let currentUser: User;
    if (existingUser) {
      currentUser = existingUser;
    } else {
      currentUser = {
        id: email,
        name: name,
        email: email,
        rating: 1.25,
        ratingHistory: [1.00, 1.10, 1.25],
        matchesPlayed: 0,
        role: role || 'player',
        hand: 'right',
        side: 'indifferent',
        preferredTime: 'evening'
      };
      setAllUsers(prev => [...prev, currentUser]);
    }
    setUser(currentUser);
    CRMService.syncUser(currentUser);
    if (currentUser.role === 'manager' && currentUser.managedClubId) {
        const managedClub = clubs.find(c => c.id === currentUser.managedClubId);
        if (managedClub) setSelectedClub(managedClub);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedClub(null);
    setCurrentView('home');
    setShowIntro(true);
    localStorage.removeItem('padello_user_email');
    localStorage.removeItem('padello_user_name');
  };

  const handleChatEmergency = (message: string) => {
    if (!user || !selectedClub) return;
    const newNotification: ManagerNotification = {
      id: Date.now().toString(),
      bookingId: 'chat-' + Date.now(),
      message: message,
      timestamp: new Date(),
      status: 'pending',
      playerName: user.name,
      matchInfo: 'Richiesta urgente da Sir Padellotto Chat'
    };
    setManagerNotifications(prev => [newNotification, ...prev]);
    setToastMessage("Sir Padellotto ha avvisato il gestore! 📡");
  };

  const handleQuickSearch = () => {
    if (!user || !selectedClub) {
      setToastMessage("Seleziona prima un circolo!");
      return;
    }
    handleChatEmergency(`Il giocatore ${user.name} ha attivato la RICERCA VELOCE compagno.`);
    setIsChatOpen(true);
    setChatSystemMessage(`Mio Signore, ho attivato la ricerca rapida! 🏰 Sto setacciando il Regno per trovarle uno sfidante degno. Ho già inviato un messo reale al gestore di ${selectedClub.name}.`);
    setTimeout(() => setChatSystemMessage(null), 1000);
  };

  const handleConfirmBooking = (rackets: number, instructor: boolean, paymentMethod: PaymentMethod) => {
    if (!bookingDraft || !user || !selectedClub) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      playerName: user.name,
      clubId: selectedClub.id,
      courtId: bookingDraft.court.id,
      date: formatDate(bookingDraft.date),
      slotId: bookingDraft.slot.id,
      extras: { rackets, instructor },
      totalPrice: bookingDraft.court.price + (rackets * racketPrice) + (instructor ? instructorPrice : 0),
      paymentMethod,
      status: paymentMethod === 'paypal' ? 'confirmed' : 'pending_payment'
    };

    setBookings(prev => [...prev, newBooking]);
    setBookingDraft(null);
    CRMService.syncNewBooking(newBooking);
    setSuccessMessage("Prenotazione confermata! Preparati alla sfida. 🎾");
  };

  const handleRegisterTeam = (p1Id: string, p2Id: string) => {
    if (!selectedTournamentId) return;
    const p1 = allUsers.find(u => u.id === p1Id);
    const p2 = allUsers.find(u => u.id === p2Id);
    if (!p1 || !p2) return;

    const newTeam: TournamentTeam = {
      id: Math.random().toString(36).substr(2, 9),
      player1: p1,
      player2: p2,
      name: `${p1.name.split(' ')[0]} & ${p2.name.split(' ')[0]}`
    };

    setTournaments(prev => prev.map(t => {
      if (t.id === selectedTournamentId) {
        return { ...t, teams: [...t.teams, newTeam] };
      }
      return t;
    }));
    setSuccessMessage("Squadra iscritta al torneo! 🏆");
  };

  const handleGenerateBracket = () => {
    if (!selectedTournamentId) return;
    setTournaments(prev => prev.map(t => {
      if (t.id === selectedTournamentId) {
        const teams = [...t.teams];
        if (teams.length < 2) return t;
        const matches: TournamentMatch[] = [];
        const numTeams = teams.length;
        const numRounds = Math.ceil(Math.log2(numTeams));
        const bracketSize = Math.pow(2, numRounds);
        
        for (let i = 0; i < bracketSize / 2; i++) {
          matches.push({
            id: `m-${t.id}-1-${i}`,
            tournamentId: t.id,
            round: 1,
            matchNumber: i + 1,
            team1Id: teams[i*2]?.id || null,
            team2Id: teams[i*2+1]?.id || null,
            score: '',
            winnerId: null,
            nextMatchId: `m-${t.id}-2-${Math.floor(i/2)}`
          });
        }
        
        for (let r = 2; r < numRounds; r++) {
          const roundSize = bracketSize / Math.pow(2, r);
          for (let i = 0; i < roundSize; i++) {
            matches.push({
              id: `m-${t.id}-${r}-${i}`,
              tournamentId: t.id,
              round: r,
              matchNumber: matches.length + 1,
              team1Id: null,
              team2Id: null,
              score: '',
              winnerId: null,
              nextMatchId: `m-${t.id}-${r+1}-${Math.floor(i/2)}`
            });
          }
        }

        if (numRounds > 1) {
          matches.push({
            id: `m-${t.id}-${numRounds}-0`,
            tournamentId: t.id,
            round: numRounds,
            matchNumber: matches.length + 1,
            team1Id: null,
            team2Id: null,
            score: '',
            winnerId: null,
            nextMatchId: null
          });
        }

        return { ...t, matches, status: 'active' };
      }
      return t;
    }));
    setSuccessMessage("Tabellone generato con successo! ⚔️");
  };

  const handleUpdateTournamentMatch = (matchId: string, score: string, winnerId: string, courtId?: number | null) => {
    if (!selectedTournamentId) return;
    setTournaments(prev => prev.map(t => {
      if (t.id === selectedTournamentId) {
        const updatedMatches = t.matches.map(m => {
          if (m.id === matchId) {
            return { ...m, score, winnerId, courtId };
          }
          return m;
        });

        const currentMatch = updatedMatches.find(m => m.id === matchId);
        if (currentMatch?.nextMatchId && winnerId) {
          const nextMatchIndex = updatedMatches.findIndex(m => m.id === currentMatch.nextMatchId);
          if (nextMatchIndex !== -1) {
            const matchesToNext = t.matches.filter(m => m.nextMatchId === currentMatch.nextMatchId);
            const isTeam1 = matchesToNext[0].id === matchId;
            if (isTeam1) {
              updatedMatches[nextMatchIndex].team1Id = winnerId;
            } else {
              updatedMatches[nextMatchIndex].team2Id = winnerId;
            }
          }
        }

        return { ...t, matches: updatedMatches };
      }
      return t;
    }));
  };

  const userBookings = useMemo(() => user ? bookings.filter(b => b.userId === user.id) : [], [bookings, user]);
  const clubCourts = useMemo(() => selectedClub ? courts.filter(c => c.clubId === selectedClub.id) : [], [selectedClub, courts]);
  const dayBookings = useMemo(() => selectedClub ? bookings.filter(b => b.date === formatDate(selectedDate) && b.clubId === selectedClub.id) : [], [bookings, selectedDate, selectedClub]);

  const handleSlotClick = useCallback((court: Court, slot: TimeSlot) => {
    if (!selectedClub || !user) return;
    const existingBooking = dayBookings.find(b => b.courtId === court.id && b.slotId === slot.id);
    const isAdmin = user.role === 'super_admin' || user.role === 'manager';
    
    if (existingBooking?.status === 'unavailable' && !isAdmin) {
      setToastMessage("Campo in manutenzione ⛔");
      return;
    }

    if (movingBookingId) {
      const sourceBooking = bookings.find(b => b.id === movingBookingId);
      if (!sourceBooking) return;
      
      const isUnavailable = sourceBooking.status === 'unavailable';
      const newBasePrice = court.price;
      const extrasPrice = (sourceBooking.extras.rackets * racketPrice) + (sourceBooking.extras.instructor ? instructorPrice : 0);
      const newTotal = isUnavailable ? 0 : newBasePrice + extrasPrice;

      if (existingBooking) {
        if (isAdmin) {
          if (confirm("Questo slot è occupato. Vuoi scambiare le due prenotazioni?")) {
             const sourceOldCourt = courts.find(c => c.id === sourceBooking.courtId);
             const targetNewBasePrice = sourceOldCourt?.price || 0;
             const targetExtrasPrice = (existingBooking.extras.rackets * racketPrice) + (existingBooking.extras.instructor ? instructorPrice : 0);
             const targetNewTotal = existingBooking.status === 'unavailable' ? 0 : targetNewBasePrice + targetExtrasPrice;
             
             const updatedSourceBooking = { ...sourceBooking, date: formatDate(selectedDate), courtId: court.id, slotId: slot.id, clubId: selectedClub.id, totalPrice: newTotal };
             const updatedTargetBooking = { ...existingBooking, date: sourceBooking.date, courtId: sourceBooking.courtId, slotId: sourceBooking.slotId, clubId: sourceBooking.clubId, totalPrice: targetNewTotal };

             setBookings(prev => prev.map(b => {
               if (b.id === sourceBooking.id) return updatedSourceBooking;
               if (b.id === existingBooking.id) return updatedTargetBooking;
               return b;
             }));
             setMovingBookingId(null);
             setSuccessMessage("Spostamento completato!");
          }
          return;
        }
        setToastMessage("Questo campo è occupato.");
        return;
      }

      const updatedMoveBooking = { ...sourceBooking, date: formatDate(selectedDate), courtId: court.id, slotId: slot.id, clubId: selectedClub.id, totalPrice: newTotal };
      setBookings(prev => prev.map(b => b.id === movingBookingId ? updatedMoveBooking : b));
      setMovingBookingId(null);
      setSuccessMessage("Spostamento completato!");
      return;
    }

    if (isAdmin && existingBooking) {
      setSelectedAdminBooking({ booking: existingBooking, court, slot });
      return;
    }

    if (existingBooking) {
      setToastMessage("Orario già prenotato 😕");
      return;
    }

    setBookingDraft({ 
      court, 
      slot, 
      date: selectedDate,
      preselectedExtras: { instructor: bookingMode === 'lesson' }
    });
  }, [selectedClub, user, dayBookings, movingBookingId, selectedDate, bookingMode, bookings, racketPrice, instructorPrice, courts]);

  const renderContent = () => {
    switch (currentView) {
      case 'bookings': 
        return <BookingList bookings={userBookings} onBack={() => setCurrentView('home')} onDelete={(id) => setBookings(p => p.filter(b => b.id !== id))} onRecordResult={setResultBookingId} onToggleSearch={() => {}} />;
      case 'leaderboard': 
        return <Leaderboard users={allUsers} bookings={bookings} currentUserId={user?.id || ''} onBack={() => setCurrentView('home')} />;
      case 'tournaments': 
        return <TournamentList tournaments={tournaments.filter(t => t.clubId === selectedClub?.id)} clubs={clubs} user={user!} onBack={() => setCurrentView('home')} onSelect={(t) => { setSelectedTournamentId(t.id); setCurrentView('tournament_detail'); }} />;
      case 'explore': 
        return <Explore user={user!} tournaments={tournaments} clubs={clubs} selectedClubId={selectedClub?.id} bookings={bookings} notifications={managerNotifications} resolvedMatchIds={resolvedMatchIds} onSelectTournament={(t) => { setSelectedTournamentId(t.id); setCurrentView('tournament_detail'); }} onSelectClub={(c) => { setSelectedClub(c); setCurrentView('home'); }} onJoinMatch={() => {}} onCheckNotification={(id) => setManagerNotifications(prev => prev.filter(n => n.id !== id))} />;
      case 'community': 
        return <Community user={user!} allUsers={allUsers} selectedClub={selectedClub} onBack={() => setCurrentView('home')} onAskToPlay={(p) => { setIsChatOpen(true); setChatSystemMessage(`Messaggio per ${p.name}: Vorrei sfidarti a Padel! Quando saresti disponibile? ⚔️`); setTimeout(() => setChatSystemMessage(null), 1000); }} onQuickSearch={handleQuickSearch} />;
      case 'tournament_detail':
        const t = tournaments.find(x => x.id === selectedTournamentId);
        return t ? <TournamentDetail tournament={t} availableUsers={allUsers} currentUser={user!} isManager={user?.role !== 'player'} onBack={() => setCurrentView('tournaments')} onEdit={() => { setEditingTournament(t); setIsTournamentModalOpen(true); }} onRegisterTeam={handleRegisterTeam} onGenerateBracket={handleGenerateBracket} onUpdateMatch={handleUpdateTournamentMatch} clubCourts={courts.filter(c => c.clubId === t.clubId)} /> : null;
      case 'admin_dashboard':
        return selectedClub ? <AdminDashboard club={selectedClub} courts={clubCourts} clubBookings={bookings.filter(b => b.clubId === selectedClub.id)} clubTournaments={tournaments.filter(t => t.clubId === selectedClub.id)} racketPrice={racketPrice} instructorPrice={instructorPrice} onBack={() => setCurrentView('home')} onUpdateGlobalPrices={(r, i) => { setRacketPrice(r); setInstructorPrice(i); }} onAddCourt={() => setEditingCourt({} as any)} onEditCourt={setEditingCourt} onDeleteCourt={(id) => setCourts(p => p.filter(c => c.id !== id))} onEditClub={setEditingClub} onEditTournament={(t) => { setEditingTournament(t); setIsTournamentModalOpen(true); }} onAddTournament={() => { setEditingTournament(undefined); setIsTournamentModalOpen(true); }} /> : null;
      default:
        if (!selectedClub) return <ClubList clubs={clubs} currentUser={user!} onSelect={(c) => setSelectedClub(c)} onAddClub={() => setIsCreatingClub(true)} />;
        return (
          <div className="pb-32 px-4 md:px-8 max-w-7xl mx-auto">
            <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
            <main className="pt-6 space-y-8">
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                 <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex w-full md:w-auto md:min-w-[400px]">
                    <button onClick={() => setBookingMode('match')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${bookingMode === 'match' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}><LayoutGrid size={18} />Campo</button>
                    <button onClick={() => setBookingMode('lesson')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${bookingMode === 'lesson' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}><GraduationCap size={18} />Lezione</button>
                 </div>
                 <button onClick={() => setShowOnlyAvailable(!showOnlyAvailable)} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold border transition-all ${showOnlyAvailable ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700' : 'bg-white dark:bg-slate-800 text-slate-500'}`}><Filter size={16} /> Disponibili</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubCourts.map((court) => <CourtCard key={court.id} court={court} timeSlots={TIME_SLOTS} dayBookings={dayBookings} isAdmin={user?.role !== 'player'} isLessonMode={bookingMode === 'lesson'} showAvailableOnly={showOnlyAvailable} onSlotClick={handleSlotClick} onShowToast={setToastMessage} />)}
              </div>
            </main>
          </div>
        );
    }
  };

  if (!user) {
    if (showIntro) return <IntroSlide onEnter={() => setShowIntro(false)} />;
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex flex-col">
      <Header user={user} selectedClub={selectedClub} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} onLogout={handleLogout} onMyBookingsClick={() => setCurrentView('bookings')} onAdminDashboardClick={() => setCurrentView('admin_dashboard')} onEditProfile={() => setIsProfileModalOpen(true)} onSwitchClub={() => setSelectedClub(null)} playerNotifications={playerNotifications} onMarkNotificationAsRead={() => {}} />
      <div className="flex-1 w-full max-w-7xl mx-auto relative pb-safe">
        {renderContent()}
      </div>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      {/* Modals and Overlays */}
      {selectedClub && <ChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} user={user} clubId={selectedClub.id} systemMessage={chatSystemMessage} onEmergencyRequest={handleChatEmergency} />}
      <BookingModal draft={bookingDraft} racketPrice={racketPrice} instructorPrice={instructorPrice} onClose={() => setBookingDraft(null)} onConfirm={handleConfirmBooking} />
      {selectedAdminBooking && <AdminManageModal booking={selectedAdminBooking.booking} court={selectedAdminBooking.court} slot={selectedAdminBooking.slot} racketPrice={racketPrice} instructorPrice={instructorPrice} onClose={() => setSelectedAdminBooking(null)} onDelete={() => setBookings(p => p.filter(b => b.id !== selectedAdminBooking.booking.id))} onUpdate={(updates) => setBookings(prev => prev.map(b => b.id === selectedAdminBooking.booking.id ? { ...b, ...updates } : b))} onMoveStart={() => { setMovingBookingId(selectedAdminBooking.booking.id); setSelectedAdminBooking(null); setToastMessage("Seleziona il nuovo slot per spostare la prenotazione"); }} onShowToast={setToastMessage} />}
      {successMessage && <SuccessModal message={successMessage} onClose={() => setSuccessMessage(null)} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      {resultBookingId && <ResultModal onClose={() => setResultBookingId(null)} onSave={(score, outcome) => { setBookings(prev => prev.map(b => b.id === resultBookingId ? { ...b, result: { score, outcome } } : b)); setResultBookingId(null); setSuccessMessage("Partita registrata!"); }} />}
      {isProfileModalOpen && <ProfileModal user={user} bookings={bookings} onClose={() => setIsProfileModalOpen(false)} onSave={(f) => { setUser(u => u ? {...u, ...f} : null); setIsProfileModalOpen(false); setToastMessage("Profilo aggiornato!"); }} />}
      {editingCourt !== null && selectedClub && <CourtEditorModal court={editingCourt || undefined} clubId={selectedClub.id} onClose={() => setEditingCourt(null)} onSave={(data) => { if (data.id) { setCourts(prev => prev.map(c => c.id === data.id ? { ...c, ...data, id: data.id! } : c)); } else { setCourts(prev => [...prev, { ...data, id: Date.now() }]); } setEditingCourt(null); }} />}
      {(isCreatingClub || editingClub) && <ClubEditorModal club={editingClub} onClose={() => { setIsCreatingClub(false); setEditingClub(undefined); }} onSave={(data) => { if (data.id) { setClubs(prev => prev.map(c => c.id === data.id ? { ...c, ...data, id: data.id! } : c)); } else { setClubs(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) }]); } setIsCreatingClub(false); setEditingClub(undefined); }} />}
      {isTournamentModalOpen && selectedClub && <TournamentEditorModal tournament={editingTournament} clubId={selectedClub.id} onClose={() => { setIsTournamentModalOpen(false); setEditingTournament(undefined); }} onSave={(data) => { if (data.id) { setTournaments(prev => prev.map(t => t.id === data.id ? { ...t, ...data, id: data.id! } : t)); } else { setTournaments(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), teams: [], matches: [], status: 'open' }]); } setIsTournamentModalOpen(false); setEditingTournament(undefined); }} />}
    </div>
  );
};
