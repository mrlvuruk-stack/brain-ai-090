import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ExternalLink, Activity } from 'lucide-react';
import type { IntelligenceActivityItem } from '../../data/intelligenceTypes';
import './IntelligenceActivityDrawer.css';

interface IntelligenceActivityProps {
  activities: IntelligenceActivityItem[];
  isHindi?: boolean;
  className?: string;
}

export const IntelligenceActivityDrawer: React.FC<IntelligenceActivityProps> = ({
  activities,
  isHindi = false,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <aside className={`sw-intel-activity-box ${className}`} aria-labelledby="intel-activity-title">
      <div className="sw-intel-activity-header">
        <div className="sw-intel-activity-header__title-row">
          <Activity size={16} className="sw-intel-activity-icon" aria-hidden="true" />
          <h3 id="intel-activity-title" className="sw-intel-activity-title">
            {isHindi ? 'प्रोटोटाइप गतिविधि' : 'Prototype Activity'}
          </h3>
        </div>
        <span className="sw-intel-activity-tag">
          {isHindi ? 'सिम्युलेटेड लॉग' : 'Simulated Log'}
        </span>
      </div>

      <p className="sw-intel-activity-disclaimer">
        {isHindi
          ? 'यह इतिहास प्रोटोटाइप में डेटा संबंधों का सिम्युलेटेड रिकॉर्ड दर्शाता है। कोई वास्तविक बैकग्राउंड एआई रन नहीं हो रहा है।'
          : 'Transparent simulated record of data relationships evaluated in this prototype. No real-time background AI processing.'}
      </p>

      <ul className="sw-intel-activity-list" role="list">
        {activities.map((item) => (
          <li key={item.id} className="sw-intel-activity-item">
            <div className="sw-intel-activity-meta">
              <span className="sw-intel-activity-time">
                <Clock size={12} aria-hidden="true" />
                <span>{isHindi ? item.timeAgoHi : item.timeAgoEn}</span>
              </span>
            </div>

            <h4 className="sw-intel-activity-action">
              {isHindi ? item.actionHi : item.actionEn}
            </h4>

            <p className="sw-intel-activity-detail">
              {isHindi ? item.detailHi : item.detailEn}
            </p>

            <button
              type="button"
              className="sw-intel-activity-link"
              onClick={() => navigate(item.relatedRoute)}
              aria-label={`${isHindi ? 'संबंधित पृष्ठ खोलें' : 'Open related feature'}: ${
                isHindi ? item.actionHi : item.actionEn
              }`}
            >
              <span>{isHindi ? 'संबंधित रिकॉर्ड देखें' : 'View record'}</span>
              <ExternalLink size={12} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
