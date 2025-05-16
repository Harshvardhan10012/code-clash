import Link from 'next/link';
import Image from 'next/image';
import { Clock, Tag, Zap, CheckCircle, Award, Eye } from 'lucide-react';
import type { Challenge } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';


interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { id, title, description, language, difficulty, points, deadline, status, imageUrl, aiHint } = challenge;

  const isPastDeadline = new Date(deadline) < new Date();
  const deadlineText = formatDistanceToNow(new Date(deadline), { addSuffix: true });

  const getStatusButton = () => {
    if (status === 'open') {
      return <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
               <Link href={`/challenges/${id}`}>Predict Now</Link>
             </Button>;
    }
    if (status === 'completed') {
      return <Button asChild variant="outline" className="w-full">
               <Link href={`/challenges/${id}`}>View Results</Link>
             </Button>;
    }
    return <Button disabled className="w-full">{status.charAt(0).toUpperCase() + status.slice(1)}</Button>;
  }

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={aiHint || 'coding challenge'}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
        <CardDescription className="mt-1 h-16 overflow-hidden text-ellipsis text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="mr-2 h-4 w-4 text-accent" />
          Language: {language}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Zap className="mr-2 h-4 w-4 text-accent" />
          Difficulty: <Badge variant={
            difficulty === 'Easy' ? 'default' : difficulty === 'Medium' ? 'secondary' : 'destructive'
          } className={cn(
            difficulty === 'Easy' && 'bg-green-500 hover:bg-green-600',
            difficulty === 'Medium' && 'bg-yellow-500 hover:bg-yellow-600',
            difficulty === 'Hard' && 'bg-red-500 hover:bg-red-600',
            'ml-1 text-xs text-white'
          )}>{difficulty}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Award className="mr-2 h-4 w-4 text-accent" />
          Points: {points}
        </div>
        <div className={cn("flex items-center text-sm", isPastDeadline && status === 'open' ? "text-destructive" : "text-muted-foreground")}>
          <Clock className="mr-2 h-4 w-4 text-accent" />
          Deadline: {deadlineText}
        </div>
         {status === 'completed' && (
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="mr-2 h-4 w-4" />
            Status: Completed
          </div>
        )}
      </CardContent>
      <CardFooter>
        {getStatusButton()}
      </CardFooter>
    </Card>
  );
}
