export const getWeather = (cellId: string = '876526addffffff') => {
  const domain = process.env.NEXT_PUBLIC_WEATHERXM_DOMAIN || 'https://api.weatherxm.com/api/v1';
  console.log('the weatherxm domain is ', domain);
  const endpoint = `${domain}/cells/${cellId}/devices`
  return fetch(endpoint).then((res) =>
    res.json(),
  );
};
