import { useNavigate } from 'react-router-dom';
import {
  FileText,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Layers,
  Search,
  BookOpen,
  Activity,
  History,
  AlertCircle,
} from 'lucide-react';
import { PrototypeShell } from '../../components/layout/PrototypeShell';
import { Heading, Text } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ContextualAskButton } from '../../components/intelligence/ContextualAskButton';
import { usePrototype } from '../../state';
import { demoLabReports } from '../../data/demoData';
import './ReportAnalysisPage.css';

export const ReportAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedReportId,
    selectedReport,
    setSelectedReportId,
    isProcessingReport,
    processingStep,
    reanalyzeReport,
    language,
  } = usePrototype();

  const isHindi = language === 'hi';

  const intelMap: Record<
    string,
    {
      keyObsEn: string;
      keyObsHi: string;
      metricNameEn: string;
      metricNameHi: string;
      metricRoute: string;
      metricVal: string;
      timelineTitleEn: string;
      timelineTitleHi: string;
      timelineRoute: string;
      timelineDate: string;
      questions: Array<{ qEn: string; qHi: string; query: string }>;
      limitationsEn: string;
      limitationsHi: string;
    }
  > = {
    rep_001: {
      keyObsEn: 'Laboratory fasting glucose measured at 142 mg/dL alongside HbA1c at 6.8% and serum creatinine at 1.0 mg/dL.',
      keyObsHi: 'फास्टिंग ग्लूकोज 142 mg/dL के साथ HbA1c 6.8% और सीरम क्रिएटिनिन 1.0 mg/dL दर्ज हुआ।',
      metricNameEn: 'Continuous Glucose Trend',
      metricNameHi: 'निरंतर ग्लूकोज रुझान',
      metricRoute: '/prototype/health-intelligence',
      metricVal: '138 mg/dL (recent morning check)',
      timelineTitleEn: 'Illustrative Lab Report Analyzed: CMP',
      timelineTitleHi: 'सांकेतिक लैब रिपोर्ट विश्लेषण: CMP',
      timelineRoute: '/prototype/journey',
      timelineDate: '12 Sep 2026',
      questions: [
        {
          qEn: 'What does this Comprehensive Metabolic Panel measure?',
          qHi: 'यह व्यापक मेटाबॉलिक पैनल क्या मापता है?',
          query: 'Explain the Comprehensive Metabolic Panel parameters in plain language.',
        },
        {
          qEn: 'How does HbA1c relate to morning glucose readings?',
          qHi: 'HbA1c सुबह के ग्लूकोज पाठ्यांकों से कैसे संबंधित है?',
          query: 'Explain the difference between HbA1c and daily fasting glucose.',
        },
      ],
      limitationsEn: 'The prototype presents illustrative synthetic laboratory data. It does not replace certified laboratory interpretation or medical advice.',
      limitationsHi: 'प्रोटोटाइप सांकेतिक प्रयोगशाला डेटा प्रस्तुत करता है। यह प्रमाणित लैब व्याख्या या चिकित्सा सलाह का विकल्प नहीं है।',
    },
    rep_002: {
      keyObsEn: 'Hemoglobin documented at 11.2 g/dL with platelet counts and leukocyte differentials within reference bounds.',
      keyObsHi: 'हीमोग्लोबिन 11.2 g/dL दर्ज हुआ, प्लेटलेट और ल्यूकोसाइट सामान्य संदर्भ सीमा में रहे।',
      metricNameEn: 'Hemoglobin Longitudinal Log',
      metricNameHi: 'हीमोग्लोबिन दीर्घकालिक लॉग',
      metricRoute: '/prototype/health-intelligence',
      metricVal: '11.2 g/dL (up from 10.4 g/dL baseline)',
      timelineTitleEn: 'Complete Blood Count Review',
      timelineTitleHi: 'कम्प्लीट ब्लड काउंट समीक्षा',
      timelineRoute: '/prototype/journey',
      timelineDate: '14 Sep 2026',
      questions: [
        {
          qEn: 'What does hemoglobin measure in this report?',
          qHi: 'इस रिपोर्ट में हीमोग्लोबिन क्या मापता है?',
          query: 'Explain the hemoglobin parameter in this Complete Blood Count.',
        },
        {
          qEn: 'What are normal platelet reference ranges?',
          qHi: 'सामान्य प्लेटलेट संदर्भ सीमा क्या है?',
          query: 'Explain normal reference ranges for platelets and white blood cells.',
        },
      ],
      limitationsEn: 'Illustrative hematology panel. Nutritional intake and clinical symptoms were not directly monitored.',
      limitationsHi: 'सांकेतिक हेमेटोलॉजी पैनल। नैदानिक लक्षण, पोषण या आहार की प्रत्यक्ष निगरानी प्रोटोटाइप में नहीं है।',
    },
    rep_003: {
      keyObsEn: 'Lipid profile fractions recorded alongside morning resting cardiovascular vitals.',
      keyObsHi: 'लिपिड प्रोफाइल घटक सुबह के विश्राम कार्डियोवास्कुलर वाइटल्स के साथ दर्ज किए गए।',
      metricNameEn: 'Resting Blood Pressure',
      metricNameHi: 'विश्राम रक्तचाप',
      metricRoute: '/prototype/health-intelligence',
      metricVal: '132/82 mmHg',
      timelineTitleEn: 'Lipid Profile Investigation',
      timelineTitleHi: 'लिपिड प्रोफाइल जांच',
      timelineRoute: '/prototype/journey',
      timelineDate: '05 Aug 2026',
      questions: [
        {
          qEn: 'What components make up a standard lipid panel?',
          qHi: 'लिपिड पैनल में कौन-कौन से घटक होते हैं?',
          query: 'Explain HDL, LDL, and triglycerides in a standard lipid panel.',
        },
      ],
      limitationsEn: 'Simulated lipid observations without fasting duration telemetry or certified laboratory calibration.',
      limitationsHi: 'बिना फास्टिंग अवधि टेलीमेट्री के सिम्युलेटेड लिपिड अवलोकन।',
    },
  };

  const processingStages = [
    {
      step: 1,
      titleEn: 'Preparing report',
      titleHi: 'रिपोर्ट तैयार की जा रही है',
      descEn: 'Digitizing scanned laboratory document structure',
      descHi: 'लैब दस्तावेज़ संरचना डिजिटाइज़ हो रही है',
      icon: <Layers size={18} />,
    },
    {
      step: 2,
      titleEn: 'Reading measurements',
      titleHi: 'मापकों का पठन',
      descEn: 'Extracting biomarker numerical values and units',
      descHi: 'बायोमार्कर मान और इकाइयाँ पहचानी जा रही हैं',
      icon: <Search size={18} />,
    },
    {
      step: 3,
      titleEn: 'Organizing results',
      titleHi: 'परिणामों का वर्गीकरण',
      descEn: 'Cross-referencing standard clinical ranges',
      descHi: 'मानक स्वास्थ्य संदर्भ सीमाओं से तुलना की जा रही है',
      icon: <CheckCircle2 size={18} />,
    },
    {
      step: 4,
      titleEn: 'Preparing plain-language explanation',
      titleHi: 'सरल भाषा व्याख्या तैयार की जा रही है',
      descEn: 'Synthesizing educational insights for patient consultation',
      descHi: 'परामर्श हेतु सरल भाषाई सारांश तैयार हो रहा है',
      icon: <BookOpen size={18} />,
    },
  ];

  return (
    <PrototypeShell activeModuleName={isHindi ? 'डेमो रिपोर्ट विश्लेषण' : 'Demo Report Analysis'}>
      <div className="sw-reports-page">
        {/* Page Subtitle & Overview */}
        <div className="sw-proto-page-header">
          <div className="sw-proto-page-header__meta">
            <Badge variant="primary" size="sm" showDot>
              {isHindi ? 'इंटरेक्टिव रिपोर्ट समझ' : 'Interactive Lab Understanding'}
            </Badge>
            <span className="sw-proto-page-header__sub">
              {isHindi
                ? 'सांकेतिक व्याख्या · नैदानिक निदान नहीं'
                : 'Educational Interpretation · Non-Diagnostic Prototype'}
            </span>
          </div>
          <Heading level={1} size="h3">
            {isHindi ? 'सांकेतिक लैब रिपोर्ट विश्लेषण' : 'Illustrative Laboratory Report Analysis'}
          </Heading>
          <Text variant="secondary">
            {isHindi
              ? 'सैंपल रिपोर्ट चुनें या सिमुलेटेड एआई व्याख्या प्रक्रिया देखें। प्रत्येक परीक्षण का अर्थ सरल हिंदी व अंग्रेजी में समझें।'
              : 'Select a sample report to inspect simulated AI processing. Understand complex biomarkers in plain language to prepare for doctor visits.'}
          </Text>
        </div>

        {/* 1. Sample Report Selector Strip */}
        <section aria-label="Select sample report">
          <span className="sw-selector-label">
            {isHindi ? 'नमूना रिपोर्ट चुनें (3 उपलब्ध):' : 'SELECT SAMPLE REPORT (3 AVAILABLE):'}
          </span>
          <div className="sw-report-tabs">
            {demoLabReports.map((report) => {
              const isSelected = report.id === selectedReportId;
              return (
                <button
                  key={report.id}
                  type="button"
                  className={`sw-report-tab-btn ${
                    isSelected ? 'sw-report-tab-btn--active' : ''
                  }`}
                  onClick={() => setSelectedReportId(report.id)}
                  aria-pressed={isSelected}
                >
                  <div className="sw-report-tab-header">
                    <FileText size={16} className="sw-report-tab-icon" />
                    <span className="sw-report-tab-title">{report.title}</span>
                  </div>
                  <div className="sw-report-tab-meta">
                    <span>{report.date}</span>
                    <Badge
                      variant={report.clinicalStatus === 'normal' ? 'normal' : 'warning'}
                      size="sm"
                    >
                      {report.clinicalStatus === 'normal'
                        ? (isHindi ? 'सामान्य' : 'Normal')
                        : (isHindi ? 'ध्यान दें' : 'Attention')}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Simulated Processing State (When Analyzing) */}
        {isProcessingReport ? (
          <Card variant="subtle" padding="lg" className="sw-processing-card">
            <div className="sw-processing-head">
              <div className="sw-processing-spinner-wrap">
                <RotateCw size={24} className="sw-spin-icon" />
              </div>
              <div>
                <Heading level={2} size="h4">
                  {isHindi
                    ? 'रिपोर्ट का विश्लेषण किया जा रहा है...'
                    : 'Analyzing Laboratory Measurements...'}
                </Heading>
                <Text variant="secondary" style={{ fontSize: 'var(--text-xs)' }}>
                  {isHindi
                    ? 'सिम्युलेटेड 4-चरण प्रक्रिया: डेटा निष्कर्षण और सरल भाषा व्याख्या'
                    : 'Simulated 4-step pipeline: Structured parameter extraction & plain-language translation'}
                </Text>
              </div>
            </div>

            {/* Stepped Progress Indicator */}
            <div className="sw-stages-list">
              {processingStages.map((stage) => {
                const isDone = processingStep > stage.step;
                const isCurrent = processingStep === stage.step;

                return (
                  <div
                    key={stage.step}
                    className={`sw-stage-item ${
                      isDone
                        ? 'sw-stage-item--done'
                        : isCurrent
                        ? 'sw-stage-item--current'
                        : 'sw-stage-item--pending'
                    }`}
                  >
                    <div className="sw-stage-icon-circle">
                      {isDone ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        stage.icon
                      )}
                    </div>
                    <div className="sw-stage-content">
                      <strong className="sw-stage-title">
                        {isHindi ? stage.titleHi : stage.titleEn}
                      </strong>
                      <span className="sw-stage-desc">
                        {isHindi ? stage.descHi : stage.descEn}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="sw-stage-badge">
                        {isHindi ? 'प्रक्रियाधीन' : 'Processing...'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          /* 3. Analyzed Report Overview & Detailed Findings */
          <div className="sw-report-results-view">
            {/* Report Header Card */}
            <Card variant="default" padding="lg" className="sw-report-detail-header">
              <div className="sw-report-top-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FileText size={20} color="var(--color-primary)" />
                    <Heading level={2} size="h4">
                      {selectedReport.title}
                    </Heading>
                  </div>
                  <span className="sw-report-facility">
                    {selectedReport.facilityName} · {selectedReport.testType} · {selectedReport.date}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<RotateCw size={14} />}
                    onClick={() => reanalyzeReport()}
                  >
                    {isHindi ? 'पुनः विश्लेषण चलाएँ' : 'Re-run Simulation'}
                  </Button>
                  <Badge
                    variant={selectedReport.clinicalStatus === 'normal' ? 'normal' : 'warning'}
                    size="sm"
                  >
                    {selectedReport.clinicalStatus === 'normal'
                      ? (isHindi ? 'सामान्य सीमा' : 'Normal Bounds')
                      : (isHindi ? 'ध्यान देने योग्य' : 'Review Needed')}
                  </Badge>
                </div>
              </div>

              {/* Plain-Language Narrative Summary */}
              <div className="sw-report-summary-box">
                <div className="sw-report-summary-box__title">
                  <Sparkles size={16} color="var(--color-primary)" />
                  <strong>
                    {isHindi ? 'सरल भाषा सारांश (सांकेतिक)' : 'Plain-Language Interpretation'}
                  </strong>
                </div>
                <p className="sw-report-summary-box__text">
                  {isHindi ? selectedReport.summaryHi : selectedReport.summaryEn}
                </p>
              </div>

              {/* AI Key Insights Bullets */}
              <div className="sw-report-insights-block">
                <span className="sw-report-insights-label">
                  {isHindi ? 'सांकेतिक शैक्षिक अवलोकन:' : 'EDUCATIONAL OBSERVATIONS (ILLUSTRATIVE DATA):'}
                </span>
                <ul className="sw-report-insights-list">
                  {(isHindi ? selectedReport.aiInsightsHi : selectedReport.aiInsightsEn).map(
                    (insight, idx) => (
                      <li key={idx}>{insight}</li>
                    )
                  )}
                </ul>
              </div>
            </Card>

            {/* Parameter Breakdown Table */}
            <div className="sw-params-section">
              <div className="sw-params-section-head">
                <Heading level={2} size="h5">
                  {isHindi ? 'मापे गए बायोमार्कर और व्याख्या' : 'Biomarker Measurements & Explanations'}
                </Heading>
                <span className="sw-params-count">
                  {selectedReport.keyFindings.length} {isHindi ? 'परीक्षण' : 'parameters evaluated'}
                </span>
              </div>

              <div className="sw-params-table-wrap">
                <table className="sw-params-table" aria-label="Biomarker parameters">
                  <thead>
                    <tr>
                      <th scope="col">{isHindi ? 'पैरामीटर' : 'Parameter'}</th>
                      <th scope="col">{isHindi ? 'मान एवं इकाई' : 'Value & Unit'}</th>
                      <th scope="col">{isHindi ? 'मानक सीमा' : 'Standard Range'}</th>
                      <th scope="col">{isHindi ? 'स्थिति' : 'Status'}</th>
                      <th scope="col">{isHindi ? 'सरल व्याख्या' : 'Plain-Language Context'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.keyFindings.map((param) => (
                      <tr key={param.parameter} className={`sw-param-row--${param.status}`}>
                        <td className="sw-param-cell-name">
                          <strong>{param.parameter}</strong>
                        </td>
                        <td className="sw-param-cell-val">
                          <span className="sw-val-bold">{param.value}</span>{' '}
                          <span className="sw-unit-sub">{param.unit}</span>
                        </td>
                        <td className="sw-param-cell-range">{param.standardRange}</td>
                        <td className="sw-param-cell-status">
                          <Badge
                            variant={param.status === 'normal' ? 'normal' : 'warning'}
                            size="sm"
                          >
                            {param.status === 'normal'
                              ? (isHindi ? 'सामान्य' : 'Normal')
                              : (isHindi ? 'उच्च / समीक्षा' : 'Attention')}
                          </Badge>
                        </td>
                        <td className="sw-param-cell-explanation">
                          {isHindi ? param.explanationHi : param.explanationEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Phase 5 Report Intelligence: Observations, Metric Link, Timeline Context, Questions, Limitations */}
            <div className="sw-report-intelligence-panel">
              <div className="sw-report-intelligence-header">
                <Sparkles size={18} color="#0d9488" aria-hidden="true" />
                <Heading level={2} size="h5">
                  {isHindi ? 'रिपोर्ट बुद्धिमत्ता एवं संदर्भ' : 'Report Intelligence & Timeline Context'}
                </Heading>
              </div>

              {/* 1. Key Observations */}
              <div className="sw-report-intel-block">
                <span className="sw-report-intel-label">
                  {isHindi ? 'मुख्य अवलोकन (Key Observations):' : 'Key Observations:'}
                </span>
                <p className="sw-report-intel-text">
                  {isHindi
                    ? intelMap[selectedReport.id]?.keyObsHi || selectedReport.summaryHi
                    : intelMap[selectedReport.id]?.keyObsEn || selectedReport.summaryEn}
                </p>
              </div>

              {/* 2. Connected Data Flow */}
              {intelMap[selectedReport.id] && (
                <div className="sw-report-flow-card">
                  <span className="sw-report-intel-label">
                    {isHindi ? 'डेटा संबंध प्रवाह (Traceability Chain):' : 'Traceability & Connection Flow:'}
                  </span>

                  <div className="sw-report-flow-steps">
                    <div className="sw-report-flow-step">
                      <span className="sw-report-flow-step__tag">{isHindi ? '1. रिपोर्ट मान' : '1. Report Value'}</span>
                      <span className="sw-report-flow-step__title">{selectedReport.title}</span>
                      <span className="sw-report-flow-step__sub">{selectedReport.date}</span>
                    </div>

                    <span className="sw-report-flow-arrow" aria-hidden="true">→</span>

                    <div
                      className="sw-report-flow-step sw-report-flow-step--clickable"
                      onClick={() => navigate(intelMap[selectedReport.id].metricRoute)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(intelMap[selectedReport.id].metricRoute)}
                      title={isHindi ? 'बायोमेट्रिक रुझान पृष्ठ खोलें' : 'Open Biometric Trends'}
                    >
                      <span className="sw-report-flow-step__tag">{isHindi ? '2. संबंधित माप' : '2. Related Metric'}</span>
                      <span className="sw-report-flow-step__title">
                        <Activity size={12} style={{ display: 'inline', marginRight: 4 }} />
                        {isHindi
                          ? intelMap[selectedReport.id].metricNameHi
                          : intelMap[selectedReport.id].metricNameEn}
                      </span>
                      <span className="sw-report-flow-step__sub">{intelMap[selectedReport.id].metricVal}</span>
                    </div>

                    <span className="sw-report-flow-arrow" aria-hidden="true">→</span>

                    <div
                      className="sw-report-flow-step sw-report-flow-step--clickable"
                      onClick={() => navigate(intelMap[selectedReport.id].timelineRoute)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(intelMap[selectedReport.id].timelineRoute)}
                      title={isHindi ? 'स्वास्थ्य यात्रा समयरेखा खोलें' : 'Open Health Journey Timeline'}
                    >
                      <span className="sw-report-flow-step__tag">{isHindi ? '3. समयरेखा संदर्भ' : '3. Timeline Context'}</span>
                      <span className="sw-report-flow-step__title">
                        <History size={12} style={{ display: 'inline', marginRight: 4 }} />
                        {isHindi
                          ? intelMap[selectedReport.id].timelineTitleHi
                          : intelMap[selectedReport.id].timelineTitleEn}
                      </span>
                      <span className="sw-report-flow-step__sub">{intelMap[selectedReport.id].timelineDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Questions to Explore */}
              {intelMap[selectedReport.id] && (
                <div className="sw-report-questions-block">
                  <span className="sw-report-intel-label">
                    {isHindi ? 'विचारणीय प्रश्न (Questions to Explore):' : 'Questions to Explore:'}
                  </span>
                  <div className="sw-report-questions-list">
                    {intelMap[selectedReport.id].questions.map((q, idx) => (
                      <div key={idx} className="sw-report-question-row">
                        <span className="sw-report-question-text">{isHindi ? q.qHi : q.qEn}</span>
                        <ContextualAskButton
                          context={{
                            sourceType: 'report',
                            sourceTitleEn: selectedReport.title,
                            sourceTitleHi: selectedReport.title,
                            sourceDate: selectedReport.date,
                            snippetEn: q.qEn,
                            snippetHi: q.qHi,
                            suggestedQuestions: [
                              {
                                questionEn: q.qEn,
                                questionHi: q.qHi,
                                assistantQuery: q.query,
                              },
                            ],
                          }}
                          labelEn="Ask"
                          labelHi="पूछें"
                          variant="subtle"
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Data Limitations */}
              {intelMap[selectedReport.id] && (
                <div className="sw-report-limits-block" role="note">
                  <AlertCircle size={15} color="#b45309" aria-hidden="true" style={{ flexShrink: 0 }} />
                  <span className="sw-report-limits-text">
                    {isHindi
                      ? intelMap[selectedReport.id].limitationsHi
                      : intelMap[selectedReport.id].limitationsEn}
                  </span>
                </div>
              )}
            </div>

            {/* Mandatory Medical Safety Boundary */}
            <div className="sw-report-disclaimer-box">
              <ShieldAlert size={18} className="sw-disclaimer-icon" aria-hidden="true" />
              <div className="sw-disclaimer-content">
                <strong>
                  {isHindi ? 'प्रोटोटाइप परिणाम सीमा' : 'Prototype Result • Illustrative Data'}
                </strong>
                <p>
                  {isHindi
                    ? 'यह परिणाम विशुद्ध रूप से सॉफ्टवेयर प्रोटोटाइप अध्ययन हेतु सांकेतिक है। यह कोई नैदानिक निदान नहीं है। किसी भी स्वास्थ्य निर्णय या दवा परिवर्तन से पहले योग्य चिकित्सक से परामर्श करें।'
                    : 'Prototype result • Discuss health concerns with a qualified healthcare professional. Not a medical diagnosis or treatment recommendation.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
};
