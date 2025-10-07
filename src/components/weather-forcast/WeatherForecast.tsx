'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';

interface WeatherForecastProps {
  targetDate: string; // Add this prop
  city?: string; // Optional city prop
}

const WeatherForecast = ({ targetDate, city = 'Brits, ZA' }: WeatherForecastProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: targetDate,
            city: city,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [targetDate, city]); // Add dependencies

  const formattedDate = new Date(targetDate).toLocaleDateString('af-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const time = targetDate.substring(11,targetDate.length-3);

  return (
    <div className="weather-section max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Weervoorspelling vir {time}
      </h2>
      
      <div className="text-center mb-4">
        <div className="text-lg font-semibold text-gray-700">
          {formattedDate}
        </div>
        <div className="text-sm text-gray-500 mt-1">{city}</div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laai tans...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {weather && !loading && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">{weather.location}</div>
            
            {weather.icon && (
              <div className="my-2">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                  alt={weather.description}
                  className="mx-auto w-16 h-16"
                />
              </div>
            )}
            
            <div className="text-3xl font-bold text-gray-900 my-2">
              {Math.round(weather.temperature)}°C
            </div>
            
            <div className="text-gray-600 capitalize mb-4">{weather.description}</div>
            
            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 font-semibold">Kans vir Reën</div>
                <div className="text-xl font-bold text-blue-800">
                  {weather.rainfallProbability}%
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-600 font-semibold">Humiditeit</div>
                <div className="text-xl font-bold text-green-800">
                  {weather.humidity}%
                </div>
              </div>
            </div>

            {weather.isHistorical && weather.note && (
              <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-700">{weather.note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;