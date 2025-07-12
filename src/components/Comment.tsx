import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, MessageCircle, Edit, Trash2, Flag } from 'lucide-react';
import { Comment as CommentType, User } from '../types';
import RichTextEditor from './RichTextEditor';

interface CommentProps {
  comment: CommentType;
  currentUser: User | null;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onEdit: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  currentUser,
  onVote,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const canEdit = currentUser?.id === comment.authorId;
  const canDelete = currentUser?.id === comment.authorId;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start space-x-3">
        {/* Voting */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={() => onVote(comment.id, 'up')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            disabled={!currentUser}
          >
            <ChevronUp className="h-4 w-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-900">{comment.votes}</span>
          <button
            onClick={() => onVote(comment.id, 'down')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            disabled={!currentUser}
          >
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <RichTextEditor
                value={editContent}
                onChange={setEditContent}
                placeholder="Edit your comment..."
                className="min-h-[100px]"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none mb-3"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          )}

          {/* Author and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.username}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{comment.author.username}</p>
                <p className="text-xs text-gray-500">
                  {comment.author.reputation} reputation • {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  title="Edit comment"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                  title="Delete comment"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              <button
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Flag comment"
              >
                <Flag className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment; 