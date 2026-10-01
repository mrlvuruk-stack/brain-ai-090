import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { usePrototype } from '../../state';
import type { InjectedAssistantContext } from '../../data/intelligenceTypes';
import './ContextualAskButton.css';

interface ContextualAskButtonProps {
  context: InjectedAssistantContext;
  labelEn?: string;
  labelHi?: string;
  variant?: 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export const ContextualAskButton: React.FC<ContextualAskButtonProps> = ({
  context,
  labelEn = 'Ask SwasthyaAI about this',
  labelHi = 'इसके बारे में AI से पूछें',
  variant = 'outline',
  size = 'md',
  className = '',
}) => {
  const navigate = useNavigate();
  const { askAboutContext, language } = usePrototype();
  const isHindi = language === 'hi';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    askAboutContext(context);
    navigate('/prototype/assistant');
  };

  return (
    <button
      type="button"
      className={`sw-contextual-ask-btn sw-contextual-ask-btn--${variant} sw-contextual-ask-btn--${size} ${className}`}
      onClick={handleClick}
      aria-label={`${isHindi ? labelHi : labelEn}: ${
        isHindi ? context.sourceTitleHi : context.sourceTitleEn
      }`}
    >
      <Sparkles size={size === 'sm' ? 13 : 15} className="sw-contextual-ask-btn__icon" aria-hidden="true" />
      <span>{isHindi ? labelHi : labelEn}</span>
    </button>
  );
};
