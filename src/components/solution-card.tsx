import type { Prediction, User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface SolutionCardProps {
  prediction: Prediction & { user?: User };
  challengeLanguage: string;
}

export function SolutionCard({ prediction, challengeLanguage }: SolutionCardProps) {
  const { user, submittedCode, predictedOutcome, actualOutcome, isCorrect, pointsEarned, submissionDate } = prediction;

  const submissionDateTime = format(new Date(submissionDate), "MMMM d, yyyy 'at' h:mm a");

  return (
    <Card className="bg-card text-card-foreground shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.name} data-ai-hint={user?.aiHintAvatar || 'profile image'} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-medium text-primary">{user?.name || 'Anonymous User'}</CardTitle>
            <p className="text-xs text-muted-foreground">Submitted: {submissionDateTime}</p>
          </div>
        </div>
        {isCorrect !== undefined && (
          <Badge variant={isCorrect ? 'default' : 'destructive'} className={isCorrect ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}>
            {isCorrect ? `Correct (+${pointsEarned} pts)` : `Incorrect (${pointsEarned} pts)`}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Submitted Code ({challengeLanguage}):</h4>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-40">
            <code className={`language-${challengeLanguage.toLowerCase()}`}>{submittedCode}</code>
          </pre>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="text-sm font-semibold mb-1 text-muted-foreground">User's Prediction:</h4>
                <div className="flex items-center">
                {predictedOutcome.willPass ? 
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> : 
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />}
                <span className={predictedOutcome.willPass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    Predicted to {predictedOutcome.willPass ? 'Pass' : 'Fail'}
                </span>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Actual Outcome:</h4>
                {actualOutcome ? (
                <div className="flex items-center">
                    {actualOutcome.willPass ? 
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> : 
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />}
                    <span className={actualOutcome.willPass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {actualOutcome.willPass ? 'Passed' : 'Failed'}
                    </span>
                </div>
                ) : (
                <div className="flex items-center text-muted-foreground">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    <span>Outcome pending</span>
                </div>
                )}
            </div>
        </div>

        {actualOutcome?.reasoning && (
          <div>
            <h4 className="text-sm font-semibold mb-1 text-muted-foreground flex items-center">
                <MessageSquare className="h-4 w-4 mr-2"/>AI Reasoning:
            </h4>
            <p className="text-xs bg-muted/50 p-3 rounded-md italic">{actualOutcome.reasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
