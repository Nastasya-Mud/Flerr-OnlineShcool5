import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Request interceptor для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor для обработки ошибок и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если 401 и это не повторный запрос, пытаемся обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Не удалось обновить токен, выходим
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  forgotPassword: (email: string) => api.post('/auth/forgot', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset', { token, password }),
};

// Courses API
export const coursesAPI = {
  getAll: (params?: any) => api.get('/courses', { params }),
  getBySlug: (slug: string) => api.get(`/courses/${slug}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.patch(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  toggleFavorite: (id: string) => api.post(`/courses/${id}/favorite`),
};

// Lessons API
export const lessonsAPI = {
  getByCourse: (courseSlug: string) => api.get(`/lessons/course/${courseSlug}`),
  getById: (id: string) => api.get(`/lessons/${id}`),
  create: (data: any) => api.post('/lessons', data),
  update: (id: string, data: any) => api.patch(`/lessons/${id}`, data),
  delete: (id: string) => api.delete(`/lessons/${id}`),
  saveProgress: (lessonId: string, percent: number) =>
    api.post('/lessons/progress', { lessonId, percent }),
};

// Promo Codes API
export const promoAPI = {
  validate: (code: string) => api.post('/promo/validate', { code }),
  activate: (code: string) => api.post('/promo/activate', { code }),
  getAll: (params?: any) => api.get('/promo', { params }),
  create: (data: any) => api.post('/promo', data),
  update: (id: string, data: any) => api.patch(`/promo/${id}`, data),
  delete: (id: string) => api.delete(`/promo/${id}`),
};

// Search API
export const searchAPI = {
  search: (params: any) => api.get('/search', { params }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: any) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

// Uploads API
export const uploadsAPI = {
  getUploadUrl: (data: any) => api.post('/uploads/s3-sign', data),
};

// Teachers API
export const teachersAPI = {
  getAll: (params?: any) => api.get('/teachers', { params }),
  getById: (id: string) => api.get(`/teachers/${id}`),
  create: (data: any) => api.post('/teachers', data),
  update: (id: string, data: any) => api.patch(`/teachers/${id}`, data),
  delete: (id: string) => api.delete(`/teachers/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: (params?: any) => api.get('/gallery', { params }),
  getById: (id: string) => api.get(`/gallery/${id}`),
  create: (data: any) => api.post('/gallery', data),
  update: (id: string, data: any) => api.patch(`/gallery/${id}`, data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

