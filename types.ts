
export type CourtType = 'indoor' | 'outdoor';
export type PaymentMethod = 'paypal' | 'in_club';
export type BookingStatus = 'confirmed' | 'pending_payment' | 'unavailable';
export type MatchOutcome = 'won' | 'lost';
export type UserRole = 'super_admin' | 'manager' | 'player';

// Player Preferences Types
export type PlayerHand = 'right' | 'left';
export type CourtSide = 'left' | 'right' | 'indifferent';
export type PreferredTime = 'morning' | 'afternoon' | 'evening';

// Tournament Types
export type TournamentStatus = 'open' | 'active' | 'completed';
export type TournamentFormat = 'knockout';

export interface TournamentTeam {
  id: string;
  player1: User;
  player2: User;
  name?: string;
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  team1Id?: string | null;
  team2Id?: string | null;
  score?: string;
  winnerId?: string | null;
  nextMatchId?: string | null;
  courtId?: number | null;
}

export interface Tournament {
  id: string;
  clubId: string;
  name: string;
  startDate: string;
  status: TournamentStatus;
  format: TournamentFormat;
  maxTeams: number;
  teams: TournamentTeam[];
  matches: TournamentMatch[];
  minRating: number; 
  maxRating: number; 
  championTeamId?: string;
  prize?: string;
}

export interface Club {
  id: string;
  name: string;
  location: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  rating: number;
  ratingHistory: number[];
  matchesPlayed: number;
  role: UserRole;
  managedClubId?: string;
  hand?: PlayerHand;
  side?: CourtSide;
  preferredTime?: PreferredTime;
}

export interface Court {
  id: number;
  clubId: string;
  name: string;
  type: CourtType;
  price: number;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface MatchResult {
  score: string;
  outcome: MatchOutcome;
}

export interface Booking {
  id: string;
  userId: string;
  playerName?: string;
  clubId: string;
  courtId: number;
  date: string;
  slotId: string;
  extras: {
    rackets: number;
    instructor: boolean;
  };
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  result?: MatchResult;
  isLookingForPlayer?: boolean;
  participantIds?: string[];
  isResolved?: boolean; 
}

export interface PlayerNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'move' | 'cancel' | 'system';
}

export interface BookingDraft {
  court: Court;
  slot: TimeSlot;
  date: Date;
  preselectedExtras?: {
    instructor: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  imageUrl?: string;
  isEmergency?: boolean;
  timestamp: Date;
}

export type PostType = 'level_up' | 'tournament' | 'match_sos' | 'general';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  type: PostType;
  timestamp: Date;
  likes: number;
  clubId?: string;
  metadata?: any;
}

export interface ManagerNotification {
  id: string;
  bookingId: string;
  message: string;
  timestamp: Date;
  status: 'pending' | 'checked';
  playerName: string;
  matchInfo: string;
}
