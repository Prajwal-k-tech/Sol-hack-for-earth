import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  AlertCircle,
  Sun,
  Cloud
} from 'lucide-react';

const WeatherWidget = ({ weatherData }) => {
  const current = weatherData?.current || {
    temperature: 32,
    humidity: 45,
    windSpeed: 12,
    pm25: 68,
    condition: 'Partly Cloudy',
    uvIndex: 8,
    visibility: 10
  };

  const alert = weatherData?.alerts?.[0];

  const getPM25Status = (value) => {
    if (value <= 50) return { status: 'Good', color: 'green' };
    if (value <= 100) return { status: 'Moderate', color: 'yellow' };
    if (value <= 150) return { status: 'Unhealthy for Sensitive', color: 'orange' };
    return { status: 'Unhealthy', color: 'red' };
  };

  const pm25Status = getPM25Status(current.pm25);

  const getWeatherIcon = (condition) => {
    if (condition.toLowerCase().includes('cloudy')) return Cloud;
    if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) return Sun;
    return Cloud;
  };

  const WeatherIcon = getWeatherIcon(current.condition);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weather Conditions</h3>
      
      {/* Weather Alert */}
      {alert && (
        <div className={`p-3 rounded-lg border-l-4 ${
          alert.severity === 'high' 
            ? 'bg-red-50 border-red-400 dark:bg-red-900/50 dark:border-red-500' 
            : 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-500'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-4 h-4 ${
              alert.severity === 'high' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
            }`} />
            <p className={`text-sm font-medium ${
              alert.severity === 'high' ? 'text-red-800 dark:text-red-300' : 'text-yellow-800 dark:text-yellow-300'
            }`}>
              {alert.message}
            </p>
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <WeatherIcon className="w-8 h-8 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{current.condition}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current conditions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{current.temperature}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Humidity</p>
              <p className="font-semibold text-gray-900 dark:text-white">{current.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Wind Speed</p>
              <p className="font-semibold text-gray-900 dark:text-white">{current.windSpeed} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">UV Index</p>
              <p className="font-semibold text-gray-900 dark:text-white">{current.uvIndex}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Visibility</p>
              <p className="font-semibold text-gray-900 dark:text-white">{current.visibility} km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Air Quality */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 mb-3 dark:text-white">Air Quality Impact</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">PM2.5 Level</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">{current.pm25} μg/m³</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                pm25Status.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                pm25Status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                pm25Status.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {pm25Status.status}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full ${
                pm25Status.color === 'green' ? 'bg-green-500' :
                pm25Status.color === 'yellow' ? 'bg-yellow-500' :
                pm25Status.color === 'orange' ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min((current.pm25 / 200) * 100, 100)}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            High PM2.5 levels increase soiling rate by up to 23%
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 mb-3 dark:text-white">3-Day Forecast</h4>
        
        <div className="space-y-2">
          {(weatherData?.forecast || [
            { day: 'Today', temp: 32, condition: 'Partly Cloudy', soilingRisk: 'low' },
            { day: 'Tomorrow', temp: 35, condition: 'Dusty', soilingRisk: 'high' },
            { day: 'Day 3', temp: 30, condition: 'Cloudy', soilingRisk: 'medium' }
          ]).map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <WeatherIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{day.day}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{day.condition}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{day.temp}°C</span>
                <div className={`w-2 h-2 rounded-full ${
                  day.soilingRisk === 'low' ? 'bg-green-500' :
                  day.soilingRisk === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} title={`${day.soilingRisk} soiling risk`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
