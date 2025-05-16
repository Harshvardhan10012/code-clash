'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Code } from 'lucide-react';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string, predictedWillPass: boolean) => void;
  challengeTitle: string;
  challengeLanguage: string;
  defaultCode?: string;
}

export function PredictionModal({
  isOpen,
  onClose,
  onSubmit,
  challengeTitle,
  challengeLanguage,
  defaultCode = '',
}: PredictionModalProps) {
  const [code, setCode] = useState(defaultCode);
  const [predictedWillPass, setPredictedWillPass] = useState<string>('true'); // 'true' or 'false' as string for RadioGroup

  const handleSubmit = () => {
    onSubmit(code, predictedWillPass === 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center">
            <Code className="mr-2 h-6 w-6"/> Predict for: {challengeTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit your {challengeLanguage} code and predict if it will pass the test cases.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="code-editor" className="text-base font-medium">
              Your Code ({challengeLanguage})
            </Label>
            <Textarea
              id="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Enter your ${challengeLanguage} solution here...`}
              className="min-h-[200px] font-mono text-sm bg-background border-input focus:ring-accent"
              rows={10}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">Will your code pass all test cases?</Label>
            <RadioGroup
              value={predictedWillPass}
              onValueChange={setPredictedWillPass}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="predict-pass" className="text-primary focus:ring-accent checked:bg-accent checked:border-accent"/>
                <Label htmlFor="predict-pass" className="cursor-pointer">Yes, it will pass</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="predict-fail" className="text-primary focus:ring-accent checked:bg-accent checked:border-accent"/>
                <Label htmlFor="predict-fail" className="cursor-pointer">No, it will fail</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Submit Prediction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
