import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { getTeamById } from '../api/team.api';
import MemberList from '../components/team/MemberList';
import InviteModal from '../components/team/InviteModal';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useState } from 'react';

export default function Team() {
  const { id } = useParams<{ id: string }>();
  const [showInvite, setShowInvite] = useState(false);

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeamById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl mb-2" />)}
      </div>
    );
  }

  if (!team) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-text-muted">Team not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">{team.name}</h1>
          <p className="text-text-muted text-sm mt-1">{team.members.length} members</p>
        </div>
        <Button size="sm" onClick={() => setShowInvite(true)}>
          <UserPlus size={14} /> Invite
        </Button>
      </div>

      <MemberList members={team.members} leaderId={team.leaderId} />
      <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} teamId={team.id} />
    </div>
  );
}
