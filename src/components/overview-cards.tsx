import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, Zap, Target } from "lucide-react"
import { mockDashboardData, getEnergyLossAmount, formatCurrency } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'warning' | 'success' | 'error'
  className?: string
}

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  trendValue, 
  variant = 'default',
  className 
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-accent-success" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-accent-error" />
    return null
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'border-accent-warning/30 bg-gradient-to-br from-accent-warning/5 to-accent-warning/10'
      case 'success':
        return 'border-accent-success/30 bg-gradient-to-br from-accent-success/5 to-accent-success/10'
      case 'error':
        return 'border-accent-error/30 bg-gradient-to-br from-accent-error/5 to-accent-error/10'
      default:
        return 'border-accent-primary/30 bg-gradient-to-br from-accent-primary/5 to-accent-primary/10'
    }
  }

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:scale-[1.02] hover:shadow-glow animate-fade-in",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
        <div className="text-accent-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-3xl font-bold text-text-primary">
            {value}
            {unit && <span className="text-xl text-text-muted ml-1">{unit}</span>}
          </div>
        </div>
        {trendValue && (
          <div className="flex items-center space-x-1 mt-2">
            {getTrendIcon()}
            <span className={cn(
              "text-sm font-medium",
              trend === 'up' ? "text-accent-success" : 
              trend === 'down' ? "text-accent-error" : "text-text-muted"
            )}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewCards() {
  const data = mockDashboardData
  const energyLoss = getEnergyLossAmount(data.currentProduction, data.estimatedSoilingLoss)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Current Energy Production"
        value={data.currentProduction.toFixed(1)}
        unit="kWh"
        icon={<Zap className="h-5 w-5" />}
        trend="up"
        trendValue="+2.1% from yesterday"
        variant="success"
      />
      
      <MetricCard
        title="Estimated Soiling Loss"
        value={data.estimatedSoilingLoss.toFixed(1)}
        unit="%"
        icon={<AlertTriangle className="h-5 w-5" />}
        trend="down"
        trendValue={`${formatCurrency(energyLoss)}/day loss`}
        variant="warning"
      />
      
      <MetricCard
        title="Economic Threshold"
        value={formatCurrency(data.economicThreshold)}
        icon={<Target className="h-5 w-5" />}
        trend="neutral"
        trendValue="Cleaning recommended when reached"
        variant="default"
      />
    </div>
  )
}
