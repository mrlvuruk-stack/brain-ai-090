import { useContext } from 'react';
import { PrototypeContext } from './contextDef';
import type { PrototypeContextType } from './contextDef';

export const usePrototype = (): PrototypeContextType => {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('usePrototype must be used within a PrototypeProvider');
  }
  return context;
};
