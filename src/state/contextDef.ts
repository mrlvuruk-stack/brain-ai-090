import { createContext } from 'react';
import type {
  DemoUser,
  DemoFamilyMember,
  DemoNotification,
  DemoLabReport,
} from '../data/types';
import type { AssistantMessage } from '../data/assistantTypes';
import type {
  HealthJourneyEvent,
  HealthChange,
  HealthGoal,
} from '../data/journeyTypes';
import type { InjectedAssistantContext } from '../data/intelligenceTypes';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
}

export interface PrototypeContextType {
  // Profile
  currentProfileId: string;
  currentProfile: DemoUser;
  setProfileId: (id: string) => void;

  // Language
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;

  // Accessibility / Elderly Mode
  elderlyMode: boolean;
  toggleElderlyMode: () => void;

  // Notifications
  notifications: DemoNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Family Members & Permission Controls
  familyMembers: DemoFamilyMember[];
  updateFamilyAccess: (
    memberId: string,
    accessState: DemoFamilyMember['medicalAccessState'],
    scopes: DemoFamilyMember['sharedScopes'],
    duration: DemoFamilyMember['accessDurationDays']
  ) => void;

  // Reports Analysis Simulation
  selectedReportId: string;
  selectedReport: DemoLabReport;
  setSelectedReportId: (id: string) => void;
  isProcessingReport: boolean;
  processingStep: number;
  reanalyzeReport: (id?: string) => void;

  // Health Intelligence Filters
  timeframe: '7d' | '30d' | '90d';
  setTimeframe: (tf: '7d' | '30d' | '90d') => void;
  activeMetricId: 'glucose' | 'bp' | 'heartRate';
  setActiveMetricId: (id: 'glucose' | 'bp' | 'heartRate') => void;

  // Feedback Toast System
  toasts: ToastItem[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;

  // AI Health Intelligence Assistant (Phase 3)
  assistantMessages: AssistantMessage[];
  isAssistantThinking: boolean;
  sendAssistantQuery: (query: string) => Promise<void>;
  clearAssistantConversation: () => void;

  // Personal Health Journey & Intelligence (Phase 4)
  journeyEvents: HealthJourneyEvent[];
  healthChanges: HealthChange[];
  healthGoals: HealthGoal[];
  toggleGoalStatus: (goalId: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Contextual Assistant Handoff (Phase 5)
  injectedContext: InjectedAssistantContext | null;
  setInjectedContext: (ctx: InjectedAssistantContext | null) => void;
  askAboutContext: (ctx: InjectedAssistantContext) => void;

  // Real Gemini AI & Voice (Phase 5.5)
  geminiStatus: { available: boolean; textModel: string; liveModel: string };
  isGeminiMode: boolean;
  setIsGeminiMode: (enabled: boolean) => void;
}

export const PrototypeContext = createContext<PrototypeContextType | undefined>(undefined);
