import type {
  DemoUser,
  DemoFamilyMember,
  DemoLabReport,
  DemoHealthMetric,
  DemoNotification,
  DemoWellnessRecommendation,
  DemoEmergencyProfile,
  MetricTimelineData,
} from './types';

/**
 * FICTIONAL DEMO DATA SET — PHASE 2
 * Strictly for illustrative software prototype demonstration.
 * Names, labs, metrics, and profiles are synthetic constructs for Indore & Ujjain pilot study.
 */

// Available Switchable Profiles
export const demoProfiles: Record<string, DemoUser> = {
  aarav: {
    id: 'aarav',
    fullName: 'Aarav Sharma',
    age: 38,
    gender: 'Male',
    city: 'Indore',
    state: 'Madhya Pradesh',
    bloodGroup: 'B+',
    allergies: ['Penicillin (Simulated Allergy)'],
    preferredLanguage: 'en',
    avatarInitials: 'AS',
  },
  meera: {
    id: 'meera',
    fullName: 'Meera Sharma',
    age: 35,
    gender: 'Female',
    city: 'Indore',
    state: 'Madhya Pradesh',
    bloodGroup: 'O+',
    allergies: ['Dust / Seasonal Pollen (Mild)'],
    preferredLanguage: 'en',
    avatarInitials: 'MS',
  },
  savitri: {
    id: 'savitri',
    fullName: 'Savitri Devi',
    age: 64,
    gender: 'Female',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    bloodGroup: 'A+',
    allergies: ['Sulfonamides (Documented)'],
    preferredLanguage: 'hi',
    avatarInitials: 'SD',
  },
};

export const demoUser: DemoUser = demoProfiles.aarav;

// 5 Family Members (Explicit UX distinction: Family Relationship ≠ Medical Access State)
export const initialDemoFamilyMembers: DemoFamilyMember[] = [
  {
    id: 'fam_meera',
    name: 'Meera Sharma',
    relationship: 'Spouse',
    age: 35,
    avatarInitials: 'MS',
    medicalAccessState: 'Shared (Full)',
    accessRole: 'Shared (Full)',
    sharedScopes: ['Reports', 'Lab Results', 'Health Metrics', 'Medications'],
    accessDurationDays: 365,
    chronicConditions: ['None reported'],
    lastUpdated: '12 Sep 2026',
  },
  {
    id: 'fam_savitri',
    name: 'Savitri Devi',
    relationship: 'Mother',
    age: 64,
    avatarInitials: 'SD',
    medicalAccessState: 'Shared (Limited)',
    accessRole: 'Shared (Limited)',
    sharedScopes: ['Health Metrics', 'Medications'],
    accessDurationDays: 90,
    chronicConditions: ['Hypertension (Simulated)', 'Type 2 Diabetes (Mild)'],
    lastUpdated: 'Yesterday',
  },
  {
    id: 'fam_kavya',
    name: 'Kavya Sharma',
    relationship: 'Daughter',
    age: 14,
    avatarInitials: 'KS',
    medicalAccessState: 'Shared (Full)',
    accessRole: 'Shared (Full)',
    sharedScopes: ['Reports', 'Medications'],
    accessDurationDays: 365,
    chronicConditions: ['Asthma (Mild, seasonal)'],
    lastUpdated: '01 Sep 2026',
  },
  {
    id: 'fam_rohan',
    name: 'Rohan Sharma',
    relationship: 'Son',
    age: 9,
    avatarInitials: 'RS',
    medicalAccessState: 'Shared (Full)',
    accessRole: 'Shared (Full)',
    sharedScopes: ['Reports', 'Medications'],
    accessDurationDays: 365,
    chronicConditions: ['Seasonal Bronchitis (Mild)'],
    lastUpdated: '15 Aug 2026',
  },
  {
    id: 'fam_brother',
    name: 'Vikram Sharma',
    relationship: 'Father',
    age: 68,
    avatarInitials: 'VS',
    medicalAccessState: 'Not shared',
    accessRole: 'Not shared',
    sharedScopes: [],
    accessDurationDays: 30,
    chronicConditions: ['Osteoarthritis'],
    lastUpdated: 'Inactive',
  },
];

// Preserved backwards-compatibility reference
export const demoFamilyMembers: DemoFamilyMember[] = initialDemoFamilyMembers;

// 3 Selectable Sample Illustrative Lab Reports
export const demoLabReports: DemoLabReport[] = [
  {
    id: 'rep_001',
    title: 'Comprehensive Metabolic Panel (CMP)',
    testType: 'Blood Chemistry',
    date: '12 Sep 2026',
    facilityName: 'Indore Central Laboratory (Simulated)',
    clinicalStatus: 'attention',
    summaryEn:
      'Overall metabolic profile is generally functional. Fasting plasma glucose and HbA1c exhibit mild elevations indicating an illustrative pre-diabetes evaluation pattern.',
    summary:
      'Overall metabolic profile is generally functional. Fasting plasma glucose and HbA1c exhibit mild elevations indicating an illustrative pre-diabetes evaluation pattern.',
    summaryHi:
      'समग्र चयापचय प्रोफाइल सामान्यतः ठीक है। फास्टिंग प्लाज्मा ग्लूकोज और HbA1c में थोड़ा अधिक स्तर दर्ज है, जिस पर चिकित्सक से परामर्श की आवश्यकता है।',
    keyFindings: [
      {
        parameter: 'Fasting Blood Glucose',
        value: '112',
        unit: 'mg/dL',
        standardRange: '70 - 99 mg/dL',
        status: 'warning',
        explanationEn: 'Mildly elevated above standard fasting cutoff. Suggests careful carbohydrate pacing.',
        explanationHi: 'सामान्य सीमा (70-99) से थोड़ा अधिक। संतुलित आहार पर ध्यान दें।',
      },
      {
        parameter: 'Glycated Hemoglobin (HbA1c)',
        value: '5.8',
        unit: '%',
        standardRange: '< 5.7%',
        status: 'warning',
        explanationEn: 'Reflects 3-month average glucose. Located in early pre-diabetes observational zone.',
        explanationHi: 'पिछले 3 महीनों का औसत शर्करा स्तर दर्शाता है। प्रारंभिक निगरानी आवश्यक है।',
      },
      {
        parameter: 'Serum Creatinine',
        value: '0.9',
        unit: 'mg/dL',
        standardRange: '0.7 - 1.3 mg/dL',
        status: 'normal',
        explanationEn: 'Healthy kidney filtration marker within standard expected limits.',
        explanationHi: 'गुर्दे की कार्यप्रणाली सामान्य सीमा के भीतर पूरी तरह स्वस्थ है।',
      },
      {
        parameter: 'Blood Urea Nitrogen (BUN)',
        value: '14',
        unit: 'mg/dL',
        standardRange: '7 - 20 mg/dL',
        status: 'normal',
        explanationEn: 'Protein metabolism and renal waste clearance operating normally.',
        explanationHi: 'प्रोटीन अपशिष्ट निष्कासन सामान्य दर पर कार्यरत है।',
      },
    ],
    aiInsightsEn: [
      'Fasting glucose of 112 mg/dL correlates with HbA1c of 5.8%.',
      'Kidney markers (Creatinine & BUN) demonstrate stable filtration.',
      'Suggested clinical discussion regarding regular morning walking and moderating refined sugar intake.',
    ],
    aiInsights: [
      'Fasting glucose of 112 mg/dL correlates with HbA1c of 5.8%.',
      'Kidney markers (Creatinine & BUN) demonstrate stable filtration.',
      'Suggested clinical discussion regarding regular morning walking and moderating refined sugar intake.',
    ],
    aiInsightsHi: [
      '112 mg/dL का फास्टिंग ग्लूकोज 5.8% HbA1c के साथ जुड़ा हुआ है।',
      'गुर्दे के दोनों प्रमुख परीक्षण (क्रिएटिनिन और बीयूएन) सामान्य हैं।',
      'अपने डॉक्टर से सुबह की सैर और मीठे के संयम पर चर्चा करने का सुझाव है।',
    ],
  },
  {
    id: 'rep_002',
    title: 'Complete Blood Count (CBC) with Differential',
    testType: 'Hematology',
    date: '10 Aug 2026',
    facilityName: 'Ujjain Care Pathology (Simulated)',
    clinicalStatus: 'normal',
    summaryEn:
      'Hemoglobin, platelet volume, and leukocyte differentials are balanced within standard physiological limits.',
    summary:
      'Hemoglobin, platelet volume, and leukocyte differentials are balanced within standard physiological limits.',
    summaryHi:
      'हीमोग्लोबिन, प्लेटलेट्स और श्वेत रक्त कोशिकाएं मानक स्वस्थ सीमाओं के भीतर हैं।',
    keyFindings: [
      {
        parameter: 'Hemoglobin',
        value: '14.6',
        unit: 'g/dL',
        standardRange: '13.8 - 17.2 g/dL',
        status: 'normal',
        explanationEn: 'Healthy red blood cell count ensuring good oxygen transport across tissues.',
        explanationHi: 'रक्त में ऑक्सीजन संचरण के लिए स्वस्थ हीमोग्लोबिन का स्तर।',
      },
      {
        parameter: 'Total Leukocyte Count (WBC)',
        value: '6,800',
        unit: '/mcL',
        standardRange: '4,500 - 11,000 /mcL',
        status: 'normal',
        explanationEn: 'White cell distribution demonstrates calm immune response without acute infection.',
        explanationHi: 'रोग प्रतिरोधक श्वेत कोशिकाएं सामान्य और संतुलित हैं।',
      },
      {
        parameter: 'Platelet Count',
        value: '240,000',
        unit: '/mcL',
        standardRange: '150,000 - 450,000 /mcL',
        status: 'normal',
        explanationEn: 'Optimal blood clotting potential within robust clinical parameters.',
        explanationHi: 'रक्त का थक्का जमाने वाली प्लेटलेट्स सामान्य सीमा में हैं।',
      },
    ],
    aiInsightsEn: [
      'Robust immunocompetence and absence of inflammatory spikes.',
      'Normal red blood cell volume.',
    ],
    aiInsights: [
      'Robust immunocompetence and absence of inflammatory spikes.',
      'Normal red blood cell volume.',
    ],
    aiInsightsHi: [
      'शरीर की रोग प्रतिरोधक क्षमता स्वस्थ अवस्था में है।',
      'रक्त कोशिकाओं का संतुलन उत्तम है।',
    ],
  },
  {
    id: 'rep_003',
    title: 'Lipid Cardiovascular Profile',
    testType: 'Cardiovascular Chemistry',
    date: '15 Jun 2026',
    facilityName: 'Indore Heart Diagnostic Labs (Simulated)',
    clinicalStatus: 'attention',
    summaryEn:
      'Total cholesterol is well regulated, but serum triglycerides show mild elevation typical of refined carbohydrate intake.',
    summary:
      'Total cholesterol is well regulated, but serum triglycerides show mild elevation typical of refined carbohydrate intake.',
    summaryHi:
      'कोलेस्ट्रॉल का स्तर संतुलित है, लेकिन ट्राइग्लिसराइड्स में थोड़ी वृद्धि देखी गई है।',
    keyFindings: [
      {
        parameter: 'Total Cholesterol',
        value: '188',
        unit: 'mg/dL',
        standardRange: '< 200 mg/dL',
        status: 'normal',
        explanationEn: 'Within acceptable baseline boundaries for cardiovascular health.',
        explanationHi: 'हृदय स्वास्थ्य के लिए कुल कोलेस्ट्रॉल सामान्य सीमा में है।',
      },
      {
        parameter: 'Serum Triglycerides',
        value: '172',
        unit: 'mg/dL',
        standardRange: '< 150 mg/dL',
        status: 'warning',
        explanationEn: 'Mildly elevated. Often responds favorably to physical activity and evening meal moderation.',
        explanationHi: 'हल्का सा बढ़ा हुआ। दैनिक व्यायाम और रात्रि भोजन में चिकनाई कम करने से लाभ संभव।',
      },
      {
        parameter: 'HDL (Protective Cholesterol)',
        value: '48',
        unit: 'mg/dL',
        standardRange: '> 40 mg/dL',
        status: 'normal',
        explanationEn: 'Satisfactory protective lipid concentration.',
        explanationHi: 'सुरक्षात्मक एचडीएल स्तर संतोषजनक सीमा में है।',
      },
    ],
    aiInsightsEn: [
      'Cardiovascular baseline is generally favorable.',
      'Triglycerides indicate potential benefit from aerobic movement such as brisk walking.',
    ],
    aiInsights: [
      'Cardiovascular baseline is generally favorable.',
      'Triglycerides indicate potential benefit from aerobic movement such as brisk walking.',
    ],
    aiInsightsHi: [
      'कार्डियोवैस्कुलर स्वास्थ्य कुल मिलाकर अच्छा है।',
      'रोजाना तेज कदमों से टहलना ट्राइग्लिसराइड्स को नियंत्रित करने में सहायक हो सकता है।',
    ],
  },
];

// Snapshot Metrics for Dashboard
export const demoHealthMetrics: DemoHealthMetric[] = [
  {
    id: 'met_bp',
    label: 'Blood Pressure',
    labelHi: 'रक्तचाप (BP)',
    value: '122 / 80',
    unit: 'mmHg',
    status: 'normal',
    recordedAt: 'Today · 08:30 AM',
    trend: 'stable',
    contextNote: 'Optimal resting physiological reading in Indore.',
  },
  {
    id: 'met_glucose',
    label: 'Fasting Blood Glucose',
    labelHi: 'फास्टिंग ग्लूकोज',
    value: '108',
    unit: 'mg/dL',
    status: 'warning',
    recordedAt: 'Today · 07:15 AM',
    trend: 'improving',
    contextNote: 'Down from 114 mg/dL last week; progressing steadily.',
  },
  {
    id: 'met_heart',
    label: 'Resting Heart Rate',
    labelHi: 'हृदय गति (Heart Rate)',
    value: '72',
    unit: 'bpm',
    status: 'normal',
    recordedAt: 'Today · 08:30 AM',
    trend: 'stable',
    contextNote: 'Healthy sinus rhythm at rest.',
  },
  {
    id: 'met_spo2',
    label: 'Oxygen Saturation (SpO2)',
    labelHi: 'ऑक्सीजन स्तर (SpO2)',
    value: '98',
    unit: '%',
    status: 'normal',
    recordedAt: 'Today · 08:32 AM',
    trend: 'stable',
    contextNote: 'Normal room-air oxygenation.',
  },
];

// Timeframe Data for Health Intelligence (7d, 30d, 90d)
export const metricTimelineDataMap: Record<string, MetricTimelineData> = {
  glucose: {
    metricId: 'glucose',
    title: 'Fasting Blood Glucose',
    unit: 'mg/dL',
    normalRange: '70 - 99 mg/dL',
    points7d: [
      { label: 'Mon', value: 114, date: '18 Sep', status: 'warning' },
      { label: 'Tue', value: 112, date: '19 Sep', status: 'warning' },
      { label: 'Wed', value: 110, date: '20 Sep', status: 'warning' },
      { label: 'Thu', value: 111, date: '21 Sep', status: 'warning' },
      { label: 'Fri', value: 109, date: '22 Sep', status: 'warning' },
      { label: 'Sat', value: 107, date: '23 Sep', status: 'warning' },
      { label: 'Sun', value: 108, date: '24 Sep', status: 'warning', note: 'Recent reading' },
    ],
    points30d: [
      { label: 'W1', value: 118, date: '01 Sep', status: 'warning' },
      { label: 'W2', value: 115, date: '08 Sep', status: 'warning' },
      { label: 'W3', value: 112, date: '15 Sep', status: 'warning' },
      { label: 'W4', value: 108, date: '22 Sep', status: 'warning' },
      { label: 'Current', value: 108, date: '24 Sep', status: 'warning' },
    ],
    points90d: [
      { label: 'Jul', value: 124, date: 'Jul 2026', status: 'warning' },
      { label: 'Aug', value: 116, date: 'Aug 2026', status: 'warning' },
      { label: 'Sep', value: 108, date: 'Sep 2026', status: 'warning' },
    ],
  },
  bp: {
    metricId: 'bp',
    title: 'Systolic Blood Pressure',
    unit: 'mmHg',
    normalRange: '< 120 / 80 mmHg',
    points7d: [
      { label: 'Mon', value: 124, secondaryValue: 82, date: '18 Sep', status: 'normal' },
      { label: 'Tue', value: 122, secondaryValue: 80, date: '19 Sep', status: 'normal' },
      { label: 'Wed', value: 120, secondaryValue: 79, date: '20 Sep', status: 'normal' },
      { label: 'Thu', value: 123, secondaryValue: 81, date: '21 Sep', status: 'normal' },
      { label: 'Fri', value: 121, secondaryValue: 80, date: '22 Sep', status: 'normal' },
      { label: 'Sat', value: 119, secondaryValue: 78, date: '23 Sep', status: 'normal' },
      { label: 'Sun', value: 122, secondaryValue: 80, date: '24 Sep', status: 'normal' },
    ],
    points30d: [
      { label: 'W1', value: 126, secondaryValue: 84, date: '01 Sep', status: 'normal' },
      { label: 'W2', value: 124, secondaryValue: 82, date: '08 Sep', status: 'normal' },
      { label: 'W3', value: 122, secondaryValue: 80, date: '15 Sep', status: 'normal' },
      { label: 'W4', value: 121, secondaryValue: 80, date: '22 Sep', status: 'normal' },
    ],
    points90d: [
      { label: 'Jul', value: 128, secondaryValue: 85, date: 'Jul 2026', status: 'warning' },
      { label: 'Aug', value: 125, secondaryValue: 82, date: 'Aug 2026', status: 'normal' },
      { label: 'Sep', value: 122, secondaryValue: 80, date: 'Sep 2026', status: 'normal' },
    ],
  },
  heartRate: {
    metricId: 'heartRate',
    title: 'Resting Heart Rate',
    unit: 'bpm',
    normalRange: '60 - 100 bpm',
    points7d: [
      { label: 'Mon', value: 74, date: '18 Sep', status: 'normal' },
      { label: 'Tue', value: 72, date: '19 Sep', status: 'normal' },
      { label: 'Wed', value: 75, date: '20 Sep', status: 'normal' },
      { label: 'Thu', value: 71, date: '21 Sep', status: 'normal' },
      { label: 'Fri', value: 73, date: '22 Sep', status: 'normal' },
      { label: 'Sat', value: 70, date: '23 Sep', status: 'normal' },
      { label: 'Sun', value: 72, date: '24 Sep', status: 'normal' },
    ],
    points30d: [
      { label: 'W1', value: 76, date: '01 Sep', status: 'normal' },
      { label: 'W2', value: 74, date: '08 Sep', status: 'normal' },
      { label: 'W3', value: 72, date: '15 Sep', status: 'normal' },
      { label: 'W4', value: 72, date: '22 Sep', status: 'normal' },
    ],
    points90d: [
      { label: 'Jul', value: 78, date: 'Jul 2026', status: 'normal' },
      { label: 'Aug', value: 75, date: 'Aug 2026', status: 'normal' },
      { label: 'Sep', value: 72, date: 'Sep 2026', status: 'normal' },
    ],
  },
};

// Recent Health Timeline Events
export const demoTimelineEvents = [
  {
    id: 'evt_01',
    date: 'Today · 08:30 AM',
    title: 'Morning Vitals Recorded',
    titleHi: 'सुबह के महत्वपूर्ण माप दर्ज किए गए',
    description: 'BP 122/80 mmHg and Fasting Glucose 108 mg/dL entered by Aarav.',
    category: 'vitals',
  },
  {
    id: 'evt_02',
    date: 'Yesterday · 06:15 PM',
    title: 'Family Vitals Update: Savitri Devi',
    titleHi: 'पारिवारिक स्वास्थ्य अपडेट: सावित्री देवी',
    description: 'BP reading of 128/82 mmHg shared via Ujjain Family Circle.',
    category: 'family',
  },
  {
    id: 'evt_03',
    date: '12 Sep 2026',
    title: 'Lab Report Processed: Comprehensive Metabolic Panel',
    titleHi: 'लैब रिपोर्ट विश्लेषण: व्यापक चयापचय पैनल',
    description: 'Indore Central Diagnostic Centre results summarized in plain language.',
    category: 'report',
  },
  {
    id: 'evt_04',
    date: '08 Sep 2026',
    title: 'Wellness Routine Completed: Anulom Vilom',
    titleHi: 'कल्याण दिनचर्या पूर्ण: अनुलोम विलोम',
    description: '10-minute morning pranayama sequence completed.',
    category: 'wellness',
  },
];

// Notifications
export const initialDemoNotifications: DemoNotification[] = [
  {
    id: 'notif_01',
    title: 'New Illustrative Lab Report Ready',
    titleHi: 'नई सांकेतिक लैब रिपोर्ट तैयार है',
    message: 'Comprehensive Metabolic Panel from Indore Central Laboratory is available for review.',
    messageHi: 'इंदौर सेंट्रल प्रयोगशाला से व्यापक चयापचय रिपोर्ट समीक्षा के लिए तैयार है।',
    category: 'report',
    targetPath: '/prototype/report-analysis',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif_02',
    title: 'Family Vitals Update',
    titleHi: 'पारिवारिक स्वास्थ्य सूचना',
    message: 'Savitri Devi recorded morning blood pressure (128/82 mmHg).',
    messageHi: 'सावित्री देवी ने सुबह का रक्तचाप (128/82 mmHg) दर्ज किया।',
    category: 'family',
    targetPath: '/prototype/family',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif_03',
    title: 'Evening Wellness Reminder',
    titleHi: 'शाम की कल्याण अनुस्मारक',
    message: 'Shatapadi (100 gentle steps) recommended following dinner.',
    messageHi: 'रात्रि भोजन के उपरांत शतपदी (100 कदम टहलना) का सुझाव दिया गया है।',
    category: 'wellness',
    targetPath: '/prototype/wellness',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 'notif_04',
    title: 'Fasting Glucose Checkpoint',
    titleHi: 'फास्टिंग ग्लूकोज समीक्षा',
    message: 'Fasting glucose has steadily decreased by 6 mg/dL over the past week.',
    messageHi: 'पिछले सप्ताह में फास्टिंग ग्लूकोज में 6 mg/dL का सकारात्मक सुधार हुआ है।',
    category: 'preventive',
    targetPath: '/prototype/health-intelligence',
    timestamp: '2 days ago',
    read: true,
  },
];

export const demoNotifications: DemoNotification[] = initialDemoNotifications;

// Wellness Recommendations Across Categories
export const demoWellnessRecommendations: DemoWellnessRecommendation[] = [
  {
    id: 'wel_01',
    title: 'Anulom Vilom (Alternate Nostril Pranayama)',
    titleHi: 'अनुलोम विलोम प्राणायाम',
    category: 'today',
    purpose: 'Autonomic nervous system stabilization and stress reduction.',
    suggestedActivity: '10-minute seated rhythm breathwork before morning breakfast.',
    description:
      'Gently alternates airflow between left and right nostrils to foster calm parasympathetic tone and steady mental focus.',
    duration: '10 mins · Morning',
    safetyNote: 'Sit comfortably upright without forcing the breath; suitable for all ages.',
    suitability: 'Universal / Beginner',
    ayurvedicContext: 'Balances Vata and Pitta doshas during morning hours.',
  },
  {
    id: 'wel_02',
    title: 'Post-Meal Shatapadi (100 Steps Walking)',
    titleHi: 'शतपदी (भोजनोपरांत १०० कदम)',
    category: 'today',
    purpose: 'Promote gastric motility and moderate postprandial glucose surges.',
    suggestedActivity: '15-minute relaxed, gentle stroll inside the courtyard or garden.',
    description:
      'Traditional Ayurvedic post-meal practice preventing sluggish digestion and assisting pancreatic regulation.',
    duration: '15 mins · Post-dinner',
    safetyNote: 'Maintain a slow, leisurely pace without vigorous exertion immediately after eating.',
    suitability: 'All adult household members',
  },
  {
    id: 'wel_03',
    title: 'Vrikshasana (Tree Pose) for Balance',
    titleHi: 'वृक्षासन (संतुलन हेतु)',
    category: 'yoga',
    purpose: 'Neuromuscular stability, leg strengthening, and mental focus.',
    suggestedActivity: 'Hold pose for 30-45 seconds on each foot near a supporting wall.',
    description:
      'A grounded standing balance posture that cultivates composure and posture awareness.',
    duration: '5 mins · Anytime',
    safetyNote: 'Elders may keep one hand gently touching a wall or chair for support.',
    suitability: 'Teens to active adults',
  },
  {
    id: 'wel_04',
    title: 'Triphala & Warm Water Routine',
    titleHi: 'त्रिफला एवं गुनगुने जल का सेवन',
    category: 'ayurveda',
    purpose: 'Gentle gastrointestinal support and digestive fire (Agni) maintenance.',
    suggestedActivity: 'Half teaspoon of pure Triphala powder in lukewarm water before bedtime.',
    description:
      'Classical Rasayana formulation blending Amalaki, Bibhitaki, and Haritaki for digestive harmony.',
    duration: 'Evening habit',
    safetyNote: 'Educational concept; discuss with an Ayurvedic physician before daily use.',
    suitability: 'Adults with sluggish evening digestion',
    ayurvedicContext: 'Balances all three doshas with gentle colon detox properties.',
  },
  {
    id: 'wel_05',
    title: 'Carbohydrate Pacing for Pre-Diabetes',
    titleHi: 'संतुलित कार्बोहाइड्रेट पोषण',
    category: 'nutrition',
    purpose: 'Blunt blood glucose spikes and sustain steady daily energy.',
    suggestedActivity: 'Pair whole grains (millets, bajra, jowar) with fibrous legumes and greens.',
    description:
      'Traditional Malwa whole grain choices provide sustained satiety compared to polished white rice and maida.',
    duration: 'Daily meal planning',
    safetyNote: 'Consult a clinical dietician for personalized medical nutrition therapy.',
    suitability: 'Adults managing borderline glucose levels',
  },
  {
    id: 'wel_06',
    title: 'Nidra (Sleep Hygiene Rhythms)',
    titleHi: 'निद्रा एवं रात्रि विश्राम नियम',
    category: 'sleep',
    purpose: 'Deep tissue recovery, cortisol reduction, and circadian rhythm alignment.',
    suggestedActivity: 'Dim household screens 45 minutes prior to sleep; drink warm turmeric-infused milk.',
    description:
      'Classical Ayurvedic sleep discipline prioritizing regular bedtimes before 10:30 PM.',
    duration: '7-8 hours nightly',
    safetyNote: 'Maintain a dark, cool, and well-ventilated bedroom.',
    suitability: 'All family members',
  },
  {
    id: 'wel_07',
    title: 'Morning Sunlight & Hydration',
    titleHi: 'प्रातःकाल सूर्य प्रकाश एवं जल सेवन',
    category: 'lifestyle',
    purpose: 'Circadian entrainment, vitamin D synthesis, and gentle digestive awakening (Ushapan).',
    suggestedActivity: 'Drink 2 glasses of lukewarm water and spend 15 minutes in early morning sunshine.',
    description:
      'Ushapan (morning drinking of water) stimulates natural peristalsis while natural morning light sets the hormonal clock.',
    duration: '15 mins · Dawn',
    safetyNote: 'Avoid midday harsh sun; early morning light is safest.',
    suitability: 'Universal',
  },
];

// Emergency Profile
export const demoEmergencyProfile: DemoEmergencyProfile = {
  id: 'emg_01',
  patientName: 'Aarav Sharma',
  age: 38,
  bloodGroup: 'B+',
  primaryHospital: 'Indore Care Super-Speciality Hospital (Demo Reference)',
  hospitalLocation: 'AB Road, Near LIG Square, Indore, Madhya Pradesh',
  ambulanceContact: '108 (State Medical Emergency)',
  emergencyDoctorName: 'Dr. Vivek Saxena, MD (Simulated Family Physician)',
  emergencyNotes:
    'Patient has documented simulated penicillin allergy. Blood group B positive. Primary emergency proxy: Meera Sharma (Spouse). Pre-existing pre-diabetes evaluation.',
  emergencyContacts: [
    { name: 'Meera Sharma', relationship: 'Spouse', phone: '+91 98765 43210 (Simulated)' },
    { name: 'Dr. Vivek Saxena', relationship: 'Attending Physician', phone: '+91 98220 12345 (Simulated)' },
  ],
  activeMedications: [
    'Metformin 500mg (Simulated — Once daily after morning breakfast)',
    'Atorvastatin 10mg (Simulated — Once daily at bedtime)',
  ],
};

// Longitudinal Health Timeline Dataset (7d, 30d, 90d)
export const demoTimelineData: Record<'glucose' | 'bp' | 'heartRate', MetricTimelineData> = {
  glucose: {
    metricId: 'glucose',
    title: 'Fasting Blood Glucose',
    unit: 'mg/dL',
    normalRange: '70 – 99 mg/dL',
    points7d: [
      { label: '18 Sep', date: '18 Sep 2026', value: 146, status: 'warning', note: 'Post-dinner sweet dessert' },
      { label: '19 Sep', date: '19 Sep 2026', value: 142, status: 'warning' },
      { label: '20 Sep', date: '20 Sep 2026', value: 139, status: 'warning', note: 'Morning walk resumed' },
      { label: '21 Sep', date: '21 Sep 2026', value: 136, status: 'warning' },
      { label: '22 Sep', date: '22 Sep 2026', value: 135, status: 'warning', note: 'Evening Shatapadi practiced' },
      { label: '23 Sep', date: '23 Sep 2026', value: 138, status: 'warning' },
      { label: '24 Sep', date: '24 Sep 2026', value: 142, status: 'warning', note: 'Current morning reading' },
    ],
    points30d: [
      { label: '26 Aug', date: '26 Aug 2026', value: 152, status: 'warning' },
      { label: '30 Aug', date: '30 Aug 2026', value: 148, status: 'warning' },
      { label: '04 Sep', date: '04 Sep 2026', value: 144, status: 'warning' },
      { label: '08 Sep', date: '08 Sep 2026', value: 145, status: 'warning' },
      { label: '12 Sep', date: '12 Sep 2026', value: 140, status: 'warning', note: 'CMP Lab test performed' },
      { label: '16 Sep', date: '16 Sep 2026', value: 145, status: 'warning' },
      { label: '20 Sep', date: '20 Sep 2026', value: 139, status: 'warning' },
      { label: '24 Sep', date: '24 Sep 2026', value: 142, status: 'warning', note: 'Current baseline' },
    ],
    points90d: [
      { label: '28 Jun', date: '28 Jun 2026', value: 160, status: 'warning', note: 'Initial elevation observed' },
      { label: '12 Jul', date: '12 Jul 2026', value: 155, status: 'warning' },
      { label: '26 Jul', date: '26 Jul 2026', value: 152, status: 'warning' },
      { label: '10 Aug', date: '10 Aug 2026', value: 149, status: 'warning' },
      { label: '25 Aug', date: '25 Aug 2026', value: 147, status: 'warning' },
      { label: '08 Sep', date: '08 Sep 2026', value: 143, status: 'warning' },
      { label: '24 Sep', date: '24 Sep 2026', value: 142, status: 'warning', note: 'Net 18 mg/dL improvement' },
    ],
  },
  bp: {
    metricId: 'bp',
    title: 'Blood Pressure (Systolic / Diastolic)',
    unit: 'mmHg',
    normalRange: '90/60 – 120/80 mmHg',
    points7d: [
      { label: '18 Sep', date: '18 Sep 2026', value: 124, secondaryValue: 82, status: 'normal' },
      { label: '19 Sep', date: '19 Sep 2026', value: 122, secondaryValue: 80, status: 'normal' },
      { label: '20 Sep', date: '20 Sep 2026', value: 119, secondaryValue: 79, status: 'normal' },
      { label: '21 Sep', date: '21 Sep 2026', value: 120, secondaryValue: 81, status: 'normal' },
      { label: '22 Sep', date: '22 Sep 2026', value: 118, secondaryValue: 78, status: 'normal' },
      { label: '23 Sep', date: '23 Sep 2026', value: 119, secondaryValue: 79, status: 'normal' },
      { label: '24 Sep', date: '24 Sep 2026', value: 118, secondaryValue: 78, status: 'normal', note: 'Optimal range' },
    ],
    points30d: [
      { label: '26 Aug', date: '26 Aug 2026', value: 126, secondaryValue: 84, status: 'normal' },
      { label: '02 Sep', date: '02 Sep 2026', value: 124, secondaryValue: 82, status: 'normal' },
      { label: '09 Sep', date: '09 Sep 2026', value: 121, secondaryValue: 80, status: 'normal' },
      { label: '16 Sep', date: '16 Sep 2026', value: 120, secondaryValue: 79, status: 'normal' },
      { label: '24 Sep', date: '24 Sep 2026', value: 118, secondaryValue: 78, status: 'normal' },
    ],
    points90d: [
      { label: '28 Jun', date: '28 Jun 2026', value: 130, secondaryValue: 86, status: 'warning', note: 'Mild stress peak' },
      { label: '18 Jul', date: '18 Jul 2026', value: 127, secondaryValue: 83, status: 'normal' },
      { label: '08 Aug', date: '08 Aug 2026', value: 124, secondaryValue: 81, status: 'normal' },
      { label: '28 Aug', date: '28 Aug 2026', value: 122, secondaryValue: 80, status: 'normal' },
      { label: '24 Sep', date: '24 Sep 2026', value: 118, secondaryValue: 78, status: 'normal' },
    ],
  },
  heartRate: {
    metricId: 'heartRate',
    title: 'Resting Heart Rate',
    unit: 'bpm',
    normalRange: '60 – 100 bpm',
    points7d: [
      { label: '18 Sep', date: '18 Sep 2026', value: 76, status: 'normal' },
      { label: '19 Sep', date: '19 Sep 2026', value: 74, status: 'normal' },
      { label: '20 Sep', date: '20 Sep 2026', value: 71, status: 'normal' },
      { label: '21 Sep', date: '21 Sep 2026', value: 73, status: 'normal' },
      { label: '22 Sep', date: '22 Sep 2026', value: 70, status: 'normal' },
      { label: '23 Sep', date: '23 Sep 2026', value: 74, status: 'normal' },
      { label: '24 Sep', date: '24 Sep 2026', value: 72, status: 'normal', note: 'Sinus rhythm' },
    ],
    points30d: [
      { label: '26 Aug', date: '26 Aug 2026', value: 78, status: 'normal' },
      { label: '04 Sep', date: '04 Sep 2026', value: 75, status: 'normal' },
      { label: '12 Sep', date: '12 Sep 2026', value: 73, status: 'normal' },
      { label: '20 Sep', date: '20 Sep 2026', value: 71, status: 'normal' },
      { label: '24 Sep', date: '24 Sep 2026', value: 72, status: 'normal' },
    ],
    points90d: [
      { label: '28 Jun', date: '28 Jun 2026', value: 80, status: 'normal' },
      { label: '20 Jul', date: '20 Jul 2026', value: 77, status: 'normal' },
      { label: '12 Aug', date: '12 Aug 2026', value: 75, status: 'normal' },
      { label: '04 Sep', date: '04 Sep 2026', value: 73, status: 'normal' },
      { label: '24 Sep', date: '24 Sep 2026', value: 72, status: 'normal' },
    ],
  },
};

