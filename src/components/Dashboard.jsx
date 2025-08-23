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
  selectedPanel,
  optimizedRoute,
  isOptimizing,
  onRouteOptimization,
  onOptimizationLoading
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Farm Overview */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {farmData?.farm?.name || 'Bangalore Solar Park'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Real-time monitoring and AI-powered optimization
        </p>
      </div>

      {/* Key Metrics */}
      <MetricsCards metrics={metrics} farmData={farmData} />

      {/* Weather Widget */}
      <WeatherWidget weatherData={weatherData} />

      {/* Soiling Prediction Chart */}
      <SoilingChart soilingForecast={soilingForecast} />

      {/* Route Optimizer */}
      <RouteOptimizer
        panels={panels}
        optimizedRoute={optimizedRoute}
        isOptimizing={isOptimizing}
        onRouteOptimization={onRouteOptimization}
        onOptimizationLoading={onOptimizationLoading}
      />

      {/* Panel Details */}
      {selectedPanel && (
        <PanelDetails panel={selectedPanel} />
      )}
    </div>
  );
};

export default Dashboard;
