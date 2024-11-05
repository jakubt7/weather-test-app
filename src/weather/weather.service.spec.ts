import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
  });

  describe('calculateTemperatures', () => {
    it('should correctly calculate min, max, and avg temperatures for 3 days', () => {
      // Mocking 3 days of weather data (8 intervals per day)
      const mockWeatherData = {
        list: [
          { main: { temp: 12 } }, { main: { temp: 15 } }, { main: { temp: 18 } }, { main: { temp: 16 } }, 
          { main: { temp: 20 } }, { main: { temp: 17 } }, { main: { temp: 19 } }, { main: { temp: 14 } }, // Day 1 (8 intervals)
          { main: { temp: 10 } }, { main: { temp: 11 } }, { main: { temp: 15 } }, { main: { temp: 18 } }, 
          { main: { temp: 12 } }, { main: { temp: 13 } }, { main: { temp: 14 } }, { main: { temp: 17 } }, // Day 2 (8 intervals)
          { main: { temp: 10 } }, { main: { temp: 12 } }, { main: { temp: 16 } }, { main: { temp: 18 } }, 
          { main: { temp: 15 } }, { main: { temp: 16 } }, { main: { temp: 17 } }, { main: { temp: 19 } }, // Day 3 (8 intervals)
        ],
      };

      // Run the method for 3 days
      const result = weatherService.calculateTemperatures(mockWeatherData, 3);

      expect(result.min).toBe(10); // Lowest temperature
      expect(result.max).toBe(20); // Highest temperature
      expect(result.avg).toBeCloseTo(15.17, 2); // Average with 2 decimal precision
    });

    it('should correctly calculate min, max, and avg temperatures for 1 day', () => {
      // Mocking 1 day of weather data (8 intervals)
      const mockWeatherData = {
        list: [
          { main: { temp: 15 } }, { main: { temp: 17 } }, { main: { temp: 19 } }, { main: { temp: 16 } }, 
          { main: { temp: 20 } }, { main: { temp: 18 } }, { main: { temp: 14 } }, { main: { temp: 12 } }, // 1 day (8 intervals)
        ],
      };

      // Run the method for 1 day
      const result = weatherService.calculateTemperatures(mockWeatherData, 1);

      expect(result.min).toBe(12); // Lowest temperature
      expect(result.max).toBe(20); // Highest temperature
      expect(result.avg).toBeCloseTo(16.38, 2); // Average with 2 decimal precision
    });

    it('should handle negative temperatures correctly', () => {
      // Mocking 2 days of weather data with negative temperatures
      const mockWeatherData = {
        list: [
          { main: { temp: -5 } }, { main: { temp: -10 } }, { main: { temp: -3 } }, { main: { temp: -7 } },
          { main: { temp: -6 } }, { main: { temp: -4 } }, { main: { temp: -2 } }, { main: { temp: -8 } }, // Day 1
          { main: { temp: -9 } }, { main: { temp: -11 } }, { main: { temp: -5 } }, { main: { temp: -12 } },
          { main: { temp: -3 } }, { main: { temp: -6 } }, { main: { temp: -4 } }, { main: { temp: -7 } }, // Day 2
        ],
      };

      // Run the method for 2 days
      const result = weatherService.calculateTemperatures(mockWeatherData, 2);

      expect(result.min).toBe(-12); // Lowest temperature
      expect(result.max).toBe(-2); // Highest temperature
      expect(result.avg).toBeCloseTo(-6.37, 2); // Average with 2 decimal precision
    });

    it('should handle an empty list of temperatures', () => {
      // Mocking empty weather data
      const mockWeatherData = { list: [] };

      // Run the method for 1 day (but empty data)
      const result = weatherService.calculateTemperatures(mockWeatherData, 1);

      expect(result.min).toBe(Infinity); 
      expect(result.max).toBe(-Infinity);
      expect(result.avg).toBe(NaN); 
    });
  });
});
