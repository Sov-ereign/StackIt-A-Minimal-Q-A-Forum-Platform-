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

  getCurrentUser: () => {
    const token = getAuthToken();
    return token ? { token } : null;
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
}; 