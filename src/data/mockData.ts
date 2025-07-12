import { User, Question, Answer, Tag, Notification, Comment } from '../types';

export const tags: Tag[] = [
  { id: '1', name: 'React', color: '#61DAFB' },
  { id: '2', name: 'JavaScript', color: '#F7DF1E' },
  { id: '3', name: 'TypeScript', color: '#3178C6' },
  { id: '4', name: 'Node.js', color: '#339933' },
  { id: '5', name: 'CSS', color: '#1572B6' },
  { id: '6', name: 'HTML', color: '#E34F26' },
  { id: '7', name: 'Python', color: '#3776AB' },
  { id: '8', name: 'JWT', color: '#000000' },
];

export const users: User[] = [
  {
    id: '1',
    username: 'alice_dev',
    email: 'alice@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    reputation: 1250
  },
  {
    id: '2',
    username: 'bob_react',
    email: 'bob@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    reputation: 890
  },
  {
    id: '3',
    username: 'charlie_admin',
    email: 'charlie@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    reputation: 2100
  }
];

export const questions: Question[] = [
  {
    id: '1',
    title: 'How to implement JWT authentication in React?',
    description: `<p>I'm building a React application and need to implement <strong>JWT authentication</strong>. What's the best approach for:</p>
    <ul>
      <li>Storing tokens securely</li>
      <li>Handling token refresh</li>
      <li>Protecting routes</li>
    </ul>
    <p>Any help would be appreciated! 😊</p>`,
    tags: [tags[0], tags[1], tags[7]],
    authorId: '1',
    author: users[0],
    createdAt: new Date('2024-01-15T10:30:00Z'),
    votes: 15,
    answerCount: 3,
    acceptedAnswerId: '1',
    views: 342
  },
  {
    id: '2',
    title: 'TypeScript generic constraints explained',
    description: `<p>Can someone explain <em>generic constraints</em> in TypeScript with practical examples?</p>
    <p>I understand basic generics but constraints are confusing me.</p>`,
    tags: [tags[2], tags[1]],
    authorId: '2',
    author: users[1],
    createdAt: new Date('2024-01-14T15:45:00Z'),
    votes: 8,
    answerCount: 2,
    views: 156
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox: When to use which?',
    description: `<p>I'm always confused about when to use <strong>CSS Grid</strong> vs <strong>Flexbox</strong>.</p>
    <ol>
      <li>What are the main differences?</li>
      <li>When should I choose one over the other?</li>
      <li>Can they be used together?</li>
    </ol>`,
    tags: [tags[4], tags[5]],
    authorId: '1',
    author: users[0],
    createdAt: new Date('2024-01-13T09:20:00Z'),
    votes: 23,
    answerCount: 5,
    acceptedAnswerId: '3',
    views: 789
  }
];

export const answers: Answer[] = [
  {
    id: '1',
    questionId: '1',
    content: `<p>For JWT authentication in React, here's a comprehensive approach:</p>
    <h3>1. Token Storage</h3>
    <p>Store tokens in <strong>httpOnly cookies</strong> for maximum security:</p>
    <pre><code>// Set cookie on login
    document.cookie = "token=your-jwt-token; httpOnly; secure; sameSite=strict";</code></pre>
    
    <h3>2. Token Refresh</h3>
    <p>Implement automatic refresh using interceptors:</p>
    <ul>
      <li>Use axios interceptors</li>
      <li>Check token expiry</li>
      <li>Refresh automatically</li>
    </ul>
    
    <p>This approach provides excellent security and user experience! 🚀</p>`,
    authorId: '3',
    author: users[2],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    votes: 12,
    isAccepted: true
  },
  {
    id: '2',
    questionId: '1',
    content: `<p>Another approach is using <strong>React Context</strong> with localStorage:</p>
    <p>While not as secure as httpOnly cookies, it's simpler to implement for beginners.</p>`,
    authorId: '2',
    author: users[1],
    createdAt: new Date('2024-01-15T14:30:00Z'),
    votes: 5,
    isAccepted: false
  },
  {
    id: '3',
    questionId: '3',
    content: `<p>Great question! Here's when to use each:</p>
    
    <h3>Use Flexbox when:</h3>
    <ul>
      <li>Working with <em>one-dimensional</em> layouts (row or column)</li>
      <li>Centering content</li>
      <li>Distributing space between items</li>
    </ul>
    
    <h3>Use CSS Grid when:</h3>
    <ul>
      <li>Creating <em>two-dimensional</em> layouts</li>
      <li>Complex page layouts</li>
      <li>Need precise control over rows and columns</li>
    </ul>
    
    <p><strong>Pro tip:</strong> You can absolutely use them together! Grid for the overall layout, Flexbox for component internals. 💡</p>`,
    authorId: '3',
    author: users[2],
    createdAt: new Date('2024-01-13T16:45:00Z'),
    votes: 18,
    isAccepted: true
  }
];

export const comments: Comment[] = [
  {
    id: '1',
    answerId: '1',
    content: 'Great answer! I would also recommend using a library like `react-query` for better token management.',
    authorId: '2',
    author: users[1],
    createdAt: new Date('2024-01-15T11:30:00Z'),
    votes: 3
  },
  {
    id: '2',
    answerId: '1',
    content: 'Thanks for the detailed explanation. The httpOnly cookie approach is definitely more secure.',
    authorId: '1',
    author: users[0],
    createdAt: new Date('2024-01-15T12:00:00Z'),
    votes: 1
  },
  {
    id: '3',
    answerId: '3',
    content: 'This is exactly what I needed! The one-dimensional vs two-dimensional explanation really helped clarify things.',
    authorId: '2',
    author: users[1],
    createdAt: new Date('2024-01-13T17:00:00Z'),
    votes: 2
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'answer',
    message: 'charlie_admin answered your question about JWT authentication',
    questionId: '1',
    answerId: '1',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    read: false
  },
  {
    id: '2',
    userId: '1',
    type: 'answer',
    message: 'bob_react answered your question about CSS Grid vs Flexbox',
    questionId: '3',
    answerId: '3',
    createdAt: new Date('2024-01-13T16:45:00Z'),
    read: true
  },
  {
    id: '3',
    userId: '3',
    type: 'comment',
    message: 'bob_react commented on your answer about JWT authentication',
    questionId: '1',
    answerId: '1',
    commentId: '1',
    createdAt: new Date('2024-01-15T11:30:00Z'),
    read: false
  },
  {
    id: '4',
    userId: '3',
    type: 'comment',
    message: 'alice_dev commented on your answer about JWT authentication',
    questionId: '1',
    answerId: '1',
    commentId: '2',
    createdAt: new Date('2024-01-15T12:00:00Z'),
    read: true
  }
];