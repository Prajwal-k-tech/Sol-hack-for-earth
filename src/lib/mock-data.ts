import { format, addDays, subDays } from 'date-fns'
import { 
  generateRealisticEnergyData, 
  defaultSystemProfile 
} from './solar-calculations'

export interface EnergyData {
  date: string
  predicted: number
  actual: number
}

export interface CleaningRecord {
  id: string
  date: string
  cost: number
  energyGained: number
  type: 'manual' | 'robotic' | 'water'
}

export interface WeatherEvent {
  id: string
  type: 'rain' | 'dust_storm' | 'high_aqi' | 'wind'
  date: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

export interface DashboardData {
  currentProduction: number
  estimatedSoilingLoss: number
  economicThreshold: number
  optimalCleaningDate: string
  lastCleaning: string
  energyData: EnergyData[]
  cleaningHistory: CleaningRecord[]
  upcomingEvents: WeatherEvent[]
}

// Generate mock energy data for the last 30 days using realistic calculations
const generateEnergyData = (): EnergyData[] => {
  const realisticData = generateRealisticEnergyData(defaultSystemProfile, 30)
  
  return realisticData.map(item => ({
    date: item.date,
    predicted: item.predicted,
    actual: item.actual
  }))
}

// Generate mock cleaning history
const generateCleaningHistory = (): CleaningRecord[] => {
  return [
    {
      id: '1',
      date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      cost: 2500,
      energyGained: 45.2,
      type: 'manual'
    },
    {
      id: '2',
      date: format(subDays(new Date(), 21), 'yyyy-MM-dd'),
      cost: 2800,
      energyGained: 52.8,
      type: 'manual'
    },
    {
      id: '3',
      date: format(subDays(new Date(), 35), 'yyyy-MM-dd'),
      cost: 3200,
      energyGained: 61.5,
      type: 'robotic'
    },
    {
      id: '4',
      date: format(subDays(new Date(), 49), 'yyyy-MM-dd'),
      cost: 2200,
      energyGained: 38.9,
      type: 'water'
    },
    {
      id: '5',
      date: format(subDays(new Date(), 63), 'yyyy-MM-dd'),
      cost: 2900,
      energyGained: 48.7,
      type: 'manual'
    }
  ]
}

// Generate upcoming weather events
const generateUpcomingEvents = (): WeatherEvent[] => {
  return [
    {
      id: '1',
      type: 'rain',
      date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      severity: 'medium',
      description: 'Moderate rainfall expected (15-25mm)'
    },
    {
      id: '2',
      type: 'dust_storm',
      date: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
      severity: 'high',
      description: 'Dust storm warning - high particulate matter'
    },
    {
      id: '3',
      type: 'high_aqi',
      date: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
      severity: 'medium',
      description: 'AQI forecast: 150-200 (Unhealthy)'
    },
    {
      id: '4',
      type: 'wind',
      date: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
      severity: 'low',
      description: 'Strong winds 25-35 km/h - natural cleaning'
    }
  ]
}

export const mockDashboardData: DashboardData = {
  currentProduction: defaultSystemProfile.capacity * 4.8, // Realistic daily generation based on irradiance
  estimatedSoilingLoss: 12.3, // Based on 14 days since last cleaning
  economicThreshold: 2500, // Cost threshold for cleaning intervention
  optimalCleaningDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'), // Calculated optimal date
  lastCleaning: format(subDays(new Date(), 14), 'yyyy-MM-dd'), // 14 days ago
  energyData: generateEnergyData(),
  cleaningHistory: generateCleaningHistory(),
  upcomingEvents: generateUpcomingEvents()
}

export const getEnergyLossAmount = (production: number, lossPercentage: number): number => {
  return Math.round((production * lossPercentage / 100) * 6.5) // Assuming ₹6.5 per kWh
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

export const formatDateShort = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd')
}
