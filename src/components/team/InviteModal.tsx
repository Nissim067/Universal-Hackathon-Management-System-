import { useState } from 'react';
import { Mail } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { inviteTeamMember } from '../../api/team.api';
import { useUIStore } from '../../store/uiStore';
import { isValidEmail } from '../../utils/validators';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
}

export default function InviteModal({ isOpen, onClose, teamId }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();

  async function handleInvite() {
    if (!isValidEmail(email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await inviteTeamMember(teamId, { email });
      addToast(`Invitation sent to ${email}`, 'success');
      setEmail('');
      onClose();
    } catch {
      addToast('Failed to send invitation', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Enter the email address of the person you'd like to invite to your team.
        </p>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
            className="input-field w-full pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInvite} isLoading={isLoading}>
            Send Invite
          </Button>
        </div>
      </div>
    </Modal>
  );
}
