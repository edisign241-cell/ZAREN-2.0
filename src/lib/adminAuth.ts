export const SUPER_ADMIN_EMAIL = 'loumbo408@gmail.com';

export interface AdminSession {
  email: string;
  role: 'SUPER_ADMIN';
  token: string;
  loggedAt: string;
}

class AdminAuthService {
  private getStorageKey(): string {
    return 'zaren_admin_auth_data';
  }

  private getSessionKey(): string {
    return 'zaren_admin_session';
  }

  isPasswordSet(): boolean {
    if (typeof window === 'undefined') return true;
    const data = localStorage.getItem(this.getStorageKey());
    return !!data;
  }

  setPassword(password: string): boolean {
    if (typeof window === 'undefined') return false;
    if (!password) return false;
    localStorage.setItem(this.getStorageKey(), JSON.stringify({
      email: SUPER_ADMIN_EMAIL,
      password: btoa(password),
      updatedAt: new Date().toISOString()
    }));
    return true;
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    if (typeof window === 'undefined') return { success: false, error: 'Environnement serveur' };
    
    if (email.trim().toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: `Accès refusé. Seul le compte ${SUPER_ADMIN_EMAIL} est autorisé.` };
    }

    if (!password || password.trim() === '') {
      return { success: false, error: 'Veuillez renseigner un mot de passe.' };
    }

    const storedData = localStorage.getItem(this.getStorageKey());
    
    // Si aucun mot de passe n'a été créé, on l'initialise avec le mot de passe saisi
    if (!storedData) {
      this.setPassword(password);
      this.createSession();
      return { success: true };
    }

    try {
      const parsed = JSON.parse(storedData);
      if (parsed.password === btoa(password)) {
        this.createSession();
        return { success: true };
      } else {
        return { success: false, error: 'Mot de passe administrateur incorrect.' };
      }
    } catch {
      this.setPassword(password);
      this.createSession();
      return { success: true };
    }
  }

  private createSession(): void {
    if (typeof window === 'undefined') return;
    const session: AdminSession = {
      email: SUPER_ADMIN_EMAIL,
      role: 'SUPER_ADMIN',
      token: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      loggedAt: new Date().toISOString()
    };
    sessionStorage.setItem(this.getSessionKey(), JSON.stringify(session));
    localStorage.setItem(this.getSessionKey(), JSON.stringify(session));
    if (typeof document !== 'undefined') {
      document.cookie = `zaren_admin_session=true; path=/; max-age=86400; SameSite=Lax`;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const session = sessionStorage.getItem(this.getSessionKey()) || localStorage.getItem(this.getSessionKey());
    if (!session) return false;
    try {
      const parsed: AdminSession = JSON.parse(session);
      return parsed.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    } catch {
      return false;
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.getSessionKey());
    localStorage.removeItem(this.getSessionKey());
    if (typeof document !== 'undefined') {
      document.cookie = `zaren_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  }
}

export const adminAuthService = new AdminAuthService();
