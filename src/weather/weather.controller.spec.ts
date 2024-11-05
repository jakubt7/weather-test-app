import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service'; 
import { BadRequestException } from '@nestjs/common';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn(),
            calculateTemperatures: jest.fn(), 
          },
        },
      ],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should return min, max, and avg temperatures for valid days parameter', async () => {
    const mockWeatherData = {
      daily: [
        { temp: { day: 15 } },
        { temp: { day: 20 } },
        { temp: { day: 18 } },
      ],
    };

    const mockTemperatures = { min: 15, max: 20, avg: 17.67 };

    jest.spyOn(weatherService, 'getWeather').mockResolvedValue(mockWeatherData);
    jest.spyOn(weatherService, 'calculateTemperatures').mockReturnValue(mockTemperatures);

    const result = await weatherController.getTemperatureInfo('3');
    
    expect(weatherService.getWeather).toHaveBeenCalledWith(3); 
    expect(weatherService.calculateTemperatures).toHaveBeenCalledWith(mockWeatherData, 3);
    expect(result).toEqual(mockTemperatures);
  });

  it('should throw BadRequestException for invalid days parameter (non-numeric)', async () => {
    await expect(weatherController.getTemperatureInfo('invalid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for invalid days parameter (negative number)', async () => {
    await expect(weatherController.getTemperatureInfo('-5')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for days greater than 5', async () => {
    await expect(weatherController.getTemperatureInfo('6')).rejects.toThrow(
      BadRequestException,
    );
  });
});
