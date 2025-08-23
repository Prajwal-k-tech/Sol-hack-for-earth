import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Thermometer, 
  Activity, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { getPanelDetails } from '../services/api';

const PanelDetails = ({ panel, onClose }) => {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanelDetails = async () => {
      if (!panel) return;
      
      setLoading(true);
      try {
        const details = await getPanelDetails(panel.id);
        setDetailedData(details);
      } catch (error) {
        console.error('Failed to fetch panel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelDetails();
  }, [panel]);

  if (!panel) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'clean':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'dirty':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'clean':
        return CheckCircle;
      case 'moderate':
        return AlertCircle;
      case 'dirty':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const StatusIcon = getStatusIcon(panel.status);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-solar-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{panel.id}</h3>
            <p className="text-sky-100 text-sm">Solar Panel Details</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading panel details...</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Status Overview */}
          <div className={`p-3 rounded-lg border ${getStatusColor(panel.status)}`}>
            <div className="flex items-center gap-2">
              <StatusIcon className="w-5 h-5" />
              <div>
                <p className="font-semibold capitalize">{panel.status} Status</p>
                <p className="text-sm opacity-80">
                  {panel.efficiency}% efficiency • {panel.soilingLevel}% soiling
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Power Output</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {detailedData?.powerOutput || Math.round(panel.efficiency * 4)}W
              </p>
              <p className="text-xs text-gray-600">of 400W max</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Temperature</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {detailedData?.temperature || panel.temperature}°C
              </p>
              <p className="text-xs text-gray-600">Surface temp</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Voltage</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {detailedData?.voltage || panel.voltage}V
              </p>
              <p className="text-xs text-gray-600">DC output</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Current</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {detailedData?.current || (panel.voltage / 25).toFixed(1)}A
              </p>
              <p className="text-xs text-gray-600">DC current</p>
            </div>
          </div>

          {/* Maintenance History */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Last Cleaned</p>
                  <p className="text-xs text-gray-600">
                    {detailedData?.maintenanceHistory?.[0]?.date || panel.lastCleaned}
                  </p>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  {detailedData?.maintenanceHistory?.[0]?.duration || '3 min'}
                </span>
              </div>
              
              {detailedData?.maintenanceHistory?.slice(1).map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.type}</p>
                    <p className="text-xs text-gray-600">{item.date}</p>
                  </div>
                  <span className="text-xs text-gray-500">{item.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Conditions */}
          {detailedData?.weatherConditions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Environmental Impact</h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Rain</span>
                  <span className="font-medium text-gray-900">
                    {detailedData.weatherConditions.lastRain}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Dust Level</span>
                  <span className="font-medium text-gray-900">
                    {detailedData.weatherConditions.avgDustLevel}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Wind Exposure</span>
                  <span className="font-medium text-gray-900">
                    {detailedData.weatherConditions.windExposure}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
            <div className="space-y-2">
              {panel.status === 'dirty' && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-700">
                    Immediate cleaning required - efficiency loss exceeding 15%
                  </p>
                </div>
              )}
              
              {panel.status === 'moderate' && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Schedule cleaning within 48 hours to maintain optimal performance
                  </p>
                </div>
              )}
              
              {panel.status === 'clean' && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">
                    Panel operating at optimal efficiency - no action needed
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            <p>Coordinates: {panel.lat.toFixed(6)}, {panel.lng.toFixed(6)}</p>
            <p>Grid Position: Row {Math.floor(Math.random() * 50) + 1}, Col {Math.floor(Math.random() * 20) + 1}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelDetails;
