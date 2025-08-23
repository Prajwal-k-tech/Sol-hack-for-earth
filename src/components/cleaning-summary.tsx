import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDashboardData, formatCurrency } from "@/lib/mock-data"
import { CalendarDays, IndianRupee, Droplets, Sparkles } from "lucide-react"

export function CleaningSummary() {
  const data = mockDashboardData
  const totalCleanings = data.cleaningHistory.length
  const totalRecovered = data.cleaningHistory.reduce((s, r) => s + Math.round(r.energyGained * 6.5), 0)
  const avgRoi = Math.round(
    data.cleaningHistory.reduce((s, r) => s + ((r.energyGained * 6.5 - r.cost) / r.cost) * 100, 0) / totalCleanings
  )

  return (
    <Card className="hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-primary" />
          Cleaning Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Top Row - 3 Main Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-xl border border-border bg-surface-overlay/20 text-center">
            <CalendarDays className="h-4 w-4 mx-auto text-accent-info mb-1" />
            <div className="text-xl font-bold text-text-primary">{totalCleanings}</div>
            <div className="text-xs text-text-muted">Total Cleanings</div>
          </div>
          <div className="p-2 rounded-xl border border-border bg-surface-overlay/20 text-center">
            <IndianRupee className="h-4 w-4 mx-auto text-accent-success mb-1" />
            <div className="text-xl font-bold text-text-primary">{formatCurrency(totalRecovered)}</div>
            <div className="text-xs text-text-muted">Value Recovered</div>
          </div>
          <div className="p-2 rounded-xl border border-border bg-surface-overlay/20 text-center">
            <Droplets className="h-4 w-4 mx-auto text-accent-warning mb-1" />
            <div className="text-xl font-bold text-text-primary">{avgRoi}%</div>
            <div className="text-xs text-text-muted">Average ROI</div>
          </div>
        </div>
        
        {/* Bottom Row - Additional Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-xl border border-border bg-surface-overlay/20 text-center">
            <div className="text-lg font-bold text-accent-success">98.5%</div>
            <div className="text-xs text-text-muted">Efficiency Rate</div>
          </div>
          <div className="p-2 rounded-xl border border-border bg-surface-overlay/20 text-center">
            <div className="text-lg font-bold text-accent-info">15 days</div>
            <div className="text-xs text-text-muted">Avg Interval</div>
          </div>
        </div>
        
        {/* Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-border">
          <Badge variant="success" className="text-xs">Water Efficient</Badge>
          <Badge variant="warning" className="text-xs">High Dust Region</Badge>
          <Badge variant="secondary" className="text-xs">Auto-schedule</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default CleaningSummary
