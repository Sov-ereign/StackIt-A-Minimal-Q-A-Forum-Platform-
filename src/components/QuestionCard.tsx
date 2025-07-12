import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ChevronUp, Eye, CheckCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer hover:border-gray-300"
    >
      <div className="flex items-start justify-between space-x-4">
        {/* Stats */}
        <div className="flex flex-col items-center space-y-2 text-gray-500 min-w-[80px]">
          <div className="flex items-center space-x-1">
            <ChevronUp className="h-4 w-4" />
            <span className="text-sm font-medium">{question.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{question.answerCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span className="text-sm">{question.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {question.title}
            </h3>
            {question.acceptedAnswerId && (
              <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs font-medium rounded-md"
                style={{ 
                  backgroundColor: `${tag.color}20`, 
                  color: tag.color 
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Author and Date */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {question.author.avatar ? (
                <img
                  src={question.author.avatar}
                  alt={question.author.username}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              )}
              <span className="text-sm text-gray-600">{question.author.username}</span>
              <span className="text-xs text-gray-400">
                {question.author.reputation} rep
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;