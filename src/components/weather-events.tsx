import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Wind, AlertTriangle, Droplets, Eye } from "lucide-react"
import { mockDashboardData, formatDateShort, type WeatherEvent } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const getEventIcon = (type: WeatherEvent['type']) => {
  switch (type) {
    case 'rain':
      return <Droplets className="h-4 w-4" />
    case 'dust_storm':
      return <Wind className="h-4 w-4" />
    case 'high_aqi':
      return <Eye className="h-4 w-4" />
    case 'wind':
      return <Wind className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const getSeverityIndicator = (severity: WeatherEvent['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-accent-error h-2 w-2 rounded-full animate-pulse'
    case 'medium':
      return 'bg-accent-warning h-2 w-2 rounded-full'
    case 'low':
      return 'bg-accent-success h-2 w-2 rounded-full'
    default:
      return 'bg-text-muted h-2 w-2 rounded-full'
  }
}

const formatEventType = (type: WeatherEvent['type']) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function WeatherEvents() {
  const data = mockDashboardData

  return (
    <Card className="hover:shadow-glow transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Cloud className="h-5 w-5 text-accent-info" />
          Upcoming Weather Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.upcomingEvents.slice(0, 3).map((event, index) => (
            <div 
              key={event.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-xl border transition-all duration-300 hover:bg-surface-overlay-1",
                "animate-slide-up",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={getSeverityIndicator(event.severity)} />
                  <div className="text-accent-info">
                    {getEventIcon(event.type)}
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-text-primary text-sm">
                    {formatEventType(event.type)}
                  </div>
                  <div className="text-xs text-text-muted">
                    {event.description}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  {formatDateShort(event.date)}
                </div>
                <Badge 
                  variant={event.severity === 'high' ? 'destructive' : 
                          event.severity === 'medium' ? 'warning' : 'success'}
                  className="text-xs"
                >
                  {event.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-text-muted text-center">
            Weather data updates every 6 hours • Last updated: Today, 2:30 PM
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
