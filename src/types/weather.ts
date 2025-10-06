export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  date: string;
  icon?: string;
  isHistorical?: boolean;
  note?: string;
  rainfallProbability?: number; // New field
  humidity?: number;
}

export interface WeatherForecastProps {
  defaultCity?: string;
  className?: string;
}

// API-specific types
export interface ForecastItem {
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

export interface WeatherApiResponse {
  city: {
    name: string;
  };
  list: ForecastItem[];
}

export interface GeoData {
  lat: number;
  lon: number;
  name: string;
  country: string;
}