export interface User {
  id: string;
  username: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  avatar?: string;
  reputation: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  authorId: string;
  author: User;
  createdAt: Date;
  votes: number;
  answerCount: number;
  acceptedAnswerId?: string;
  views: number;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  votes: number;
  isAccepted: boolean;
}

export interface Comment {
  id: string;
  answerId: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  votes: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'answer' | 'comment' | 'mention';
  message: string;
  questionId?: string;
  answerId?: string;
  commentId?: string;
  createdAt: Date;
  read: boolean;
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'question' | 'answer';
  type: 'up' | 'down';
}