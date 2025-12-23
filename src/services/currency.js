// Simple currency service with hardcoded rates for demo
// In production, fetch from API

const rates = {
  RON: 1,
  EUR: 4.9, // approximate
  USD: 4.6
};

export async function getExchangeRates(base = 'RON') {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rates);
    }, 500);
  });
}

export function convertAmount(amount, from, to, rates) {
  if (from === to) return amount;
  const amountInBase = amount / rates[from];
  return amountInBase * rates[to];
}
