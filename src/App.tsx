import React, { useState, useEffect } from 'react';
import { User, Question, Answer, Tag, Notification, Comment } from './types';
import { tags, notifications as initialNotifications, comments as initialComments } from './data/mockData';
import { authAPI, questionsAPI, answersAPI, votesAPI, reportsAPI, notificationsAPI } from './services/api';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Load questions and check for existing user session on component mount
  useEffect(() => {
    loadQuestions();
    checkExistingUser();
  }, []);

  // Load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  const checkExistingUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
  };

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

  const loadNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const notificationsData = await notificationsAPI.getAll();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleQuestionClick = async (questionId: string) => {
    if (!questionId) return; // Don't proceed if questionId is invalid
    
    setSelectedQuestionId(questionId);
    setCurrentView('detail');
    await loadAnswers(questionId);
  };

  const handleVoteChange = (targetId: string, targetType: 'question' | 'answer', newVoteCount: number) => {
    if (targetType === 'question') {
      setQuestions(prev => 
        prev.map(q => 
          q.id === targetId ? { ...q, votes: newVoteCount } : q
        )
      );
    } else {
      setAnswers(prev => 
        prev.map(a => 
          a.id === targetId ? { ...a, votes: newVoteCount } : a
        )
      );
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!currentUser || !selectedQuestionId) return;

    try {
      // This would need to be implemented in the backend
      // For now, we'll just update the local state
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
    } catch (error) {
      console.error('Failed to accept answer:', error);
    }
  };

  const loadAnswers = async (questionId: string) => {
    if (!questionId) return; // Don't load if questionId is undefined
    
    try {
      const answersData = await answersAPI.getByQuestion(questionId);
      setAnswers(answersData);
    } catch (error) {
      console.error('Failed to load answers:', error);
      setAnswers([]); // Set empty array on error
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
    
    // For comments, we'll just update the local state since there's no backend vote system yet
    setComments(prev => 
      prev.map(c => 
        c.id === commentId 
          ? { ...c, votes: c.votes + (voteType === 'up' ? 1 : -1) }
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

      {currentView === 'detail' && selectedQuestion && selectedQuestionId && (
        <ErrorBoundary>
                  <QuestionDetail
          question={selectedQuestion}
          answers={questionAnswers}
          comments={comments}
          currentUser={currentUser}
          onVoteChange={handleVoteChange}
          onAcceptAnswer={handleAcceptAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onCommentVote={handleCommentVote}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onSubmitComment={handleSubmitComment}
          onBack={() => setCurrentView('list')}
        />
        </ErrorBoundary>
      )}

      {currentView === 'detail' && !selectedQuestion && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading question...</p>
          </div>
        </div>
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