import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('api')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('temperature-info')
  async getTemperatureInfo(@Query('days') days: string) {
    const numberOfDays = parseInt(days, 10);

    if (isNaN(numberOfDays) || numberOfDays <= 0 || numberOfDays > 5) {
      throw new BadRequestException('Invalid number of days, enter number between 1 and 5');
    }

    const weatherData = await this.weatherService.getWeather(numberOfDays);
    const temperatures = this.weatherService.calculateTemperatures(weatherData, numberOfDays);

    console.log(temperatures);
    return temperatures;
  }
}
