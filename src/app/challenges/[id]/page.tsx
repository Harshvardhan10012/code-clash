
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  mockChallenges,
  mockUsers,
  mockPredictions,
  getChallengeById,
  getPredictionsForChallenge,
  getUserById,
  getPredictionsByOtherUsers,
  proposeBet as proposeBetAction,
  getProposedBetsForChallenge,
  addPrediction as addPredictionAction,
  type ProposedBet as ProposedBetType,
} from '@/lib/mock-data';
import type { Challenge, Prediction as PredictionType, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Code, FileText, Loader2, MessageSquare, Tag, Users, Zap, ShieldQuestion, Handshake } from 'lucide-react';
import { PredictionModal } from '@/components/prediction-modal';
import { ProposeBetModal } from '@/components/propose-bet-modal';
import { SolutionCard } from '@/components/solution-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateTestCases } from '@/ai/flows/generate-test-cases';
import { predictCodeSolutionOutcome } from '@/ai/flows/predict-code-solution-outcome';

interface EnrichedPrediction extends PredictionType {
  user?: User;
}

interface EnrichedProposedBet extends ProposedBetType {
  proposingUser?: User;
  targetUser?: User;
}

// Simulate a logged-in user. In a real app, this would come from an auth context.
const CURRENT_USER_ID = mockUsers[0]?.id || 'user1'; // Alice Coder

export default function ChallengeDetailPage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { toast } = useToast();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [predictions, setPredictions] = useState<EnrichedPrediction[]>([]);
  const [otherUserPredictions, setOtherUserPredictions] = useState<EnrichedPrediction[]>([]);
  const [proposedBets, setProposedBets] = useState<EnrichedProposedBet[]>([]);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [isProposeBetModalOpen, setIsProposeBetModalOpen] = useState(false);
  const [betTargetPrediction, setBetTargetPrediction] = useState<EnrichedPrediction | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [simulatedTestCases, setSimulatedTestCases] = useState<Awaited<ReturnType<typeof generateTestCases>>['testCases'] | null>(null);

  const refreshChallengeData = () => {
    if (challengeId) {
      const foundChallenge = getChallengeById(challengeId);
      if (foundChallenge) {
        setChallenge(foundChallenge);
        const challengePredictions = getPredictionsForChallenge(challengeId);
        const enrichedPredictions = challengePredictions.map(p => ({
          ...p,
          user: getUserById(p.userId)
        }));
        setPredictions(enrichedPredictions);

        const otherPredictions = getPredictionsByOtherUsers(challengeId, CURRENT_USER_ID);
        setOtherUserPredictions(otherPredictions);

        const currentProposedBets = getProposedBetsForChallenge(challengeId);
        setProposedBets(currentProposedBets);
      }
    }
  };

  useEffect(() => {
    refreshChallengeData();
  }, [challengeId]);

  if (!challenge) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-2 text-lg">Loading Challenge...</span></div>;
  }

  const deadlineText = formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true });
  const formattedDeadline = format(new Date(challenge.deadline), "MMMM d, yyyy 'at' h:mm a");

  const handlePredictionSubmit = async (code: string, predictedWillPass: boolean) => {
    setIsPredictionModalOpen(false);
    
    // Add the new prediction to mock data
    addPredictionAction({
      userId: CURRENT_USER_ID, // Assume current user is making the prediction
      challengeId: challenge.id,
      submittedCode: code,
      predictedOutcome: { willPass: predictedWillPass },
    });
    
    toast({
      title: "Prediction Submitted!",
      description: "Your prediction and code have been recorded.",
    });
    
    refreshChallengeData(); // Refresh data to show new prediction

    if (challenge.status === 'open') {
        setIsLoadingAssessment(true);
        toast({
            title: "AI Analyzing Your Solution...",
            description: "Please wait while our AI predicts the outcome.",
        });
        try {
            let currentTestCases = challenge.testCases;
            if (!currentTestCases || currentTestCases.length === 0) {
                const generated = await generateTestCases({
                    codeChallengeDescription: challenge.description,
                    programmingLanguage: challenge.language,
                });
                currentTestCases = generated.testCases;
                setSimulatedTestCases(currentTestCases);
                 toast({
                    title: "AI Generated Test Cases",
                    description: `${currentTestCases.length} test cases were generated for this challenge.`,
                });
            }

            const aiPrediction = await predictCodeSolutionOutcome({
                code: code,
                testCases: JSON.stringify(currentTestCases),
                language: challenge.language,
                challengeDescription: challenge.description,
            });

            toast({
                title: `AI Prediction: ${aiPrediction.willPass ? "Likely to Pass" : "Likely to Fail"}`,
                description: aiPrediction.reasoning,
                variant: aiPrediction.willPass ? "default" : "destructive",
                duration: 10000, 
            });
        } catch (error) {
            console.error("AI prediction error:", error);
            toast({
                title: "AI Prediction Error",
                description: "Could not get an AI prediction at this time.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingAssessment(false);
        }
    }
  };

  const handleOpenProposeBetModal = (targetPrediction: EnrichedPrediction) => {
    setBetTargetPrediction(targetPrediction);
    setIsProposeBetModalOpen(true);
  };

  const handleProposeBetSubmit = (betAmount: number) => {
    if (!betTargetPrediction || !betTargetPrediction.user) return;

    proposeBetAction(
      challenge.id,
      CURRENT_USER_ID,
      betTargetPrediction.userId,
      betTargetPrediction.id,
      betAmount
    );
    toast({
      title: "Bet Proposed!",
      description: `You proposed a ${betAmount} point bet against ${betTargetPrediction.user.name}.`,
    });
    setIsProposeBetModalOpen(false);
    setBetTargetPrediction(null);
    refreshChallengeData(); // Re-fetch bets
  };


  const renderChallengeStatusSpecificContent = () => {
    switch (challenge.status) {
      case 'open':
        return (
          <Button onClick={() => setIsPredictionModalOpen(true)} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={isLoadingAssessment}>
            {isLoadingAssessment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code className="mr-2 h-5 w-5" />}
            {isLoadingAssessment ? 'Analyzing...' : 'Make Your Prediction'}
          </Button>
        );
      case 'closed':
      case 'assessing':
        return (
          <div className="flex items-center justify-center rounded-md border border-dashed border-primary bg-primary/10 p-6 text-center text-primary">
            <Loader2 className="mr-3 h-8 w-8 animate-spin" />
            <div>
              <p className="text-lg font-semibold">Assessment in Progress</p>
              <p className="text-sm text-muted-foreground">Results will be available soon. Check back later!</p>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-primary">Challenge Results & Submissions</h3>
            {predictions.length > 0 ? (
              <ScrollArea className="h-[600px] rounded-md border p-4">
                 <div className="space-y-6">
                  {predictions.map(prediction => (
                    <SolutionCard key={prediction.id} prediction={prediction} challengeLanguage={challenge.language} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No submissions were made for this challenge.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card className="overflow-hidden shadow-xl">
        {challenge.imageUrl && (
          <div className="relative h-64 w-full md:h-80">
            <Image
              src={challenge.imageUrl}
              alt={challenge.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={challenge.aiHint || 'coding technology'}
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
             <div className="absolute bottom-0 left-0 p-6">
                <CardTitle className="text-3xl font-bold text-white md:text-4xl">{challenge.title}</CardTitle>
             </div>
          </div>
        )}
         {!challenge.imageUrl && (
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary md:text-4xl">{challenge.title}</CardTitle>
            </CardHeader>
         )}
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center text-muted-foreground">
              <Tag className="mr-2 h-5 w-5 text-accent" /> Language: {challenge.language}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Zap className="mr-2 h-5 w-5 text-accent" /> Difficulty: <Badge variant={challenge.difficulty === 'Easy' ? 'default' : challenge.difficulty === 'Medium' ? 'secondary' : 'destructive'} className="ml-1 text-xs">{challenge.difficulty}</Badge>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="mr-2 h-5 w-5 text-accent" /> Points: {challenge.points}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary flex items-center"><FileText className="mr-2 h-5 w-5"/>Description</h3>
            <CardDescription className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
              {challenge.description}
            </CardDescription>
          </div>
          
          {challenge.exampleSolution && (
             <div>
                <h3 className="mb-2 text-lg font-semibold text-primary flex items-center"><Code className="mr-2 h-5 w-5"/>Example Solution Snippet</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    <code className={`language-${challenge.language.toLowerCase()}`}>{challenge.exampleSolution}</code>
                </pre>
             </div>
          )}

          {simulatedTestCases && simulatedTestCases.length > 0 && (
            <div>
                <h3 className="mb-2 text-lg font-semibold text-primary flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500"/>AI Generated Test Cases</h3>
                <ScrollArea className="h-[200px] bg-muted p-4 rounded-md">
                    <ul className="space-y-2">
                    {simulatedTestCases.map((tc, index) => (
                        <li key={index} className="text-sm border-b pb-1">
                            <strong>Input:</strong> {tc.input} <br/>
                            <strong>Expected Output:</strong> {tc.expectedOutput}
                        </li>
                    ))}
                    </ul>
                </ScrollArea>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 bg-muted/50 p-6">
          <div className="flex items-center text-lg font-medium">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Deadline: {deadlineText} ({formattedDeadline})
          </div>
          {renderChallengeStatusSpecificContent()}
        </CardFooter>
      </Card>

      {/* Section for Other Users' Predictions and Proposing Bets */}
      {challenge.status === 'open' && otherUserPredictions.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center"><ShieldQuestion className="mr-2 h-5 w-5"/>Other Users' Predictions</CardTitle>
            <CardDescription>See what others are predicting for this challenge and propose a bet!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {otherUserPredictions.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                <div>
                  <p className="font-semibold">{p.user?.name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    Predicts their solution will: <Badge variant={p.predictedOutcome.willPass ? 'default' : 'destructive'} className={p.predictedOutcome.willPass ? 'bg-green-500' : 'bg-red-500'}>{p.predictedOutcome.willPass ? 'Pass' : 'Fail'}</Badge>
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleOpenProposeBetModal(p)}>
                  Propose Bet
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Section to display proposed bets */}
      {proposedBets.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center"><Handshake className="mr-2 h-5 w-5"/>Proposed Side Bets on this Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposedBets.map(bet => (
              <div key={bet.id} className="p-3 border rounded-md bg-card text-sm">
                <p>
                  <span className="font-semibold">{bet.proposingUser?.name || 'Someone'}</span> proposed a <Badge variant="secondary">{bet.betAmount} point</Badge> bet against <span className="font-semibold">{bet.targetUser?.name || 'someone'}</span>.
                </p>
                <p className="text-xs text-muted-foreground">
                  (Betting that {bet.targetUser?.name}'s prediction will be incorrect. Status: {bet.status.replace('_', ' ')})
                </p>
                 {/* TODO: Add Accept/Decline buttons if bet.targetUserId === CURRENT_USER_ID && bet.status === 'pending_acceptance' */}
              </div>
            ))}
          </CardContent>
        </Card>
      )}


      <PredictionModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
        onSubmit={handlePredictionSubmit}
        challengeTitle={challenge.title}
        challengeLanguage={challenge.language}
        defaultCode={challenge.exampleSolution || `// Your ${challenge.language} code here`}
      />

      {betTargetPrediction && challenge && (
        <ProposeBetModal
          isOpen={isProposeBetModalOpen}
          onClose={() => { setIsProposeBetModalOpen(false); setBetTargetPrediction(null); }}
          onSubmit={handleProposeBetSubmit}
          challengeTitle={challenge.title}
          targetUser={betTargetPrediction.user}
          targetPredictionOutcome={betTargetPrediction.predictedOutcome.willPass}
        />
      )}
    </div>
  );
}
