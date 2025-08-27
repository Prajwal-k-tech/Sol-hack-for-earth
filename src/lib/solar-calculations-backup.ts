// Solar industry calculations and realistic formulas based on real data
import { format, subDays } from 'date-fns'

export interface TariffStructure {
  peakRate: number      // ₹/kWh during peak hours (10 AM - 6 PM)
  offPeakRate: number   // ₹/kWh during off-peak hours
  demandCharge: number  // ₹/kW for maximum demand
  fixedCharge: number   // ₹/month fixed connection charge
}

export interface SolarSystemProfile {
  capacity: number      // kW installed capacity
  location: string
  tiltAngle: number
  orientation: string   // South, Southeast, etc.
  installationDate: string
  panelType: string     // Monocrystalline, Polycrystalline, etc.
  moduleCount: number   // Total number of panels
}

export interface CleaningImpactData {
  soilingRate: number           // % loss per day without cleaning (0.1-0.5% daily)
  cleaningEffectiveness: number // % of performance restored after cleaning (95-99%)
  degradationFactor: number     // Annual degradation rate (0.5-0.8%)
  weatherImpactFactor: number   // Current weather impact on soiling
  dustAccumulation: number      // Current dust level (0-20%)
}

// Industry-standard cleaning costs based on research
export interface CleaningCosts {
  manualCostPerPanel: number    // $8-25 per panel for manual cleaning
  roboticCostPerPanel: number   // $0.50-1.00 per module for robotic
  laborRatePerHour: number      // $35-135 per hour labor costs
  waterCostAnnual: number       // $1000-5000 annual water costs
  frequencyOptimal: number      // Days between cleanings (30-45 days)
}

// Real Indian commercial solar tariff structure (based on typical rates)
export const defaultTariff: TariffStructure = {
  peakRate: 8.50,      // Peak hours rate
  offPeakRate: 6.20,   // Off-peak hours rate  
  demandCharge: 450,   // Demand charge per kW
  fixedCharge: 2500    // Monthly fixed charge
}

// Realistic solar system profile based on industry standards
export const defaultSystemProfile: SolarSystemProfile = {
  capacity: 1000,      // 1 MW commercial installation
  location: "Rajasthan, India", // High solar irradiance area
  tiltAngle: 26,       // Optimal for Rajasthan latitude
  orientation: "South",
  installationDate: "2023-06-15",
  panelType: "Monocrystalline",
  moduleCount: 2500    // ~400W panels
}

// Industry-standard cleaning cost structure
export const cleaningCosts: CleaningCosts = {
  manualCostPerPanel: 15,      // $15 per panel average
  roboticCostPerPanel: 0.75,   // $0.75 per module for automated
  laborRatePerHour: 85,        // $85/hour average labor
  waterCostAnnual: 3000,       // $3000 annual water costs
  frequencyOptimal: 35         // 35 days optimal frequency
}

// Calculate realistic soiling loss based on industry research (3-5% annual loss)
export const calculateSoilingLoss = (
  daysSinceLastCleaning: number,
  weatherFactor: number,
  dustLevel: 'low' | 'medium' | 'high'
): number => {
  // Daily soiling rates based on environment
  const dailySoilingRates = {
    low: 0.15,    // 0.15% per day in clean environments
    medium: 0.25,  // 0.25% per day in moderate dust
    high: 0.45     // 0.45% per day in dusty/desert areas
  }
  
  const baseRate = dailySoilingRates[dustLevel]
  const weatherMultiplier = weatherFactor // Wind reduces soiling, humidity increases
  
  return Math.min(daysSinceLastCleaning * baseRate * weatherMultiplier, 25) // Cap at 25% max loss
}

// Calculate realistic solar irradiance based on location and season
export const calculateSolarIrradiance = (date: Date, _location: string): number => {
  const month = date.getMonth() + 1
  
  // Seasonal irradiance patterns for Rajasthan, India (kWh/m²/day)
  const seasonalMultipliers: { [key: number]: number } = {
    1: 0.85,  // January - moderate
    2: 0.90,  // February - good
    3: 0.95,  // March - excellent  
    4: 1.00,  // April - peak
    5: 0.98,  // May - very good
    6: 0.75,  // June - monsoon impact
    7: 0.70,  // July - monsoon
    8: 0.72,  // August - monsoon
    9: 0.80,  // September - post-monsoon
    10: 0.88, // October - good
    11: 0.85, // November - moderate
    12: 0.82  // December - moderate
  }
  
  const baseIrradiance = 5.2 // Average daily irradiance for South India
  return baseIrradiance * (seasonalMultipliers[month] || 0.85)
}

// Calculate capacity factor (realistic performance metric)
export const calculateCapacityFactor = (
  actualGeneration: number, 
  capacity: number, 
  hours: number = 24
): number => {
  const theoreticalMax = capacity * hours
  return (actualGeneration / theoreticalMax) * 100
}

// Enhanced ROI calculation with real tariff structures
export const calculateCleaningROI = (
  cleaningCost: number,
  systemProfile: SolarSystemProfile,
  tariff: TariffStructure,
  daysSinceCleaning: number,
  weatherImpact: CleaningImpactData
): {
  energyRecovered: number
  revenueRecovered: number
  paybackPeriod: number
  roi: number
  demandChargeImpact: number
  detailedBreakdown: {
    peakEnergyValue: number
    offPeakEnergyValue: number
    demandChargeSavings: number
    totalRevenue: number
  }
} => {
  // Calculate current soiling loss using simplified parameters
  const dustLevel: 'low' | 'medium' | 'high' = 
    weatherImpact.weatherImpactFactor > 1.2 ? 'high' : 
    weatherImpact.weatherImpactFactor > 0.8 ? 'medium' : 'low'
    
  const currentSoilingLoss = calculateSoilingLoss(
    daysSinceCleaning, 
    weatherImpact.weatherImpactFactor, 
    dustLevel
  )
  
  // Calculate daily generation capacity
  const today = new Date()
  const dailyIrradiance = calculateSolarIrradiance(today, systemProfile.location)
  const maxDailyGeneration = systemProfile.capacity * dailyIrradiance * 0.85 // 85% system efficiency
  
  // Energy recovered after cleaning (per day)
  const energyRecoveredPerDay = maxDailyGeneration * (currentSoilingLoss / 100) * 
    (weatherImpact.cleaningEffectiveness / 100)
  
  // Assume 70% of generation during peak hours, 30% during off-peak
  const peakEnergyRecovered = energyRecoveredPerDay * 0.70
  const offPeakEnergyRecovered = energyRecoveredPerDay * 0.30
  
  // Calculate revenue per day
  const peakEnergyValue = peakEnergyRecovered * tariff.peakRate
  const offPeakEnergyValue = offPeakEnergyRecovered * tariff.offPeakRate
  
  // Demand charge impact (cleaning improves peak demand capacity)
  const demandChargeImpact = (systemProfile.capacity * currentSoilingLoss / 100) * 
    tariff.demandCharge / 30 // Monthly demand charge impact per day
  
  const totalDailyRevenue = peakEnergyValue + offPeakEnergyValue + demandChargeImpact
  
  // Calculate payback period and ROI
  const paybackPeriod = cleaningCost / totalDailyRevenue
  const monthlyRevenue = totalDailyRevenue * 30
  const roi = ((monthlyRevenue - cleaningCost) / cleaningCost) * 100
  
  return {
    energyRecovered: energyRecoveredPerDay,
    revenueRecovered: totalDailyRevenue,
    paybackPeriod: Math.ceil(paybackPeriod),
    roi: roi,
    demandChargeImpact: demandChargeImpact,
    detailedBreakdown: {
      peakEnergyValue,
      offPeakEnergyValue, 
      demandChargeSavings: demandChargeImpact,
      totalRevenue: totalDailyRevenue
    }
  }
}

// Calculate optimal cleaning frequency
export const calculateOptimalCleaningFrequency = (
  systemProfile: SolarSystemProfile,
  tariff: TariffStructure,
  cleaningCost: number,
  weatherImpact: CleaningImpactData
): {
  optimalDays: number
  annualSavings: number
  cleaningsPerYear: number
} => {
  let bestROI = -Infinity
  let optimalDays = 30
  
  // Test cleaning frequencies from 7 to 60 days
  for (let days = 7; days <= 60; days += 1) {
    const roiData = calculateCleaningROI(
      cleaningCost,
      systemProfile, 
      tariff,
      days,
      weatherImpact
    )
    
    if (roiData.roi > bestROI && roiData.roi > 10) { // Minimum 10% ROI threshold
      bestROI = roiData.roi
      optimalDays = days
    }
  }
  
  const cleaningsPerYear = Math.floor(365 / optimalDays)
  const finalROI = calculateCleaningROI(
    cleaningCost,
    systemProfile,
    tariff, 
    optimalDays,
    weatherImpact
  )
  
  const annualSavings = (finalROI.revenueRecovered * optimalDays - cleaningCost) * cleaningsPerYear
  
  return {
    optimalDays,
    annualSavings,
    cleaningsPerYear
  }
}

// Generate realistic energy data with seasonal patterns
export const generateRealisticEnergyData = (
  systemProfile: SolarSystemProfile,
  days: number = 30
): Array<{
  date: string
  predicted: number
  actual: number
  irradiance: number
  soilingLoss: number
  capacityFactor: number
}> => {
  const data = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'yyyy-MM-dd')
    
    // Calculate realistic irradiance for the date
    const irradiance = calculateSolarIrradiance(date, systemProfile.location)
    
    // Add weather variability (clouds, etc.)
    const weatherVariability = 0.85 + Math.random() * 0.3 // 85-115% of clear sky
    const adjustedIrradiance = irradiance * weatherVariability
    
    // Calculate predicted generation (ideal conditions)
    const predicted = systemProfile.capacity * adjustedIrradiance * 0.85 // System efficiency
    
    // Calculate soiling impact (accumulates since last cleaning)
    const daysSinceCleaning = Math.floor(i / 14) * 14 + (i % 14) // Assume cleaning every 14 days
    const soilingLoss = calculateSoilingLoss(
      daysSinceCleaning,
      1.0, // Weather factor
      'medium' // Dust level
    )
    
    const actual = predicted * (1 - soilingLoss / 100)
    const capacityFactor = calculateCapacityFactor(actual, systemProfile.capacity)
    
    data.push({
      date: dateStr,
      predicted: Math.round(predicted * 10) / 10,
      actual: Math.round(actual * 10) / 10,
      irradiance: Math.round(adjustedIrradiance * 100) / 100,
      soilingLoss: Math.round(soilingLoss * 10) / 10,
      capacityFactor: Math.round(capacityFactor * 10) / 10
    })
  }
  
  return data
}
