import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private apiKey = ''; 
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  private latitude = '51.9356';
  private longtitude = '15.5062';

  async getWeather(days: number): Promise<any> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          lat: this.latitude,
          lon: this.longtitude,
          appid: this.apiKey,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching weather data: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  calculateTemperatures(data: any, days: number): { min: number; max: number; avg: number } {
    const temps: number[] = [];

    const forecastsPerDay = 8;
    const maxIntervals = days * forecastsPerDay;

    data.list.slice(0, maxIntervals).forEach((entry: any) => {
      temps.push(entry.main.temp);
    });

    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = temps.reduce((sum: number, current: number) => sum + current, 0) / temps.length;

    return { min, max, avg };
  }
}
