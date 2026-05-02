import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { formatMoney, supportedCurrencies } from '../utils/currency';

const STORAGE_KEY = 'storefront-currency';
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem(STORAGE_KEY) || 'USD');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const value = useMemo(() => ({
    currency,
    setCurrency,
    supportedCurrencies: Object.values(supportedCurrencies),
    formatPrice: (amount) => formatMoney(amount, currency),
  }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
