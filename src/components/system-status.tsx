import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  Thermometer, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'error'
  threshold: { warning: number; error: number }
}

const mockSystemMetrics: SystemMetric[] = [
  {
    id: 'connectivity',
    name: 'Panel Connectivity',
    value: 98.5,
    unit: '%',
    status: 'good',
    threshold: { warning: 95, error: 90 }
  },
  {
    id: 'temperature',
    name: 'Panel Temperature',
    value: 42,
    unit: '°C',
    status: 'warning',
    threshold: { warning: 40, error: 50 }
  },
  {
    id: 'inverter',
    name: 'Inverter Efficiency',
    value: 96.8,
    unit: '%',
    status: 'good',
    threshold: { warning: 95, error: 90 }
  },
  {
    id: 'battery',
    name: 'Battery Health',
    value: 87,
    unit: '%',
    status: 'warning',
    threshold: { warning: 85, error: 70 }
  }
]

const getStatusIcon = (status: SystemMetric['status']) => {
  switch (status) {
    case 'good':
      return <CheckCircle className="h-4 w-4 text-accent-success" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-accent-warning" />
    case 'error':
      return <XCircle className="h-4 w-4 text-accent-error" />
  }
}

const getMetricIcon = (id: string) => {
  switch (id) {
    case 'connectivity':
      return <Wifi className="h-4 w-4" />
    case 'temperature':
      return <Thermometer className="h-4 w-4" />
    case 'inverter':
      return <Activity className="h-4 w-4" />
    case 'battery':
      return <Battery className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

export function SystemStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // No need for interval in demo
    setIsOnline(true)
  }, [])

  const overallStatus = mockSystemMetrics.some(m => m.status === 'error') ? 'error' :
                       mockSystemMetrics.some(m => m.status === 'warning') ? 'warning' : 'good'

  return (
    <Card className="hover:shadow-glow transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent-info" />
            System Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={overallStatus === 'good' ? 'success' : 
                      overallStatus === 'warning' ? 'warning' : 'destructive'}
              className="animate-pulse"
            >
              {overallStatus === 'good' ? '● Healthy' : 
               overallStatus === 'warning' ? '● Warning' : '● Critical'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-2 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-accent-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-accent-error" />
              )}
              <div>
                <div className="font-medium text-text-primary text-sm">Connection</div>
                <div className="text-xs text-text-muted">
                  Last update: 1:45:46 AM
                </div>
              </div>
            </div>
            <Badge variant={isOnline ? "success" : "destructive"} className="text-xs">
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {/* System Metrics */}
          <div className="space-y-2">
            {mockSystemMetrics.map((metric, index) => (
              <div 
                key={metric.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl border transition-all duration-300 hover:bg-surface-overlay-1",
                  "animate-slide-up",
                  metric.status === 'error' ? 'border-accent-error/30 bg-accent-error/5' :
                  metric.status === 'warning' ? 'border-accent-warning/30 bg-accent-warning/5' :
                  'border-border'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-text-muted">
                    {getMetricIcon(metric.id)}
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">
                      {metric.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      Warning: {metric.threshold.warning}{metric.unit}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold text-text-primary text-sm">
                      {metric.value}{metric.unit}
                    </div>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 hover:border-accent-primary/50 hover:bg-accent-primary/5 text-xs h-8"
              >
                <Activity className="h-3 w-3" />
                Run Diagnostics
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 hover:border-accent-warning/50 hover:bg-accent-warning/5 text-xs h-8"
              >
                <AlertTriangle className="h-3 w-3" />
                View Alerts
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
