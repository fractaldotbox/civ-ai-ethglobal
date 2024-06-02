import { describe, expect, test, vi } from 'vitest';
import { getWeather } from './weather';

describe('weather api', () => {
  test('#getWeather', async () => {
    const results = await getWeather();
    // expect the result to be an array that is not empty
    expect(results).toBeInstanceOf(Array);
    expect(results).not.toEqual([]);

    // expect the result to be an array of objects and not empty
    expect(results[0]).toBeInstanceOf(Object);
    expect(results[0]).not.toEqual({});
    // the object should have the following structure
    expect(results[0]).toHaveProperty('current_weather');
    expect(results[0].current_weather).toHaveProperty('solar_irradiance');
    // expect the solar_irradiance to be a number
    expect(typeof results[0].current_weather.solar_irradiance).toBe('number');
  });
});
