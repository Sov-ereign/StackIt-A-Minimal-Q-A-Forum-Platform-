import React, { useState } from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import { Tag as TagType } from '../types';
import RichTextEditor from './RichTextEditor';

interface AskQuestionProps {
  availableTags: TagType[];
  onSubmit: (title: string, description: string, tagIds: string[]) => void;
  onBack: () => void;
}

const AskQuestion: React.FC<AskQuestionProps> = ({ availableTags, onSubmit, onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && selectedTags.length > 0) {
      onSubmit(title, description, selectedTags);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      const isAlreadySelected = prev.includes(tagId);
      const newTags = isAlreadySelected 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      
      // Close dropdown after selecting a tag (but not when removing)
      if (!isAlreadySelected) {
        setShowTagDropdown(false);
      }
      
      return newTags;
    });
  };

  const isFormValid = title.trim() && description.trim() && selectedTags.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to questions</span>
      </button>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ask a Question</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Share your knowledge and help the community by asking a clear, detailed question.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label htmlFor="title" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Question Title
          </label>
          <p className="text-sm text-gray-600 mb-3 sm:mb-4">
            Be specific and imagine you're asking a question to another person.
          </p>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., How to implement authentication in React?"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base sm:text-lg"
            style={{ direction: 'ltr', textAlign: 'left' }}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs sm:text-sm text-gray-500">
              Make your title clear and descriptive
            </span>
            <span className="text-xs sm:text-sm text-gray-400">
              {title.length}/200
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Question Description
          </label>
          <p className="text-sm text-gray-600 mb-3 sm:mb-4">
            Include all the information someone would need to answer your question. Add code examples, error messages, or expected results.
          </p>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Describe your problem in detail..."
          />
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Tags
          </label>
          <p className="text-sm text-gray-600 mb-3 sm:mb-4">
            Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
          </p>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tagId) => {
                const tag = availableTags.find(t => t.id === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium cursor-pointer"
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color 
                    }}
                    onClick={() => toggleTag(tagId)}
                  >
                    {tag.name}
                    <span className="ml-1 sm:ml-2 text-xs">✕</span>
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Tag Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left flex items-center justify-between text-sm sm:text-base"
            >
              <span className="text-gray-500">
                {selectedTags.length === 0 ? 'Select tags...' : `${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected`}
              </span>
              <Tag className="h-4 w-4 text-gray-400" />
            </button>

            {showTagDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      selectedTags.includes(tag.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span
                      className="px-2 py-1 rounded text-xs sm:text-sm font-medium"
                      style={{ 
                        backgroundColor: `${tag.color}20`, 
                        color: tag.color 
                      }}
                    >
                      {tag.name}
                    </span>
                    {selectedTags.includes(tag.id) && (
                      <span className="text-blue-600 text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Select {selectedTags.length}/5 tags. Tags help categorize your question.
          </p>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            Post Question
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="px-6 sm:px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;