import { NextRequest, NextResponse } from 'next/server';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  date: string;
  icon?: string;
  isHistorical?: boolean;
  note?: string;
  rainfallProbability?: number;
  humidity?: number;
}

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  pop?: number; // Probability of precipitation
}

interface WeatherApiResponse {
  city: {
    name: string;
  };
  list: ForecastItem[];
}

interface GeoData {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { date, city = 'Brits, ZA' } = await request.json();

  if (!date) {
    return NextResponse.json({ message: 'Date is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    const targetDate = new Date(date);
    const today = new Date();
    const daysDifference = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // If date is within 5 days, use actual forecast
    if (daysDifference <= 5) {
      // Get city coordinates first
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
      );

      const geoData: GeoData[] = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        return NextResponse.json({ message: 'City not found' }, { status: 404 });
      }

      const { lat, lon } = geoData[0];

      // Get 5-day forecast
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      const weatherData: WeatherApiResponse = await weatherResponse.json();

      // Find forecast for the selected date
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const forecast = weatherData.list.find((item: ForecastItem) =>
        item.dt_txt.includes(targetDateStr)
      );

      if (!forecast) {
        return NextResponse.json({ message: 'Forecast not available for this date' }, { status: 404 });
      }

      const weather: WeatherData = {
        location: weatherData.city.name,
        temperature: forecast.main.temp,
        description: forecast.weather[0].description,
        date: date,
        icon: forecast.weather[0].icon,
        rainfallProbability: forecast.pop ? Math.round(forecast.pop * 100) : 0, // Convert to percentage
        humidity: forecast.main.humidity,
        isHistorical: false,
      };

      return NextResponse.json(weather);
    } else {
      // For dates beyond 5 days, use historical averages for Brits, South Africa
      // Historical weather data for Brits in late March (autumn season)
      if (targetDate.getHours() < 20) {
        const historicalData = {
          temperature: 27,
          description: 'Warm middag toestande, gedeeltelik bewolk, met min tot geen kans vir reën.',
          icon: '02d',
          rainfallProbability: 25, 
          humidity: 50, 
          note: 'Gebasseer op historiese gemiddelde temperature vir laat Maart in Brits'
        };

        const weather: WeatherData = {
          location: 'Brits, Suid-Afrika',
          temperature: historicalData.temperature,
          description: historicalData.description,
          date: date,
          icon: historicalData.icon,
          rainfallProbability: historicalData.rainfallProbability,
          humidity: historicalData.humidity,
          isHistorical: true,
          note: historicalData.note,
        };

        return NextResponse.json(weather);

      } else {
        const historicalData = {
          temperature: 18,
          description: 'Koel tot matig, met oop tot bewolkte-aand, met lae kanse vir reën.',
          icon: '02n',
          rainfallProbability: 15, // 15% chance of rain based on historical data
          humidity: 60, // Average humidity
          note: 'Gebasseer op historiese gemiddelde temperature vir laat Maart in Brits'
        };

        const weather: WeatherData = {
          location: 'Brits, Suid-Afrika',
          temperature: historicalData.temperature,
          description: historicalData.description,
          date: date,
          icon: historicalData.icon,
          rainfallProbability: historicalData.rainfallProbability,
          humidity: historicalData.humidity,
          isHistorical: true,
          note: historicalData.note,
        };

        return NextResponse.json(weather);

      }
    }

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Weather API - Use POST method with date and city parameters' },
    { status: 200 }
  );
}