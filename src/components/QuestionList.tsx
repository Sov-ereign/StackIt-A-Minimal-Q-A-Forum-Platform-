import React, { useState } from 'react';
import { Plus, Filter, SortDesc } from 'lucide-react';
import { Question, Tag } from '../types';
import QuestionCard from './QuestionCard';

interface QuestionListProps {
  questions: Question[];
  tags: Tag[];
  currentUser: any;
  onQuestionClick: (questionId: string) => void;
  onAskQuestion: () => void;
  onTagFilter: (tagId: string | null) => void;
  selectedTag: string | null;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  tags,
  currentUser,
  onQuestionClick,
  onAskQuestion,
  onTagFilter,
  selectedTag
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'votes' | 'activity'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const sortedQuestions = [...questions].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.votes - a.votes;
      case 'activity':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const filteredQuestions = selectedTag
    ? sortedQuestions.filter(q => q.tags.some(t => t.id === selectedTag))
    : sortedQuestions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedTag ? `Questions tagged "${tags.find(t => t.id === selectedTag)?.name}"` : 'All Questions'}
          </h1>
          <p className="text-gray-600 mt-1">{filteredQuestions.length} questions</p>
        </div>
        
        {currentUser && (
          <button
            onClick={onAskQuestion}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Ask Question</span>
          </button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          
          {selectedTag && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filtered by:</span>
              <span
                className="px-3 py-1 text-sm font-medium rounded-md cursor-pointer"
                style={{ 
                  backgroundColor: `${tags.find(t => t.id === selectedTag)?.color}20`, 
                  color: tags.find(t => t.id === selectedTag)?.color 
                }}
                onClick={() => onTagFilter(null)}
              >
                {tags.find(t => t.id === selectedTag)?.name} ✕
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <SortDesc className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="votes">Most Votes</option>
            <option value="activity">Most Active</option>
          </select>
        </div>
      </div>

      {/* Tag Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTagFilter(null)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                !selectedTag 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagFilter(tag.id)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTag === tag.id
                    ? 'text-white'
                    : 'text-gray-700 hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: selectedTag === tag.id ? tag.color : `${tag.color}20`,
                  color: selectedTag === tag.id ? 'white' : tag.color
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onClick={() => onQuestionClick(question.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions found</p>
            {currentUser && (
              <button
                onClick={onAskQuestion}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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