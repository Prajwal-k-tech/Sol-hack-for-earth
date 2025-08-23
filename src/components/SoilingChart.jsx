import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Brain, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SoilingChart = ({ soilingForecast = [] }) => {
  const { theme } = useTheme();
  // Use provided forecast or fallback data
  const data = soilingForecast.length > 0 ? soilingForecast : [
    { day: 'Today', date: 'Aug 23', percentage: 10, riskLevel: 'low' },
    { day: 'Tomorrow', date: 'Aug 24', percentage: 15, riskLevel: 'low' },
    { day: 'Day 3', date: 'Aug 25', percentage: 30, riskLevel: 'medium' },
    { day: 'Day 4', date: 'Aug 26', percentage: 60, riskLevel: 'high' },
    { day: 'Day 5', date: 'Aug 27', percentage: 40, riskLevel: 'medium' },
    { day: 'Day 6', date: 'Aug 28', percentage: 20, riskLevel: 'low' },
    { day: 'Day 7', date: 'Aug 29', percentage: 10, riskLevel: 'low' }
  ];

  const maxSoiling = Math.max(...data.map(d => d.percentage));
  const avgSoiling = Math.round(data.reduce((sum, d) => sum + d.percentage, 0) / data.length);
  
  const getRecommendation = () => {
    const highRiskDays = data.filter(d => d.percentage >= 50);
    if (highRiskDays.length > 0) {
      return {
        type: 'warning',
        message: `Schedule cleaning before ${highRiskDays[0].day} (${highRiskDays[0].date}) to prevent efficiency loss`,
        icon: AlertCircle,
        color: 'red'
      };
    }
    
    const mediumRiskDays = data.filter(d => d.percentage >= 30 && d.percentage < 50);
    if (mediumRiskDays.length > 0) {
      return {
        type: 'info',
        message: `Monitor soiling levels on ${mediumRiskDays[0].day} - cleaning may be beneficial`,
        icon: TrendingUp,
        color: 'yellow'
      };
    }
    
    return {
      type: 'success',
      message: 'Soiling levels remain optimal for the next 7 days',
      icon: CheckCircle,
      color: 'green'
    };
  };

  const recommendation = getRecommendation();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.day}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.date}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">Soiling Level: </span>
            <span className={`font-bold ${
              data.percentage < 30 ? 'text-green-600 dark:text-green-400' :
              data.percentage < 50 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {data.percentage}%
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            Risk Level: {data.riskLevel}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Soiling Prediction</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Brain className="w-4 h-4" />
          <span>92.5% Accuracy</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 dark:text-white">7-Day Soiling Forecast</h4>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span>Peak Soiling: </span>
              <span className="font-semibold text-red-600 dark:text-red-400">{maxSoiling}%</span>
            </div>
            <div>
              <span>Average: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{avgSoiling}%</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="soilingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f3f4f6'} />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                label={{ value: 'Soiling %', angle: -90, position: 'insideLeft', fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#soilingGradient)"
                dot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: '#3b82f6',
                  fill: theme === 'dark' ? '#1f2937' : '#ffffff'
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 2,
                  stroke: '#3b82f6'
                }}
              />
              {/* Threshold lines */}
              <Line 
                type="monotone" 
                dataKey={() => 30} 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                activeDot={false}
              />
              <Line 
                type="monotone" 
                dataKey={() => 50} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-green-500"></div>
            <span>Low Risk (&lt;30%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-yellow-500"></div>
            <span>Medium Risk (30-50%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-red-500"></div>
            <span>High Risk (&gt;50%)</span>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className={`p-4 rounded-lg border-l-4 ${
        recommendation.color === 'green' ? 'bg-green-50 border-green-400 dark:bg-green-900/50 dark:border-green-500' :
        recommendation.color === 'yellow' ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-500' :
        'bg-red-50 border-red-400 dark:bg-red-900/50 dark:border-red-500'
      }`}>
        <div className="flex items-start gap-3">
          <recommendation.icon className={`w-5 h-5 mt-0.5 ${
            recommendation.color === 'green' ? 'text-green-600 dark:text-green-400' :
            recommendation.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          }`} />
          <div>
            <h4 className={`font-semibold ${
              recommendation.color === 'green' ? 'text-green-800 dark:text-green-300' :
              recommendation.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-300' :
              'text-red-800 dark:text-red-300'
            }`}>
              AI Recommendation
            </h4>
            <p className={`text-sm mt-1 ${
              recommendation.color === 'green' ? 'text-green-700 dark:text-green-200' :
              recommendation.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-200' :
              'text-red-700 dark:text-red-200'
            }`}>
              {recommendation.message}
            </p>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-800/50 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 mb-2 dark:text-white">AI Model Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Model Version</p>
            <p className="font-medium text-gray-900 dark:text-white">SoilNet v2.1.0</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
            <p className="font-medium text-gray-900 dark:text-white">Aug 20, 2025</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Training Data</p>
            <p className="font-medium text-gray-900 dark:text-white">156K data points</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Confidence</p>
            <p className="font-medium text-green-600 dark:text-green-400">92.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilingChart;
