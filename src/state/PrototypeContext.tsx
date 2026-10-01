import React, { useState, useEffect } from 'react';
import type {
  DemoFamilyMember,
  DemoNotification,
} from '../data/types';
import {
  demoProfiles,
  initialDemoFamilyMembers,
  initialDemoNotifications,
  demoLabReports,
} from '../data/demoData';
import { detectIntent, generateAssistantReply } from '../data/assistantDemoData';
import type { AssistantMessage } from '../data/assistantTypes';
import {
  demoJourneyEvents,
  demoHealthChanges,
  demoHealthGoals,
} from '../data/journeyDemoData';
import type { HealthGoal } from '../data/journeyTypes';
import type { InjectedAssistantContext } from '../data/intelligenceTypes';
import { PrototypeContext, type ToastItem } from './contextDef';
import { checkGeminiStatus, streamChatMessage } from '../services/gemini/geminiClient';
import { getSwasthyaSystemInstruction, formatGroundedContextText } from '../services/gemini/geminiPrompts';
import { buildGeminiHealthContext } from '../services/gemini/geminiContext';

export const PrototypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real Gemini AI State (Phase 5.5)
  const [geminiStatus, setGeminiStatus] = useState<{ available: boolean; textModel: string; liveModel: string }>({
    available: false,
    textModel: 'gemini-3.8-flash',
    liveModel: 'gemini-3.1-flash-live-preview',
  });
  const [isGeminiMode, setIsGeminiMode] = useState<boolean>(true);

  // Check Gemini backend status on mount
  useEffect(() => {
    checkGeminiStatus().then((status) => {
      setGeminiStatus(status);
    });
  }, []);

  // Contextual Assistant Handoff State (Phase 5)
  const [injectedContext, setInjectedContext] = useState<InjectedAssistantContext | null>(null);
  // Profile State
  const [currentProfileId, setCurrentProfileId] = useState<string>('aarav');
  const currentProfile = demoProfiles[currentProfileId] || demoProfiles.aarav;

  // Language State
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');

  // Elderly Accessibility Mode
  const [elderlyMode, setElderlyMode] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<DemoNotification[]>(initialDemoNotifications);
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState<DemoFamilyMember[]>(initialDemoFamilyMembers);

  // Reports Analysis State
  const [selectedReportId, setSelectedReportIdState] = useState<string>('rep_001');
  const [isProcessingReport, setIsProcessingReport] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(4); // 4 = complete

  // Health Intelligence Filters
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeMetricId, setActiveMetricId] = useState<'glucose' | 'bp' | 'heartRate'>('glucose');

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync elderly mode to document body for global CSS scaling
  useEffect(() => {
    if (elderlyMode) {
      document.body.classList.add('sw-elderly-mode');
    } else {
      document.body.classList.remove('sw-elderly-mode');
    }
  }, [elderlyMode]);

  // Profile switcher with isolation and toast
  const setProfileId = (id: string) => {
    if (demoProfiles[id]) {
      setCurrentProfileId(id);
      // Cleanly clear conversation and injected context to avoid cross-profile leakage
      setAssistantMessages([]);
      setInjectedContext(null);
      setIsAssistantThinking(false);
      addToast(
        language === 'hi'
          ? `सक्रिय प्रोफ़ाइल को ${demoProfiles[id].fullName} पर बदला गया (सांकेतिक रिकॉर्ड पृथक्करण)`
          : `Profile context switched to ${demoProfiles[id].fullName} without mixing demo records`,
        'info'
      );
    }
  };

  // Language toggle with toast
  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      addToast(next === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language set to English', 'info');
      return next;
    });
  };

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    addToast(lang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language set to English', 'info');
  };

  // Elderly mode toggle with toast
  const toggleElderlyMode = () => {
    setElderlyMode((prev) => {
      const next = !prev;
      addToast(
        next
          ? 'Elderly Mode Enabled: ~60px touch targets, larger fonts & higher contrast'
          : 'Elderly Mode Disabled: Standard interface restored',
        'info'
      );
      return next;
    });
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  // Family access update
  const updateFamilyAccess = (
    memberId: string,
    accessState: DemoFamilyMember['medicalAccessState'],
    scopes: DemoFamilyMember['sharedScopes'],
    duration: DemoFamilyMember['accessDurationDays']
  ) => {
    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              medicalAccessState: accessState,
              sharedScopes: scopes,
              accessDurationDays: duration,
              lastUpdated: 'Just now (Updated)',
            }
          : m
      )
    );
    const targetMember = familyMembers.find((m) => m.id === memberId);
    const memberName = targetMember ? targetMember.name : 'Family member';
    if (accessState === 'Not shared') {
      addToast(`Medical data access revoked for ${memberName}`, 'warning');
    } else {
      addToast(`Medical access granted to ${memberName} (${accessState})`, 'success');
    }
  };

  // Report analysis simulation
  const selectedReport =
    demoLabReports.find((r) => r.id === selectedReportId) || demoLabReports[0];

  const reanalyzeReport = (newId?: string) => {
    const targetId = newId || selectedReportId;
    setSelectedReportIdState(targetId);
    setIsProcessingReport(true);
    setProcessingStep(1);

    // Staged processing simulation
    setTimeout(() => setProcessingStep(2), 500);
    setTimeout(() => setProcessingStep(3), 1000);
    setTimeout(() => setProcessingStep(4), 1600);
    setTimeout(() => {
      setIsProcessingReport(false);
      addToast('Diagnostic analysis and plain-language summary prepared', 'success');
    }, 2000);
  };

  const setSelectedReportId = (id: string) => {
    if (id !== selectedReportId) {
      reanalyzeReport(id);
    }
  };

  // AI Health Intelligence Assistant State (Phase 3 & 5.5)
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  const sendAssistantQuery = async (query: string): Promise<void> => {
    if (!query.trim()) return;

    const userMsg: AssistantMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      textEn: query,
      textHi: query,
    };

    setAssistantMessages((prev) => [...prev, userMsg]);
    setIsAssistantThinking(true);

    // 1. Safety Interception: Emergency symptoms get immediate deterministic protocol
    const intent = detectIntent(query);
    if (intent === 'EMERGENCY') {
      const reply = generateAssistantReply(
        intent,
        query,
        currentProfile,
        language,
        familyMembers,
        demoLabReports
      );
      reply.engine = 'deterministic';
      setAssistantMessages((prev) => [...prev, reply]);
      setIsAssistantThinking(false);
      addToast(
        language === 'hi'
          ? 'आपातकालीन सहायता मार्गदर्शन प्रदर्शित किया गया'
          : 'Emergency guidance displayed',
        'warning'
      );
      return;
    }

    // 2. Real Gemini Mode: Stream real responses when available
    if (isGeminiMode && geminiStatus.available) {
      const botMsgId = `msg_asst_${Date.now()}`;
      const initialBotMsg: AssistantMessage = {
        id: botMsgId,
        sender: 'assistant',
        textEn: '',
        textHi: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
        engine: 'gemini',
      };

      setAssistantMessages((prev) => [...prev, initialBotMsg]);

      try {
        const systemInstruction = getSwasthyaSystemInstruction(language);
        const groundedObj = buildGeminiHealthContext(currentProfileId, injectedContext);
        const groundedText = formatGroundedContextText(groundedObj);

        // Previous 6 messages for turn-by-turn conversation context
        const historyForGemini = assistantMessages.slice(-6).map((m) => ({
          role: m.sender,
          content: language === 'hi' && m.textHi ? m.textHi : m.textEn,
        }));
        historyForGemini.push({ role: 'user', content: query });

        let accumulated = '';
        await streamChatMessage({
          messages: historyForGemini,
          profileId: currentProfileId,
          language,
          injectedSnippet: injectedContext?.snippetEn,
          systemInstruction,
          groundedContext: groundedText,
          onChunk: (chunk) => {
            accumulated += chunk;
            setAssistantMessages((prev) =>
              prev.map((m) =>
                m.id === botMsgId
                  ? { ...m, textEn: accumulated, textHi: accumulated, isStreaming: true }
                  : m
              )
            );
          },
        });

        setAssistantMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, isStreaming: false, engine: 'gemini' }
              : m
          )
        );
        setIsAssistantThinking(false);
        return;
      } catch (err) {
        console.warn('[PrototypeContext] Gemini API streaming failed, falling back to prototype engine:', err);
        setAssistantMessages((prev) => prev.filter((m) => m.id !== botMsgId));
        addToast(
          language === 'hi'
            ? 'जेमिनी उपलब्ध नहीं है, प्रोटोटाइप डेटा से उत्तर दिया जा रहा है'
            : 'Gemini unavailable. Switched to grounded prototype fallback.',
          'info'
        );
      }
    }

    // 3. Grounded Deterministic Prototype Engine Fallback
    await new Promise((resolve) => setTimeout(resolve, 600));
    const reply = generateAssistantReply(
      intent,
      query,
      currentProfile,
      language,
      familyMembers,
      demoLabReports
    );
    reply.engine = 'deterministic';

    setAssistantMessages((prev) => [...prev, reply]);
    setIsAssistantThinking(false);

    // Contextual toasts
    if (intent === 'REPORT_EXPLANATION') {
      addToast(
        language === 'hi'
          ? 'रिपोर्ट संदर्भ सफलतापूर्वक लोड किया गया'
          : 'Report context loaded',
        'info'
      );
    } else if (intent === 'HEALTH_SUMMARY') {
      addToast(
        language === 'hi'
          ? 'स्वास्थ्य सारांश तैयार किया गया'
          : 'Health summary prepared',
        'info'
      );
    }
  };

  const clearAssistantConversation = () => {
    setAssistantMessages([]);
    addToast(
      language === 'hi' ? 'वार्तालाप साफ़ कर दिया गया' : 'Conversation cleared',
      'info'
    );
  };

  // Phase 4: Personal Health Journey & Goals State
  const [goalsState, setGoalsState] = useState<Record<string, HealthGoal[]>>(demoHealthGoals);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const journeyEvents = demoJourneyEvents.filter((e) => e.profileId === currentProfileId);
  const healthChanges = demoHealthChanges[currentProfileId] || demoHealthChanges.aarav;
  const healthGoals = goalsState[currentProfileId] || goalsState.aarav;

  const toggleGoalStatus = (goalId: string) => {
    setGoalsState((prev) => {
      const profileGoals = prev[currentProfileId] || [];
      const updated = profileGoals.map((g) => {
        if (g.id === goalId) {
          const nextCompleted = !g.completed;
          addToast(
            nextCompleted
              ? language === 'hi'
                ? `लक्ष्य पूर्ण: ${g.titleHi}`
                : `Goal completed: ${g.titleEn}`
              : language === 'hi'
              ? `लक्ष्य पुनः सक्रिय: ${g.titleHi}`
              : `Goal active: ${g.titleEn}`,
            'success'
          );
          return {
            ...g,
            completed: nextCompleted,
            progressPercent: nextCompleted ? 100 : Math.max(50, g.progressPercent - 20),
          };
        }
        return g;
      });
      return { ...prev, [currentProfileId]: updated };
    });
  };

  const askAboutContext = (ctx: InjectedAssistantContext) => {
    setInjectedContext(ctx);
  };

  return (
    <PrototypeContext.Provider
      value={{
        currentProfileId,
        currentProfile,
        setProfileId,
        language,
        toggleLanguage,
        setLanguage,
        elderlyMode,
        toggleElderlyMode,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        familyMembers,
        updateFamilyAccess,
        selectedReportId,
        selectedReport,
        setSelectedReportId,
        isProcessingReport,
        processingStep,
        reanalyzeReport,
        timeframe,
        setTimeframe,
        activeMetricId,
        setActiveMetricId,
        toasts,
        addToast,
        removeToast,
        assistantMessages,
        isAssistantThinking,
        sendAssistantQuery,
        clearAssistantConversation,
        journeyEvents,
        healthChanges,
        healthGoals,
        toggleGoalStatus,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        injectedContext,
        setInjectedContext,
        askAboutContext,
        geminiStatus,
        isGeminiMode,
        setIsGeminiMode,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  );
};


