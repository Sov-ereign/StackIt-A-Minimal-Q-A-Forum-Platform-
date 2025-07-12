const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Helper function to set auth token in localStorage
const setAuthToken = (token: string) => localStorage.setItem('authToken', token);

// Helper function to remove auth token from localStorage
const removeAuthToken = () => localStorage.removeItem('authToken');

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const response = await apiRequest('/auth/me');
      return response;
    } catch (error) {
      // Token is invalid, remove it
      removeAuthToken();
      return null;
    }
  },
};

// Questions API
export const questionsAPI = {
  getAll: async () => {
    return apiRequest('/questions');
  },

  create: async (title: string, description: string, tags: string[]) => {
    return apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify({ title, description, tags }),
    });
  },
};

// Answers API
export const answersAPI = {
  getByQuestion: async (questionId: string) => {
    return apiRequest(`/answers/${questionId}`);
  },

  create: async (questionId: string, content: string) => {
    return apiRequest(`/answers/${questionId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// Votes API
export const votesAPI = {
  vote: async (targetId: string, targetType: 'question' | 'answer', type: 'up' | 'down') => {
    return apiRequest('/votes', {
      method: 'POST',
      body: JSON.stringify({ targetId, targetType, type }),
    });
  },
  
  getUserVote: async (targetId: string, targetType: 'question' | 'answer') => {
    return apiRequest(`/votes/${targetType}/${targetId}`);
  },
};

// Reports API
export const reportsAPI = {
  report: async (targetId: string, targetType: 'question' | 'answer' | 'comment', reason: string, description?: string) => {
    return apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify({ targetId, targetType, reason, description }),
    });
  },
};

// Comments API
export const commentsAPI = {
  // Get comments for an answer
  getByAnswer: async (answerId: string) => {
    return apiRequest(`/comments/${answerId}`);
  },

  // Create a new comment
  create: async (answerId: string, content: string) => {
    console.log('API: Creating comment:', { answerId, content });
    const result = await apiRequest(`/comments/${answerId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    console.log('API: Comment created:', result);
    return result;
  },

  // Update a comment
  update: async (commentId: string, content: string) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  // Delete a comment
  delete: async (commentId: string) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Notifications API
export const notificationsAPI = {
  // Get user's notifications
  getAll: async () => {
    return apiRequest('/notifications');
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    console.log('API: Marking notification as read:', id);
    const result = await apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
    console.log('API: Notification marked as read:', result);
    return result;
  },
};

// Admin API
export const adminAPI = {
  // Get moderation dashboard stats
  getDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Get pending content for moderation
  getPending: async (type: string = 'all', page: number = 1, limit: number = 20) => {
    return apiRequest(`/admin/pending?type=${type}&page=${page}&limit=${limit}`);
  },

  // Get flagged content
  getFlagged: async (type: string = 'all', page: number = 1, limit: number = 20) => {
    return apiRequest(`/admin/flagged?type=${type}&page=${page}&limit=${limit}`);
  },

  // Moderate content (approve/reject)
  moderate: async (contentType: string, contentId: string, action: 'approve' | 'reject', reason?: string) => {
    return apiRequest(`/admin/moderate/${contentType}/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
  },

  // Flag content
  flag: async (contentType: string, contentId: string, reason: string) => {
    return apiRequest(`/admin/flag/${contentType}/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Get all users
  getUsers: async (page: number = 1, limit: number = 20, search: string = '') => {
    return apiRequest(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
  },

  // Update user role
  updateUserRole: async (userId: string, role: string) => {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
}; 