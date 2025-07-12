import React, { useState } from 'react';
import { User, Question, Answer, Tag, Notification } from './types';
import { users, questions as initialQuestions, answers as initialAnswers, tags, notifications as initialNotifications } from './data/mockData';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';

type View = 'list' | 'detail' | 'ask';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]); // Simulate logged in user
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // State for data
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState(initialAnswers);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleLogin = () => {
    // Simulate login - in real app this would open a login modal/page
    setCurrentUser(users[0]);
  };

  const handleLogout = () => {
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

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentView('detail');
  };

  const handleVote = (targetId: string, targetType: 'question' | 'answer', voteType: 'up' | 'down') => {
    if (!currentUser) return;

    const voteValue = voteType === 'up' ? 1 : -1;
    
    if (targetType === 'question') {
      setQuestions(prev => 
        prev.map(q => 
          q.id === targetId 
            ? { ...q, votes: q.votes + voteValue }
            : q
        )
      );
    } else {
      setAnswers(prev => 
        prev.map(a => 
          a.id === targetId 
            ? { ...a, votes: a.votes + voteValue }
            : a
        )
      );
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

  const handleSubmitAnswer = (content: string) => {
    if (!currentUser || !selectedQuestionId) return;

    const newAnswer: Answer = {
      id: Date.now().toString(),
      questionId: selectedQuestionId,
      content,
      authorId: currentUser.id,
      author: currentUser,
      createdAt: new Date(),
      votes: 0,
      isAccepted: false
    };

    setAnswers(prev => [...prev, newAnswer]);
    
    // Update question answer count
    setQuestions(prev => 
      prev.map(q => 
        q.id === selectedQuestionId
          ? { ...q, answerCount: q.answerCount + 1 }
          : q
      )
    );

    // Create notification for question author
    const question = questions.find(q => q.id === selectedQuestionId);
    if (question && question.authorId !== currentUser.id) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        userId: question.authorId,
        type: 'answer',
        message: `${currentUser.username} answered your question "${question.title}"`,
        questionId: selectedQuestionId,
        answerId: newAnswer.id,
        createdAt: new Date(),
        read: false
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const handleSubmitQuestion = (title: string, description: string, tagIds: string[]) => {
    if (!currentUser) return;

    const selectedTags = tags.filter(tag => tagIds.includes(tag.id));
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      title,
      description,
      tags: selectedTags,
      authorId: currentUser.id,
      author: currentUser,
      createdAt: new Date(),
      votes: 0,
      answerCount: 0,
      views: 0
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setCurrentView('list');
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

      {currentView === 'list' && (
        <QuestionList
          questions={questions}
          tags={tags}
          currentUser={currentUser}
          onQuestionClick={handleQuestionClick}
          onAskQuestion={() => setCurrentView('ask')}
          onTagFilter={setSelectedTag}
          selectedTag={selectedTag}
        />
      )}

      {currentView === 'detail' && selectedQuestion && (
        <QuestionDetail
          question={selectedQuestion}
          answers={questionAnswers}
          currentUser={currentUser}
          onVote={handleVote}
          onAcceptAnswer={handleAcceptAnswer}
          onSubmitAnswer={handleSubmitAnswer}
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