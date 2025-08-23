// Mock API service for sol

/**
 * Simulate API delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock weather API
 */
export const getWeatherData = async () => {
  await delay(800);
  
  return {
    current: {
      temperature: 32,
      humidity: 45,
      windSpeed: 12,
      pm25: 68,
      condition: 'Partly Cloudy',
      icon: '⛅',
      uvIndex: 8,
      visibility: 10
    },
    alerts: [
      {
        id: 1,
        type: 'dust-storm',
        message: 'Dust storm expected tomorrow',
        severity: 'high',
        timestamp: new Date().toISOString()
      }
    ],
    forecast: [
      { day: 'Today', temp: 32, condition: 'Partly Cloudy', soilingRisk: 'low' },
      { day: 'Tomorrow', temp: 35, condition: 'Dusty', soilingRisk: 'high' },
      { day: 'Day 3', temp: 30, condition: 'Cloudy', soilingRisk: 'medium' }
    ]
  };
};

/**
 * Mock solar farm data API
 */
export const getSolarFarmData = async () => {
  await delay(600);
  
  return {
    farm: {
      id: 'SF-BLR-001',
      name: 'My Solar Panels',
      location: { lat: 12.9159, lng: 77.6499 },
      capacity: '10 kW',
      totalPanels: 40,
      cleanPanels: 30,
      moderateSoiling: 5,
      needsCleaning: 5,
      currentEfficiency: 92,
      energyGenerated: 45, // kWh today
      lastUpdated: new Date().toISOString()
    },
    metrics: {
      dailyGeneration: 45,
      monthlyGeneration: 1350,
      yearlyGeneration: 16425,
      co2Saved: 0.03, // tons
      treesEquivalent: 1
    }
  };
};

/**
 * Mock soiling prediction API
 */
export const getSoilingPrediction = async () => {
  await delay(1000);
  
  return {
    predictions: [
      { day: 'Today', date: 'Aug 23', percentage: 10, confidence: 95 },
      { day: 'Tomorrow', date: 'Aug 24', percentage: 15, confidence: 92 },
      { day: 'Day 3', date: 'Aug 25', percentage: 30, confidence: 88 },
      { day: 'Day 4', date: 'Aug 26', percentage: 60, confidence: 85 },
      { day: 'Day 5', date: 'Aug 27', percentage: 40, confidence: 82 },
      { day: 'Day 6', date: 'Aug 28', percentage: 20, confidence: 87 },
      { day: 'Day 7', date: 'Aug 29', percentage: 10, confidence: 90 }
    ],
    recommendations: [
      {
        id: 1,
        type: 'cleaning',
        priority: 'high',
        message: 'Schedule cleaning for Day 4 (Aug 26) before soiling reaches 60%',
        panels: 5000,
        estimatedLoss: '12.3 MWh'
      },
      {
        id: 2,
        type: 'monitoring',
        priority: 'medium',
        message: 'Monitor dust accumulation due to upcoming weather conditions',
        panels: 10000,
        estimatedLoss: '2.1 MWh'
      }
    ],
    aiInsights: {
      modelAccuracy: 92.5,
      lastTrained: '2025-08-20',
      dataPoints: 156000,
      weatherFactors: ['PM2.5', 'Wind Speed', 'Humidity', 'Temperature']
    }
  };
};

/**
 * Mock route optimization API
 */
export const optimizeCleaningRoute = async (panels) => {
  await delay(2500); // Simulate TSP calculation time
  
  const dirtyPanels = panels?.filter(p => p.status === 'dirty') || [];
  
  return {
    optimization: {
      originalRoute: {
        distance: 15.2, // km
        time: 164, // minutes
        batteryUsage: 85, // %
        panels: dirtyPanels.length
      },
      optimizedRoute: {
        distance: 8.1, // km
        time: 87, // minutes
        batteryUsage: 41, // %
        panels: dirtyPanels.length
      },
      improvements: {
        timeSaved: 77, // minutes
        timeSavedPercentage: 47,
        batterySaved: 44, // %
        batterySavedPercentage: 52,
        distanceSaved: 7.1, // km
        costSaved: 234, // USD
        co2Saved: 12.3 // kg
      }
    },
    route: {
      coordinates: dirtyPanels.slice(0, 10).map(panel => [panel.lat, panel.lng]),
      waypoints: dirtyPanels.slice(0, 10).map((panel, index) => ({
        id: panel.id,
        order: index + 1,
        estimatedTime: Math.round(5 + Math.random() * 3), // 5-8 minutes per panel
        coordinates: [panel.lat, panel.lng]
      }))
    },
    algorithm: {
      name: 'Genetic Algorithm + 2-opt',
      iterations: 1000,
      executionTime: 2.3, // seconds
      convergenceRate: 0.95
    }
  };
};

/**
 * Mock notifications API
 */
export const getNotifications = async () => {
  await delay(500);
  
  return [
    {
      id: 1,
      type: 'alert',
      title: 'High Soiling Detected',
      message: 'Sector B-7 panels showing 65% soiling level',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'Cleaning Route Optimized',
      message: 'New route saves 47% time and 52% battery',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Weather Update',
      message: 'Clear skies expected for next 3 days - optimal cleaning window',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      read: true,
      priority: 'low'
    }
  ];
};

/**
 * Mock panel details API
 */
export const getPanelDetails = async (panelId) => {
  await delay(400);
  
  // Generate random but realistic data
  const status = ['clean', 'moderate', 'dirty'][Math.floor(Math.random() * 3)];
  const efficiency = status === 'clean' ? 90 : status === 'moderate' ? 75 : 55;
  
  return {
    id: panelId,
    status,
    efficiency,
    soilingLevel: 100 - efficiency + Math.floor(Math.random() * 10),
    lastCleaned: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    temperature: Math.round(30 + Math.random() * 8),
    voltage: Math.round((220 + Math.random() * 20) * 100) / 100,
    current: Math.round((8 + Math.random() * 4) * 100) / 100,
    powerOutput: Math.round((efficiency / 100 * 400) * 100) / 100, // 400W max
    maintenanceHistory: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        type: 'Cleaning',
        technician: 'Drone Unit D-007',
        duration: '3 minutes'
      },
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        type: 'Inspection',
        technician: 'Field Team Alpha',
        duration: '15 minutes'
      }
    ],
    weatherConditions: {
      lastRain: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      avgDustLevel: Math.round(40 + Math.random() * 30),
      windExposure: 'Medium'
    }
  };
};

/**
 * Mock analytics API
 */
export const getAnalytics = async (timeRange = '7d') => {
  await delay(700);
  
  const generateTrendData = (days) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        efficiency: Math.round(82 + Math.random() * 10),
        soiling: Math.round(15 + Math.random() * 25),
        cleaned: Math.round(50 + Math.random() * 200),
        energy: Math.round(200 + Math.random() * 100)
      });
    }
    return data;
  };
  
  return {
    trends: generateTrendData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90),
    kpis: {
      avgEfficiency: 87.2,
      totalCleaned: 1250,
      energySaved: 45.7, // MWh
      costSavings: 12450, // USD
      co2Reduction: 23.8 // tons
    },
    predictions: {
      nextWeekEfficiency: 89.1,
      optimalCleaningDate: '2025-08-26',
      expectedROI: 156, // %
      maintenanceSavings: 23400 // USD
    }
  };
};

/**
 * Mock system health API
 */
export const getSystemHealth = async () => {
  await delay(600);
  
  return {
    overall: 'excellent',
    score: 94,
    components: {
      aiModel: { status: 'healthy', uptime: 99.8, lastUpdate: '2025-08-20' },
      droneFleet: { status: 'healthy', active: 12, total: 15, batteryAvg: 87 },
      sensors: { status: 'warning', active: 156, total: 160, accuracy: 98.2 },
      dataFlow: { status: 'healthy', latency: 45, throughput: 1250 },
      weatherAPI: { status: 'healthy', calls: 2340, limit: 10000 }
    },
    alerts: [
      {
        component: 'sensors',
        message: '4 sensors offline in Sector C-12',
        severity: 'medium',
        timestamp: new Date().toISOString()
      }
    ]
  };
};
