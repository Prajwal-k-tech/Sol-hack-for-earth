// Utility functions for Sol-AI Planner

/**
 * Generate realistic solar panel coordinates around Bangalore
 * @param {number} count - Number of panels to generate
 * @param {Object} center - Center coordinates {lat, lng}
 * @param {number} radius - Radius in km to spread panels
 * @returns {Array} Array of panel objects
 */
export const generateSolarPanels = (count = 300, center = { lat: 12.9716, lng: 77.5946 }, radius = 5) => {
  const panels = [];
  
  // Define status distribution: 70% clean, 20% moderate, 10% dirty
  const statusDistribution = [
    ...Array(Math.floor(count * 0.7)).fill('clean'),
    ...Array(Math.floor(count * 0.2)).fill('moderate'),
    ...Array(Math.floor(count * 0.1)).fill('dirty')
  ];
  
  // Shuffle the distribution
  for (let i = statusDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statusDistribution[i], statusDistribution[j]] = [statusDistribution[j], statusDistribution[i]];
  }
  
  for (let i = 0; i < count; i++) {
    // Generate coordinates in a rough grid pattern with randomization
    const gridSize = Math.ceil(Math.sqrt(count));
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    
    // Base position with slight randomization
    const latOffset = (row / gridSize - 0.5) * (radius / 111) + (Math.random() - 0.5) * 0.005;
    const lngOffset = (col / gridSize - 0.5) * (radius / 111) + (Math.random() - 0.5) * 0.005;
    
    const status = statusDistribution[i] || 'clean';
    const efficiency = getEfficiencyByStatus(status);
    
    panels.push({
      id: `SP-${String(i + 1).padStart(4, '0')}`,
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
      status,
      efficiency,
      soilingLevel: getSoilingLevelByStatus(status),
      lastCleaned: getRandomLastCleanedDate(),
      temperature: Math.round(28 + Math.random() * 8), // 28-36°C
      voltage: Math.round((220 + Math.random() * 20) * 100) / 100 // 220-240V
    });
  }
  
  return panels;
};

/**
 * Get efficiency percentage based on panel status
 */
const getEfficiencyByStatus = (status) => {
  switch (status) {
    case 'clean':
      return Math.round(85 + Math.random() * 10); // 85-95%
    case 'moderate':
      return Math.round(70 + Math.random() * 15); // 70-85%
    case 'dirty':
      return Math.round(45 + Math.random() * 20); // 45-65%
    default:
      return 85;
  }
};

/**
 * Get soiling level based on status
 */
const getSoilingLevelByStatus = (status) => {
  switch (status) {
    case 'clean':
      return Math.round(Math.random() * 15); // 0-15%
    case 'moderate':
      return Math.round(15 + Math.random() * 25); // 15-40%
    case 'dirty':
      return Math.round(40 + Math.random() * 35); // 40-75%
    default:
      return 10;
  }
};

/**
 * Generate random last cleaned date
 */
const getRandomLastCleanedDate = () => {
  const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Simple TSP solver using nearest neighbor heuristic
 * @param {Array} panels - Array of panel coordinates
 * @param {Object} startPoint - Starting point {lat, lng}
 * @returns {Object} Optimized route with distance and time metrics
 */
export const solveTSP = (panels, startPoint = { lat: 12.9716, lng: 77.5946 }) => {
  if (panels.length === 0) return { route: [], totalDistance: 0, estimatedTime: 0 };
  
  // Filter only dirty panels that need cleaning
  const dirtyPanels = panels.filter(panel => panel.status === 'dirty');
  
  if (dirtyPanels.length === 0) return { route: [], totalDistance: 0, estimatedTime: 0 };
  
  const unvisited = [...dirtyPanels];
  const route = [startPoint];
  let currentPoint = startPoint;
  let totalDistance = 0;
  
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = calculateDistance(currentPoint, unvisited[0]);
    
    // Find nearest unvisited panel
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(currentPoint, unvisited[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }
    
    const nearestPanel = unvisited[nearestIndex];
    route.push(nearestPanel);
    totalDistance += minDistance;
    currentPoint = nearestPanel;
    unvisited.splice(nearestIndex, 1);
  }
  
  // Return to start
  totalDistance += calculateDistance(currentPoint, startPoint);
  route.push(startPoint);
  
  // Calculate estimated time (assuming drone speed of 15 m/s)
  const estimatedTime = Math.round((totalDistance * 1000) / 15 / 60); // minutes
  
  return {
    route,
    totalDistance: Math.round(totalDistance * 1000) / 1000, // km
    estimatedTime,
    panelsToClean: dirtyPanels.length
  };
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {Object} point1 - {lat, lng}
 * @param {Object} point2 - {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Generate sample soiling forecast data
 */
export const generateSoilingForecast = () => {
  const today = new Date();
  const forecast = [];
  const baseValues = [10, 15, 30, 60, 40, 20, 10]; // Sample progression
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    forecast.push({
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percentage: baseValues[i],
      riskLevel: baseValues[i] < 30 ? 'low' : baseValues[i] < 50 ? 'medium' : 'high',
      temperature: Math.round(30 + Math.random() * 6), // 30-36°C
      humidity: Math.round(40 + Math.random() * 20), // 40-60%
      windSpeed: Math.round(8 + Math.random() * 8) // 8-16 km/h
    });
  }
  
  return forecast;
};

/**
 * Format numbers with appropriate units
 */
export const formatNumber = (num, decimals = 0) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num.toLocaleString();
};

/**
 * Get color based on efficiency or soiling level
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'clean':
      return '#22c55e'; // green
    case 'moderate':
      return '#f59e0b'; // orange
    case 'dirty':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

/**
 * Generate realistic weather alerts
 */
export const generateWeatherAlerts = () => {
  const alerts = [
    'Dust storm expected tomorrow - High soiling risk',
    'Heavy winds forecasted - Monitor panel stability',
    'Rain expected this weekend - Natural cleaning opportunity',
    'High PM2.5 levels detected - Increased soiling rate',
    'Clear skies ahead - Optimal cleaning window'
  ];
  
  // Return random alert with 60% probability
  return Math.random() < 0.6 ? alerts[Math.floor(Math.random() * alerts.length)] : null;
};

/**
 * Calculate battery savings from route optimization
 */
export const calculateOptimizationSavings = (originalRoute, optimizedRoute) => {
  const originalDistance = originalRoute.totalDistance || 15.2; // fallback
  const optimizedDistance = optimizedRoute.totalDistance || 8.1; // fallback
  
  const timeSavings = Math.round(((originalDistance - optimizedDistance) / originalDistance) * 100);
  const batterySavings = Math.round(timeSavings * 1.1); // Battery savings typically higher
  
  return {
    timeSavings,
    batterySavings,
    originalTime: Math.round(originalDistance * 10.8), // minutes
    optimizedTime: Math.round(optimizedDistance * 10.8), // minutes
    distanceSaved: Math.round((originalDistance - optimizedDistance) * 100) / 100
  };
};
