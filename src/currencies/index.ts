export const currencies = ['AUDUSD', 'USDBRL', 'EURUSD', 'USDARS', 'USDEGP', 'USDINR', 'USDTRY', 'AUDCAD', 'GBPAUD', 'GBPJPY', 'USDCOP', 'USDIDR', 'USDMXN', 'EURAUD', 'CADJPY', 'EURCHF', 'EURGBP', 'GBPUSD', 'NZDCHF', 'USDCAD', 'USDCHF', 'USDNGN', 'EURCAD', 'NZDCAD', 'USDJPY', 'USDPHP', 'CADCHF', 'NZDJPY', 'AUDJPY', 'CHFJPY', 'EURJPY', 'USDPKR', 'AUDCHF', 'USDBDT', 'USDDZD'] as const;

export const currenciesLookup = currencies.reduce((acc, v) => acc.set(v, true), new Map());

export type TCurrencie = typeof currencies[number];
