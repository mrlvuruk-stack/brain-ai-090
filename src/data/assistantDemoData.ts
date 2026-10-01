/**
 * SWASTHYAAI AI HEALTH INTELLIGENCE ASSISTANT — DEMO ENGINE & DATA
 * Deterministic, context-aware responses anchored in synthetic pilot profiles.
 * Strictly non-diagnostic; provides plain-language educational explanations only.
 */

import type {
  AssistantIntent,
  AssistantMessage,
  SuggestedQuestion,
  QuickInsight,
} from './assistantTypes';
import type { DemoUser, DemoFamilyMember, DemoLabReport } from './types';

// 1. Suggested Starter Questions (Contextual to synthetic profiles)
export const defaultSuggestedQuestions: SuggestedQuestion[] = [
  {
    id: 'q_report',
    questionEn: 'Explain my latest report',
    questionHi: 'मेरी नवीनतम रिपोर्ट समझाइए',
    category: 'reports',
  },
  {
    id: 'q_glucose',
    questionEn: 'What do my recent glucose readings show?',
    questionHi: 'मेरे हालिया ग्लूकोज पाठ्यांक क्या दर्शाते हैं?',
    category: 'metrics',
  },
  {
    id: 'q_summary',
    questionEn: 'Give me a simple health summary',
    questionHi: 'मुझे एक सरल स्वास्थ्य सारांश दीजिए',
    category: 'summary',
  },
  {
    id: 'q_wellness',
    questionEn: 'What wellness activities are in my routine?',
    questionHi: 'मेरी दिनचर्या में कौन-सी कल्याण गतिविधियाँ हैं?',
    category: 'wellness',
  },
  {
    id: 'q_hba1c',
    questionEn: 'Explain HbA1c in simple language',
    questionHi: 'HbA1c को सरल भाषा में समझाइए',
    category: 'metrics',
  },
  {
    id: 'q_trends',
    questionEn: 'Show me what changed recently',
    questionHi: 'हाल ही में क्या बदलाव आए हैं?',
    category: 'trends',
  },
  {
    id: 'q_family',
    questionEn: 'Who has access to my health records?',
    questionHi: 'मेरे स्वास्थ्य रिकॉर्ड्स तक किसकी पहुँच है?',
    category: 'summary',
  },
];

// Profile-specific starter overrides/additions
export const profileSuggestedQuestions: Record<string, SuggestedQuestion[]> = {
  aarav: [
    {
      id: 'q_aarav_cmp',
      questionEn: 'Explain my latest report',
      questionHi: 'मेरी नवीनतम रिपोर्ट समझाइए',
      category: 'reports',
    },
    {
      id: 'q_aarav_glucose',
      questionEn: 'What do my recent glucose readings show?',
      questionHi: 'मेरे हालिया ग्लूकोज पाठ्यांक क्या दर्शाते हैं?',
      category: 'metrics',
    },
    {
      id: 'q_aarav_summary',
      questionEn: 'Give me a simple health summary',
      questionHi: 'मुझे एक सरल स्वास्थ्य सारांश दीजिए',
      category: 'summary',
    },
    {
      id: 'q_aarav_trends',
      questionEn: 'What changed over the last 30 days?',
      questionHi: 'पिछले 30 दिनों में क्या बदलाव आए हैं?',
      category: 'trends',
    },
    {
      id: 'q_aarav_wellness',
      questionEn: 'Tell me about Anulom Vilom and Shatapadi',
      questionHi: 'अनुलोम विलोम और शतपदी के बारे में बताइए',
      category: 'wellness',
    },
  ],
  meera: [
    {
      id: 'q_meera_cbc',
      questionEn: 'Explain my Complete Blood Count report',
      questionHi: 'मेरी कम्प्लीट ब्लड काउंट (CBC) रिपोर्ट समझाइए',
      category: 'reports',
    },
    {
      id: 'q_meera_bp',
      questionEn: 'How are my blood pressure and heart rate readings?',
      questionHi: 'मेरा रक्तचाप और हृदय गति कैसी है?',
      category: 'metrics',
    },
    {
      id: 'q_meera_summary',
      questionEn: 'Give me a simple health summary',
      questionHi: 'मुझे एक सरल स्वास्थ्य सारांश दीजिए',
      category: 'summary',
    },
    {
      id: 'q_meera_wellness',
      questionEn: 'What balance and yoga practices are suggested for me?',
      questionHi: 'मेरे लिए कौन-से योग अभ्यास सुझाए गए हैं?',
      category: 'wellness',
    },
  ],
  savitri: [
    {
      id: 'q_savitri_bp',
      questionEn: 'What do my blood pressure readings indicate?',
      questionHi: 'मेरे रक्तचाप के पाठ्यांक क्या संकेत देते हैं?',
      category: 'metrics',
    },
    {
      id: 'q_savitri_summary',
      questionEn: 'Give me a simple health summary',
      questionHi: 'मुझे एक सरल स्वास्थ्य सारांश दीजिए',
      category: 'summary',
    },
    {
      id: 'q_savitri_report',
      questionEn: 'Explain my renal and blood sugar report',
      questionHi: 'मेरी किडनी और ब्लड शुगर रिपोर्ट समझाइए',
      category: 'reports',
    },
    {
      id: 'q_savitri_routine',
      questionEn: 'What gentle routines are safe for my joints and age?',
      questionHi: 'मेरी उम्र और जोड़ों के लिए कौन-सी दिनचर्या उपयुक्त है?',
      category: 'wellness',
    },
  ],
};

// 2. Quick Insight Cards (Section 16)
export const quickInsights: QuickInsight[] = [
  {
    id: 'ins_report',
    titleEn: 'Recent Illustrative Lab Report Ready',
    titleHi: 'हालिया सांकेतिक लैब रिपोर्ट तैयार',
    descriptionEn: 'Explore simplified explanations of numerical lab parameters from your latest test.',
    descriptionHi: 'अपनी नवीनतम जांच के प्रयोगशाला मापदंडों की सरल व्याख्या देखें।',
    route: '/prototype/report-analysis',
    badgeEn: 'Report AI',
    badgeHi: 'रिपोर्ट विश्लेषण',
    iconName: 'file-text',
  },
  {
    id: 'ins_trends',
    titleEn: 'Longitudinal Trend Analysis',
    titleHi: 'दीर्घकालिक रुझान विश्लेषण',
    descriptionEn: 'Inspect 7, 30, and 90-day physiological continuity curves without alarming clutter.',
    descriptionHi: '7, 30 और 90 दिनों के स्वास्थ्य रुझान ग्राफ देखें।',
    route: '/prototype/health-intelligence',
    badgeEn: 'Trends',
    badgeHi: 'स्वास्थ्य रुझान',
    iconName: 'activity',
  },
  {
    id: 'ins_wellness',
    titleEn: 'Today’s Integrative Dinacharya',
    titleHi: 'आज की एकीकृत दिनचर्या',
    descriptionEn: 'Review morning pranayama, post-meal Shatapadi walking, and sleep hygiene practices.',
    descriptionHi: 'प्रातः प्राणायाम, शतपदी चलना और रात्रि निद्रा आदतों की समीक्षा करें।',
    route: '/prototype/wellness',
    badgeEn: 'Wellness',
    badgeHi: 'कल्याण व योग',
    iconName: 'heart',
  },
  {
    id: 'ins_family',
    titleEn: 'Family Access & Consent Circles',
    titleHi: 'पारिवारिक पहुँच एवं सहमति चक्र',
    descriptionEn: 'Verify granted diagnostic permissions across your multi-generational family network.',
    descriptionHi: 'अपने परिवार के सदस्यों के साथ साझा स्वास्थ्य अनुमतियों की समीक्षा करें।',
    route: '/prototype/family',
    badgeEn: 'Family Care',
    badgeHi: 'पारिवारिक देखभाल',
    iconName: 'users',
  },
];

// 3. Intent Detection Logic
export function detectIntent(rawQuery: string): AssistantIntent {
  const query = rawQuery.toLowerCase().trim();

  // EMERGENCY CHECK (Highest Priority)
  const emergencyKeywords = [
    'chest pain',
    'heart attack',
    'unconscious',
    'cannot breathe',
    'difficulty breathing',
    'choking',
    'severe bleeding',
    'emergency',
    'ambulance',
    'stroke',
    'fainted',
    '108',
    '112',
    'सीने में दर्द',
    'दिल का दौरा',
    'बेहोश',
    'सांस नहीं',
    'सांस लेने में तकलीफ',
    'गंभीर रक्तस्राव',
    'एम्बुलेंस',
    'आपातकाल',
    'मदद चाहिए',
  ];
  if (emergencyKeywords.some((kw) => query.includes(kw))) {
    return 'EMERGENCY';
  }

  // HEALTH SUMMARY CHECK
  const summaryKeywords = [
    'summary',
    'overall health',
    'health snapshot',
    'overview',
    'how am i doing',
    'tell me about my health',
    'health status',
    'whole picture',
    'सारांश',
    'स्वास्थ्य सारांश',
    'समग्र स्वास्थ्य',
    'मेरी सेहत कैसी है',
    'अवलोकन',
  ];
  if (summaryKeywords.some((kw) => query.includes(kw))) {
    return 'HEALTH_SUMMARY';
  }

  // TREND / LONGITUDINAL CHECK
  const trendKeywords = [
    'trend',
    '30 day',
    '7 day',
    '90 day',
    'what changed',
    'changed recently',
    'over time',
    'history',
    'progress',
    'graph',
    'curve',
    'रूझान',
    'रुझान',
    'बदलाव',
    'तीस दिन',
    'समय के साथ',
  ];
  if (trendKeywords.some((kw) => query.includes(kw))) {
    return 'TREND_SUMMARY';
  }

  // REPORT EXPLANATION CHECK
  const reportKeywords = [
    'report',
    'test',
    'cbc',
    'cmp',
    'lipid',
    'blood test',
    'lab result',
    'creatinine',
    'hemoglobin',
    'platelets',
    'wbc',
    'leukocyte',
    'differential',
    'pathology',
    'रिपोर्ट',
    'जांच',
    'परीक्षण',
    'लैब',
    'हीमोग्लोबिन',
    'प्लेटलेट',
    'क्रिएटिनिन',
  ];
  if (reportKeywords.some((kw) => query.includes(kw))) {
    return 'REPORT_EXPLANATION';
  }

  // METRIC / VITAL EXPLANATION CHECK
  const metricKeywords = [
    'glucose',
    'sugar',
    'blood pressure',
    'bp',
    'hba1c',
    'a1c',
    'heart rate',
    'pulse',
    'vitals',
    'systolic',
    'diastolic',
    'ग्लूकोज',
    'शुगर',
    'रक्त शर्करा',
    'रक्तचाप',
    'बीपी',
    'पल्स',
    'हृदय गति',
  ];
  if (metricKeywords.some((kw) => query.includes(kw))) {
    return 'METRIC_EXPLANATION';
  }

  // WELLNESS GUIDANCE CHECK
  const wellnessKeywords = [
    'wellness',
    'routine',
    'yoga',
    'pranayama',
    'anulom',
    'vilom',
    'shatapadi',
    'walking',
    'walk',
    'ayurveda',
    'dinacharya',
    'nutrition',
    'diet',
    'sleep',
    'nidra',
    'triphala',
    'vrikshasana',
    'lifestyle',
    'कल्याण',
    'दिनचर्या',
    'योग',
    'प्राणायाम',
    'अनुलोम',
    'शतपदी',
    'आयुर्वेद',
    'आहार',
    'नींद',
    'निद्रा',
  ];
  if (wellnessKeywords.some((kw) => query.includes(kw))) {
    return 'WELLNESS_GUIDANCE';
  }

  // FAMILY CONTEXT CHECK
  const familyKeywords = [
    'family',
    'family circle',
    'access',
    'permission',
    'share',
    'consent',
    'meera',
    'savitri',
    'kavya',
    'rohan',
    'vikram',
    'who can see',
    'records shared',
    'परिवार',
    'पहुँच',
    'अनुमति',
    'साझा',
    'सहमति',
    'मीरा',
    'सावित्री',
  ];
  if (familyKeywords.some((kw) => query.includes(kw))) {
    return 'FAMILY_CONTEXT';
  }

  // GENERAL EDUCATION CHECK
  const educationKeywords = [
    'what is',
    'why is',
    'explain',
    'meaning of',
    'normal range',
    'how to improve',
    'pre-diabetes',
    'hypertension',
    'क्या है',
    'क्यों',
    'अर्थ',
  ];
  if (educationKeywords.some((kw) => query.includes(kw))) {
    return 'GENERAL_HEALTH_EDUCATION';
  }

  return 'UNSUPPORTED_MEDICAL_REQUEST';
}

// 4. Deterministic Simulated Response Generator
export function generateAssistantReply(
  intent: AssistantIntent,
  _query: string,
  profile: DemoUser,
  _language: 'en' | 'hi',
  familyMembers: DemoFamilyMember[],
  reports: DemoLabReport[]
): AssistantMessage {
  const timestamp = 'Just now · Local Client Sandbox';
  const isAarav = profile.id === 'aarav';
  const isMeera = profile.id === 'meera';
  const isSavitri = profile.id === 'savitri';

  // Find latest relevant report
  const latestReport = reports[0] || {
    title: 'Comprehensive Metabolic Panel (CMP)',
    date: '12 Sep 2026',
    facilityName: 'Indore Central Diagnostic Centre',
  };

  switch (intent) {
    case 'EMERGENCY': {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'EMERGENCY',
        isEmergency: true,
        textEn:
          '🚨 EMERGENCY SAFETY NOTICE:\n\nIf you or someone nearby is experiencing chest pain, difficulty breathing, sudden weakness, loss of consciousness, or any acute distress, immediately contact official emergency services directly.\n\n• In India, call 112 or 108 immediately.\n• This SwasthyaAI prototype is an illustrative software demonstration. It does NOT connect to 108/112 dispatch, place phone calls, or route ambulances.',
        textHi:
          '🚨 आपातकालीन सुरक्षा सूचना:\n\nयदि आप या आपके आसपास कोई व्यक्ति सीने में दर्द, सांस लेने में गंभीर कठिनाई, बेहोशी, या तीव्र संकट का सामना कर रहा है, तो कृपया तुरंत आधिकारिक आपातकालीन सेवाओं से संपर्क करें।\n\n• भारत में तुरंत 112 या 108 पर कॉल करें।\n• यह प्रोटोटाइप केवल एक सॉफ्टवेयर सिमुलेशन है। यह वास्तविक 108/112 सेवाओं से जुड़ा नहीं है और न ही एम्बुलेंस डिस्पैच करता है।',
        sourceCard: {
          titleEn: 'Emergency Information Preview',
          titleHi: 'आपातकालीन सूचना पूर्वावलोकन',
          descriptionEn: 'Inspect your rapid-access medical ID, proxy contacts, and documented allergies.',
          descriptionHi: 'अपनी त्वरित-पहुँच मेडिकल आईडी, प्रॉक्सी संपर्क और एलर्जी विवरण देखें।',
          badgeEn: 'Prototype Triage',
          badgeHi: 'प्रोटोटाइप ट्राइएज',
          targetRoute: '/prototype/emergency',
          ctaTextEn: 'Open Emergency Information',
          ctaTextHi: 'आपातकालीन जानकारी खोलें',
        },
      };
    }

    case 'REPORT_EXPLANATION': {
      let explanationEn = '';
      let explanationHi = '';

      if (isAarav) {
        explanationEn =
          `Based on your latest illustrative ${latestReport.title} from ${latestReport.date}:\n\n` +
          `• Fasting Blood Glucose (112 mg/dL) and HbA1c (5.8%) show mild elevation above optimal baseline, representing an illustrative pre-diabetes observational pattern.\n` +
          `• Kidney Filtration (Creatinine 1.0 mg/dL, BUN 14 mg/dL) and Total Cholesterol (185 mg/dL) are situated comfortably within normal reference bounds.\n\n` +
          `In this prototype, these numbers are provided for plain-language educational context rather than diagnosis. We recommend discussing them during your routine medical checkup.`;

        explanationHi =
          `आपकी नवीनतम सांकेतिक ${latestReport.title} (${latestReport.date}) के आधार पर:\n\n` +
          `• फास्टिंग ब्लड ग्लूकोज (112 mg/dL) और HbA1c (5.8%) सामान्य सीमा से हल्के बढ़े हुए हैं, जो सांकेतिक प्रीडायबिटीज पैटर्न दर्शाते हैं।\n` +
          `• किडनी फंक्शन (क्रिएटिनिन 1.0 mg/dL) और कोलेस्ट्रॉल (185 mg/dL) पूरी तरह से सामान्य सीमा में हैं।\n\n` +
          `यह प्रोटोटाइप परिणाम केवल शैक्षिक समझ के लिए है। किसी भी स्वास्थ्य निर्णय से पहले योग्य चिकित्सक से परामर्श लें।`;
      } else if (isMeera) {
        explanationEn =
          `Based on your illustrative Complete Blood Count (CBC) with Differential (10 Aug 2026):\n\n` +
          `• Hemoglobin (14.6 g/dL) is balanced and healthy, supporting optimal tissue oxygen transport.\n` +
          `• Total Leukocytes / WBC (6,800 /mcL) and Platelets (240,000 /mcL) confirm stable immune defenses with no inflammatory indicators.\n\n` +
          `All measured parameters reside within standard non-elevated physiological reference ranges for your demographic group.`;

        explanationHi =
          `आपकी सांकेतिक कम्प्लीट ब्लड काउंट (CBC) रिपोर्ट (10 अगस्त 2026) के आधार पर:\n\n` +
          `• हीमोग्लोबिन (14.6 g/dL) संतुलित और स्वस्थ है, जो शरीर में ऑक्सीजन आपूर्ति को सुचारू रखता है।\n` +
          `• श्वेत रक्त कोशिकाएं (WBC 6,800 /mcL) और प्लेटलेट्स (240,000 /mcL) सामान्य प्रतिरक्षा और स्थिर स्थिति दर्शाते हैं।\n\n` +
          `सभी मापे गए पैरामीटर मानक स्वास्थ्य सीमाओं के भीतर हैं।`;
      } else {
        // Savitri Devi
        explanationEn =
          `Based on your illustrative Glycated Hemoglobin & Renal Screen from Ujjain Care Pathology:\n\n` +
          `• HbA1c is noted at 6.4%, reflecting a mild glycaemic elevation consistent with your documented Type 2 diabetes background.\n` +
          `• Blood Urea and Serum Creatinine indicate stable renal filtration under ongoing hydration discipline.\n\n` +
          `Educational guidance suggests continuing gentle post-meal movement and reviewing seasonal medication adjustments with your attending physician.`;

        explanationHi =
          `उज्जैन केयर पैथोलॉजी की आपकी सांकेतिक ग्लाइकेटेड हीमोग्लोबिन व रीनल रिपोर्ट के आधार पर:\n\n` +
          `• HbA1c 6.4% पर दर्ज है, जो आपके टाइप 2 डायबिटीज इतिहास के अनुसार हल्की वृद्धि दर्शाता है।\n` +
          `• ब्लड यूरिया और सीरम क्रिएटिनिन नियमित जलयोजन के तहत सामान्य किडनी कार्यप्रणाली दर्शाते हैं।\n\n` +
          `शैक्षिक परामर्श के अनुसार भोजन के बाद हल्का टहलना जारी रखें और चिकित्सक के परामर्श से दवा नियमित रखें।`;
      }

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'REPORT_EXPLANATION',
        textEn: explanationEn,
        textHi: explanationHi,
        sourceCard: {
          titleEn: latestReport.title,
          titleHi: 'डायग्नोस्टिक लैब रिपोर्ट AI',
          descriptionEn: `Analyzed from synthetic records (${profile.fullName}, ${profile.city}).`,
          descriptionHi: `सिंथेटिक रिकॉर्ड्स से विश्लेषित (${profile.fullName}, ${profile.city})।`,
          badgeEn: 'Lab Diagnostic Context',
          badgeHi: 'लैब संदर्भ',
          targetRoute: '/prototype/report-analysis',
          ctaTextEn: 'Open Detailed Report',
          ctaTextHi: 'विस्तृत रिपोर्ट खोलें',
          itemsEn: ['Biomarkers evaluated: Fasting Glucose, HbA1c, Creatinine', 'Educational interpretation'],
          itemsHi: ['मूल्यांकित पैरामीटर: फास्टिंग ग्लूकोज, HbA1c, क्रिएटिनिन', 'सांकेतिक शैक्षिक व्याख्या'],
        },
      };
    }

    case 'METRIC_EXPLANATION': {
      let metricTextEn = '';
      let metricTextHi = '';

      if (isAarav) {
        metricTextEn =
          `Here is what your current illustrative vitals show for ${profile.fullName}:\n\n` +
          `• Blood Glucose: 142 mg/dL (Attention · Elevated) recorded this morning at 08:20 AM. While individual spikes can occur after meals, consistent morning fasting numbers above 100 mg/dL merit dietary pacing discussion with your doctor.\n` +
          `• Blood Pressure: 118/78 mmHg (Normal · Stable) situated in the optimal healthy range.\n` +
          `• Resting Heart Rate: 72 bpm (Normal · Stable resting sinus rhythm).\n` +
          `• Sleep: 7h 20m last night with 1h 45m deep sleep restorative architecture.`;

        metricTextHi =
          `${profile.fullName} के वर्तमान सांकेतिक वाइटल्स का विवरण:\n\n` +
          `• ब्लड ग्लूकोज: 142 mg/dL (ध्यान दें · बढ़ा हुआ) आज सुबह 08:20 पर दर्ज किया गया। यह संख्या आहार और कार्बोहाइड्रेट संतुलन पर ध्यान देने का सुझाव देती है।\n` +
          `• रक्तचाप (BP): 118/78 mmHg (सामान्य · स्थिर) इष्टतम स्वस्थ सीमा में है।\n` +
          `• हृदय गति: 72 bpm (सामान्य · स्थिर)।\n` +
          `• नींद: पिछली रात 7 घंटे 20 मिनट की अच्छी नींद।`;
      } else if (isMeera) {
        metricTextEn =
          `Here is what the current illustrative vitals show for ${profile.fullName}:\n\n` +
          `• Blood Pressure: 114/74 mmHg (Optimal · Healthy systolic/diastolic baseline).\n` +
          `• Blood Glucose: 92 mg/dL (Normal · Healthy fasting balance).\n` +
          `• Resting Heart Rate: 68 bpm (Optimal cardiovascular recovery tone).\n` +
          `• Sleep: 7h 45m continuous rest.`;

        metricTextHi =
          `${profile.fullName} के वर्तमान सांकेतिक वाइटल्स का विवरण:\n\n` +
          `• रक्तचाप: 114/74 mmHg (इष्टतम स्वस्थ सीमा)।\n` +
          `• ब्लड ग्लूकोज: 92 mg/dL (सामान्य संतुलित स्तर)।\n` +
          `• हृदय गति: 68 bpm (उत्तम कार्डियोवास्कुलर रिकवरी)।\n` +
          `• नींद: 7 घंटे 45 मिनट का संतुलित विश्राम।`;
      } else {
        // Savitri Devi
        metricTextEn =
          `Here is what the current illustrative vitals show for ${profile.fullName} (64 yrs, Ujjain):\n\n` +
          `• Blood Pressure: 138/88 mmHg (Attention · Mild elevation). Correlates with documented essential hypertension; continuing regular morning monitoring is recommended.\n` +
          `• Fasting Blood Glucose: 134 mg/dL (Attention · Stable with daily Metformin routine).\n` +
          `• Resting Heart Rate: 76 bpm (Normal range for age profile).`;

        metricTextHi =
          `${profile.fullName} (64 वर्ष, उज्जैन) के वर्तमान सांकेतिक वाइटल्स का विवरण:\n\n` +
          `• रक्तचाप: 138/88 mmHg (ध्यान दें · हल्का बढ़ा हुआ)। यह आपके उच्च रक्तचाप इतिहास से संबंधित है; नियमित सुबह की निगरानी अनुशंसित है।\n` +
          `• ब्लड ग्लूकोज: 134 mg/dL (ध्यान दें · दैनिक मेटफॉर्मिन रूटीन के साथ स्थिर)।\n` +
          `• हृदय गति: 76 bpm (उम्र के अनुसार सामान्य सीमा)।`;
      }

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'METRIC_EXPLANATION',
        textEn: metricTextEn,
        textHi: metricTextHi,
        highlightedMetrics: [
          {
            labelEn: 'Blood Glucose',
            labelHi: 'ब्लड ग्लूकोज',
            value: isAarav ? '142' : isMeera ? '92' : '134',
            unit: 'mg/dL',
            status: isMeera ? 'normal' : 'warning',
          },
          {
            labelEn: 'Blood Pressure',
            labelHi: 'रक्तचाप',
            value: isAarav ? '118/78' : isMeera ? '114/74' : '138/88',
            unit: 'mmHg',
            status: isSavitri ? 'warning' : 'normal',
          },
        ],
        sourceCard: {
          titleEn: 'Health Metrics & Longitudinal Graphs',
          titleHi: 'स्वास्थ्य मेट्रिक्स एवं रुझान',
          descriptionEn: 'View interactive 7, 30, and 90-day timeframes with statistical checkpoints.',
          descriptionHi: 'इंटरैक्टिव 7, 30 और 90 दिनों के रुझान ग्राफ देखें।',
          badgeEn: 'Vitals Context',
          badgeHi: 'वाइटल्स संदर्भ',
          targetRoute: '/prototype/health-intelligence',
          ctaTextEn: 'View Health Intelligence',
          ctaTextHi: 'स्वास्थ्य रुझान देखें',
        },
      };
    }

    case 'HEALTH_SUMMARY': {
      const activeMedCount = isAarav ? 2 : isMeera ? 0 : 2;
      const allergiesText = profile.allergies.join(', ');

      const summaryEn =
        `Health Summary for ${profile.fullName} (${profile.age} yrs · ${profile.gender} · ${profile.city}, MP):\n\n` +
        `1. Health Snapshot:\n` +
        `   • Documented Allergies: ${allergiesText}\n` +
        `   • Active Prescription Routines: ${activeMedCount > 0 ? (isAarav ? 'Metformin 500mg, Atorvastatin 10mg' : 'Amlodipine 5mg, Metformin 500mg') : 'None reported (daily multivitamin)'}\n` +
        `   • Baseline Vitals: BP ${isAarav ? '118/78' : isMeera ? '114/74' : '138/88'} mmHg · Glucose ${isAarav ? '142' : isMeera ? '92' : '134'} mg/dL\n\n` +
        `2. Recent Illustrative Lab Reports:\n` +
        `   • Latest: ${latestReport.title} (${latestReport.date}). Results categorized as non-critical with educational follow-up notes.\n\n` +
        `3. Wellness & Habits:\n` +
        `   • Integrative Dinacharya routine: Anulom Vilom Pranayama, Post-Meal Shatapadi walking, and carbohydrate pacing.\n\n` +
        `4. Family Care Circle:\n` +
        `   • ${familyMembers.length} multi-generational connections in Indore & Ujjain. Medical access remains strictly permission-scoped.\n\n` +
        `Educational Prototype Boundary: This summary reflects synthetic demo records. Consult a registered medical practitioner for clinical assessment.`;

      const summaryHi =
        `${profile.fullName} (${profile.age} वर्ष · ${profile.gender} · ${profile.city}, म.प्र.) का स्वास्थ्य सारांश:\n\n` +
        `1. स्वास्थ्य स्थिति:\n` +
        `   • दर्ज एलर्जी: ${allergiesText}\n` +
        `   • सक्रिय दवाइयाँ: ${activeMedCount > 0 ? (isAarav ? 'मेटफॉर्मिन 500mg, एटोरवास्टेटिन 10mg' : 'एम्लोडिपिन 5mg, मेटफॉर्मिन 500mg') : 'कोई नहीं (दैनिक मल्टीविटामिन)'}\n` +
        `   • मुख्य वाइटल्स: BP ${isAarav ? '118/78' : isMeera ? '114/74' : '138/88'} mmHg · ग्लूकोज ${isAarav ? '142' : isMeera ? '92' : '134'} mg/dL\n\n` +
        `2. हालिया सांकेतिक लैब रिपोर्ट्स:\n` +
        `   • नवीनतम: ${latestReport.title} (${latestReport.date})।\n\n` +
        `3. कल्याण एवं दिनचर्या:\n` +
        `   • अनुलोम विलोम प्राणायाम, भोजनोपरांत शतपदी चलना और संतुलित आहार।\n\n` +
        `4. पारिवारिक स्वास्थ्य चक्र:\n` +
        `   • इंदौर और उज्जैन में ${familyMembers.length} पारिवारिक संबंध जुड़े हैं, जिनकी मेडिकल पहुँच अलग से प्रबंधित है।\n\n` +
        `सांकेतिक प्रोटोटाइप सीमा: यह सारांश डेमो डेटा पर आधारित है। व्यक्तिगत सलाह के लिए अपने चिकित्सक से संपर्क करें।`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'HEALTH_SUMMARY',
        textEn: summaryEn,
        textHi: summaryHi,
        sourceCard: {
          titleEn: 'Comprehensive Patient Overview',
          titleHi: 'समग्र रोगी अवलोकन',
          descriptionEn: 'Aggregated snapshot spanning lab reports, vitals, active medications, and family circles.',
          descriptionHi: 'लैब रिपोर्ट, वाइटल्स, सक्रिय दवाइयों और पारिवारिक नेटवर्क का एकीकृत सारांश।',
          badgeEn: 'Full Overview',
          badgeHi: 'पूर्ण अवलोकन',
          targetRoute: '/prototype',
          ctaTextEn: 'Go to Overview Dashboard',
          ctaTextHi: 'अवलोकन डैशबोर्ड पर जाएं',
        },
      };
    }

    case 'TREND_SUMMARY': {
      const trendTextEn =
        `Here is an analysis of your illustrative 30-day health trends:\n\n` +
        `• Fasting Glucose Trend: Across 8 recorded checkpoints in the past 30 days, your average fasting reading was 144 mg/dL (Peak: 152 mg/dL on 26 Aug; Lowest: 139 mg/dL on 20 Sep).\n` +
        `• Observed Direction: Steady pacing trend. Minor elevations correlate with documented festive carbohydrate intake on 10 Sep, followed by stabilizing levels after resumption of evening Shatapadi walking.\n` +
        `• Blood Pressure Continuity: Remained tightly clustered between 116/76 mmHg and 122/82 mmHg, showing stable autonomic cardiovascular regulation.\n\n` +
        `Educational Insight: Lifestyle pacing (evening walks and carbohydrate discipline) shows positive correlation with stabilized morning fasting readings.`;

      const trendTextHi =
        `आपके 30 दिनों के सांकेतिक स्वास्थ्य रुझानों का विश्लेषण:\n\n` +
        `• फास्टिंग ग्लूकोज रुझान: पिछले 30 दिनों में 8 जांचों में आपका औसत ग्लूकोज 144 mg/dL रहा (अधिकतम: 152 mg/dL, न्यूनतम: 139 mg/dL)।\n` +
        `• दर्ज दिशा: स्थिर स्थिति। 10 सितंबर को त्योहार के बाद हल्की वृद्धि देखी गई, जो शाम की शतपदी वॉक के बाद पुनः स्थिर हो गई।\n` +
        `• रक्तचाप (BP): 116/76 से 122/82 mmHg के बीच पूरी तरह संतुलित रहा।\n\n` +
        `शैक्षिक निष्कर्ष: नियमित शाम का टहलना और संतुलित खानपान सुबह के ग्लूकोज स्तर को स्थिर रखने में मददगार साबित हो रहा है।`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'TREND_SUMMARY',
        textEn: trendTextEn,
        textHi: trendTextHi,
        sourceCard: {
          titleEn: '30-Day Health Intelligence Graphs',
          titleHi: '30-दिवसीय स्वास्थ्य रुझान ग्राफ',
          descriptionEn: 'Explore visual SVG curve trajectories, minimums, maximums, and lifestyle event markers.',
          descriptionHi: 'न्यूनतम, अधिकतम और जीवनशैली आयोजनों के साथ विज़ुअल ग्राफ का अन्वेषण करें।',
          badgeEn: 'Longitudinal View',
          badgeHi: 'दीर्घकालिक दृष्टिकोण',
          targetRoute: '/prototype/health-intelligence',
          ctaTextEn: 'Explore Health Intelligence',
          ctaTextHi: 'स्वास्थ्य रुझान खोलें',
        },
      };
    }

    case 'WELLNESS_GUIDANCE': {
      const wellnessTextEn =
        `Your personalized Dinacharya & Integrative Indian Wellness routine includes:\n\n` +
        `1. Anulom Vilom (Alternate Nostril Pranayama):\n` +
        `   • Timing: 10 minutes before morning breakfast.\n` +
        `   • Purpose: Autonomic nervous system balance and calm parasympathetic focus.\n` +
        `   • Safety note: Sit upright comfortably without straining breath.\n\n` +
        `2. Post-Meal Shatapadi (100 Steps Walking):\n` +
        `   • Timing: 15 minutes leisurely walk after dinner.\n` +
        `   • Purpose: Promotes gastric motility and tempers postprandial glucose surges.\n` +
        `   • Safety note: Maintain gentle pacing; avoid vigorous exercise right after eating.\n\n` +
        `3. Nidra & Sleep Hygiene:\n` +
        `   • Dimming blue screens 45 minutes prior to bedtime and optional warm turmeric milk.\n\n` +
        `Educational Guidance: Ayurvedic practices support daily wellness pacing but are not designed as solitary curative treatments for diagnosed clinical conditions.`;

      const wellnessTextHi =
        `आपकी व्यक्तिगत दिनचर्या एवं एकीकृत भारतीय कल्याण योजना में शामिल हैं:\n\n` +
        `1. अनुलोम विलोम प्राणायाम:\n` +
        `   • समय: सुबह नाश्ते से पहले 10 मिनट।\n` +
        `   • उद्देश्य: तंत्रिका तंत्र में शांति और मानसिक एकाग्रता।\n` +
        `   • सुरक्षा नियम: आरामदायक मुद्रा में बैठें, सांस पर जोर न दें।\n\n` +
        `2. भोजनोपरांत शतपदी (100 कदम चलना):\n` +
        `   • समय: रात के भोजन के बाद 15 मिनट की धीमी सैर।\n` +
        `   • उद्देश्य: पाचन क्रिया को सुगम बनाना और भोजन के बाद शुगर स्पाइक को नियंत्रित रखना।\n` +
        `   • सुरक्षा नियम: गति धीमी रखें; भोजन के तुरंत बाद तेज व्यायाम न करें।\n\n` +
        `3. निद्रा अनुशासन:\n` +
        `   • सोने से 45 मिनट पहले स्क्रीन बंद करना और हल्का गुनगुना दूध।\n\n` +
        `शैक्षिक सूचना: आयुर्वेदिक आदतें जीवनशैली संवर्धन के लिए हैं, ये किसी बीमारी का चिकित्सीय उपचार नहीं हैं।`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'WELLNESS_GUIDANCE',
        textEn: wellnessTextEn,
        textHi: wellnessTextHi,
        sourceCard: {
          titleEn: 'Wellness & Daily Dinacharya Modules',
          titleHi: 'कल्याण एवं दैनिक दिनचर्या',
          descriptionEn: 'Access therapeutic yoga postures, Ayurvedic Agni guidelines, and habit tracking.',
          descriptionHi: 'उपचारात्मक योगासन, आयुर्वेदिक अग्नि नियम और आदत ट्रैकिंग तक पहुंचें।',
          badgeEn: 'Ayurveda & Yoga',
          badgeHi: 'आयुर्वेद व योग',
          targetRoute: '/prototype/wellness',
          ctaTextEn: 'Open Wellness Module',
          ctaTextHi: 'कल्याण मॉड्यूल खोलें',
        },
      };
    }

    case 'FAMILY_CONTEXT': {
      const consentedMembers = familyMembers.filter(
        (m) => m.medicalAccessState !== 'Not shared'
      );

      const familyTextEn =
        `Here is how your Family Health Circle and diagnostic privacy scopes are currently organized:\n\n` +
        `• Core Architectural Principle: Family Relationship ≠ Medical Data Access. Kinship connection does not automatically grant diagnostic visibility.\n` +
        `• Total Family Members: ${familyMembers.length} members connected in Indore & Ujjain.\n` +
        `• Active Consented Scopes: ${consentedMembers.length} members currently hold designated medical visibility:\n` +
        consentedMembers
          .map((m) => `   - ${m.name} (${m.relationship}): ${m.medicalAccessState} — Scopes: ${m.sharedScopes.join(', ')}`)
          .join('\n') +
        `\n\nYou can independently grant, modify scopes for, or immediately revoke access from any member on demand.`;

      const familyTextHi =
        `आपके पारिवारिक स्वास्थ्य चक्र और डेटा गोपनीयता अनुमतियों का विवरण:\n\n` +
        `• मुख्य वास्तुशिल्प सिद्धांत: पारिवारिक संबंध ≠ मेडिकल डेटा एक्सेस। परिवार का सदस्य होने का अर्थ स्वचालित मेडिकल डेटा साझाकरण नहीं है।\n` +
        `• कुल पारिवारिक सदस्य: ${familyMembers.length} सदस्य (इंदौर और उज्जैन)।\n` +
        `• सक्रिय अनुमतियां: ${consentedMembers.length} सदस्यों के पास वर्तमान में सहमति-आधारित पहुँच है:\n` +
        consentedMembers
          .map((m) => `   - ${m.name} (${m.relationship}): ${m.medicalAccessState} — अनुमतियाँ: ${m.sharedScopes.join(', ')}`)
          .join('\n') +
        `\n\nआप किसी भी सदस्य की अनुमति को कभी भी संशोधित या तुरंत निरस्त (Revoke) कर सकते हैं।`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'FAMILY_CONTEXT',
        textEn: familyTextEn,
        textHi: familyTextHi,
        sourceCard: {
          titleEn: 'Family Health Circles & Access Control',
          titleHi: 'पारिवारिक स्वास्थ्य एवं पहुँच नियंत्रण',
          descriptionEn: 'Manage granular permission scopes (Reports, Vitals, Medications) and set expiration durations.',
          descriptionHi: 'विशिष्ट अनुमतियाँ (रिपोर्ट्स, वाइटल्स, दवाइयाँ) प्रबंधित करें और समय सीमा निर्धारित करें।',
          badgeEn: 'Consent Governance',
          badgeHi: 'सहमति प्रबंधन',
          targetRoute: '/prototype/family',
          ctaTextEn: 'Manage Family Access',
          ctaTextHi: 'पारिवारिक अनुमतियाँ प्रबंधित करें',
        },
      };
    }

    case 'GENERAL_HEALTH_EDUCATION': {
      const educationTextEn =
        `Health Education Insight regarding your question:\n\n` +
        `• Understanding Biomarker Reference Ranges: Laboratory cutoffs represent statistical standard bounds established across healthy population samples. Being slightly outside a range is an observational indicator for your doctor to evaluate, rather than a definitive diagnosis on its own.\n` +
        `• Glycaemic Regulation: Fasting blood glucose measures circulating sugar after 8–10 hours without food. HbA1c measures the percentage of hemoglobin bound to glucose over approximately 90 days, offering a smoother long-term snapshot.\n` +
        `• Lifestyle Pacing: Consistent moderate walking and consistent sleep rhythms have well-documented correlations with metabolic equilibrium.\n\n` +
        `Discuss any questions about your lab parameters with your qualified healthcare provider.`;

      const educationTextHi =
        `आपके प्रश्न से संबंधित स्वास्थ्य शिक्षा जानकारी:\n\n` +
        `• बायोमार्कर संदर्भ सीमाएं समझना: प्रयोगशाला संदर्भ सीमाएं स्वस्थ आबादी के सांख्यिकीय मानकों पर आधारित होती हैं। किसी मान का सीमा से थोड़ा बाहर होना केवल एक अवलोकन है, जिसे चिकित्सक की सलाह से समझा जाना चाहिए।\n` +
        `• ग्लूकोज नियमन: फास्टिंग ब्लड ग्लूकोज 8-10 घंटे बिना भोजन के रक्त में शर्करा का स्तर मापता है। जबकि HbA1c पिछले लगभग 90 दिनों का औसत ग्लाइसेमिक स्तर दर्शाता है।\n` +
        `• जीवनशैली: प्रतिदिन नियमित टहलना और समय पर सोना मेटाबॉलिक संतुलन बनाए रखने में सहायक होता है।\n\n` +
        `अपने विशिष्ट स्वास्थ्य मापदंडों के बारे में हमेशा योग्य चिकित्सक से चर्चा करें।`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'GENERAL_HEALTH_EDUCATION',
        textEn: educationTextEn,
        textHi: educationTextHi,
        sourceCard: {
          titleEn: 'Educational Prototype Knowledgebase',
          titleHi: 'शैक्षिक प्रोटोटाइप ज्ञानकोष',
          descriptionEn: 'Plain-language healthcare explanations designed around human understanding.',
          descriptionHi: 'मानवीय समझ के अनुरूप तैयार की गई सरल स्वास्थ्य व्याख्याएं।',
          badgeEn: 'Health Literacy',
          badgeHi: 'स्वास्थ्य साक्षरता',
          targetRoute: '/prototype/report-analysis',
          ctaTextEn: 'View Diagnostic Explanations',
          ctaTextHi: 'डायग्नोस्टिक व्याख्या देखें',
        },
      };
    }

    case 'UNSUPPORTED_MEDICAL_REQUEST':
    default: {
      const fallbackEn =
        `I can explain the illustrative health information available in this prototype, but I don't have enough specific demo records to answer that question reliably.\n\n` +
        `Here are some topics you can explore with me:\n` +
        `• "Explain my latest report" — Plain-language biomarker breakdown\n` +
        `• "What do my recent glucose readings show?" — Current vitals and context\n` +
        `• "Give me a simple health summary" — Unified patient snapshot\n` +
        `• "What wellness activities are in my routine?" — Dinacharya and yoga\n` +
        `• "Who has access to my health records?" — Family privacy scopes\n\n` +
        `Reminder: This prototype does not provide medical diagnosis, write prescriptions, or replace consultation with a qualified doctor.`;

      const fallbackHi =
        `मैं इस प्रोटोटाइप में उपलब्ध सांकेतिक स्वास्थ्य जानकारी की व्याख्या कर सकता हूँ, लेकिन इस विशिष्ट प्रश्न का विश्वसनीय उत्तर देने के लिए पर्याप्त डेमो डेटा उपलब्ध नहीं है।\n\n` +
        `आप मुझसे इन विषयों पर पूछ सकते हैं:\n` +
        `• "मेरी नवीनतम रिपोर्ट समझाइए" — सरल भाषा में बायोमार्कर विवरण\n` +
        `• "मेरे हालिया ग्लूकोज पाठ्यांक क्या दर्शाते हैं?" — वर्तमान वाइटल्स\n` +
        `• "मुझे एक सरल स्वास्थ्य सारांश दीजिए" — संपूर्ण स्वास्थ्य स्थिति\n` +
        `• "मेरी दिनचर्या में कौन-सी गतिविधियाँ हैं?" — योग और दिनचर्या\n` +
        `• "मेरे स्वास्थ्य रिकॉर्ड्स तक किसकी पहुँच है?" — पारिवारिक अनुमतियाँ\n\n` +
        `याद रखें: यह प्रोटोटाइप चिकित्सा निदान या दवा का पर्चा प्रदान नहीं करता है।`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        intent: 'UNSUPPORTED_MEDICAL_REQUEST',
        textEn: fallbackEn,
        textHi: fallbackHi,
      };
    }
  }
}
