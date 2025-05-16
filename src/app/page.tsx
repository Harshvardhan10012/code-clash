import { ChallengeCard } from '@/components/challenge-card';
import { mockChallenges } from '@/lib/mock-data';
import type { Challenge } from '@/types';

export default function HomePage() {
  const openChallenges = mockChallenges.filter(challenge => challenge.status === 'open');

  return (
    <div className="space-y-8">
      <section>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Active Challenges
        </h1>
        {openChallenges.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openChallenges.map((challenge: Challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No active challenges at the moment. Check back soon!</p>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-primary md:text-3xl">
          Past Challenges
        </h2>
        {mockChallenges.filter(c => c.status === 'completed').length > 0 ? (
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockChallenges.filter(c => c.status === 'completed').map((challenge: Challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
           <p className="text-muted-foreground">No past challenges to display yet.</p>
        )}
      </section>
    </div>
  );
}
