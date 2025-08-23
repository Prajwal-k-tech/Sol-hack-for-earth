import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockDashboardData, type CleaningRecord, formatCurrency, formatDateShort } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, Download, IndianRupee, TrendingUp, Zap } from "lucide-react";

const getCleaningTypeBadge = (type: CleaningRecord['type']) => {
  switch (type) {
    case 'manual':
      return <Badge variant="secondary">Manual</Badge>
    case 'robotic':
      return <Badge variant="outline" className="border-accent-info text-accent-info">Robotic</Badge>
    case 'water':
      return <Badge variant="outline" className="border-accent-success text-accent-success">Water Only</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-overlay border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <p className="text-text-primary font-medium">{`Date: ${formatDateShort(label)}`}</p>
        <p className="text-accent-success">
          {`Predicted: ${payload[0]?.value} kWh`}
        </p>
        <p className="text-accent-warning">
          {`Actual: ${payload[1]?.value} kWh`}
        </p>
        <p className="text-text-muted text-sm">
          {`Loss: ${Math.round(((payload[0]?.value - payload[1]?.value) / payload[0]?.value) * 100)}%`}
        </p>
      </div>
    )
  }
  return null
}

export function ReportsSection() {
  const data = mockDashboardData

  // Calculate chart statistics
  const totalLoss = data.energyData.reduce((sum, item) => sum + (item.predicted - item.actual), 0)
  const avgLossPercentage = data.energyData.reduce((sum, item) => 
    sum + ((item.predicted - item.actual) / item.predicted * 100), 0
  ) / data.energyData.length

  return (
    <div className="space-y-6">
      {/* Energy Performance Chart */}
      <Card className="hover:shadow-glow transition-all duration-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent-primary" />
              <CardTitle className="text-lg font-semibold text-text-primary">
                Energy Performance Analysis
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-success rounded-full"></div>
              <span>Predicted Yield</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-warning rounded-full"></div>
              <span>Actual Yield</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
                <XAxis 
                  dataKey="date" 
                  stroke="#a6adc8"
                  tickFormatter={(value) => formatDateShort(value)}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#a6adc8"
                  tickFormatter={(value) => `${value} kWh`}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#a6e3a1" 
                  strokeWidth={2}
                  dot={{ fill: '#a6e3a1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#a6e3a1', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#f9e2af" 
                  strokeWidth={2}
                  dot={{ fill: '#f9e2af', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f9e2af', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-error">
                {totalLoss.toFixed(1)} kWh
              </div>
              <div className="text-sm text-text-muted">Total Loss (30 days)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-warning">
                {avgLossPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-text-muted">Average Loss Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-error">
                {formatCurrency(totalLoss * 6.5)}
              </div>
              <div className="text-sm text-text-muted">Revenue Loss</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cleaning History Table */}
      <Card className="hover:shadow-glow transition-all duration-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent-info" />
              Cleaning History
            </CardTitle>
            <Button variant="outline" size="sm">
              View All Records
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-text-secondary">Cost</th>
                  <th className="text-right py-3 px-4 font-medium text-text-secondary">Energy Gained</th>
                  <th className="text-right py-3 px-4 font-medium text-text-secondary">ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.cleaningHistory.map((record, index) => {
                  const roi = ((record.energyGained * 6.5) / record.cost * 100)
                  return (
                    <tr 
                      key={record.id} 
                      className={cn(
                        "border-b border-border hover:bg-surface-overlay transition-colors duration-200",
                        "animate-slide-up"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-text-primary">
                          {formatDateShort(record.date)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getCleaningTypeBadge(record.type)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <IndianRupee className="h-4 w-4 text-text-muted" />
                          <span className="font-medium text-text-primary">
                            {record.cost.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Zap className="h-4 w-4 text-accent-warning" />
                          <span className="font-medium text-text-primary">
                            {record.energyGained} kWh
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingUp className={cn(
                            "h-4 w-4",
                            roi > 100 ? "text-accent-success" : "text-accent-warning"
                          )} />
                          <span className={cn(
                            "font-medium",
                            roi > 100 ? "text-accent-success" : "text-accent-warning"
                          )}>
                            {roi.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-text-primary">
                  {data.cleaningHistory.length}
                </div>
                <div className="text-sm text-text-muted">Total Cleanings</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent-success">
                  {formatCurrency(data.cleaningHistory.reduce((sum, r) => sum + (r.energyGained * 6.5), 0))}
                </div>
                <div className="text-sm text-text-muted">Total Value Recovered</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent-primary">
                  {Math.round(data.cleaningHistory.reduce((sum, r) => sum + ((r.energyGained * 6.5) / r.cost * 100), 0) / data.cleaningHistory.length)}%
                </div>
                <div className="text-sm text-text-muted">Average ROI</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
