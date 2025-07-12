import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface CommentVoteButtonsProps {
  commentId: string;
  currentVotes: number;
  currentUser: User | null;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
}

const CommentVoteButtons: React.FC<CommentVoteButtonsProps> = ({
  commentId,
  currentVotes,
  currentUser,
  onVote
}) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [localVotes, setLocalVotes] = useState(currentVotes);

  const handleVote = (voteType: 'up' | 'down') => {
    if (!currentUser) return;

    let newVoteCount = localVotes;
    let newUserVote: 'up' | 'down' | null = voteType;

    if (userVote === voteType) {
      // Remove vote
      newUserVote = null;
      newVoteCount = voteType === 'up' ? localVotes - 1 : localVotes + 1;
    } else if (userVote === null) {
      // Add new vote
      newVoteCount = voteType === 'up' ? localVotes + 1 : localVotes - 1;
    } else {
      // Change vote (from up to down or vice versa)
      newVoteCount = voteType === 'up' ? localVotes + 2 : localVotes - 2;
    }

    setUserVote(newUserVote);
    setLocalVotes(newVoteCount);
    onVote(commentId, voteType);
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={() => handleVote('up')}
        disabled={!currentUser}
        className={`p-1 hover:bg-gray-200 rounded transition-colors ${
          userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-600'
        } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      
      <span className="text-sm font-medium text-gray-900">
        {localVotes}
      </span>
      
      <button
        onClick={() => handleVote('down')}
        disabled={!currentUser}
        className={`p-1 hover:bg-gray-200 rounded transition-colors ${
          userVote === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-600'
        } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CommentVoteButtons; 