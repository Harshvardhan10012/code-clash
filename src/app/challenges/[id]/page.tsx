'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockChallenges, mockUsers, mockPredictions, getChallengeById, getPredictionsForChallenge, getUserById } from '@/lib/mock-data';
import type { Challenge, Prediction as PredictionType, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Code, FileText, Loader2, MessageSquare, Tag, Users, Zap } from 'lucide-react';
import { PredictionModal } from '@/components/prediction-modal';
import { SolutionCard } from '@/components/solution-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateTestCases, predictCodeSolutionOutcome } from '@/ai/flows'; // Import AI functions

interface EnrichedPrediction extends PredictionType {
  user?: User;
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { toast } = useToast();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [predictions, setPredictions] = useState<EnrichedPrediction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [simulatedTestCases, setSimulatedTestCases] = useState<Awaited<ReturnType<typeof generateTestCases>>['testCases'] | null>(null);


  useEffect(() => {
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
      }
    }
  }, [challengeId]);

  if (!challenge) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-2 text-lg">Loading Challenge...</span></div>;
  }

  const deadlineText = formatDistanceToNow(new Date(challenge.deadline), { addSuffix: true });
  const formattedDeadline = format(new Date(challenge.deadline), "MMMM d, yyyy 'at' h:mm a");

  const handlePredictionSubmit = async (code: string, predictedWillPass: boolean) => {
    setIsModalOpen(false);
    toast({
      title: "Prediction Submitted!",
      description: "Your prediction and code have been recorded.",
    });
    // In a real app, you would save this prediction to a backend.
    // For now, we can add it to the local state or just simulate.
    console.log("Submitted code:", code);
    console.log("Predicted outcome (willPass):", predictedWillPass);

    // Simulate AI interaction for immediate feedback (optional, for demo)
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
                setSimulatedTestCases(currentTestCases); // Store for display if needed
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

  const renderChallengeStatusSpecificContent = () => {
    switch (challenge.status) {
      case 'open':
        return (
          <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={isLoadingAssessment}>
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
            <h2 className="mb-4 text-2xl font-semibold text-primary">Challenge Results & Submissions</h2>
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
    <div className="max-w-5xl mx-auto">
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

      <PredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePredictionSubmit}
        challengeTitle={challenge.title}
        challengeLanguage={challenge.language}
        defaultCode={challenge.exampleSolution || `// Your ${challenge.language} code here`}
      />
    </div>
  );
}
