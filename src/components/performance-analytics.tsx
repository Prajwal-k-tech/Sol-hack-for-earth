import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  ComposedChart,
  ReferenceLine
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  Eye,
  Calendar
} from "lucide-react"

interface PerformanceData {
  time: string
  actual: number
  expected: number
  efficiency: number
  soiling: number
}

interface PerformanceAnalyticsProps {
  className?: string
}

export function PerformanceAnalytics({ className }: PerformanceAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')
  const [viewMode, setViewMode] = useState<'efficiency' | 'comparison' | 'soiling'>('efficiency')
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])

  // Generate realistic performance data
  useEffect(() => {
    const generateData = () => {
      const now = new Date()
      const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30
      const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 24 : 24 * 7
      
      const data: PerformanceData[] = []
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * interval * 60 * 60 * 1000)
        
        // Simulate daily performance curve for solar
        const hour = timeRange === '24h' ? date.getHours() : 12 // Peak hour for daily/monthly view
        let baseEfficiency = 0
        
        if (hour >= 6 && hour <= 18) {
          // Daylight hours - sine curve
          const hoursSinceSunrise = hour - 6
          baseEfficiency = Math.sin((hoursSinceSunrise / 12) * Math.PI) * 85 + 10
        } else {
          baseEfficiency = 5 // Night time
        }
        
        // Add random variation and soiling effects based on research
        const soilingLoss = Math.random() * 12 // 0-12% soiling loss (realistic range)
        const randomVariation = (Math.random() - 0.5) * 5 // ±2.5% variation
        const actualEfficiency = Math.max(0, baseEfficiency - soilingLoss + randomVariation)
        
        // Calculate realistic efficiency percentage
        const expectedOutput = baseEfficiency + randomVariation
        const efficiencyPercentage = expectedOutput > 0 ? (actualEfficiency / expectedOutput) * 100 : 0
        
        data.push({
          time: timeRange === '24h' 
            ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          actual: actualEfficiency,
          expected: expectedOutput,
          efficiency: efficiencyPercentage,
          soiling: soilingLoss
        })
      }
      
      setPerformanceData(data)
    }

    generateData()
    const interval = setInterval(generateData, timeRange === '24h' ? 60000 : 300000) // Update every minute for 24h, 5 min for longer ranges
    
    return () => clearInterval(interval)
  }, [timeRange])

  const avgEfficiency = performanceData.reduce((acc, data) => acc + data.efficiency, 0) / performanceData.length
  const avgSoiling = performanceData.reduce((acc, data) => acc + data.soiling, 0) / performanceData.length
  
  // Realistic calculations based on industry research
  const systemCapacity = 1000 // 1 MW system
  const energyLoss = (avgSoiling / 100) * systemCapacity // kW lost due to soiling
  const energyLossDaily = energyLoss * 8 // 8 hours average generation per day
  const tariffRate = 8.5 // ₹8.5 per kWh realistic commercial rate
  
  // Calculate revenue loss based on time range
  const hoursInPeriod = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
  const revenueloss = energyLossDaily * (hoursInPeriod / 24) * tariffRate

  // Generate Solar Unsoiled style soiling demonstration data
  const generateLongTermSoilingData = () => {
    const data = []
    const startDate = new Date(2024, 0, 1) // Start of 2024
    
    // Generate daily data for about 6 months to reduce crowding
    for (let day = 0; day < 180; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + day)
      
      // Create realistic soiling accumulation cycles
      let soilingLoss = 0
      let isCleaningDay = false
      let wouldBeSoiling = 0 // What soiling would be without cleaning
      
      // Determine cycle position (roughly 30-45 day cycles)
      const cycleLength = 35 + Math.sin(day / 20) * 10 // Varying cycle lengths
      const dayInCycle = day % Math.floor(cycleLength)
      
      if (dayInCycle < 28) {
        // Gradual accumulation - realistic daily soiling rate
        soilingLoss = dayInCycle * 0.5 + (Math.random() - 0.5) * 0.3
        // Without cleaning, soiling would continue accumulating
        wouldBeSoiling = dayInCycle * 0.5 + (day / 180) * 5 + (Math.random() - 0.5) * 0.5
      } else {
        // Cleaning recommended period
        isCleaningDay = dayInCycle < 32 // 4-day cleaning window
        soilingLoss = isCleaningDay ? 0.5 : dayInCycle * 0.5
        // Without cleaning, would keep accumulating
        wouldBeSoiling = dayInCycle * 0.5 + (day / 180) * 5 + (Math.random() - 0.5) * 0.5
      }
      
      // Cap at realistic maximum
      soilingLoss = Math.max(0, Math.min(20, soilingLoss))
      wouldBeSoiling = Math.max(soilingLoss, Math.min(25, wouldBeSoiling))
      
      // Only show every 5th day to reduce X-axis crowding
      if (day % 5 === 0) {
        data.push({
          date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          soilingLoss: parseFloat(soilingLoss.toFixed(1)),
          wouldBeSoiling: parseFloat(wouldBeSoiling.toFixed(1)),
          cleaningRecommended: isCleaningDay ? 25 : null, // Height for cleaning bars
          dayNumber: day + 1
        })
      }
    }
    
    return data
  }

  const renderChart = () => {
    switch (viewMode) {
      case 'efficiency':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface-overlay)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="var(--color-accent-success)"
                fill="var(--color-accent-success)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface-overlay)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="var(--color-accent-info)"
                strokeWidth={2}
                dot={false}
                name="Expected Output"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-accent-success)"
                strokeWidth={2}
                dot={false}
                name="Actual Output"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'soiling':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface-overlay)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <Bar
                dataKey="soiling"
                fill="var(--color-accent-warning)"
                name="Soiling Loss %"
              />
            </BarChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className={`bg-surface-overlay border-border ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent-primary" />
            Performance Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="text-xs text-text-secondary mr-2">Time Range:</div>
            {(['24h', '7d', '30d'] as const).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-text-secondary mr-2">View:</div>
            {([
              { key: 'efficiency', label: 'Efficiency' },
              { key: 'comparison', label: 'vs Expected' },
              { key: 'soiling', label: 'Soiling' }
            ] as const).map(({ key, label }) => (
              <Button
                key={key}
                size="sm"
                variant={viewMode === key ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => setViewMode(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {avgEfficiency.toFixed(1)}%
            </div>
            <div className="text-xs text-text-secondary">Avg Efficiency</div>
            <Badge className={`text-xs mt-1 ${avgEfficiency > 90 ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-warning/20 text-accent-warning'}`}>
              {avgEfficiency > 90 ? 'Excellent' : 'Needs Attention'}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {avgSoiling.toFixed(1)}%
            </div>
            <div className="text-xs text-text-secondary">Avg Soiling</div>
            <Badge className={`text-xs mt-1 ${avgSoiling < 5 ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-warning/20 text-accent-warning'}`}>
              {avgSoiling < 5 ? 'Clean' : 'Dirty'}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-error">
              {energyLoss.toFixed(0)}kW
            </div>
            <div className="text-xs text-text-secondary">Energy Loss</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-accent-error" />
              <span className="text-xs text-accent-error">Lost Capacity</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-error">
              ₹{revenueloss.toFixed(0)}
            </div>
            <div className="text-xs text-text-secondary">Revenue Loss</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-accent-error" />
              <span className="text-xs text-accent-error">
                {timeRange === '24h' ? 'Daily' : timeRange === '7d' ? 'Weekly' : 'Monthly'}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-4">
          {renderChart()}
        </div>

        {/* Soiling Trends Section - Solar Unsoiled Style */}
        <div className="bg-surface-base rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent-info" />
              Soiling Loss Optimization
            </div>
            <Badge className="bg-accent-info/20 text-accent-info text-xs">
              Modeled Soiling Losses Since Last Clean State
            </Badge>
          </div>
          
          <div className="h-64 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={generateLongTermSoilingData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a4458" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={9}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 8 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={10}
                  domain={[0, 25]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e2e',
                    border: '1px solid #3a4458',
                    borderRadius: '8px',
                    color: '#cdd6f4',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'soilingLoss') return [`${value}%`, 'With Sol Cleaning']
                    if (name === 'wouldBeSoiling') return [`${value}%`, 'Without Cleaning']
                    if (name === 'cleaningRecommended') return ['Cleaning Recommended', 'Algorithm']
                    return [value, name]
                  }}
                />
                
                {/* Blue bars for cleaning recommendations - behind everything */}
                <Bar
                  dataKey="cleaningRecommended"
                  fill="#89b4fa"
                  fillOpacity={0.4}
                  radius={[0, 0, 0, 0]}
                  name="cleaningRecommended"
                />
                
                {/* Area showing what soiling would be without optimization - lighter, dashed outline */}
                <Area
                  type="monotone"
                  dataKey="wouldBeSoiling"
                  stroke="#f38ba8"
                  fill="#f38ba8"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  name="wouldBeSoiling"
                />
                
                {/* Actual soiling with cleaning optimization - solid, prominent */}
                <Area
                  type="monotone"
                  dataKey="soilingLoss"
                  stroke="#89b4fa"
                  fill="#89b4fa"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="soilingLoss"
                />
                
                {/* Optimal cleaning threshold line */}
                <ReferenceLine y={15} stroke="#f9e2af" strokeDasharray="3 3" strokeWidth={1.5} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-3 h-2 bg-accent-info/30 border border-accent-info/50" />
                <span className="text-text-secondary">Cleaning Periods</span>
              </div>
              <div className="text-accent-info font-medium">Sol Optimized</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-3 h-3 bg-accent-info/25 border border-accent-info" />
                <span className="text-text-secondary">With Sol</span>
              </div>
              <div className="text-accent-success font-medium">Optimized Loss</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-3 h-3 bg-accent-error/8 border border-accent-error border-dashed" />
                <span className="text-text-secondary">Without Sol</span>
              </div>
              <div className="text-accent-error font-medium">Baseline Loss</div>
            </div>
          </div>
        </div>

        {/* Insights - Industry Based */}
        <div className="bg-surface-base rounded-lg p-4">
          <div className="text-sm font-medium text-text-primary mb-2">AI Insights</div>
          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-warning mt-1 flex-shrink-0" />
              <div>
                Current soiling rate: {avgSoiling.toFixed(2)}% daily accumulation. Industry optimal is less than 0.2% daily.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-info mt-1 flex-shrink-0" />
              <div>
                Cleaning ROI: ₹{((energyLossDaily * 30 * tariffRate) - 300000).toFixed(0)} monthly savings vs ₹3,00,000 cleaning cost.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-success mt-1 flex-shrink-0" />
              <div>
                Optimal cleaning frequency: Every {Math.ceil(0.2 / (avgSoiling / 100) * 35)} days based on current conditions.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
