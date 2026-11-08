import { type AuthUser, VALID_USERS, SHARED_PASSWORD } from '../types/auth';

const AUTH_STORAGE_KEY = 'guten_auth_user_v1';

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        if (parsed && parsed.username && VALID_USERS[parsed.username.toLowerCase()]) {
          // Re-sync with latest permissions so all 3 have canEdit/canCreate
          const userTemplate = VALID_USERS[parsed.username.toLowerCase()];
          this.currentUser = {
            ...userTemplate,
            ...parsed,
            canEdit: true,
            canCreate: true
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse Guten auth session:', e);
      this.currentUser = null;
    }
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public canEdit(): boolean {
    return this.currentUser?.canEdit === true;
  }

  public canCreate(): boolean {
    return this.currentUser?.canCreate === true;
  }

  public login(
    usernameInput: string,
    passwordInput: string
  ): { success: boolean; user?: AuthUser; error?: string } {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanUsername) {
      return { success: false, error: 'Bitte geben Sie einen Benutzernamen ein.' };
    }

    const matchedUser = VALID_USERS[cleanUsername];
    if (!matchedUser) {
      return {
        success: false,
        error: 'Benutzer nicht gefunden. Autorisierte Konten: admin, sreegovind oder gayathri.'
      };
    }

    if (cleanPassword !== SHARED_PASSWORD) {
      return {
        success: false,
        error: 'Falsches Passwort. Bitte überprüfen Sie Ihre Anmeldedaten.'
      };
    }

    this.currentUser = matchedUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
    }
    this.notify();
    return { success: true, user: matchedUser };
  }

  public logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    this.notify();
  }

  public subscribe(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }
}

export const authService = new AuthService();
