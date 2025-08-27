import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, AlertTriangle } from 'lucide-react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { cn } from "@/lib/utils"

interface ScheduledCleaning {
  id: string
  date: Date
  type: 'scheduled' | 'optimal' | 'emergency'
  provider: string
  cost: number
  status: 'pending' | 'confirmed' | 'completed'
}

interface WeatherEvent {
  date: Date
  type: 'rain' | 'dust_storm' | 'high_aqi'
  severity: 'low' | 'medium' | 'high'
}

export function InteractiveScheduler() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledCleanings, setScheduledCleanings] = useState<ScheduledCleaning[]>([
    {
      id: '1',
      date: addDays(new Date(), 3),
      type: 'optimal',
      provider: 'GreenClean Solutions',
      cost: 2500,
      status: 'pending'
    },
    {
      id: '2', 
      date: addDays(new Date(), 17),
      type: 'scheduled',
      provider: 'EcoWash Pro',
      cost: 2800,
      status: 'confirmed'
    }
  ])

  const weatherEvents: WeatherEvent[] = [
    {
      date: addDays(new Date(), 5),
      type: 'rain',
      severity: 'medium'
    },
    {
      date: addDays(new Date(), 12),
      type: 'dust_storm', 
      severity: 'high'
    }
  ]

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date: Date) => {
    const cleanings = scheduledCleanings.filter(cleaning => 
      isSameDay(cleaning.date, date)
    )
    const weather = weatherEvents.filter(event =>
      isSameDay(event.date, date)
    )
    return { cleanings, weather }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleScheduleCleaning = (date: Date) => {
    const newCleaning: ScheduledCleaning = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      type: 'scheduled',
      provider: 'GreenClean Solutions',
      cost: 2500,
      status: 'pending'
    }
    setScheduledCleanings([...scheduledCleanings, newCleaning])
    setSelectedDate(null)
  }

  const getCleaningStatusColor = (status: ScheduledCleaning['status']) => {
    switch (status) {
      case 'pending': return 'bg-accent-warning'
      case 'confirmed': return 'bg-accent-success'
      case 'completed': return 'bg-accent-info'
      default: return 'bg-accent-primary'
    }
  }

  const getTypeIcon = (type: ScheduledCleaning['type']) => {
    switch (type) {
      case 'optimal': return '⭐'
      case 'emergency': return '🚨'
      default: return '🧽'
    }
  }

  return (
    <Card className="hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Calendar className="w-5 h-5 text-accent-info" />
            Cleaning Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="p-2 text-xs font-medium text-text-muted text-center">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(date => {
              const { cleanings, weather } = getEventsForDate(date)
              const isCurrentMonth = isSameMonth(date, currentMonth)
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isCurrentDay = isToday(date)
              
              return (
                <div
                  key={date.toString()}
                  className={cn(
                    "relative p-2 h-16 border border-border/30 rounded-lg cursor-pointer transition-all duration-200 hover:bg-surface-overlay/50",
                    !isCurrentMonth && "opacity-30",
                    isSelected && "ring-2 ring-accent-primary bg-accent-primary/10",
                    isCurrentDay && "bg-accent-info/10 border-accent-info/50"
                  )}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="text-xs font-medium text-text-primary">
                    {format(date, 'd')}
                  </div>
                  
                  {/* Event indicators */}
                  <div className="absolute bottom-1 left-1 right-1 flex gap-1 flex-wrap">
                    {cleanings.map(cleaning => (
                      <div
                        key={cleaning.id}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getCleaningStatusColor(cleaning.status)
                        )}
                        title={`${cleaning.provider} - ${cleaning.status}`}
                      />
                    ))}
                    {weather.map((event, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          event.type === 'rain' && "bg-accent-info",
                          event.type === 'dust_storm' && "bg-accent-error",
                          event.type === 'high_aqi' && "bg-accent-warning"
                        )}
                        title={`${event.type} - ${event.severity} severity`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-warning"></div>
              <span className="text-text-muted">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-success"></div>
              <span className="text-text-muted">Confirmed</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-info"></div>
              <span className="text-text-muted">Weather</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-error"></div>
              <span className="text-text-muted">Dust Storm</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="pt-3 border-t border-border animate-fade-in">
            <h4 className="font-medium text-text-primary mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h4>
            
            {(() => {
              const { cleanings, weather } = getEventsForDate(selectedDate)
              
              if (cleanings.length === 0 && weather.length === 0) {
                return (
                  <div className="space-y-2">
                    <p className="text-sm text-text-muted">No events scheduled</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScheduleCleaning(selectedDate)}
                      className="w-full hover:border-accent-success/50 hover:text-accent-success"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Cleaning
                    </Button>
                  </div>
                )
              }
              
              return (
                <div className="space-y-2">
                  {cleanings.map(cleaning => (
                    <div key={cleaning.id} className="p-2 rounded-lg bg-surface-overlay/30 border border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(cleaning.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {cleaning.provider}
                            </div>
                            <div className="text-xs text-text-muted">
                              ₹{cleaning.cost.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={cleaning.status === 'confirmed' ? 'success' : 'warning'}>
                          {cleaning.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {weather.map((event, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-accent-warning/10 border border-accent-warning/30">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-accent-warning" />
                        <div className="text-sm text-text-primary">
                          {event.type.replace('_', ' ')} - {event.severity} severity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 text-xs hover:border-accent-primary/50">
            Auto-Schedule
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs hover:border-accent-info/50">
            View Providers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
