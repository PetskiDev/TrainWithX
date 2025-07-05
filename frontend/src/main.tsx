import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@frontend/context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { PaddleProvider } from '@frontend/context/PaddleContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PaddleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PaddleProvider>
    </AuthProvider>
  </StrictMode>
);
