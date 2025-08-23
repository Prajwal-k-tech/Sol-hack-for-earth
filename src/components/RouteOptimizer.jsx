import React, { useState } from 'react';
import { 
  Route, 
  Play, 
  Clock, 
  Battery, 
  MapPin, 
  TrendingDown,
  CheckCircle,
  Loader2,
  Zap
} from 'lucide-react';
import { optimizeCleaningRoute } from '../services/api';
import { calculateOptimizationSavings } from '../utils/helpers';

const RouteOptimizer = ({
  panels = [],
  optimizedRoute,
  isOptimizing,
  onRouteOptimization,
  onOptimizationLoading
}) => {
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const dirtyPanelsCount = panels.filter(p => p.status === 'dirty').length;

  const handleOptimize = async () => {
    if (dirtyPanelsCount === 0) return;

    try {
      onOptimizationLoading(true);
      setShowResults(false);
      
      // Simulate optimization process
      const result = await optimizeCleaningRoute(panels);
      
      setOptimizationResult(result);
      onRouteOptimization(result);
      setShowResults(true);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      onOptimizationLoading(false);
    }
  };

  const resetOptimization = () => {
    setOptimizationResult(null);
    setShowResults(false);
    onRouteOptimization(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Route Optimization</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Route className="w-4 h-4" />
          <span>TSP Algorithm</span>
        </div>
      </div>

      {/* Optimization Control */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Cleaning Route Planner</h4>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">{dirtyPanelsCount} panels need cleaning</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Optimize drone cleaning routes using advanced TSP algorithms to minimize time and battery usage.
          </p>
        </div>

        <div className="space-y-3">
          {!isOptimizing && !showResults && (
            <button
              onClick={handleOptimize}
              disabled={dirtyPanelsCount === 0}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                dirtyPanelsCount > 0
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4" />
              {dirtyPanelsCount > 0 ? 'Optimize Cleaning Route' : 'No Panels Need Cleaning'}
            </button>
          )}

          {isOptimizing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-900">Optimizing Route...</p>
                  <p className="text-sm text-blue-700">
                    Running TSP algorithm for {dirtyPanelsCount} panels
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">Analyzing optimal waypoints...</p>
              </div>
            </div>
          )}

          {showResults && optimizationResult && (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Route Optimized Successfully!</h4>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Generated optimal cleaning path for {optimizationResult.route?.waypoints?.length || dirtyPanelsCount} panels
                </p>
              </div>

              {/* Optimization Results */}
              <div className="bg-gradient-to-r from-sky-50 to-green-50 border border-sky-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Optimization Results</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Time Savings</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {optimizationResult.optimization?.improvements?.timeSavedPercentage || 47}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {optimizationResult.optimization?.optimizedRoute?.time || 87} min vs {optimizationResult.optimization?.originalRoute?.time || 164} min
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Battery Savings</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {optimizationResult.optimization?.improvements?.batterySavedPercentage || 52}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {optimizationResult.optimization?.optimizedRoute?.batteryUsage || 41}% vs {optimizationResult.optimization?.originalRoute?.batteryUsage || 85}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Distance</span>
                    </div>
                    <p className="text-xl font-bold text-purple-600">
                      {optimizationResult.optimization?.optimizedRoute?.distance || 8.1} km
                    </p>
                    <p className="text-xs text-gray-600">
                      {optimizationResult.optimization?.improvements?.distanceSaved || 7.1} km saved
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Cost Savings</span>
                    </div>
                    <p className="text-xl font-bold text-yellow-600">
                      ₹{(optimizationResult.optimization?.improvements?.costSaved || 234) * 84}
                    </p>
                    <p className="text-xs text-gray-600">Per optimization cycle</p>
                  </div>
                </div>
              </div>

              {/* Algorithm Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Algorithm Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Algorithm</p>
                    <p className="font-medium text-gray-900">
                      {optimizationResult.algorithm?.name || 'Genetic Algorithm + 2-opt'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Iterations</p>
                    <p className="font-medium text-gray-900">
                      {optimizationResult.algorithm?.iterations || 1000}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Execution Time</p>
                    <p className="font-medium text-gray-900">
                      {optimizationResult.algorithm?.executionTime || 2.3}s
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Convergence</p>
                    <p className="font-medium text-green-600">
                      {Math.round((optimizationResult.algorithm?.convergenceRate || 0.95) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetOptimization}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleOptimize}
                  className="flex-1 py-2 px-4 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Re-optimize
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Cleaning Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Today's Cleanings</p>
            <p className="font-semibold text-gray-900">47 panels</p>
          </div>
          <div>
            <p className="text-gray-600">Average Time</p>
            <p className="font-semibold text-gray-900">3.2 min/panel</p>
          </div>
          <div>
            <p className="text-gray-600">Fleet Utilization</p>
            <p className="font-semibold text-green-600">78%</p>
          </div>
          <div>
            <p className="text-gray-600">Success Rate</p>
            <p className="font-semibold text-green-600">99.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
