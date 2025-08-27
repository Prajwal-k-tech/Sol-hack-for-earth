import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, TrendingDown } from "lucide-react"
import { defaultSystemProfile, calculateSolarIrradiance } from "@/lib/solar-calculations"

interface LivePowerMeterProps {
  className?: string
}

export function LivePowerMeter({ className }: LivePowerMeterProps) {
  const [currentPower, setCurrentPower] = useState(847.2)
  const [previousPower, setPreviousPower] = useState(847.2)
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable')
  const [dailyGeneration, setDailyGeneration] = useState(0)

  // Simulate realistic power generation updates based on industry data
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousPower(currentPower)
      
      const now = new Date()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      
      // Realistic solar power generation curve based on time of day
      let powerOutput = 0
      
      if (hour >= 6 && hour <= 18) {
        // Daylight hours - realistic solar curve
        const hoursFromSunrise = hour - 6 + minutes / 60
        const dayLength = 12 // 12 hours of daylight
        
        // Bell curve for solar generation (peaks at noon)
        const solarAngle = (hoursFromSunrise / dayLength) * Math.PI
        const baseGeneration = Math.sin(solarAngle)
        
        // Apply realistic factors
        const maxCapacity = defaultSystemProfile.capacity // 1000 kW
        const irradianceFactor = calculateSolarIrradiance(now, defaultSystemProfile.location) / 5.5 // Normalize
        const cloudCover = 0.85 + Math.random() * 0.15 // 85-100% clear sky factor
        const temperatureFactor = 0.96 // Temperature derating
        const soilingLoss = 0.92 // 8% soiling loss (realistic)
        
        powerOutput = maxCapacity * baseGeneration * irradianceFactor * cloudCover * temperatureFactor * soilingLoss
        
        // Add small random variations (±2%)
        const variation = (Math.random() - 0.5) * 0.04
        powerOutput *= (1 + variation)
        
      } else {
        // Night time - minimal or no generation
        powerOutput = Math.random() * 5 // 0-5 kW (inverter losses, etc.)
      }
      
      setCurrentPower(Math.max(0, powerOutput))
      
      // Calculate daily generation (simplified accumulation)
      setDailyGeneration(prev => {
        if (hour === 6 && minutes === 0) return 0 // Reset at sunrise
        return prev + (powerOutput / 60) // Add kWh per minute
      })
      
      // Determine trend
      if (powerOutput > currentPower * 1.02) {
        setTrend('up')
      } else if (powerOutput < currentPower * 0.98) {
        setTrend('down')
      } else {
        setTrend('stable')
      }
    }, 60000) // Update every minute for more realistic intervals

    return () => clearInterval(interval)
  }, [currentPower])

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-accent-success" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-accent-error" />
      default:
        return <Zap className="h-4 w-4 text-accent-warning" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-accent-success'
      case 'down':
        return 'text-accent-error'
      default:
        return 'text-accent-warning'
    }
  }

  const powerPercentage = Math.min((currentPower / defaultSystemProfile.capacity) * 100, 100)
  const revenueRate = 8.5 // ₹8.5 per kWh realistic commercial rate
  const hourlyRevenue = currentPower * revenueRate
  const projectedDaily = dailyGeneration + (currentPower * (18 - new Date().getHours()) / 1000) // Estimate remaining generation

  return (
    <Card className={`bg-surface-overlay border-border ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-text-primary flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent-warning" />
          Live Power Output
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Power Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {currentPower.toFixed(1)}
              <span className="text-lg font-normal text-text-secondary ml-1">kW</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {getTrendIcon()}
              <span className={`text-sm ${getTrendColor()}`}>
                {Math.abs(currentPower - previousPower).toFixed(1)}kW vs last reading
              </span>
            </div>
          </div>

          {/* Power Gauge */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>0 kW</span>
              <span>{powerPercentage.toFixed(1)}% capacity</span>
              <span>{defaultSystemProfile.capacity} kW</span>
            </div>
            <div className="w-full bg-surface-base rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent-success to-accent-warning transition-all duration-1000 ease-out"
                style={{ width: `${powerPercentage}%` }}
              />
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant="secondary" 
              className={`text-xs ${currentPower > defaultSystemProfile.capacity * 0.8 ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-warning/20 text-accent-warning'}`}
            >
              {currentPower > defaultSystemProfile.capacity * 0.8 ? 'Optimal' : 'Below Peak'}
            </Badge>
            <Badge variant="outline" className="text-xs text-text-secondary border-border">
              {new Date().toLocaleTimeString()}
            </Badge>
          </div>

          {/* Quick Stats - Industry Realistic */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-semibold text-text-primary">
                {projectedDaily.toFixed(1)}
              </div>
              <div className="text-xs text-text-secondary">Projected Daily MWh</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-text-primary">
                              <div className="text-xs text-text-secondary">
                ₹{hourlyRevenue.toFixed(0)}
              </div>
              </div>
              <div className="text-xs text-text-secondary">Hourly Revenue</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
