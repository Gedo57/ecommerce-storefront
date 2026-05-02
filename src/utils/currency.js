export const supportedCurrencies = {
  USD: { code: 'USD', label: 'دولار', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', label: 'يورو', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', label: 'إسترليني', symbol: '£', rate: 0.79 },
};

export function convertAmount(amount, currencyCode = 'USD') {
  const currency = supportedCurrencies[currencyCode] ?? supportedCurrencies.USD;
  return Number(amount) * currency.rate;
}

export function formatMoney(amount, currencyCode = 'USD') {
  const currency = supportedCurrencies[currencyCode] ?? supportedCurrencies.USD;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 2,
  }).format(convertAmount(amount, currencyCode));
}
