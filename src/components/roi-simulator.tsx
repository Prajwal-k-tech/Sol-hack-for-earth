import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, TrendingUp } from 'lucide-react';

const RoiSimulator = () => {
  const [cost, setCost] = useState('2500');
  const [results, setResults] = useState({
    energyGained: 45.2,
    paybackPeriod: 4,
    roi: 12,
    show: true, // Changed to true to always show results
  });

  const handleCalculate = () => {
    const cleaningCost = parseFloat(cost);
    if (isNaN(cleaningCost) || cleaningCost <= 0) {
      setResults({ energyGained: 0, paybackPeriod: 0, roi: 0, show: true });
      return;
    }

    // Mock data and simplified formula as requested
    const energyGained = 40 + Math.random() * 15; // kWh
    const pricePerKwh = 8.5; // Mock price
    const revenue = energyGained * pricePerKwh;
    const profit = revenue - cleaningCost;
    const roi = (profit / cleaningCost) * 100;
    const dailyLossAvoided = 650; // Mock value
    const paybackPeriod = Math.ceil(cleaningCost / dailyLossAvoided);

    setResults({
      energyGained: parseFloat(energyGained.toFixed(1)),
      paybackPeriod,
      roi: parseFloat(roi.toFixed(0)),
      show: true,
    });
  };

  return (
    <Card className="hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Calculator className="w-5 h-5 text-accent-info" />
          ROI Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <label htmlFor="cleaning-cost" className="text-sm font-medium text-text-secondary mb-1 block">
              Enter Cleaning Cost
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
          <Button 
            onClick={handleCalculate} 
            variant="default" 
            className="w-full bg-accent-primary hover:bg-accent-primary/90 text-surface-base font-medium shadow-md hover:shadow-glow transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Calculate ROI
          </Button>
        </div>

        {results.show && (
          <div className="pt-2 border-t border-border space-y-2 animate-fade-in">
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-surface-overlay/50 rounded-lg p-2 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-medium">Energy Gained</span>
                  <span className="font-bold text-accent-success text-lg">{results.energyGained} kWh</span>
                </div>
              </div>
              <div className="bg-surface-overlay/50 rounded-lg p-2 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-medium">Payback Period</span>
                  <span className="font-bold text-accent-info text-lg">{results.paybackPeriod} days</span>
                </div>
              </div>
              <div className="bg-surface-overlay/50 rounded-lg p-2 hover:bg-surface-overlay transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-medium">Projected ROI</span>
                  <span className="font-bold text-accent-primary text-xl">{results.roi}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoiSimulator;
