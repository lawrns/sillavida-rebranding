/**
 * ConsentManager Component Tests
 * 
 * This file contains tests for the ConsentManager component, which handles
 * user consent for analytics tracking.
 */

import React from 'react';
import { render, screen, waitFor } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import ConsentManager from '../ConsentManager';
import { CONSENT_MODES } from '../../../config/analytics';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn((index: number) => ''),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.gtag
window.gtag = jest.fn();

describe('ConsentManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });
  
  it('renders the consent banner when no consent has been given', () => {
    render(<ConsentManager />);
    
    // Check if the banner is displayed
    expect(screen.getByText('Preferencias de Cookies')).toBeInTheDocument();
    expect(screen.getByText(/Utilizamos cookies para mejorar su experiencia/)).toBeInTheDocument();
    
    // Check if buttons are displayed
    expect(screen.getByText('Solo Necesarias')).toBeInTheDocument();
    expect(screen.getByText('Aceptar Todas')).toBeInTheDocument();
  });
  
  it('does not render the banner when consent has been given', () => {
    // Set consent in localStorage
    localStorageMock.setItem('sillavida-consent-preferences', JSON.stringify({
      analytics_storage: CONSENT_MODES.GRANTED,
      ad_storage: CONSENT_MODES.GRANTED,
    }));
    
    render(<ConsentManager />);
    
    // Check if the banner is not displayed
    expect(screen.queryByText('Preferencias de Cookies')).not.toBeInTheDocument();
  });
  
  it('saves full consent preferences when "Aceptar Todas" is clicked', async () => {
    const user = userEvent.setup();
    
    render(<ConsentManager />);
    
    // Click the "Aceptar Todas" button
    const acceptAllButton = screen.getByText('Aceptar Todas');
    await user.click(acceptAllButton);
    
    // Check if consent was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'sillavida-consent-preferences',
      expect.stringContaining(CONSENT_MODES.GRANTED)
    );
    
    // Check if gtag was called with the correct parameters
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({
      analytics_storage: CONSENT_MODES.GRANTED,
      ad_storage: CONSENT_MODES.GRANTED,
    }));
    
    // Check if the banner is hidden
    await waitFor(() => {
      expect(screen.queryByText('Preferencias de Cookies')).not.toBeInTheDocument();
    });
  });
  
  it('saves necessary consent preferences when "Solo Necesarias" is clicked', async () => {
    const user = userEvent.setup();
    
    render(<ConsentManager />);
    
    // Click the "Solo Necesarias" button
    const necessaryButton = screen.getByText('Solo Necesarias');
    await user.click(necessaryButton);
    
    // Check if consent was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'sillavida-consent-preferences',
      expect.stringContaining(CONSENT_MODES.DENIED)
    );
    
    // Check if gtag was called with the correct parameters
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({
      analytics_storage: CONSENT_MODES.DENIED,
      ad_storage: CONSENT_MODES.DENIED,
    }));
    
    // Check if the banner is hidden
    await waitFor(() => {
      expect(screen.queryByText('Preferencias de Cookies')).not.toBeInTheDocument();
    });
  });
});
