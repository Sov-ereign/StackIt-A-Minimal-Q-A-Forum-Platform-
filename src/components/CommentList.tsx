import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Comment as CommentType, User } from '../types';
import Comment from './Comment';
import RichTextEditor from './RichTextEditor';

interface CommentListProps {
  comments: CommentType[];
  answerId: string;
  currentUser: User | null;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onEdit: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
  onSubmit: (content: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  answerId,
  currentUser,
  onVote,
  onEdit,
  onDelete,
  onSubmit
}) => {
  const [showComments, setShowComments] = useState(comments.length > 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const handleSubmitComment = () => {
    if (commentContent.trim()) {
      onSubmit(commentContent);
      setCommentContent('');
      setShowCommentForm(false);
    }
  };

  const sortedComments = [...comments].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="mt-4">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {comments.length} Comment{comments.length !== 1 ? 's' : ''}
            </span>
          </button>
        </div>
        
        {currentUser && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Add Comment</span>
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && currentUser && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Add a Comment</h4>
          <RichTextEditor
            value={commentContent}
            onChange={setCommentContent}
            placeholder="Share your thoughts..."
            className="mb-3"
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSubmitComment}
              disabled={!commentContent.trim()}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Post Comment
            </button>
            <button
              onClick={() => {
                setShowCommentForm(false);
                setCommentContent('');
              }}
              className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="space-y-3">
          {sortedComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList; 