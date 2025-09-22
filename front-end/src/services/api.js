const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/v1` : "https://todos-mern-wb64.onrender.com/api/v1"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/current-user');
  }

  async updateProfile(data) {
    return this.request('/users/update-account', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateAvatar(avatarFile) {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return this.request('/users/avatar', {
      method: 'PATCH',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Todo endpoints
  async getTodos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/todos/user/todos${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createTodo(todoData) {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(todoId, todoData) {
    return this.request(`/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify(todoData),
    });
  }

  async deleteTodo(todoId) {
    return this.request(`/todos/${todoId}`, {
      method: 'DELETE',
    });
  }

  async toggleTodoCompletion(todoId) {
    return this.request(`/todos/${todoId}/toggle-completion`, {
      method: 'PATCH',
    });
  }

  async toggleTodoArchive(todoId) {
    return this.request(`/todos/${todoId}/toggle-archive`, {
      method: 'PATCH',
    });
  }

  async getTodoStats() {
    return this.request('/todos/stats');
  }

  async getLabels() {
    return this.request('/todos/user/labels');
  }

  async getTodosByLabel(label) {
    return this.request(`/todos/label/${encodeURIComponent(label)}`);
  }

  async updateLabel(oldLabel, newLabel) {
    return this.request(`/todos/label/${encodeURIComponent(oldLabel)}`, {
      method: 'PATCH',
      body: JSON.stringify({ newLabel }),
    });
  }

  async deleteLabel(label) {
    return this.request(`/todos/label/${encodeURIComponent(label)}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateTodos(todoIds, operation) {
    return this.request('/todos/bulk', {
      method: 'PATCH',
      body: JSON.stringify({ todoIds, operation }),
    });
  }
}

export const apiService = new ApiService();
