import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FileText,
  Activity,
  HeartPulse,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';
import { usePrototype } from '../../state';
import { searchHealthRecords } from '../../data/journeyDemoData';
import type { SearchResult } from '../../data/journeyTypes';
import './UnifiedSearchModal.css';

export const UnifiedSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    currentProfileId,
    language,
    elderlyMode,
  } = usePrototype();

  const isHindi = language === 'hi';
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results: SearchResult[] = searchHealthRecords(searchQuery, currentProfileId, language);

  // Auto focus input when opened & lock body scroll
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
      }, 50);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Keyboard navigation through results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setIsSearchOpen(false);
    navigate(result.route);
  };

  if (!isSearchOpen) return null;

  const getCategoryIcon = (category: SearchResult['category']) => {
    switch (category) {
      case 'report':
        return <FileText size={14} className="sw-search-cat-icon sw-search-cat-icon--report" />;
      case 'metric':
        return <Activity size={14} className="sw-search-cat-icon sw-search-cat-icon--metric" />;
      case 'journey':
        return <Clock size={14} className="sw-search-cat-icon sw-search-cat-icon--journey" />;
      case 'wellness':
        return <HeartPulse size={14} className="sw-search-cat-icon sw-search-cat-icon--wellness" />;
      case 'goal':
        return <Compass size={14} className="sw-search-cat-icon sw-search-cat-icon--goal" />;
      case 'family':
        return <Users size={14} className="sw-search-cat-icon sw-search-cat-icon--family" />;
      case 'assistant':
        return <Sparkles size={14} className="sw-search-cat-icon sw-search-cat-icon--assistant" />;
      default:
        return <Compass size={14} />;
    }
  };

  const exampleChips = isHindi
    ? ['ग्लूकोज', 'रक्तचाप', 'शतपदी', 'रिपोर्ट', 'माता', 'प्राणायाम']
    : ['Glucose', 'Blood pressure', 'Shatapadi', 'Report', 'Mother', 'Pranayama'];

  return (
    <div
      className={`sw-search-backdrop ${elderlyMode ? 'sw-search-backdrop--elderly' : ''}`}
      onClick={() => setIsSearchOpen(false)}
      role="presentation"
    >
      <div
        className="sw-search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={isHindi ? 'एकीकृत स्वास्थ्य खोज' : 'Unified Health Search'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="sw-search-bar">
          <Search size={18} className="sw-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="sw-search-input"
            placeholder={
              isHindi
                ? 'स्वास्थ्य रिकॉर्ड, वाइटल्स, दिनचर्या, रिपोर्ट खोजें...'
                : 'Search health records, metrics, reports, routines (e.g. "glucose", "sleep")...'
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            aria-label={isHindi ? 'स्वास्थ्य खोज शब्द' : 'Search health terms'}
          />
          {searchQuery && (
            <button
              type="button"
              className="sw-search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label={isHindi ? 'खोज साफ़ करें' : 'Clear search'}
            >
              <X size={16} />
            </button>
          )}
          <span className="sw-search-shortcut-badge">ESC</span>
        </div>

        {/* Content Body */}
        <div className="sw-search-body">
          {searchQuery.trim() === '' ? (
            /* Empty Search State: Suggested Searches & Keyboard Hint */
            <div className="sw-search-empty-state">
              <span className="sw-search-empty-label">
                {isHindi ? 'सुझाए गए खोज शब्द:' : 'Quick search ideas:'}
              </span>
              <div className="sw-search-chips-row">
                {exampleChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="sw-search-chip"
                    onClick={() => setSearchQuery(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <p className="sw-search-empty-hint">
                {isHindi
                  ? 'स्थानीय प्रोटोटाइप खोज: डायग्नोस्टिक रिपोर्ट, वाइटल्स, व्यक्तिगत स्वास्थ्य यात्रा, और परिवार अनुमति से तुरंत परिणाम प्राप्त करें।'
                  : 'Client-side simulation: Fast deterministic indexing across reports, metrics, journey events, goals, and family access.'}
              </p>
            </div>
          ) : results.length === 0 ? (
            /* No Results State */
            <div className="sw-search-no-results">
              <p className="sw-search-no-results-title">
                {isHindi ? 'कोई प्रासंगिक परिणाम नहीं मिला' : 'No matching health records found'}
              </p>
              <p className="sw-search-no-results-sub">
                {isHindi
                  ? `"${searchQuery}" के लिए कोई सांकेतिक रिकॉर्ड नहीं मिला। "ग्लूकोज", "रक्तचाप", या "शतपदी" खोज कर देखें।`
                  : `No synthetic records matched "${searchQuery}". Try searching "glucose", "blood pressure", or "routine".`}
              </p>
            </div>
          ) : (
            /* Results List */
            <div className="sw-search-results-list" role="listbox">
              {results.map((res, index) => (
                <div
                  key={res.id}
                  className={`sw-search-result-item ${
                    selectedIndex === index ? 'sw-search-result-item--selected' : ''
                  }`}
                  onClick={() => handleSelectResult(res)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={selectedIndex === index}
                  tabIndex={0}
                >
                  <div className="sw-search-result-top">
                    <span className="sw-search-badge-tag">
                      {getCategoryIcon(res.category)}
                      <span>{isHindi ? res.categoryLabelHi : res.categoryLabelEn}</span>
                    </span>
                    {res.date && <span className="sw-search-result-date">{res.date}</span>}
                  </div>

                  <strong className="sw-search-result-title">
                    {isHindi ? res.titleHi : res.titleEn}
                  </strong>

                  <p className="sw-search-result-snippet">
                    {isHindi ? res.snippetHi : res.snippetEn}
                  </p>

                  <div className="sw-search-result-action">
                    <span>{isHindi ? 'देखें' : 'Navigate'}</span>
                    <ArrowRight size={13} className="sw-search-result-arrow" aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="sw-search-footer">
          <div className="sw-search-footer__keys">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> {isHindi ? 'नेविगेट' : 'Navigate'}
            </span>
            <span>
              <kbd>↵</kbd> {isHindi ? 'चयन करें' : 'Select'}
            </span>
            <span>
              <kbd>ESC</kbd> {isHindi ? 'बंद करें' : 'Close'}
            </span>
          </div>
          <span className="sw-search-footer__tag">
            {isHindi ? 'सांकेतिक प्रोटोटाइप खोज' : 'Synthetic Prototype Search'}
          </span>
        </div>
      </div>
    </div>
  );
};
