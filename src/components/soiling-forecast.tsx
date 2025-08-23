import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Droplets, Wind, Eye, AlertTriangle } from "lucide-react";

export function SoilingForecast() {
  const forecastData = [
    { day: "Today", date: "24", aqi: 155, soiling: "High", trend: "up", weather: "Clear" },
    { day: "Tomorrow", date: "25", aqi: 170, soiling: "Very High", trend: "up", weather: "Dust" },
    { day: "Mon", date: "26", aqi: 160, soiling: "High", trend: "down", weather: "Clear" },
    { day: "Tue", date: "27", aqi: 140, soiling: "Moderate", trend: "down", weather: "Wind" },
    { day: "Wed", date: "28", aqi: 90, soiling: "Low", trend: "down", weather: "Rain" },
    { day: "Thu", date: "29", aqi: 110, soiling: "Moderate", trend: "up", weather: "Clear" },
    { day: "Fri", date: "30", aqi: 125, soiling: "Moderate", trend: "up", weather: "Clear" },
  ];

  const getSoilingColor = (level: string) => {
    switch (level) {
      case "Very High": return "text-red-500";
      case "High": return "text-orange-400";
      case "Moderate": return "text-yellow-400";
      case "Low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "Rain": return <Droplets className="h-3 w-3" />;
      case "Dust": return <AlertTriangle className="h-3 w-3" />;
      case "Wind": return <Wind className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };

  return (
    <Card className="hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Eye className="h-5 w-5 text-accent-primary" />
          7-Day Soiling Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Optimal Cleaning Recommendation */}
        <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 p-4 rounded-lg text-center border border-accent-primary/20">
          <p className="text-sm text-text-muted mb-1">Optimal Cleaning Recommended</p>
          <p className="text-2xl font-bold text-accent-primary">Aug 28 (Wednesday)</p>
          <p className="text-xs text-text-muted mt-1">Before expected rain • Expected ROI: 18%</p>
          <Button className="mt-3 bg-accent-primary hover:bg-accent-primary/90" size="sm">
            Schedule Cleaning
          </Button>
        </div>

        {/* 7-Day Forecast Grid */}
        <div className="grid grid-cols-7 gap-2">
          {forecastData.map((item, index) => (
            <div 
              key={item.day} 
              className={`p-2 rounded-md text-center transition-all duration-200 hover:bg-surface-overlay/40 ${
                index === 4 ? 'bg-accent-success/10 border border-accent-success/30' : 'bg-surface-overlay/20'
              }`}
            >
              <p className="text-xs font-semibold text-text-primary">{item.day}</p>
              <p className="text-xs text-text-muted mb-1">{item.date}</p>
              <div className="flex justify-center mb-1">
                {getWeatherIcon(item.weather)}
              </div>
              <p className={`text-xs font-medium ${getSoilingColor(item.soiling)}`}>
                {item.soiling}
              </p>
              <p className="text-xs text-text-muted">AQI {item.aqi}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Badge variant="destructive" className="text-xs">Very High</Badge>
          <Badge variant="warning" className="text-xs">High</Badge>
          <Badge variant="secondary" className="text-xs">Moderate</Badge>
          <Badge variant="success" className="text-xs">Low</Badge>
        </div>
      </CardContent>
    </Card>
  );
}