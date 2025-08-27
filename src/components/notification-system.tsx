import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionable?: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationCenterProps) {
  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-accent-success" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-accent-warning" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-accent-error" />
      case 'info': return <Info className="w-4 h-4 text-accent-info" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="absolute top-16 right-6 w-96 max-h-[80vh] overflow-hidden">
        <Card className="shadow-2xl border-border/50 bg-surface-overlay/95 backdrop-blur-lg">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent-primary" />
                <h3 className="font-semibold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="default" className="bg-accent-error text-surface-base">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="p-3 border-b border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="w-full hover:border-accent-primary/50"
                >
                  Mark all as read
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-muted">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-surface-overlay-1/50",
                        notification.read 
                          ? "border-border/30 opacity-70" 
                          : "border-accent-primary/30 bg-accent-primary/5"
                      )}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-text-primary text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-text-muted text-xs leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-text-disabled text-xs">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.actionable && (
                              <Button variant="ghost" size="sm" className="text-xs h-6">
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Cleaning Recommended',
      message: 'Solar panels have reached 12.3% soiling loss. Cleaning could recover ₹2,847 in daily revenue.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      actionable: true
    },
    {
      id: '2', 
      type: 'info',
      title: 'Weather Alert',
      message: 'Dust storm expected in 5 days. Consider scheduling cleaning before the event.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      actionable: true
    },
    {
      id: '3',
      type: 'success',
      title: 'Cleaning Completed',
      message: 'GreenClean Solutions completed scheduled cleaning. Energy output increased by 45.2 kWh.',
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
      read: true,
      actionable: false
    },
    {
      id: '4',
      type: 'info',
      title: 'Performance Report',
      message: 'Monthly performance report is ready for download.',
      timestamp: new Date(Date.now() - 1209600000), // 2 weeks ago
      read: true,
      actionable: true
    }
  ])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  }
}

// Export data function for reports
export const exportData = (type: 'energy' | 'cleaning' | 'full') => {
  // Simulate data export
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `sol-${type}-report-${timestamp}.csv`
  
  // Create mock CSV data
  let csvContent = ''
  
  switch (type) {
    case 'energy':
      csvContent = `Date,Predicted (kWh),Actual (kWh),Loss (%),Revenue Impact (₹)\n`
      // Add mock data rows
      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const predicted = 480 + Math.random() * 40
        const actual = predicted * (0.88 + Math.random() * 0.1)
        const loss = ((predicted - actual) / predicted * 100)
        const revenue = (predicted - actual) * 8.5
        csvContent += `${date},${predicted.toFixed(1)},${actual.toFixed(1)},${loss.toFixed(1)},${revenue.toFixed(0)}\n`
      }
      break
    case 'cleaning':
      csvContent = `Date,Provider,Cost (₹),Energy Gained (kWh),ROI (%)\n`
      csvContent += `2025-08-20,GreenClean Solutions,2500,45.2,12\n`
      csvContent += `2025-08-06,EcoWash Pro,2800,52.8,15\n`
      csvContent += `2025-07-23,GreenClean Solutions,2200,38.9,8\n`
      break
    case 'full':
      csvContent = `Full system report data would be exported here...\n`
      break
  }

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return filename
}
