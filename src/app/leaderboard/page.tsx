import Image from 'next/image';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort((a, b) => b.score - a.score);

  const getRankIndicator = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-400" />;
    return <span className="text-sm text-muted-foreground">{rank}</span>;
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
        Leaderboard
      </h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Top Coders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user: User, index: number) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="text-center font-medium">
                    <div className="flex items-center justify-center">
                      {getRankIndicator(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.aiHintAvatar || 'profile avatar'}/>
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {user.score}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
