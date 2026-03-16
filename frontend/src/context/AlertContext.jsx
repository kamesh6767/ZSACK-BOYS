import { createContext, useContext, useState, useEffect } from 'react';
import { mockAlerts } from '../data/mockData';

const AlertContext = createContext(null);

const EXTENDED_ALERTS = [
  ...mockAlerts,
  { id: 'ALT-007', type: 'critical', title: 'Mass Duplicate Registration Detected', message: '34 beneficiaries registered with sequential IDs in Uttar Pradesh in a 2-hour window', time: '1 day ago', read: false },
  { id: 'ALT-008', type: 'high', title: 'Cross-Scheme Fraud Pattern', message: 'Beneficiary BNF-007 claims across NREGA, PM-KISAN, and NSAP simultaneously', time: '2 days ago', read: true },
  { id: 'ALT-009', type: 'medium', title: 'Geolocation Anomaly', message: '12 beneficiaries claiming rural PM-KISAN benefits from urban IP addresses', time: '2 days ago', read: true },
  { id: 'ALT-010', type: 'low', title: 'Scan Completed', message: 'Weekly automated fraud scan completed — 284,750 records processed', time: '3 days ago', read: true },
];

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState(() => {
    const stored = localStorage.getItem('cybershield_alerts');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return EXTENDED_ALERTS;
      }
    }
    return EXTENDED_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem('cybershield_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const markRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <AlertContext.Provider value={{
      alerts,
      unreadCount,
      markRead,
      markAllRead,
      dismissAlert,
      setAlerts
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertContext);
