import React from 'react';
import { Question, Tag } from '../types';

interface QuestionListProps {
  questions: Question[];
  tags: Tag[];
  currentUser: any;
  onQuestionClick: (questionId: string) => void;
  onAskQuestion: () => void;
  onTagFilter: (tagId: string | null) => void;
  selectedTag: string | null;
  loading?: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  tags,
  currentUser,
  onQuestionClick,
  onAskQuestion,
  onTagFilter,
  selectedTag,
  loading = false
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          All Questions ({questions.length})
        </h1>
        
        {/* Tag Filter - Mobile */}
        <div className="sm:hidden mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTagFilter(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTag === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {tags.slice(0, 5).map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagFilter(tag.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTag === tag.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
            {tags.length > 5 && (
              <span className="px-3 py-1 text-sm text-gray-500">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Ask Question Button */}
      {currentUser && (
        <div className="mb-6">
          <button
            onClick={onAskQuestion}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            Ask Question
          </button>
        </div>
      )}

      {/* Tag Filter - Desktop */}
      <div className="hidden sm:block mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagFilter(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedTag === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagFilter(tag.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTag === tag.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">Loading questions...</p>
          </div>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question.id}
              onClick={() => onQuestionClick(question.id)}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Question Title */}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                {question.title}
              </h3>
              
              {/* Question Description */}
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                {question.description.substring(0, 120)}...
              </p>
              
              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {question.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={typeof tag === 'string' ? index : tag.id}
                      className="px-2 py-1 text-xs rounded-md"
                      style={{ 
                        backgroundColor: typeof tag === 'string' ? '#e5e7eb' : `${tag.color}20`, 
                        color: typeof tag === 'string' ? '#374151' : tag.color
                      }}
                    >
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  ))}
                  {question.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{question.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              {/* Question Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span>By {question.author?.username || 'Unknown'}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{question.answerCount} answers</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{question.votes} votes</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="sm:hidden">{question.votes} votes</span>
                  <span className="text-xs text-gray-400">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg mb-4">No questions found</p>
            {currentUser && (
              <button
                onClick={onAskQuestion}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Ask the first question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;