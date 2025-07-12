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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        All Questions ({questions.length})
      </h1>
      
      {currentUser && (
        <button
          onClick={onAskQuestion}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-6"
        >
          Ask Question
        </button>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading questions...</p>
          </div>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question.id}
              onClick={() => onQuestionClick(question.id)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {question.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {question.description.substring(0, 150)}...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {question.author?.username || 'Unknown'}</span>
                <span>{question.answerCount} answers</span>
              </div>
            </div>
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