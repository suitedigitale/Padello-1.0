
import { User, Booking, Tournament, BookingStatus, PaymentMethod, UserRole } from './types';

// Simulate network latency for CRM interactions
const CRM_API_DELAY = 500;

const logCRM = (action: string, payload: any) => {
  console.group(`%c[CRM Framework 360] ${action}`, 'color: #10b981; font-weight: bold;');
  console.log('Payload:', payload);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

const logExternalAlert = (title: string, message: string) => {
  console.group(`%c[EXTERNAL ALERT / SMS / PUSH] ${title}`, 'color: #f59e0b; font-weight: bold;');
  console.log(`To: Recipient Device / Phone (+39 XXX XXX XXXX)`);
  console.log(`Content: ${message}`);
  console.groupEnd();
};

const FRAMEWORK360_PROXY_ENDPOINT =
  'https://padello-c35rarybd-guidos-projects-ba7a06d1.vercel.app/api/sync-user';

export const CRMService = {
syncUser: async (user: User) => {
  const crmPayload = {
    event: 'padello_user_sync',
    source: 'padello_app',

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      rating: user.rating,
      matchesPlayed: user.matchesPlayed,
      hand: user.hand,
      side: user.side,
      preferredTime: user.preferredTime,
    },

    framework: {
      crmContactId: (user as any).crmContactId || null,
      frameworkAccountId: (user as any).frameworkAccountId || null,
      managedClubId: (user as any).managedClubId || null,
    },

    auth: {
      provider: (user as any).provider || 'email',
      providerId: (user as any).providerId || null,
    },

    routing: {
      isPlayer: user.role === 'player',
      isManager: user.role === 'manager',
      isSuperAdmin: user.role === 'super_admin',
    },

    timestamp: new Date().toISOString(),
  };

  logCRM('User Sync / Framework360 Ready', crmPayload);

  try {
    const response = await fetch(FRAMEWORK360_CONTACTS_ENDPOINT, {
      method: 'POST',
      headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${FRAMEWORK360_API_KEY}`,
},
      body: JSON.stringify(crmPayload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('[CRM Framework360] Sync failed', response.status, data);
      return;
    }

    console.log('[CRM Framework360] Real Sync OK', data);
  } catch (error) {
    console.error('[CRM Framework360] Network error', error);
  }
},

  syncNewBooking: async (booking: Booking) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        logCRM('New Booking', { booking });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncBookingUpdate: async (booking: Booking) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        logCRM('Booking Updated', { booking });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncBookingMove: async (booking: Booking, oldDetails?: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const playerName = booking.playerName || "Giocatore";
        const message = `Caro ${playerName}, il tuo match è stato spostato dal Gestore. Nuove coordinate: ${booking.date} @ ${booking.slotId}. Controlla l'app Padello per i dettagli. 🎾`;
        
        logExternalAlert('NOTIFICA PUSH INVIATA AL GIOCATORE', message);
        logCRM('Booking Moved & Player Notified', { booking, oldDetails });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncBookingCancellation: async (bookingId: string, userId: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        logCRM('Booking Cancelled', { bookingId, userId });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncEmergencyRequest: async (user: User, clubId: string, message: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const smsContent = `Sir Padellotto avvisa: Emergenza campo a ${clubId}! Il giocatore ${user.name} cerca compagno.`;
        logExternalAlert('SMS SOS INVIATO AL GESTORE', smsContent);
        logCRM('SOS Emergency Request', { user, clubId, message });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncPlayerSearch: async (booking: Booking, user: User, isActive: boolean) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        logCRM('Player Search Update', { booking, user, isActive });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  notifyManagerMatchFilled: async (booking: Booking, joinedUser: User) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const smsContent = `Padello Alert per il Gestore: Tenzone completata! ${joinedUser.name} ha risposto al SOS per il match del ${booking.date} @ ${booking.slotId}.`;
        logExternalAlert('NOTIFICA PUSH & SMS GESTORE', smsContent);
        logCRM('MANAGER NOTIFIED: MATCH FILLED', {
          booking_id: booking.id,
          joined_player: joinedUser.name
        });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncMatchJoined: async (booking: Booking, joinedUser: User) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const message = `⚔️ MESSAGGIO REALE: Un nuovo cavaliere si è unito alla tenzone! ${joinedUser.name} ha risposto alla chiamata del Sir. Padellotto per la battaglia del ${booking.date} alle ${booking.slotId}. Il campo è ora pronto per la gloria! 🛡️`;
        logCRM('PLAYER JOINED MATCH', {
          booking_id: booking.id,
          royal_notification: message
        });
        resolve();
      }, CRM_API_DELAY);
    });
  },

  syncNewTournament: async (tournament: Tournament) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        logCRM('New Tournament', { tournament });
        resolve();
      }, CRM_API_DELAY);
    });
  }
};
