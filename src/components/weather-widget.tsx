import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  visibility: number
  dustLevel: 'low' | 'medium' | 'high'
  cleaningRecommendation: string
  uvIndex: number
  dailySoilingRate: number // % per day based on conditions
}

interface WeatherWidgetProps {
  className?: string
}

export function WeatherWidget({ className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 32.8,
    humidity: 45,
    windSpeed: 12,
    condition: 'sunny',
    visibility: 8.5,
    dustLevel: 'medium',
    cleaningRecommendation: 'High dust - cleaning recommended',
    uvIndex: 8.5,
    dailySoilingRate: 0.25
  })

  // Simulate realistic weather updates based on research data
  useEffect(() => {
    const interval = setInterval(() => {
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy']
      const dustLevels: WeatherData['dustLevel'][] = ['low', 'medium', 'high']
      
      // Realistic temperature range for Rajasthan
      const temperature = 28 + Math.random() * 15 // 28-43°C realistic range
      const humidity = 20 + Math.random() * 50 // 20-70% humidity range
      const windSpeed = 8 + Math.random() * 20 // 8-28 km/h wind range
      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      const visibility = condition === 'rainy' ? 3 + Math.random() * 4 : 6 + Math.random() * 5
      
      // Realistic dust level calculation based on wind and humidity
      let dustLevel: WeatherData['dustLevel'] = 'medium'
      let dailySoilingRate = 0.25 // Base rate for medium dust
      
      if (windSpeed > 20 && humidity < 30) {
        dustLevel = 'high'
        dailySoilingRate = 0.45 // High soiling rate in dusty conditions
      } else if (windSpeed < 10 && humidity > 60) {
        dustLevel = 'low'
        dailySoilingRate = 0.15 // Low soiling rate in calm, humid conditions
      }
      
      // Cleaning recommendation based on multiple factors
      const cleaningRecommendation = getRealisticCleaningRecommendation(condition, dustLevel, windSpeed, humidity)
      
      const newWeather: WeatherData = {
        temperature,
        humidity,
        windSpeed,
        condition,
        visibility,
        dustLevel,
        cleaningRecommendation,
        uvIndex: condition === 'sunny' ? 7 + Math.random() * 4 : 3 + Math.random() * 3,
        dailySoilingRate
      }
      
      setWeather(newWeather)
    }, 30000) // Update every 30 seconds for more realistic intervals

    return () => clearInterval(interval)
  }, [])

  const getRealisticCleaningRecommendation = (
    condition: WeatherData['condition'],
    dustLevel: WeatherData['dustLevel'],
    windSpeed: number,
    humidity: number
  ): string => {
    // Industry-based cleaning recommendations
    if (condition === 'rainy') {
      return 'Rain expected - delay cleaning (natural washing)'
    }
    
    if (dustLevel === 'high' && windSpeed > 15) {
      return 'High dust conditions - immediate cleaning recommended'
    }
    
    if (dustLevel === 'high') {
      return 'Cleaning recommended within 24 hours'
    }
    
    if (dustLevel === 'medium' && humidity < 40) {
      return 'Consider cleaning in 2-3 days'
    }
    
    if (dustLevel === 'low' && condition === 'sunny') {
      return 'Optimal conditions - schedule cleaning now'
    }
    
    return 'Monitor conditions - cleaning in 5-7 days'
  }

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-accent-warning" />
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-text-secondary" />
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-accent-info" />
      case 'windy':
        return <Wind className="h-8 w-8 text-accent-primary" />
      default:
        return <Sun className="h-8 w-8 text-accent-warning" />
    }
  }

  const getDustLevelColor = () => {
    switch (weather.dustLevel) {
      case 'low':
        return 'bg-accent-success/20 text-accent-success'
      case 'medium':
        return 'bg-accent-warning/20 text-accent-warning'
      case 'high':
        return 'bg-accent-error/20 text-accent-error'
      default:
        return 'bg-text-secondary/20 text-text-secondary'
    }
  }

  const getConditionColor = () => {
    switch (weather.condition) {
      case 'sunny':
        return 'text-accent-warning'
      case 'cloudy':
        return 'text-text-secondary'
      case 'rainy':
        return 'text-accent-info'
      case 'windy':
        return 'text-accent-primary'
      default:
        return 'text-text-secondary'
    }
  }

  return (
    <Card className={`bg-surface-overlay border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-text-primary flex items-center gap-2">
          {getWeatherIcon()}
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Weather Display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {weather.temperature.toFixed(1)}°C
              </div>
              <div className={`text-sm font-medium capitalize ${getConditionColor()}`}>
                {weather.condition}
              </div>
            </div>
            <div className="text-right">
              <Badge 
                className={`text-xs mb-2 ${getDustLevelColor()}`}
              >
                {weather.dustLevel} dust
              </Badge>
              <div className="text-xs text-text-secondary">
                Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Weather Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-accent-info" />
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {weather.humidity.toFixed(0)}%
                  </div>
                  <div className="text-xs text-text-secondary">Humidity</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-accent-primary" />
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {weather.windSpeed.toFixed(0)} km/h
                  </div>
                  <div className="text-xs text-text-secondary">Wind Speed</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-accent-warning" />
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {weather.visibility.toFixed(1)} km
                  </div>
                  <div className="text-xs text-text-secondary">Visibility</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-text-primary">
                  {weather.condition === 'rainy' ? '85%' : weather.condition === 'cloudy' ? '45%' : '15%'}
                </div>
                <div className="text-xs text-text-secondary">Rain Chance</div>
              </div>
            </div>
          </div>

          {/* Cleaning Recommendation */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-primary mt-2 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-text-primary mb-1">
                  Cleaning Recommendation
                </div>
                <div className="text-xs text-text-secondary">
                  {weather.cleaningRecommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Impact Assessment - Industry Based */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-surface-base rounded p-2">
              <div className="text-lg font-semibold text-text-primary">
                -{(weather.dailySoilingRate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-text-secondary">Daily Soiling Rate</div>
            </div>
            <div className="bg-surface-base rounded p-2">
              <div className="text-lg font-semibold text-text-primary">
                {weather.condition === 'sunny' ? '95%' : weather.condition === 'cloudy' ? '70%' : '30%'}
              </div>
              <div className="text-xs text-text-secondary">Solar Irradiance</div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">UV Index:</span>
                <span className="text-text-primary font-medium">{weather.uvIndex.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Air Quality:</span>
                <span className={`font-medium ${weather.dustLevel === 'high' ? 'text-accent-error' : weather.dustLevel === 'medium' ? 'text-accent-warning' : 'text-accent-success'}`}>
                  {weather.dustLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
