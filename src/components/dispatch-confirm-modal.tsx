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
import { BellRing, Check, Rocket, UserCheck } from "lucide-react";

interface DispatchConfirmModalProps {
  // Optional: allow caller to pass a custom trigger button
  trigger?: React.ReactNode
}

const DispatchConfirmModal = ({ trigger }: DispatchConfirmModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="default" className="w-full text-surface-base shadow-lg hover:shadow-glow">
            <Rocket className="w-4 h-4 mr-2" />
            Schedule Cleaning
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BellRing className="w-6 h-6 text-accent-info" />
            Confirm Cleaning Dispatch
          </DialogTitle>
          <DialogDescription className="text-base">
            Review the details below and confirm to dispatch our vetted cleaning partner.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="bg-surface-overlay/30 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-text-primary text-lg">Recommended Date:</h4>
            <p className="text-accent-primary font-bold text-xl">August 29, 2025</p>
          </div>
          <div className="bg-surface-overlay/30 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-text-primary flex items-center gap-2 text-lg">
              <UserCheck className="w-5 h-5 text-accent-success" />
              Vetted Cleaning Partner:
            </h4>
            <p className="text-text-secondary font-medium text-lg">GreenClean Solutions, Kerala</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-overlay/30 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-text-primary">Quote:</h4>
              <p className="text-text-secondary font-bold text-lg">₹2,500</p>
              <p className="text-text-muted text-sm">(incl. water & transport)</p>
            </div>
            <div className="bg-surface-overlay/30 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-text-primary">Projected ROI:</h4>
              <p className="font-bold text-accent-primary text-2xl">12%</p>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="default" className="flex-1 bg-accent-success hover:bg-accent-success/90 text-surface-base shadow-lg">
            <Check className="w-4 h-4 mr-2" />
            Confirm & Dispatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchConfirmModal;
