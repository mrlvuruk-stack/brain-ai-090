import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '../routes/AppRouter';
import { PrototypeProvider } from '../state/PrototypeContext';
import { ToastContainer } from '../components/ui/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PrototypeProvider>
        <AppRouter />
        <ToastContainer />
      </PrototypeProvider>
    </BrowserRouter>
  );
};

export default App;
