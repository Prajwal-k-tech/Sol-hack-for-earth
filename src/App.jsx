import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SolarMap from './components/SolarMap';
import { generateSolarPanels, generateSoilingForecast } from './utils/helpers';
import { getSolarFarmData, getWeatherData, getNotifications } from './services/api';

function App() {
  const [panels, setPanels] = useState([]);
  const [farmData, setFarmData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [soilingForecast, setSoilingForecast] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Initialize application data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Generate panels and forecast data immediately
        const generatedPanels = generateSolarPanels(40);
        const forecast = generateSoilingForecast();
        
        setPanels(generatedPanels);
        setSoilingForecast(forecast);
        
        // Fetch API data in parallel
        const [farmResponse, weatherResponse, notificationsResponse] = await Promise.all([
          getSolarFarmData(),
          getWeatherData(),
          getNotifications()
        ]);
        
        setFarmData(farmResponse);
        setWeatherData(weatherResponse);
        setNotifications(notificationsResponse);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Calculate real-time metrics from panel data
  const metrics = React.useMemo(() => {
    if (!panels.length) return null;
    
    const clean = panels.filter(p => p.status === 'clean').length;
    const moderate = panels.filter(p => p.status === 'moderate').length;
    const dirty = panels.filter(p => p.status === 'dirty').length;
    const avgEfficiency = Math.round(
      panels.reduce((sum, p) => sum + p.efficiency, 0) / panels.length
    );
    
    return {
      totalPanels: panels.length,
      cleanPanels: clean,
      moderateSoiling: moderate,
      needsCleaning: dirty,
      currentEfficiency: avgEfficiency
    };
  }, [panels]);

  // Handle panel selection
  const handlePanelSelect = (panel) => {
    setSelectedPanel(panel);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-solar-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2 dark:text-white">Initializing sol</h2>
          <p className="text-gray-500 dark:text-gray-400">Loading solar farm data and AI models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-solar-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar 
        notifications={notifications}
        onNotificationRead={(id) => {
          setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
          );
        }}
      />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Dashboard */}
        <div className="w-full lg:w-96 bg-white shadow-lg overflow-y-auto dark:bg-gray-800">
          <Dashboard
            farmData={farmData}
            weatherData={weatherData}
            soilingForecast={soilingForecast}
            metrics={metrics}
            panels={panels}
            selectedPanel={selectedPanel}
          />
        </div>
        
        {/* Main Content - Solar Map */}
        <div className="flex-1 relative">
          <SolarMap
            panels={panels}
            farmData={farmData}
            onPanelSelect={handlePanelSelect}
            selectedPanel={selectedPanel}
          />
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] dark:bg-gray-800/90 dark:border dark:border-gray-700">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="dark:text-gray-300">Clean ({metrics?.cleanPanels || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                <span className="dark:text-gray-300">Moderate ({metrics?.moderateSoiling || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span className="dark:text-gray-300">Needs Cleaning ({metrics?.needsCleaning || 0})</span>
              </div>
              
            </div>
          </div>
          
          {/* Performance Metrics Overlay */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] dark:bg-gray-800/90 dark:border dark:border-gray-700">
            <div className="text-sm">
              <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">Real-time Performance</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="dark:text-gray-400">Efficiency:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{metrics?.currentEfficiency || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-400">Generation:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">245.8 MWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-400">Status:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>© 2025 sol</span>
            <span>•</span>
            <span>Hack for Earth 2025 - IIIT Kottayam</span>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>AI Model: v2.1.0</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Healthy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
