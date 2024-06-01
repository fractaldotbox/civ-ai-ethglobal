export const getWeather = (cellId: string = '876526addffffff') => {
  const domain = process.env.WEATHERXM_DOMAIN || 'https://api.weatherxm.com/api/v1';
  const endpoint = `${domain}/cells/${cellId}/devices`
  return fetch(endpoint).then((res) =>
    res.json(),
  );
};
