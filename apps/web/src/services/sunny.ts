import { getWeather } from './weather';

export const isSunny = (cellId: string = '876526addffffff', fetchWeather: (cellId: string) => any = getWeather) => {
  return fetchWeather(cellId).then((results: any) => {
    return results[0].current_weather.solar_irradiance > 500;
  });
}
  