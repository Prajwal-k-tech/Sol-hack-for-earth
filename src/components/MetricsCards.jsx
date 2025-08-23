import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const MetricsCards = ({ metrics, farmData }) => {
  const cards = [
    {
      title: 'Total Panels',
      value: formatNumber(metrics?.totalPanels || 0),
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: null
    },
    {
      title: 'Clean Panels',
      value: formatNumber(metrics?.cleanPanels || 0),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/50',
      iconColor: 'text-green-600 dark:text-green-400',
      trend: '+2.3%'
    },
    {
      title: 'Need Cleaning',
      value: formatNumber(metrics?.needsCleaning || 0),
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/50',
      iconColor: 'text-red-600 dark:text-red-400',
      trend: '-1.8%'
    },
    {
      title: 'Current Efficiency',
      value: `${metrics?.currentEfficiency || 0}%`,
      icon: Zap,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/50',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      trend: '+0.7%'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 dark:text-white">{card.value}</p>
                {card.trend && (
                  <p className={`text-xs mt-1 ${
                    card.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {card.trend} from last week
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Farm Metrics */}
      {farmData && (
        <div className="bg-gradient-to-r from-sky-50 to-solar-50 border border-sky-200 rounded-lg p-4 mt-4 dark:from-gray-700/50 dark:to-gray-800/50 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-300">Today's Performance</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Energy Generated</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {farmData.metrics?.dailyGeneration || '45'} kWh
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">CO₂ Saved</p>
              <p className="font-semibold text-green-600 dark:text-green-400">
                {farmData.metrics?.co2Saved || '0.03'} tons
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="font-semibold text-sky-600 dark:text-sky-400">₹315</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Trees Equivalent</p>
              <p className="font-semibold text-solar-600 dark:text-solar-400">
                {formatNumber(farmData.metrics?.treesEquivalent || 1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsCards;
