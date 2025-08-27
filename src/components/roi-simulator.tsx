import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, TrendingUp, Info, Settings } from 'lucide-react';
import { 
  calculateCleaningROI, 
  defaultSystemProfile, 
  defaultTariff,
  type CleaningImpactData 
} from "@/lib/solar-calculations";

const RoiSimulator = () => {
  const [cost, setCost] = useState('2500');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [daysSinceCleaning, setDaysSinceCleaning] = useState(14);
  const [results, setResults] = useState<{
    energyRecovered: number
    revenueRecovered: number
    paybackPeriod: number
    roi: number
    demandChargeImpact: number
    detailedBreakdown: {
      peakEnergyValue: number
      offPeakEnergyValue: number
      demandChargeSavings: number
      totalRevenue: number
    }
  } | null>(null);

  const weatherImpact: CleaningImpactData = {
    soilingRate: 0.15,
    cleaningEffectiveness: 95,
    degradationFactor: 0.8,
    weatherImpactFactor: 1.2, // Higher due to current dusty conditions
    dustAccumulation: 8.5 // Current dust level percentage
  };

  const handleCalculate = () => {
    const cleaningCost = parseFloat(cost);
    if (isNaN(cleaningCost) || cleaningCost <= 0) {
      setResults(null);
      return;
    }

    const calculatedResults = calculateCleaningROI(
      cleaningCost,
      defaultSystemProfile,
      defaultTariff,
      daysSinceCleaning,
      weatherImpact
    );

    setResults(calculatedResults);
  };

  return (
    <Card className="hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Calculator className="w-5 h-5 text-accent-info" />
            ROI Simulator
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-text-muted hover:text-accent-info"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label htmlFor="cleaning-cost" className="text-sm font-medium text-text-secondary mb-1 block">
              Cleaning Cost
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted font-medium">₹</span>
              <Input
                id="cleaning-cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g., 2500"
                className="pl-7 text-base bg-surface-overlay/50 border-border/60 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:ring-accent-primary/20"
              />
            </div>
          </div>

          {showAdvanced && (
            <div className="space-y-3 p-3 bg-surface-overlay/30 rounded-lg border border-border/50">
              <div>
                <label htmlFor="days-since-cleaning" className="text-sm font-medium text-text-secondary mb-1 block">
                  Days Since Last Cleaning
                </label>
                <Input
                  id="days-since-cleaning"
                  type="number"
                  value={daysSinceCleaning}
                  onChange={(e) => setDaysSinceCleaning(parseInt(e.target.value) || 14)}
                  min="1"
                  max="60"
                  className="text-base bg-surface-overlay/50"
                />
              </div>
              
              <div className="text-xs text-text-muted space-y-1">
                <div className="flex justify-between">
                  <span>System Capacity:</span>
                  <span className="text-text-primary">{defaultSystemProfile.capacity} kW</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Tariff:</span>
                  <span className="text-text-primary">₹{defaultTariff.peakRate}/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Off-Peak Tariff:</span>
                  <span className="text-text-primary">₹{defaultTariff.offPeakRate}/kWh</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleCalculate} 
            variant="default" 
            className="w-full bg-accent-primary hover:bg-accent-primary/90 text-surface-base font-medium shadow-md hover:shadow-glow transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Calculate ROI
          </Button>
        </div>

        {results && (
          <div className="pt-3 border-t border-border space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-surface-overlay/50 rounded-lg p-3 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-text-muted text-sm font-medium">Daily Energy Recovered</span>
                  <div className="group relative">
                    <Info className="w-3 h-3 text-text-muted cursor-help" />
                    <div className="invisible group-hover:visible absolute right-0 bottom-4 bg-surface-overlay-2 text-xs text-text-primary p-2 rounded shadow-lg w-48 z-10">
                      Energy generation restored after cleaning based on current soiling levels
                    </div>
                  </div>
                </div>
                <span className="font-bold text-accent-success text-lg">{results.energyRecovered.toFixed(1)} kWh</span>
              </div>
              
              <div className="bg-surface-overlay/50 rounded-lg p-3 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-text-muted text-sm font-medium">Daily Revenue Recovery</span>
                  <div className="group relative">
                    <Info className="w-3 h-3 text-text-muted cursor-help" />
                    <div className="invisible group-hover:visible absolute right-0 bottom-4 bg-surface-overlay-2 text-xs text-text-primary p-2 rounded shadow-lg w-48 z-10">
                      Includes peak/off-peak tariffs and demand charge benefits
                    </div>
                  </div>
                </div>
                <span className="font-bold text-accent-warning text-lg">₹{results.revenueRecovered.toFixed(0)}</span>
              </div>
              
              <div className="bg-surface-overlay/50 rounded-lg p-3 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-text-muted text-sm font-medium">Payback Period</span>
                </div>
                <span className="font-bold text-accent-info text-lg">{results.paybackPeriod} days</span>
              </div>
              
              <div className="bg-surface-overlay/50 rounded-lg p-3 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-text-muted text-sm font-medium">Monthly ROI</span>
                </div>
                <span className={`font-bold text-xl ${results.roi > 15 ? 'text-accent-success' : results.roi > 5 ? 'text-accent-warning' : 'text-accent-error'}`}>
                  {results.roi > 0 ? '+' : ''}{results.roi.toFixed(1)}%
                </span>
              </div>
            </div>

            {showAdvanced && results.detailedBreakdown && (
              <div className="pt-2 border-t border-border/50 space-y-2">
                <h4 className="text-sm font-medium text-text-secondary">Revenue Breakdown (Daily)</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Peak Hours Energy:</span>
                    <span className="text-accent-primary">₹{results.detailedBreakdown.peakEnergyValue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Off-Peak Energy:</span>
                    <span className="text-accent-primary">₹{results.detailedBreakdown.offPeakEnergyValue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Demand Charge Savings:</span>
                    <span className="text-accent-primary">₹{results.detailedBreakdown.demandChargeSavings.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t border-border/30">
                    <span className="text-text-primary">Total Daily Revenue:</span>
                    <span className="text-accent-success">₹{results.detailedBreakdown.totalRevenue.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoiSimulator;
