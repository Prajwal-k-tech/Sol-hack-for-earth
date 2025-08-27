import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Wrench,
  Zap,
  Thermometer,
  Settings
} from "lucide-react"

interface EquipmentStatus {
  id: string
  name: string
  type: 'inverter' | 'panel' | 'cleaner' | 'sensor'
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  efficiency: number
  lastMaintenance: string
  nextMaintenance: string
  alerts: string[]
}

interface EquipmentHealthProps {
  className?: string
}

export function EquipmentHealth({ className }: EquipmentHealthProps) {
  const [equipment, setEquipment] = useState<EquipmentStatus[]>([
    {
      id: 'inv-001',
      name: 'Inverter Block A',
      type: 'inverter',
      status: 'online',
      efficiency: 98.5,
      lastMaintenance: '2024-12-15',
      nextMaintenance: '2025-03-15',
      alerts: []
    },
    {
      id: 'inv-002',
      name: 'Inverter Block B',
      type: 'inverter',
      status: 'warning',
      efficiency: 94.2,
      lastMaintenance: '2024-11-20',
      nextMaintenance: '2025-02-20',
      alerts: ['Temperature high', 'Efficiency below optimal']
    },
    {
      id: 'panel-001',
      name: 'Panel Array 1-50',
      type: 'panel',
      status: 'online',
      efficiency: 96.8,
      lastMaintenance: '2024-12-10',
      nextMaintenance: '2025-06-10',
      alerts: []
    },
    {
      id: 'cleaner-001',
      name: 'Automated Cleaner #1',
      type: 'cleaner',
      status: 'maintenance',
      efficiency: 0,
      lastMaintenance: '2024-12-20',
      nextMaintenance: '2025-01-20',
      alerts: ['Scheduled maintenance in progress']
    },
    {
      id: 'sensor-001',
      name: 'Weather Station',
      type: 'sensor',
      status: 'online',
      efficiency: 100,
      lastMaintenance: '2024-10-15',
      nextMaintenance: '2025-04-15',
      alerts: []
    }
  ])

  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev => prev.map(item => {
        const shouldUpdate = Math.random() < 0.1 // 10% chance to update each item
        
        if (!shouldUpdate) return item

        const newEfficiency = item.status === 'maintenance' ? 0 : 
          Math.max(85, Math.min(100, item.efficiency + (Math.random() - 0.5) * 2))

        const newAlerts = [...item.alerts]
        if (newEfficiency < 95 && item.status === 'online') {
          if (!newAlerts.includes('Efficiency below optimal')) {
            newAlerts.push('Efficiency below optimal')
          }
        } else {
          const index = newAlerts.indexOf('Efficiency below optimal')
          if (index > -1) newAlerts.splice(index, 1)
        }

        return {
          ...item,
          efficiency: newEfficiency,
          alerts: newAlerts,
          status: newEfficiency < 90 ? 'warning' : item.status === 'maintenance' ? 'maintenance' : 'online'
        }
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: EquipmentStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-accent-success" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-accent-warning" />
      case 'offline':
        return <XCircle className="h-4 w-4 text-accent-error" />
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-accent-info" />
      default:
        return <Activity className="h-4 w-4 text-text-secondary" />
    }
  }

  const getStatusColor = (status: EquipmentStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-accent-success/20 text-accent-success'
      case 'warning':
        return 'bg-accent-warning/20 text-accent-warning'
      case 'offline':
        return 'bg-accent-error/20 text-accent-error'
      case 'maintenance':
        return 'bg-accent-info/20 text-accent-info'
      default:
        return 'bg-text-secondary/20 text-text-secondary'
    }
  }

  const getTypeIcon = (type: EquipmentStatus['type']) => {
    switch (type) {
      case 'inverter':
        return <Zap className="h-4 w-4 text-accent-warning" />
      case 'panel':
        return <Activity className="h-4 w-4 text-accent-info" />
      case 'cleaner':
        return <Settings className="h-4 w-4 text-accent-primary" />
      case 'sensor':
        return <Thermometer className="h-4 w-4 text-accent-success" />
      default:
        return <Activity className="h-4 w-4 text-text-secondary" />
    }
  }

  const overallHealth = equipment.reduce((acc, item) => acc + item.efficiency, 0) / equipment.length

  return (
    <Card className={`bg-surface-overlay border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent-primary" />
            Equipment Health
          </div>
          <Badge className={`text-xs ${overallHealth > 95 ? 'bg-accent-success/20 text-accent-success' : 
            overallHealth > 90 ? 'bg-accent-warning/20 text-accent-warning' : 'bg-accent-error/20 text-accent-error'}`}>
            {overallHealth.toFixed(1)}% Overall
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {equipment.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedEquipment === item.id 
                  ? 'border-accent-primary bg-surface-base' 
                  : 'border-border hover:border-accent-primary/50'
              }`}
              onClick={() => setSelectedEquipment(selectedEquipment === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="text-sm font-medium text-text-primary">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-text-secondary">Efficiency</div>
                <div className="text-sm font-medium text-text-primary">
                  {item.efficiency.toFixed(1)}%
                </div>
              </div>

              {/* Efficiency Bar */}
              <div className="w-full bg-surface-base rounded-full h-2 mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.efficiency > 95 ? 'bg-accent-success' :
                    item.efficiency > 90 ? 'bg-accent-warning' : 'bg-accent-error'
                  }`}
                  style={{ width: `${Math.max(item.efficiency, 5)}%` }}
                />
              </div>

              {/* Alerts */}
              {item.alerts.length > 0 && (
                <div className="space-y-1">
                  {item.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-accent-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {alert}
                    </div>
                  ))}
                </div>
              )}

              {/* Expanded Details */}
              {selectedEquipment === item.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-text-secondary">Last Maintenance</div>
                      <div className="text-text-primary font-medium">
                        {new Date(item.lastMaintenance).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-text-secondary">Next Maintenance</div>
                      <div className="text-text-primary font-medium">
                        {new Date(item.nextMaintenance).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Schedule Maintenance
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              Run Diagnostics
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Export Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
