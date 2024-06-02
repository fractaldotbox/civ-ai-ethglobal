import got from 'got';

export const getWeather = (cellId: string = '876526addffffff') => {
  let url = `https://api.weatherxm.com/api/v1/cells/${cellId}/devices`
  return got(url).json();
};

