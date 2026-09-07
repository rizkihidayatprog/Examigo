import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './components/Toast';
import App from './App';
import './index.css';

const theme = createTheme({
  primaryColor: 'emerald',
  colors: {
    emerald: [
      'var(--theme-mint-light, #ECFDF5)',
      'var(--theme-mint-subtle, #D1FAE5)',
      'var(--theme-border, #A7F3D0)',
      'var(--theme-primary-light, #6EE7B7)',
      'var(--theme-primary-light, #34D399)',
      'var(--theme-primary, #10B981)',
      'var(--theme-primary, #059669)',
      'var(--theme-text-muted, #047857)',
      'var(--theme-primary-dark, #065F46)',
      'var(--theme-primary-dark, #064E3B)',
    ],
    mint: [
      'var(--theme-bg, #F0FDF4)',
      '#DCFCE7',
      '#BBF7D0',
      '#86EFAC',
      '#4ADE80',
      '#22C55E',
      '#16A34A',
      '#15803D',
      '#166534',
      '#14532D',
    ],
  },
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
