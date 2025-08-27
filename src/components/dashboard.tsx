import { useState } from "react"
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
  Sparkles,
  Download
} from "lucide-react"
import { OverviewCards } from "@/components/overview-cards"
import { CleaningForecast } from "@/components/cleaning-forecast"
import { WeatherEvents } from "@/components/weather-events"
import { ReportsSection } from "@/components/reports-section"
import { SystemStatus } from "@/components/system-status"
import RoiSimulator from "./roi-simulator"
import CleaningSummary from "./cleaning-summary"
import { InteractiveScheduler } from "./interactive-scheduler"
import { NotificationCenter, useNotifications, exportData } from "./notification-system"
import { LivePowerMeter } from "./live-power-meter"
import { WeatherWidget } from "./weather-widget"
import { EquipmentHealth } from "./equipment-health"
import { PerformanceAnalytics } from "./performance-analytics"

export default function Dashboard() {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)

  const handleExportData = () => {
    exportData('full')
    addNotification({
      type: 'info',
      title: 'Data export started successfully',
      message: 'Your data is being prepared for download.'
    })
  }

  const handleRefreshData = () => {
    addNotification({
      type: 'success',
      title: 'Data refreshed',
      message: 'All sensors and forecasts have been updated.'
    })
  }

  return (
    <div className="min-h-screen bg-crust">
      {/* Navigation Header */}
      <nav className="bg-surface-overlay border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Sun className="h-8 w-8 text-accent-warning" />
                <div className="ml-3">
                  <span className="text-xl font-bold text-text-primary">Sol</span>
                  <div className="text-sm text-text-muted font-normal">Solar Analytics Platform</div>
                </div>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" className="text-accent-info hover:text-accent-info/80 border-b-2 border-accent-info px-1 pt-1 pb-4 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="text-text-muted hover:text-text-primary px-1 pt-1 pb-4 text-sm font-medium">
                  Analytics
                </a>
                <a href="#" className="text-text-muted hover:text-text-primary px-1 pt-1 pb-4 text-sm font-medium">
                  Settings
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshData}
                className="border-border hover:bg-surface-overlay"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportData}
                className="border-border hover:bg-surface-overlay"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="border-border hover:bg-surface-overlay relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-accent-primary text-surface-base flex items-center justify-center rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 z-50">
                    <NotificationCenter
                      isOpen={showNotifications}
                      notifications={notifications}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="border-border hover:bg-surface-overlay">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" className="border-border hover:bg-surface-overlay">
                <User className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" className="md:hidden border-border hover:bg-surface-overlay">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Solar Analytics Dashboard</h1>
              <p className="text-text-secondary mt-1">Optimize your panel cleaning schedule</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-accent-success text-surface-base">
                <div className="w-2 h-2 bg-surface-base rounded-full mr-2"></div>
                All Systems Online
              </Badge>
              <Badge className="bg-accent-info text-surface-base">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Real-time Monitoring Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <LivePowerMeter />
            <WeatherWidget />
          </div>
          <EquipmentHealth />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CleaningForecast />
            <WeatherEvents />
            <ReportsSection />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SystemStatus />
            <RoiSimulator />
            <CleaningSummary />
          </div>
        </div>

        {/* Performance Analytics Section - Compact */}
        <div className="mt-6">
          <PerformanceAnalytics />
        </div>

        {/* Interactive Features Section */}
        <div className="mt-8 space-y-6">
          {/* Scheduler Toggle */}
          <Card className="bg-surface-overlay border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Cleaning Schedule</h3>
                  <p className="text-text-secondary text-sm">Manage your cleaning calendar and optimize schedules</p>
                </div>
                <Button 
                  onClick={() => setShowScheduler(!showScheduler)}
                  className="bg-accent-info hover:bg-accent-info/80 text-surface-base"
                >
                  {showScheduler ? 'Hide' : 'Show'} Calendar
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showScheduler ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {showScheduler && (
                <div className="mt-4 border-t border-border pt-4">
                  <InteractiveScheduler />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
