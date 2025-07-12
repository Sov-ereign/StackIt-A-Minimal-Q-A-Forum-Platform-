import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { User } from '../types';
import { votesAPI } from '../services/api';

interface VoteButtonsProps {
  targetId: string;
  targetType: 'question' | 'answer';
  currentVotes: number;
  currentUser: User | null;
  onVoteChange: (newVoteCount: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  targetId,
  targetType,
  currentVotes,
  currentUser,
  onVoteChange,
  size = 'md'
}) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's current vote on mount
  useEffect(() => {
    if (currentUser) {
      loadUserVote();
    }
  }, [currentUser, targetId, targetType]);

  const loadUserVote = async () => {
    if (!currentUser) return;
    
    try {
      const response = await votesAPI.getUserVote(targetId, targetType);
      setUserVote(response.vote);
    } catch (error) {
      console.error('Failed to load user vote:', error);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!currentUser || isLoading) return;

    setIsLoading(true);
    try {
      await votesAPI.vote(targetId, targetType, voteType);
      
      // Update local state based on the vote action
      let newVoteCount = currentVotes;
      let newUserVote: 'up' | 'down' | null = voteType;

      if (userVote === voteType) {
        // Remove vote
        newUserVote = null;
        newVoteCount = voteType === 'up' ? currentVotes - 1 : currentVotes + 1;
      } else if (userVote === null) {
        // Add new vote
        newVoteCount = voteType === 'up' ? currentVotes + 1 : currentVotes - 1;
      } else {
        // Change vote (from up to down or vice versa)
        newVoteCount = voteType === 'up' ? currentVotes + 2 : currentVotes - 2;
      }

      setUserVote(newUserVote);
      onVoteChange(newVoteCount);
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'p-1',
          icon: 'h-4 w-4',
          text: 'text-sm'
        };
      case 'lg':
        return {
          button: 'p-2',
          icon: 'h-6 w-6',
          text: 'text-lg'
        };
      default:
        return {
          button: 'p-2',
          icon: 'h-5 w-5',
          text: 'text-lg'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={() => handleVote('up')}
        disabled={!currentUser || isLoading}
        className={`${sizeClasses.button} hover:bg-gray-100 rounded transition-colors ${
          userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-600'
        } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronUp className={sizeClasses.icon} />
      </button>
      
      <span className={`font-semibold text-gray-900 ${sizeClasses.text}`}>
        {currentVotes}
      </span>
      
      <button
        onClick={() => handleVote('down')}
        disabled={!currentUser || isLoading}
        className={`${sizeClasses.button} hover:bg-gray-100 rounded transition-colors ${
          userVote === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-600'
        } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronDown className={sizeClasses.icon} />
      </button>
    </div>
  );
};

export default VoteButtons; 