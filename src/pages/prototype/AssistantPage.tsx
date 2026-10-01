import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  RotateCcw,
  FileText,
  Activity,
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Shield,
  HelpCircle,
  Mic,
  Copy,
  Check,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Button } from '../../components/ui/Button';
import { LiveVoiceModal } from '../../components/voice/LiveVoiceModal';
import { usePrototype } from '../../state';
import {
  defaultSuggestedQuestions,
  profileSuggestedQuestions,
  quickInsights,
} from '../../data/assistantDemoData';
import type { SuggestedQuestion } from '../../data/assistantTypes';
import './AssistantPage.css';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    currentProfileId,
    language,
    assistantMessages,
    isAssistantThinking,
    sendAssistantQuery,
    clearAssistantConversation,
    selectedReport,
    injectedContext,
    setInjectedContext,
    geminiStatus,
    isGeminiMode,
  } = usePrototype();

  const isHindi = language === 'hi';
  const [inputText, setInputText] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages, isAssistantThinking]);

  // Contextual starter questions based on injected context or profile
  const starterQuestions: SuggestedQuestion[] = injectedContext?.suggestedQuestions?.length
    ? injectedContext.suggestedQuestions.map((q, idx) => ({
        id: `inj_q_${idx}`,
        questionEn: q.questionEn,
        questionHi: q.questionHi,
        category: 'metrics',
      }))
    : profileSuggestedQuestions[currentProfileId] || defaultSuggestedQuestions;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAssistantThinking) return;
    const query = inputText.trim();
    setInputText('');
    await sendAssistantQuery(query);
  };

  const handleQuestionClick = async (questionText: string) => {
    if (isAssistantThinking) return;
    const matchingInjected = injectedContext?.suggestedQuestions?.find(
      (q) => q.questionEn === questionText || q.questionHi === questionText
    );
    const queryToSend = matchingInjected?.assistantQuery || questionText;
    await sendAssistantQuery(queryToSend);
  };

  return (
    <PrototypeShell activeModuleName="assistant">
      <div className="sw-assistant-page">
        {/* 1. Header Section */}
        <div className="sw-assistant-header">
          <div className="sw-assistant-header__main">
            <div className="sw-assistant-header__title-row">
              <div className="sw-assistant-badge-icon" aria-hidden="true">
                <Sparkles size={18} />
              </div>
              <h1 className="sw-assistant-title">
                {isHindi ? 'स्वास्थ्य बुद्धिमत्ता सहायक' : 'Health Intelligence Assistant'}
              </h1>
              <span className="sw-assistant-boundary-tag">
                {isHindi ? 'प्रोटोटाइप • केवल सांकेतिक डेटा' : 'PROTOTYPE • ILLUSTRATIVE DATA'}
              </span>
            </div>
            <p className="sw-assistant-subtitle">
              {isHindi
                ? 'सरल, मानवीय भाषा में अपनी सांकेतिक स्वास्थ्य जानकारी और रिपोर्ट के बारे में पूछें।'
                : 'Ask about your illustrative health information and demo laboratory reports in simple, human language.'}
            </p>
          </div>

          <div className="sw-assistant-header__actions">
            {geminiStatus.available && isGeminiMode ? (
              <span className="sw-gemini-live-badge" title="Connected to Google Gemini Flash API">
                <Sparkles size={12} aria-hidden="true" />
                <span>{isHindi ? 'जेमिनी 3.8 फ्लैश सक्रिय' : 'Gemini 3.8 Flash (Active)'}</span>
              </span>
            ) : (
              <span className="sw-gemini-offline-badge" title="Operating with local synthetic health dataset">
                <span>{isHindi ? 'स्थानीय प्रोटोटाइप इंजन' : 'Grounded Prototype Engine'}</span>
              </span>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsVoiceModalOpen(true)}
              leftIcon={<Mic size={14} />}
              aria-label={isHindi ? 'लाइव वॉइस मोड खोलें' : 'Open live voice conversation'}
            >
              {isHindi ? 'वॉइस संवाद' : 'Talk with Voice'}
            </Button>

            {assistantMessages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAssistantConversation}
                disabled={isAssistantThinking}
                leftIcon={<RotateCcw size={14} />}
              >
                {isHindi ? 'नया वार्तालाप' : 'Clear Conversation'}
              </Button>
            )}
          </div>
        </div>

        {/* 2. Context Bar: Profile & Illustrative Grounding Indicators */}
        <div className="sw-assistant-context-bar" role="region" aria-label="Active Profile Context">
          <div className="sw-assistant-context-profile">
            <div className="sw-assistant-context-avatar" aria-hidden="true">
              {currentProfile.avatarInitials}
            </div>
            <div className="sw-assistant-context-meta">
              <span className="sw-assistant-context-viewing">
                {isHindi ? 'वर्तमान में सक्रिय: ' : 'Currently viewing: '}
              </span>
              <strong className="sw-assistant-context-name">{currentProfile.fullName}</strong>
              <span className="sw-assistant-context-sub">
                ({currentProfile.age} yrs · {currentProfile.gender})
              </span>
            </div>
          </div>

          <div className="sw-assistant-context-chips" aria-label="Context data sources">
            <div className="sw-context-chip" title="Active EHR Record">
              <span className="sw-context-chip__dot" aria-hidden="true" />
              <span className="sw-context-chip__label">
                {isHindi ? 'स्वास्थ्य रिकॉर्ड:' : 'Health Overview:'}
              </span>
              <span className="sw-context-chip__value">
                {currentProfileId === 'aarav'
                  ? 'Active / Stable'
                  : currentProfileId === 'meera'
                  ? 'Maternal Care'
                  : 'Senior Vitality'}
              </span>
            </div>

            <div className="sw-context-chip" title="Latest Lab Report">
              <FileText size={12} className="sw-context-chip__icon" aria-hidden="true" />
              <span className="sw-context-chip__label">
                {isHindi ? 'हालिया रिपोर्ट:' : 'Recent Report:'}
              </span>
              <span className="sw-context-chip__value">
                {selectedReport.title}
              </span>
            </div>

            <div className="sw-context-chip" title="Vitals Monitoring">
              <Activity size={12} className="sw-context-chip__icon" aria-hidden="true" />
              <span className="sw-context-chip__label">
                {isHindi ? 'वाइटल्स:' : 'Metrics:'}
              </span>
              <span className="sw-context-chip__value">
                {currentProfileId === 'aarav'
                  ? 'Glucose 144 mg/dL'
                  : currentProfileId === 'meera'
                  ? 'BP 118/76 mmHg'
                  : 'BP 138/86 mmHg'}
              </span>
            </div>

            <div className="sw-context-chip" title="Integrative Wellness">
              <HeartPulse size={12} className="sw-context-chip__icon" aria-hidden="true" />
              <span className="sw-context-chip__label">
                {isHindi ? 'दिनचर्या:' : 'Wellness:'}
              </span>
              <span className="sw-context-chip__value">
                {isHindi ? 'सक्रिय रूटीन' : 'Active routine'}
              </span>
            </div>
          </div>
        </div>

        {/* Phase 5 Injected Context Banner */}
        {injectedContext && (
          <div className="sw-assistant-injected-banner" role="region" aria-label="Injected Context Banner">
            <div className="sw-assistant-injected-head">
              <div className="sw-assistant-injected-title-wrap">
                <span className="sw-assistant-injected-tag">
                  {isHindi ? 'प्रासंगिक संदर्भ' : 'Context Injected'}
                </span>
                <span className="sw-assistant-injected-source">
                  {isHindi ? 'स्रोत संदर्भ:' : 'Context provided by:'}{' '}
                  <strong>{isHindi ? injectedContext.sourceTitleHi : injectedContext.sourceTitleEn}</strong>
                </span>
                {injectedContext.sourceDate && (
                  <span className="sw-assistant-injected-date">({injectedContext.sourceDate})</span>
                )}
              </div>
              <button
                type="button"
                className="sw-assistant-injected-clear"
                onClick={() => setInjectedContext(null)}
                aria-label={isHindi ? 'सामान्य संदर्भ पर लौटें' : 'Clear context'}
              >
                ✕ {isHindi ? 'सामान्य संदर्भ पर लौटें' : 'Clear context'}
              </button>
            </div>

            <p className="sw-assistant-injected-snippet">
              "{isHindi ? injectedContext.snippetHi : injectedContext.snippetEn}"
            </p>

            <span className="sw-assistant-injected-disclaimer">
              {isHindi
                ? 'सहायक केवल इस प्रदान किए गए सांकेतिक संदर्भ के आधार पर उत्तर देगा।'
                : 'The assistant answers questions based only on this supplied demo record context.'}
            </span>
          </div>
        )}

        {/* 3. Main Intelligence Layout: Workspace (Chat + Insights) */}
        <div className="sw-assistant-workspace">
          {/* Main Chat Column */}
          <div className="sw-assistant-chat-panel">
            {/* Messages Area */}
            <div
              className="sw-assistant-messages-container"
              role="log"
              aria-live="polite"
              aria-label="Conversation log"
            >
              {assistantMessages.length === 0 ? (
                /* Empty State: Calm Editorial Greeting & Starter Prompts */
                <div className="sw-assistant-empty-state">
                  <div className="sw-assistant-welcome-hero">
                    <div className="sw-assistant-welcome-icon" aria-hidden="true">
                      <Sparkles size={28} />
                    </div>
                    <h2 className="sw-assistant-welcome-title">
                      {isHindi
                        ? `नमस्ते ${currentProfile.fullName}, मैं आपका स्वास्थ्य सहायक हूँ`
                        : `Welcome ${currentProfile.fullName}, how can I help today?`}
                    </h2>
                    <p className="sw-assistant-welcome-text">
                      {isHindi
                        ? 'मैं आपके सांकेतिक रक्त परीक्षण, वाइटल्स रुझान, दिनचर्या और पारिवारिक अनुमतियों को सरल भाषा में समझाने के लिए उपलब्ध हूँ। यह प्रोटोटाइप किसी वास्तविक चिकित्सक का विकल्प नहीं है।'
                        : 'I am here to help you understand your illustrative lab reports, vitals trends, wellness routines, and family sharing in clear, human language. All responses are educational and non-diagnostic.'}
                    </p>
                  </div>

                  {/* Contextual Suggested Questions Section */}
                  <div className="sw-assistant-starter-section">
                    <div className="sw-assistant-starter-header">
                      <HelpCircle size={15} aria-hidden="true" />
                      <span>{isHindi ? 'सुझाए गए प्रश्न' : 'Suggested Questions'}</span>
                    </div>

                    <div className="sw-assistant-starter-grid">
                      {starterQuestions.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          className="sw-assistant-starter-btn"
                          onClick={() => handleQuestionClick(isHindi ? q.questionHi : q.questionEn)}
                        >
                          <span className="sw-assistant-starter-btn__text">
                            {isHindi ? q.questionHi : q.questionEn}
                          </span>
                          <ArrowRight size={14} className="sw-assistant-starter-btn__arrow" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Safety Boundary Banner */}
                  <div className="sw-assistant-hero-safety">
                    <Shield size={14} aria-hidden="true" />
                    <span>
                      {isHindi
                        ? 'प्रोटोटाइप सीमा: यह प्रणाली कोई वास्तविक चिकित्सा निदान, नुस्खे या आपातकालीन सेवाएं प्रदान नहीं करती है।'
                        : 'Prototype boundary: Non-diagnostic educational engine. No real medical advice, prescriptions, or emergency dispatch.'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Active Conversation Stream */
                <div className="sw-assistant-stream">
                  {assistantMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`sw-chat-message sw-chat-message--${msg.sender}`}
                    >
                      {msg.sender === 'user' ? (
                        <div className="sw-chat-bubble sw-chat-bubble--user">
                          <p className="sw-chat-text">{isHindi ? msg.textHi : msg.textEn}</p>
                          <span className="sw-chat-time">{msg.timestamp}</span>
                        </div>
                      ) : (
                        <div className="sw-chat-bubble sw-chat-bubble--assistant">
                          <div className="sw-chat-assistant-header">
                            <div className="sw-chat-assistant-avatar" aria-hidden="true">
                              <Sparkles size={14} />
                            </div>
                            <span className="sw-chat-assistant-name">SwasthyaAI Intelligence</span>
                            <span className="sw-chat-engine-badge">
                              {msg.engine === 'gemini' ? 'Gemini 3.8 Flash' : 'Prototype Engine'}
                            </span>
                            <span className="sw-chat-time">{msg.timestamp}</span>

                            <button
                              type="button"
                              className="sw-chat-copy-btn"
                              onClick={() => {
                                const textToCopy = isHindi ? msg.textHi : msg.textEn;
                                navigator.clipboard.writeText(textToCopy);
                                setCopiedMsgId(msg.id);
                                setTimeout(() => setCopiedMsgId(null), 2000);
                              }}
                              aria-label={isHindi ? 'संदेश कॉपी करें' : 'Copy message text'}
                              title={isHindi ? 'कॉपी करें' : 'Copy text'}
                            >
                              {copiedMsgId === msg.id ? (
                                <Check size={13} color="#059669" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>

                          {/* Message Content Body */}
                          <div className="sw-chat-text sw-chat-text--assistant">
                            {formatAssistantText(isHindi ? msg.textHi : msg.textEn)}
                            {msg.isStreaming && (
                              <span className="sw-streaming-cursor" aria-hidden="true" />
                            )}
                          </div>

                          {/* Highlighted Metrics if present */}
                          {msg.highlightedMetrics && msg.highlightedMetrics.length > 0 && (
                            <div className="sw-chat-metrics-row">
                              {msg.highlightedMetrics.map((met, idx) => (
                                <div
                                  key={idx}
                                  className={`sw-chat-metric-chip sw-chat-metric-chip--${met.status}`}
                                >
                                  <span className="sw-chat-metric-label">
                                    {isHindi ? met.labelHi : met.labelEn}
                                  </span>
                                  <div className="sw-chat-metric-val">
                                    <strong>{met.value}</strong>
                                    <small>{met.unit}</small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Emergency Alert Card (Section 10) */}
                          {msg.isEmergency && (
                            <div className="sw-chat-emergency-card" role="alert">
                              <div className="sw-chat-emergency-header">
                                <AlertTriangle size={18} className="sw-chat-emergency-icon" />
                                <strong>
                                  {isHindi ? 'आपातकालीन सूचना' : 'Emergency Information'}
                                </strong>
                              </div>
                              <p className="sw-chat-emergency-body">
                                {isHindi
                                  ? 'यदि यह वास्तविक चिकित्सा आपात स्थिति है, तो कृपया तुरंत स्थानीय आपातकालीन सेवाओं से संपर्क करें। भारत में 112 या 108 डायल करें। इस प्रोटोटाइप द्वारा कोई आपातकालीन सेवा संपर्क नहीं की जाती है।'
                                  : 'If this may be a real medical emergency, contact local emergency services directly. In India, dial 112 or 108 as appropriate. No emergency service is contacted by this prototype.'}
                              </p>
                              <Button
                                variant="primary"
                                size="sm"
                                className="sw-chat-emergency-btn"
                                onClick={() => navigate('/prototype/emergency')}
                                leftIcon={<AlertTriangle size={14} />}
                              >
                                {isHindi ? 'आपातकालीन सहायता खोलें' : 'Open Emergency Support'}
                              </Button>
                            </div>
                          )}

                          {/* Grounded Source Card (Section 12) */}
                          {msg.sourceCard && !msg.isEmergency && (
                            <div className="sw-chat-source-card">
                              <div className="sw-chat-source-header">
                                <span className="sw-chat-source-badge">
                                  {isHindi ? msg.sourceCard.badgeHi : msg.sourceCard.badgeEn}
                                </span>
                                <span className="sw-chat-source-grounded">
                                  {isHindi ? 'सांकेतिक प्रोटोटाइप डेटा पर आधारित' : 'Based on prototype information'}
                                </span>
                              </div>
                              <div className="sw-chat-source-content">
                                <strong className="sw-chat-source-title">
                                  {isHindi ? msg.sourceCard.titleHi : msg.sourceCard.titleEn}
                                </strong>
                                <p className="sw-chat-source-desc">
                                  {isHindi ? msg.sourceCard.descriptionHi : msg.sourceCard.descriptionEn}
                                </p>

                                {/* List of items if available */}
                                {msg.sourceCard.itemsEn && msg.sourceCard.itemsEn.length > 0 && (
                                  <ul className="sw-chat-source-list">
                                    {(isHindi && msg.sourceCard.itemsHi
                                      ? msg.sourceCard.itemsHi
                                      : msg.sourceCard.itemsEn
                                    ).map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <div className="sw-chat-source-footer">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(msg.sourceCard!.targetRoute)}
                                  leftIcon={<ExternalLink size={13} />}
                                >
                                  {isHindi ? msg.sourceCard.ctaTextHi : msg.sourceCard.ctaTextEn}
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Safety Boundary Subtext (Section 9) */}
                          <div className="sw-chat-disclaimer-note">
                            <Shield size={11} aria-hidden="true" />
                            <span>
                              {isHindi
                                ? 'शैक्षिक प्रोटोटाइप उत्तर · चिकित्सा निदान नहीं'
                                : 'Educational prototype response · Not a diagnosis'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Subtle Simulated AI Processing Indicator (Section 4) */}
                  {isAssistantThinking && (
                    <div className="sw-chat-message sw-chat-message--assistant" aria-live="polite">
                      <div className="sw-chat-bubble sw-chat-bubble--thinking">
                        <div className="sw-thinking-indicator">
                          <span className="sw-thinking-pulse" aria-hidden="true" />
                          <span className="sw-thinking-text">
                            {isHindi
                              ? 'आपकी सांकेतिक स्वास्थ्य जानकारी की समीक्षा की जा रही है…'
                              : 'Reviewing your illustrative health information…'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Conversation Composer Bar (Section 2) */}
            <div className="sw-assistant-composer-wrapper">
              {/* Optional Quick Starter Pill Bar if conversation has started */}
              {assistantMessages.length > 0 && (
                <div className="sw-assistant-quick-prompts" aria-label="Suggested follow-up questions">
                  {starterQuestions.slice(0, 3).map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      className="sw-assistant-mini-chip"
                      onClick={() => handleQuestionClick(isHindi ? q.questionHi : q.questionEn)}
                      disabled={isAssistantThinking}
                    >
                      {isHindi ? q.questionHi : q.questionEn}
                    </button>
                  ))}
                </div>
              )}

              <form className="sw-assistant-composer" onSubmit={handleSend}>
                <input
                  ref={inputRef}
                  id="sw-assistant-query-input"
                  name="assistantQuery"
                  type="text"
                  className="sw-assistant-input"
                  placeholder={
                    isHindi
                      ? 'स्वास्थ्य संबंधी प्रश्न पूछें (उदा. "मेरी नवीनतम रिपोर्ट समझाइए")...'
                      : 'Ask SwasthyaAI (e.g. "Explain my latest report" or "What do my glucose readings show?")...'
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isAssistantThinking}
                  aria-label={isHindi ? 'स्वास्थ्य संबंधी प्रश्न दर्ज करें' : 'Type health question'}
                />

                <button
                  type="button"
                  className="sw-assistant-mic-btn"
                  onClick={() => setIsVoiceModalOpen(true)}
                  aria-label={isHindi ? 'वॉइस मोड शुरू करें' : 'Start live voice conversation'}
                  title={isHindi ? 'जेमिनी लाइव वॉइस' : 'Gemini Live Voice'}
                >
                  <Mic size={17} aria-hidden="true" />
                </button>

                <button
                  type="submit"
                  className="sw-assistant-send-btn"
                  disabled={!inputText.trim() || isAssistantThinking}
                  aria-label={isHindi ? 'प्रश्न भेजें' : 'Send message'}
                >
                  <Send size={16} />
                </button>
              </form>

              <div className="sw-assistant-composer-footer">
                <span className="sw-composer-guardrail">
                  {geminiStatus.available && isGeminiMode
                    ? isHindi
                      ? 'जेमिनी 3.8 फ्लैश द्वारा संचालित • केवल सांकेतिक स्वास्थ्य रिकॉर्ड पर आधारित • चिकित्सा निदान नहीं।'
                      : 'Powered by Gemini 3.8 Flash • Grounded in synthetic demo records • Non-diagnostic educational assistant.'
                    : isHindi
                    ? 'स्थानीय प्रोटोटाइप इंजन • ब्राउज़र में सिमुलेटेड निर्णय-सहायता • कोई बाहरी डेटा ट्रांसमिशन नहीं।'
                    : 'Client-side simulation • Illustrative educational intelligence with local demonstration data.'}
                </span>
              </div>
            </div>
          </div>

          {/* Side Panel: Quick Insights & Navigation Shortcuts (Section 16) */}
          <aside className="sw-assistant-insights-panel" aria-label="Suggested Health Insights">
            <div className="sw-insights-panel-header">
              <Sparkles size={16} className="sw-insights-icon" aria-hidden="true" />
              <h3>{isHindi ? 'सुझाए गए स्वास्थ्य अंतर्दृष्टि' : 'Suggested Insights'}</h3>
            </div>

            <div className="sw-insights-cards-list">
              {quickInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="sw-insight-card"
                  onClick={() => navigate(insight.route)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(insight.route);
                    }
                  }}
                  aria-label={`${isHindi ? insight.titleHi : insight.titleEn}: ${isHindi ? insight.descriptionHi : insight.descriptionEn}`}
                >
                  <div className="sw-insight-card__top">
                    <span className="sw-insight-card__badge">
                      {isHindi ? insight.badgeHi : insight.badgeEn}
                    </span>
                    <ArrowRight size={14} className="sw-insight-card__arrow" aria-hidden="true" />
                  </div>
                  <h4 className="sw-insight-card__title">
                    {isHindi ? insight.titleHi : insight.titleEn}
                  </h4>
                  <p className="sw-insight-card__desc">
                    {isHindi ? insight.descriptionHi : insight.descriptionEn}
                  </p>
                </div>
              ))}
            </div>

            {/* Profile Health Snapshot Card */}
            <div className="sw-assistant-profile-card">
              <div className="sw-assistant-profile-card__head">
                <span className="sw-assistant-profile-card__tag">
                  {isHindi ? 'सक्रिय प्रोफ़ाइल' : 'Active Profile'}
                </span>
                <span className="sw-assistant-profile-card__id">{`DEMO-${currentProfile.id.toUpperCase()}-001`}</span>
              </div>
              <strong className="sw-assistant-profile-card__name">
                {currentProfile.fullName}
              </strong>
              <div className="sw-assistant-profile-card__stats">
                <div className="sw-assistant-profile-stat">
                  <span>{isHindi ? 'उम्र' : 'Age'}</span>
                  <strong>{currentProfile.age}</strong>
                </div>
                <div className="sw-assistant-profile-stat">
                  <span>{isHindi ? 'लिंग' : 'Gender'}</span>
                  <strong>{currentProfile.gender}</strong>
                </div>
                <div className="sw-assistant-profile-stat">
                  <span>{isHindi ? 'रक्त समूह' : 'Blood'}</span>
                  <strong>{currentProfile.bloodGroup}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Real Gemini Live Voice Modal */}
      <LiveVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        profileId={currentProfileId}
        injectedContext={injectedContext}
        language={language}
      />
    </PrototypeShell>
  );
};

// Simple text formatter to handle bold headers and bullet points cleanly
function formatAssistantText(text: string): React.ReactNode {
  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((paragraph, pIdx) => {
        const lines = paragraph.split('\n');

        // Check if lines are bullet points
        const isBulletList = lines.every((line) => line.trim().startsWith('•') || line.trim().startsWith('-'));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="sw-chat-bullet-list">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[•-]\s*/, '');
                return <li key={lIdx}>{renderFormattedLine(cleanLine)}</li>;
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx} className="sw-chat-para">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderFormattedLine(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function renderFormattedLine(line: string): React.ReactNode {
  // Support simple bolding like **text**
  const parts = line.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
