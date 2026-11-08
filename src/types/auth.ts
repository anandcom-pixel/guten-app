export type UserRole = 'admin' | 'tester';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatar: string;
  canEdit: boolean;
  canCreate: boolean;
}

export const SHARED_PASSWORD = 'guten123';

export const VALID_USERS: Record<string, AuthUser> = {
  admin: {
    id: 'usr-admin',
    username: 'admin',
    displayName: 'Admin',
    role: 'admin',
    avatar: '⚡',
    canEdit: true,
    canCreate: true
  },
  sreegovind: {
    id: 'usr-sreegovind',
    username: 'sreegovind',
    displayName: 'Sreegovind',
    role: 'tester',
    avatar: '🧪',
    canEdit: true,
    canCreate: true
  },
  gayathri: {
    id: 'usr-gayathri',
    username: 'gayathri',
    displayName: 'Gayathri',
    role: 'tester',
    avatar: '🔬',
    canEdit: true,
    canCreate: true
  }
};

export type EvaluationCategory = 'bug' | 'audio' | 'translation' | 'ui' | 'feature' | 'grammar';
export type EvaluationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EvaluationReport {
  id: string;
  timestamp: string;
  reporter: AuthUser;
  category: EvaluationCategory;
  severity: EvaluationSeverity;
  activeModuleTitle: string;
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  systemDiagnostics: {
    userAgent: string;
    screenResolution: string;
    speechSupport: boolean;
    appUrl: string;
  };
}
