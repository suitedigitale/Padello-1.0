
import { Court, TimeSlot, User, Club, Tournament, CommunityPost } from './types';

export const CLUBS: Club[] = [
  {
    id: 'c1',
    name: 'Padello Milano',
    location: 'Via dello Sport 10, Milano',
    image: 'https://images.unsplash.com/photo-1624896740635-c3f2d2595f51?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c2',
    name: 'Roma Padel Club',
    location: 'Lungotevere Dante 5, Roma',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c3',
    name: 'Napoli Smash',
    location: 'Via Caracciolo 22, Napoli',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=600&auto=format&fit=crop'
  }
];

export const COURTS: Court[] = [
  { id: 1, clubId: 'c1', name: 'Campo 1 (Coperto)', type: 'indoor', price: 14 },
  { id: 2, clubId: 'c1', name: 'Campo 2 (Coperto)', type: 'indoor', price: 14 },
  { id: 3, clubId: 'c1', name: 'Campo 3 (Scoperto)', type: 'outdoor', price: 12 },
  { id: 4, clubId: 'c2', name: 'Campo Centrale (Coperto)', type: 'indoor', price: 16 },
  { id: 5, clubId: 'c2', name: 'Campo Sud (Scoperto)', type: 'outdoor', price: 12 },
  { id: 6, clubId: 'c3', name: 'Vesuvio (Panoramico)', type: 'outdoor', price: 10 },
  { id: 7, clubId: 'c3', name: 'Diego (Coperto)', type: 'indoor', price: 12 }
];

export const MOCK_OPEN_MATCHES = [
  { id: 'm1', clubId: 'c1', user: 'Marco Rossi', level: 'Intermedio', time: 'Oggi, 19:30', missing: 1, isReal: false, creatorRating: 3.5 },
  { id: 'm2', clubId: 'c2', user: 'Luca Verdi', level: 'Avanzato', time: 'Domani, 18:00', missing: 2, isReal: false, creatorRating: 5.5 },
  { id: 'm3', clubId: 'c3', user: 'Giulia B.', level: 'Principiante', time: 'Oggi, 21:00', missing: 1, isReal: false, creatorRating: 1.5 },
];

export const RACKET_PRICE = 3; 
export const INSTRUCTOR_PRICE = 25;

export const getLevelDescription = (rating: number): string => {
  if (rating < 2.0) return 'Principiante';
  if (rating < 3.0) return 'Intermedio Inf.';
  if (rating < 4.0) return 'Intermedio';
  if (rating < 5.0) return 'Intermedio Avanz.';
  return 'Avanzato/Esperto';
};

export const getLevelMetadata = (rating: number) => {
  if (rating < 2.0) return { 
    label: 'Principiante', 
    color: 'slate', 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700'
  };
  if (rating < 3.0) return { 
    label: 'Intermedio Inf.', 
    color: 'indigo', 
    bg: 'bg-indigo-50 dark:bg-indigo-900/30', 
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-800'
  };
  if (rating < 4.0) return { 
    label: 'Intermedio', 
    color: 'emerald', 
    bg: 'bg-emerald-50 dark:bg-emerald-900/30', 
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-800'
  };
  if (rating < 5.0) return { 
    label: 'Intermedio Avanz.', 
    color: 'orange', 
    bg: 'bg-orange-50 dark:bg-orange-900/30', 
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800'
  };
  return { 
    label: 'Avanzato/Esperto', 
    color: 'red', 
    bg: 'bg-red-50 dark:bg-red-900/30', 
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-100 dark:border-red-800'
  };
};

export const MOCK_USERS: User[] = [
  { id: 'super1', name: 'Super Admin', email: 'super@padello.it', rating: 6.50, ratingHistory: [6.00, 6.25, 6.40, 6.50], matchesPlayed: 0, role: 'super_admin' },
  { id: 'manager1', name: 'Gestore Milano', email: 'milano@padello.it', rating: 3.50, ratingHistory: [3.00, 3.25, 3.50], matchesPlayed: 5, role: 'manager', managedClubId: 'c1' },
  { id: 'u1', name: 'Marco Rossi', email: 'marco@test.com', rating: 2.45, ratingHistory: [1.80, 2.10, 2.30, 2.45], matchesPlayed: 24, role: 'player', hand: 'right', side: 'left', preferredTime: 'evening' },
  { id: 'u2', name: 'Giulia Bianchi', email: 'giulia@test.com', rating: 3.12, ratingHistory: [2.50, 2.80, 3.00, 3.12], matchesPlayed: 18, role: 'player', hand: 'right', side: 'right', preferredTime: 'morning' },
  { id: 'u3', name: 'Luca Verdi', email: 'luca@test.com', rating: 1.25, ratingHistory: [0.90, 1.10, 1.20, 1.25], matchesPlayed: 12, role: 'player', hand: 'left', side: 'indifferent', preferredTime: 'evening' },
  { id: 'u4', name: 'Alessandro Neri', email: 'alex@test.com', rating: 4.52, ratingHistory: [3.80, 4.20, 4.40, 4.52], matchesPlayed: 30, role: 'player', hand: 'right', side: 'left', preferredTime: 'afternoon' },
];

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    clubId: 'c1',
    name: 'Slam Milano Summer',
    startDate: '2024-07-15',
    status: 'open',
    format: 'knockout',
    maxTeams: 8,
    teams: [],
    matches: [],
    minRating: 1.00,
    maxRating: 4.00,
    prize: 'Racchetta Bullpadel Vertex'
  },
  {
    id: 't2',
    clubId: 'c2',
    name: 'Master Roma Cup',
    startDate: '2024-08-10',
    status: 'open',
    format: 'knockout',
    maxTeams: 16,
    teams: [],
    matches: [],
    minRating: 3.00,
    maxRating: 6.00,
    prize: 'Completo Adidas Pro'
  },
  {
    id: 't3',
    clubId: 'c3',
    name: 'Open Napoli',
    startDate: '2024-06-25',
    status: 'open',
    format: 'knockout',
    maxTeams: 8,
    teams: [],
    matches: [],
    minRating: 1.50,
    maxRating: 3.50,
    prize: 'Cesta Gourmet Campana'
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post1',
    authorId: 'u1',
    authorName: 'Marco Rossi',
    text: 'Finalmente ho raggiunto il livello 2.50! 🏆 Sfida aperta a tutti per il prossimo weekend.',
    type: 'level_up',
    timestamp: new Date(Date.now() - 3600000 * 2),
    likes: 12,
    clubId: 'c1',
    metadata: { oldLevel: 2.40, newLevel: 2.50 }
  }
];

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 23;
  const durationMin = 90;

  let currentMinutes = startHour * 60;
  const totalEndMinutes = endHour * 60;

  while (currentMinutes + durationMin <= totalEndMinutes) {
    const startH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const startM = (currentMinutes % 60).toString().padStart(2, '0');
    
    const endTotalMinutes = currentMinutes + durationMin;
    const endH = Math.floor(endTotalMinutes / 60).toString().padStart(2, '0');
    const endM = (endTotalMinutes % 60).toString().padStart(2, '0');

    slots.push({ 
      id: `${startH}:${startM}`, 
      startTime: `${startH}:${startM}`, 
      endTime: `${endH}:${endM}` 
    });

    currentMinutes = endTotalMinutes;
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();
export const formatDate = (date: Date): string => date.toISOString().split('T')[0];
export const formatCurrency = (amount: number): string => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
