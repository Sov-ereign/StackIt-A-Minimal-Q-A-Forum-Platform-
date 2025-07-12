import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Check, ArrowLeft, Flag } from 'lucide-react';
import { Question, Answer, User, Comment } from '../types';
import RichTextEditor from './RichTextEditor';
import CommentList from './CommentList';
import VoteButtons from './VoteButtons';
import ReportModal from './ReportModal';

interface QuestionDetailProps {
  question: Question;
  answers: Answer[];
  comments: Comment[];
  currentUser: User | null;
  onVoteChange: (targetId: string, targetType: 'question' | 'answer', newVoteCount: number) => void;
  onAcceptAnswer: (answerId: string) => void;
  onSubmitAnswer: (content: string) => void;
  onCommentVote: (commentId: string, voteType: 'up' | 'down') => void;
  onEditComment: (commentId: string, newContent: string) => void;
  onDeleteComment: (commentId: string) => void;
  onSubmitComment: (answerId: string, content: string) => void;
  onBack: () => void;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  answers,
  comments,
  currentUser,
  onVoteChange,
  onAcceptAnswer,
  onSubmitAnswer,
  onCommentVote,
  onEditComment,
  onDeleteComment,
  onSubmitComment,
  onBack
}) => {
  const [answerContent, setAnswerContent] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    id: string;
    type: 'question' | 'answer' | 'comment';
    title?: string;
  } | null>(null);

  const handleSubmitAnswer = () => {
    if (answerContent.trim()) {
      onSubmitAnswer(answerContent);
      setAnswerContent('');
      setShowAnswerForm(false);
    }
  };

  const handleReport = (targetId: string, targetType: 'question' | 'answer' | 'comment', title?: string) => {
    if (!currentUser) return;
    setReportTarget({ id: targetId, type: targetType, title });
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportTarget(null);
  };

  const sortedAnswers = [...answers].sort((a, b) => {
    // Accepted answer first, then by votes
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to questions</span>
      </button>

      {/* Question */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Voting */}
          <VoteButtons
            targetId={question.id}
            targetType="question"
            currentVotes={question.votes}
            currentUser={currentUser}
            onVoteChange={(newVoteCount) => onVoteChange(question.id, 'question', newVoteCount)}
            size="lg"
          />

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
            
            <div 
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags && question.tags.length > 0 ? (
                question.tags.map((tag) => (
                  <span
                    key={typeof tag === 'string' ? tag : tag.id}
                    className="px-3 py-1 text-sm font-medium rounded-md"
                    style={{ 
                      backgroundColor: typeof tag === 'string' ? '#e5e7eb' : `${tag.color}20`, 
                      color: typeof tag === 'string' ? '#374151' : tag.color
                    }}
                  >
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No tags</span>
              )}
            </div>

            {/* Author and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                {question.author && question.author.avatar ? (
                  <img
                    src={question.author.avatar}
                    alt={question.author.username || 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{question.author?.username || 'Unknown User'}</p>
                  <p className="text-sm text-gray-500">
                    {question.author?.reputation || 0} reputation • {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleReport(question.id, 'question', question.title)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                title="Report this question"
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-6 mb-8">
        {sortedAnswers.map((answer) => (
          <div key={answer.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-6">
              {/* Voting and Accept */}
              <div className="flex flex-col items-center space-y-2">
                <VoteButtons
                  targetId={answer.id}
                  targetType="answer"
                  currentVotes={answer.votes}
                  currentUser={currentUser}
                  onVoteChange={(newVoteCount) => onVoteChange(answer.id, 'answer', newVoteCount)}
                  size="md"
                />
                
                {currentUser?.id === question.authorId && !question.acceptedAnswerId && (
                  <button
                    onClick={() => onAcceptAnswer(answer.id)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors mt-2"
                    title="Accept this answer"
                  >
                    <Check className="h-5 w-5 text-gray-400 hover:text-green-600" />
                  </button>
                )}
                
                {answer.isAccepted && (
                  <div className="p-2 bg-green-100 rounded-lg mt-2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                {answer.isAccepted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                    <span className="text-green-700 text-sm font-medium">✓ Accepted Answer</span>
                  </div>
                )}
                
                <div 
                  className="prose max-w-none mb-4"
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                />

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    {answer.author && answer.author.avatar ? (
                      <img
                        src={answer.author.avatar}
                        alt={answer.author.username || 'User'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{answer.author?.username || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">
                        {answer.author?.reputation || 0} reputation • {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleReport(answer.id, 'answer', answer.content.substring(0, 50) + '...')}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                    title="Report this answer"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                </div>

                {/* Comments */}
                <CommentList
                  comments={comments.filter(c => c.answerId === answer.id)}
                  answerId={answer.id}
                  currentUser={currentUser}
                  onVote={onCommentVote}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                  onSubmit={(content) => onSubmitComment(answer.id, content)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      {currentUser ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          
          {!showAnswerForm ? (
            <button
              onClick={() => setShowAnswerForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
            >
              <MessageCircle className="h-6 w-6 mx-auto mb-2" />
              <span>Write an answer...</span>
            </button>
          ) : (
            <div>
              <RichTextEditor
                value={answerContent}
                onChange={setAnswerContent}
                placeholder="Share your knowledge..."
                className="mb-4"
              />
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answerContent.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Post Answer
                </button>
                <button
                  onClick={() => {
                    setShowAnswerForm(false);
                    setAnswerContent('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600 mb-4">You must be logged in to answer this question.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportTarget && (
        <ReportModal
          isOpen={showReportModal}
          onClose={handleCloseReportModal}
          targetId={reportTarget.id}
          targetType={reportTarget.type}
          targetTitle={reportTarget.title}
        />
      )}
    </div>
  );
};

export default QuestionDetail;