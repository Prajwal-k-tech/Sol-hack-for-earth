import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sun, 
  Settings, 
  Bell, 
  User, 
  RefreshCw, 
  Menu,
  ChevronDown,
  Sparkles
} from "lucide-react"
import { OverviewCards } from "@/components/overview-cards"
import { CleaningForecast } from "@/components/cleaning-forecast"
import { WeatherEvents } from "@/components/weather-events"
import { ReportsSection } from "@/components/reports-section"
import { SystemStatus } from "@/components/system-status"
import RoiSimulator from "./roi-simulator"
import CleaningSummary from "./cleaning-summary"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-base via-surface-mantle to-surface-crust">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface-base/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Sun className="h-8 w-8 text-accent-warning transition-transform duration-300 group-hover:rotate-45" />
                  <Sparkles className="h-4 w-4 text-accent-primary absolute -top-1 -right-1 transition-all duration-300 group-hover:scale-125" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">sol</h1>
                  <p className="text-sm text-text-muted">Solar Analytics Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <Badge variant="success" className="animate-pulse">
                  ● Live
                </Badge>
                <span className="text-sm text-text-muted">Last updated: 2 min ago</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent-error rounded-full animate-pulse"></div>
                </Button>
                
                <Button variant="ghost" size="icon">
                  <RefreshCw className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
                
                <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-border">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-surface-base" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-text-primary">Admin</span>
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-text-primary">
              Good afternoon
            </h2>
            <p className="text-text-muted">
              Here's your solar system performance overview for today.
            </p>
          </div>

          {/* Overview Cards */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-text-primary">
                System Overview
              </h3>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <OverviewCards />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Reports and Forecast */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">
                  Performance Analytics
                </h3>
              </div>
              <ReportsSection />
              
              {/* Cleaning Forecast to fill the empty space */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-text-primary">
                    Predictive Maintenance
                  </h3>
                </div>
                <CleaningForecast />
              </div>
            </div>

            {/* Right Column - Summary Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">
                  System Intelligence
                </h3>
              </div>
              <CleaningSummary />
              <RoiSimulator />
              <WeatherEvents />
              <SystemStatus />
            </div>
          </div>

          {/* Call to Action */}
          <Card className="border-accent-primary/20 bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">
                    Need help optimizing your cleaning schedule?
                  </h4>
                  <p className="text-text-muted">
                    Our AI-powered recommendations can help you save up to 15% on maintenance costs.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="hover:border-accent-info/50 hover:text-accent-info">
                    Learn More
                  </Button>
                  <Button className="shadow-lg hover:shadow-glow bg-gradient-to-r from-accent-primary to-accent-secondary">
                    Get Recommendations
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-mantle/50 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-6 py-4 text-center">
          <p className="text-sm text-text-muted">
            © 2025 sol. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
