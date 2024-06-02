import { describe, expect, test, vi } from 'vitest';

import { isSunny } from './sunny';
import { getWeather } from './weather';

describe('sunny service', () => {
  test('#isSunny', async () => {
    const mockedGetSunnyWeather = vi.fn().mockResolvedValue([{ current_weather: { solar_irradiance: 600 } }]);
    const sunnyResult = await isSunny('876526addffffff', mockedGetSunnyWeather);
    expect(typeof sunnyResult).toBe('boolean');
    expect(sunnyResult).toBe(true);

    const mockedGetRainyWeather = vi.fn().mockResolvedValue([{ current_weather: { solar_irradiance: 100 } }]);
    const rainyResult = await isSunny('876526addffffff', mockedGetRainyWeather);
    expect(typeof rainyResult).toBe('boolean');
    expect(rainyResult).toBe(false);
  });
});
