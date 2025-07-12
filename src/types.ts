export interface User {
  id: string;
  username: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  avatar?: string;
  reputation: number;
  status: 'active' | 'suspended' | 'banned';
  suspendedUntil?: Date;
  suspensionReason?: string;
  isQuestionOwner: boolean;
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
  isApproved: boolean;
  isRemoved: boolean;
  removedBy?: string;
  removedAt?: Date;
  removalReason?: string;
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
  isApproved: boolean;
  isRemoved: boolean;
  removedBy?: string;
  removedAt?: Date;
  removalReason?: string;
}

export interface Comment {
  id: string;
  answerId: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  votes: number;
  isApproved: boolean;
  isRemoved: boolean;
  removedBy?: string;
  removedAt?: Date;
  removalReason?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  targetType: 'question' | 'answer' | 'comment';
  targetId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  adminAction?: 'approved' | 'rejected' | 'removed' | 'user_suspended';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedByUser?: User;
  reviewedAt?: Date;
  createdAt: Date;
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

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  pendingAnswers: number;
  pendingComments: number;
  pendingReports: number;
  totalQuestions: number;
  totalAnswers: number;
  totalComments: number;
}