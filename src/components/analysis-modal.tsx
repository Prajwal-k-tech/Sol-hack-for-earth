import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarChart3, TrendingUp, Zap, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalysisModalProps {
  trigger?: React.ReactNode
}

// Mock data for analysis
const soilingTrendData = [
  { date: "Aug 10", soiling: 5, efficiency: 95 },
  { date: "Aug 17", soiling: 12, efficiency: 88 },
  { date: "Aug 24", soiling: 18, efficiency: 82 },
  { date: "Aug 31", soiling: 25, efficiency: 75 },
];

const cleaningImpactData = [
  { month: "Jun", beforeCleaning: 82, afterCleaning: 98 },
  { month: "Jul", beforeCleaning: 75, afterCleaning: 96 },
  { month: "Aug", beforeCleaning: 68, afterCleaning: 94 },
];

const AnalysisModal = ({ trigger }: AnalysisModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="w-full border-overlay0 hover:bg-surface1">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analysis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-surface0 border-overlay0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text">
            <BarChart3 className="h-5 w-5 text-blue" />
            Cleaning Performance Analysis
          </DialogTitle>
          <DialogDescription className="text-subtext1">
            Detailed analysis of soiling patterns and cleaning effectiveness
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface1 rounded-lg p-3 text-center border border-overlay0">
              <TrendingUp className="h-6 w-6 text-green mx-auto mb-2" />
              <div className="text-lg font-bold text-text">22%</div>
              <div className="text-xs text-subtext1">Efficiency Gain</div>
            </div>
            <div className="bg-surface1 rounded-lg p-3 text-center border border-overlay0">
              <Zap className="h-6 w-6 text-yellow mx-auto mb-2" />
              <div className="text-lg font-bold text-text">1,240</div>
              <div className="text-xs text-subtext1">kWh Recovered</div>
            </div>
            <div className="bg-surface1 rounded-lg p-3 text-center border border-overlay0">
              <DollarSign className="h-6 w-6 text-green mx-auto mb-2" />
              <div className="text-lg font-bold text-text">₹8,060</div>
              <div className="text-xs text-subtext1">Revenue Gained</div>
            </div>
            <div className="bg-surface1 rounded-lg p-3 text-center border border-overlay0">
              <BarChart3 className="h-6 w-6 text-blue mx-auto mb-2" />
              <div className="text-lg font-bold text-text">325%</div>
              <div className="text-xs text-subtext1">ROI Achieved</div>
            </div>
          </div>

          {/* Soiling Trend Chart */}
          <div className="bg-surface1 rounded-lg p-4 border border-overlay0">
            <h3 className="text-lg font-semibold text-text mb-4">Soiling Accumulation Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={soilingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6c7086" />
                  <XAxis dataKey="date" stroke="#bac2de" />
                  <YAxis stroke="#bac2de" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#313244', 
                      border: '1px solid #6c7086',
                      borderRadius: '8px',
                      color: '#cdd6f4'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="soiling" 
                    stroke="#f38ba8" 
                    strokeWidth={2}
                    name="Soiling (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#a6e3a1" 
                    strokeWidth={2}
                    name="Efficiency (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cleaning Impact Chart */}
          <div className="bg-surface1 rounded-lg p-4 border border-overlay0">
            <h3 className="text-lg font-semibold text-text mb-4">Cleaning Impact Comparison</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cleaningImpactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6c7086" />
                  <XAxis dataKey="month" stroke="#bac2de" />
                  <YAxis stroke="#bac2de" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#313244', 
                      border: '1px solid #6c7086',
                      borderRadius: '8px',
                      color: '#cdd6f4'
                    }}
                  />
                  <Bar dataKey="beforeCleaning" fill="#f38ba8" name="Before Cleaning (%)" />
                  <Bar dataKey="afterCleaning" fill="#a6e3a1" name="After Cleaning (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analysis Insights */}
          <div className="bg-surface1 rounded-lg p-4 border border-overlay0">
            <h3 className="text-lg font-semibold text-text mb-3">Key Insights</h3>
            <div className="space-y-2 text-sm text-subtext1">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></div>
                <span>Optimal cleaning frequency appears to be every 14-17 days based on current soiling rate</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
                <span>Weather patterns suggest cleaning should be scheduled before predicted dust storms</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0"></div>
                <span>Robotic cleaning shows 15% better efficiency than manual cleaning in current conditions</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-overlay0 hover:bg-surface1 text-text">
            Close
          </Button>
          <Button className="bg-blue hover:bg-sky text-crust">
            Export Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;
