import got from 'got';

export const findNewPrime = (n: number, currentPrimes = []) => {};

export const findNPrimes = (n: number) => {
  return got('/api/prime?q=' + n).json();
};
