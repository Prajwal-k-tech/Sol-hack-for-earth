import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, BarChart3 } from "lucide-react"
import { mockDashboardData, formatDate } from "@/lib/mock-data"
import DispatchConfirmModal from "./dispatch-confirm-modal"
import AnalysisModal from "./analysis-modal"

export function CleaningForecast() {
  const data = mockDashboardData

  return (
    <Card className="bg-surface-overlay border-border hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-primary" />
            Optimal Cleaning Date
          </CardTitle>
          <Badge className="bg-accent-primary text-surface-base">
            Recommended
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center p-4 bg-surface-overlay-1 rounded-xl border border-border">
          <div className="text-3xl font-bold text-accent-primary mb-1">
            {formatDate(data.optimalCleaningDate)}
          </div>
          <p className="text-text-muted text-sm">
            Based on soiling analysis and weather forecasts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent-success">3</div>
            <div className="text-sm text-text-muted">Days from now</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">17</div>
            <div className="text-sm text-text-muted">Days since last</div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <DispatchConfirmModal 
            trigger={
              <Button variant="outline" className="flex-1 border-border hover:bg-surface-overlay-1 text-text-primary">
                Schedule Cleaning
              </Button>
            }
          />
          <AnalysisModal 
            trigger={
              <Button variant="outline" className="flex-1 border-border hover:bg-surface-overlay-1 text-text-primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analysis
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
