import React from 'react';
import MetricsCards from './MetricsCards';
import WeatherWidget from './WeatherWidget';
import SoilingChart from './SoilingChart';
import RouteOptimizer from './RouteOptimizer';
import PanelDetails from './PanelDetails';

const Dashboard = ({
  farmData,
  weatherData,
  soilingForecast,
  metrics,
  panels,
  selectedPanel
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Farm Overview */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {farmData?.farm?.name || 'My Solar Panels'}
        </h2>
        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
          Real-time monitoring and AI-powered optimization
        </p>
      </div>

      {/* Key Metrics */}
      <MetricsCards metrics={metrics} farmData={farmData} />

      {/* Weather Widget */}
      <WeatherWidget weatherData={weatherData} />

      {/* Soiling Prediction Chart */}
      <SoilingChart soilingForecast={soilingForecast} />

      

      {/* Panel Details */}
      {selectedPanel && (
        <PanelDetails panel={selectedPanel} />
      )}
    </div>
  );
};

export default Dashboard;
