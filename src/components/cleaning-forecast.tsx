import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { mockDashboardData, formatDate } from "@/lib/mock-data"
import DispatchConfirmModal from "./dispatch-confirm-modal"

export function CleaningForecast() {
  const data = mockDashboardData

  return (
    <Card className="border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 hover:shadow-glow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-primary" />
            Optimal Cleaning Date
          </CardTitle>
          <Badge variant="default" className="animate-pulse-slow bg-accent-primary text-surface-base">
            Recommended
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center p-3 bg-surface-overlay/30 rounded-xl">
          <div className="text-3xl font-bold text-accent-primary mb-1">
            {formatDate(data.optimalCleaningDate)}
          </div>
          <p className="text-text-muted text-sm">
            Based on soiling analysis and weather forecasts
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-surface-overlay/20 hover:bg-surface-overlay/40 transition-all duration-200">
            <div className="text-xl font-bold text-accent-primary">
              {Math.round((new Date(data.optimalCleaningDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-text-muted font-medium leading-tight">Days from now</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-surface-overlay/20 hover:bg-surface-overlay/40 transition-all duration-200">
            <div className="text-xl font-bold text-accent-warning">
              {Math.round((new Date(data.optimalCleaningDate).getTime() - new Date(data.lastCleaning).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-text-muted font-medium leading-tight">Days since last</div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2 border-t border-border">
          <DispatchConfirmModal 
            trigger={
              <Button variant="outline" className="flex-1 hover:border-accent-primary/50 hover:text-accent-primary">
                Schedule Cleaning
              </Button>
            }
          />
          <Button variant="outline" className="flex-1 hover:border-accent-info/50 hover:text-accent-info">
            View Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
