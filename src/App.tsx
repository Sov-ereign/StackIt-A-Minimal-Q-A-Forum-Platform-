import React, { useState, useEffect } from 'react';
import { User, Question, Answer, Tag, Notification, Comment } from './types';
import { tags, notifications as initialNotifications, comments as initialComments } from './data/mockData';
import { authAPI, questionsAPI, answersAPI, votesAPI } from './services/api';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import LoginModal from './components/LoginModal';

type View = 'list' | 'detail' | 'ask';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // State for data
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [comments, setComments] = useState(initialComments);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loading, setLoading] = useState(true);

  // Load questions on component mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await questionsAPI.getAll();
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Search:', query);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleQuestionClick = async (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentView('detail');
    await loadAnswers(questionId);
  };

  const handleVote = async (targetId: string, targetType: 'question' | 'answer', voteType: 'up' | 'down') => {
    if (!currentUser) return;

    try {
      await votesAPI.vote(targetId, targetType, voteType);
      // Reload questions to get updated vote counts
      await loadQuestions();
      if (selectedQuestionId) {
        await loadAnswers(selectedQuestionId);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!currentUser || !selectedQuestionId) return;

    const question = questions.find(q => q.id === selectedQuestionId);
    if (question?.authorId !== currentUser.id) return;

    setAnswers(prev => 
      prev.map(a => 
        a.questionId === selectedQuestionId
          ? { ...a, isAccepted: a.id === answerId }
          : a
      )
    );

    setQuestions(prev => 
      prev.map(q => 
        q.id === selectedQuestionId
          ? { ...q, acceptedAnswerId: answerId }
          : q
      )
    );
  };

  const loadAnswers = async (questionId: string) => {
    try {
      const answersData = await answersAPI.getByQuestion(questionId);
      setAnswers(answersData);
    } catch (error) {
      console.error('Failed to load answers:', error);
    }
  };

  const handleSubmitAnswer = async (content: string) => {
    if (!currentUser || !selectedQuestionId) return;

    try {
      await answersAPI.create(selectedQuestionId, content);
      await loadAnswers(selectedQuestionId);
      await loadQuestions(); // Update answer count
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleSubmitQuestion = async (title: string, description: string, tagIds: string[]) => {
    if (!currentUser) return;

    try {
      const selectedTags = tags.filter(tag => tagIds.includes(tag.id)).map(tag => tag.name);
      await questionsAPI.create(title, description, selectedTags);
      await loadQuestions();
      setCurrentView('list');
    } catch (error) {
      console.error('Failed to submit question:', error);
    }
  };

  // Comment handlers
  const handleCommentVote = (commentId: string, voteType: 'up' | 'down') => {
    if (!currentUser) return;

    const voteValue = voteType === 'up' ? 1 : -1;
    
    setComments(prev => 
      prev.map(c => 
        c.id === commentId 
          ? { ...c, votes: c.votes + voteValue }
          : c
      )
    );
  };

  const handleEditComment = (commentId: string, newContent: string) => {
    setComments(prev => 
      prev.map(c => 
        c.id === commentId 
          ? { ...c, content: newContent }
          : c
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleSubmitComment = (answerId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      answerId,
      content,
      authorId: currentUser.id,
      author: currentUser,
      createdAt: new Date(),
      votes: 0
    };

    setComments(prev => [...prev, newComment]);

    // Create notification for answer author
    const answer = answers.find(a => a.id === answerId);
    if (answer && answer.authorId !== currentUser.id) {
      const question = questions.find(q => q.id === answer.questionId);
      const newNotification: Notification = {
        id: Date.now().toString(),
        userId: answer.authorId,
        type: 'comment',
        message: `${currentUser.username} commented on your answer about "${question?.title}"`,
        questionId: answer.questionId,
        answerId: answerId,
        commentId: newComment.id,
        createdAt: new Date(),
        read: false
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const selectedQuestion = selectedQuestionId 
    ? questions.find(q => q.id === selectedQuestionId)
    : null;

  const questionAnswers = selectedQuestionId 
    ? answers.filter(a => a.questionId === selectedQuestionId)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        notifications={notifications.filter(n => n.userId === currentUser?.id)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSearch={handleSearch}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {currentView === 'list' && (
        <QuestionList
          questions={questions}
          tags={tags}
          currentUser={currentUser}
          onQuestionClick={handleQuestionClick}
          onAskQuestion={() => setCurrentView('ask')}
          onTagFilter={setSelectedTag}
          selectedTag={selectedTag}
          loading={loading}
        />
      )}

      {currentView === 'detail' && selectedQuestion && (
        <QuestionDetail
          question={selectedQuestion}
          answers={questionAnswers}
          comments={comments}
          currentUser={currentUser}
          onVote={handleVote}
          onAcceptAnswer={handleAcceptAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onCommentVote={handleCommentVote}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onSubmitComment={handleSubmitComment}
          onBack={() => setCurrentView('list')}
        />
      )}

      {currentView === 'ask' && (
        <AskQuestion
          availableTags={tags}
          onSubmit={handleSubmitQuestion}
          onBack={() => setCurrentView('list')}
        />
      )}
    </div>
  );
}

export default App;