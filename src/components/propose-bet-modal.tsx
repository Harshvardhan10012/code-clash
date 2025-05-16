
'use client';

import { useState } from 'react';
import type { User } from '@/types';
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
import { Input } from '@/components/ui/input';
import { ShieldQuestion, Coins } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProposeBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (betAmount: number) => void;
  challengeTitle: string;
  targetUser?: User;
  targetPredictionOutcome: boolean; // true if target predicted 'Pass', false if 'Fail'
}

export function ProposeBetModal({
  isOpen,
  onClose,
  onSubmit,
  challengeTitle,
  targetUser,
  targetPredictionOutcome,
}: ProposeBetModalProps) {
  const [betAmount, setBetAmount] = useState<string>('10'); // Default bet amount as string

  const handleSubmit = () => {
    const amount = parseInt(betAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      onSubmit(amount);
    } else {
      // Basic validation, could enhance with toast
      alert('Please enter a valid positive number for the bet amount.');
    }
  };

  if (!targetUser) return null;

  const targetPredictedString = targetPredictionOutcome ? "PASS" : "FAIL";
  const yourBetImpliesTargetWill = targetPredictionOutcome ? "FAIL" : "PASS";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center">
            <ShieldQuestion className="mr-2 h-6 w-6"/> Propose Bet for: {challengeTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You are proposing a bet against <span className="font-semibold text-accent">{targetUser.name}</span>'s prediction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2 p-4 border rounded-md bg-muted/50">
            <p className="text-sm">
              <span className="font-semibold">{targetUser.name}</span> predicted their solution will <Badge variant={targetPredictionOutcome ? 'default' : 'destructive'} className={targetPredictionOutcome ? "bg-green-500" : "bg-red-500"}>{targetPredictedString}</Badge>.
            </p>
            <p className="text-sm ">
              You are betting that their actual outcome will be <Badge variant={!targetPredictionOutcome ? 'default' : 'destructive'} className={!targetPredictionOutcome ? "bg-green-500" : "bg-red-500"}>{yourBetImpliesTargetWill}</Badge> (i.e., their prediction is incorrect).
            </p>
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="bet-amount" className="text-base font-medium flex items-center">
              <Coins className="mr-2 h-5 w-5 text-yellow-500"/> Bet Amount (Points)
            </Label>
            <Input
              id="bet-amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter points to bet"
              className="bg-background border-input focus:ring-accent"
              min="1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Propose Bet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
