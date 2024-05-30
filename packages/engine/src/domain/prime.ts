// import got from 'got';

// trim numbers
export const findNPrimes = (n: number, start: number = 0) => {
  const endpoint = 'http://localhost:3000';
  return fetch(endpoint + '/api/prime?n=' + n + '&start=' + start).then((res) =>
    res.json(),
  );
};
