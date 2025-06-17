import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configure axios
axios.defaults.baseURL = API_URL;

// Add request interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and if we're not on a public route
      const publicRoutes = ['/', '/login', '/register', '/menu', '/contact', '/testimonials'];
      const currentPath = window.location.pathname;
      
      if (!publicRoutes.includes(currentPath)) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: (email: string, password: string) =>
    axios.post('/users/login', { email, password }),
  register: (userData: any) => axios.post('/users/register', userData),
  getProfile: () => axios.get('/users/profile'),
  updateProfile: (userData: any) => axios.put('/users/profile', userData),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

// Menu service
export const menuService = {
  getMenuItems: () => axios.get('/menu'),
  getMenuItem: (id: number) => axios.get(`/menu/${id}`),
  createMenuItem: (itemData: any) => axios.post('/menu', itemData),
  updateMenuItem: (id: number, itemData: any) =>
    axios.put(`/menu/${id}`, itemData),
  deleteMenuItem: (id: number) => axios.delete(`/menu/${id}`),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post('/menu/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Order service
export const orderService = {
  createOrder: (orderData: any) => axios.post('/orders', orderData),
  getUserOrders: () => axios.get('/orders'),
  getAllOrders: () => axios.get('/orders/all'),
  updateOrderStatus: (id: number, status: string) =>
    axios.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id: number) => axios.patch(`/orders/${id}/cancel`, { status: 'cancelled' }),
  deleteOrder: (id: number) => axios.delete(`/orders/${id}`),
  getDashboardStats: (queryString = '') => axios.get(`/orders/stats?${queryString}`),
};

// Contact service
export const contactService = {
  submitContact: (data: any) => axios.post('/contact', data),
  getContactSubmissions: () => axios.get('/contact'),
  deleteContactSubmission: (id: string) => axios.delete(`/contact/${id}`),
};

// Cart service
export const cartService = {
  getCart: () => axios.get('/cart'),
  addToCart: (menuItemId: number, quantity: number) =>
    axios.post('/cart/add', { menuItemId, quantity }),
  updateCartItem: (itemId: number, quantity: number) =>
    axios.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId: number) => axios.delete(`/cart/items/${itemId}`),
  clearCart: () => axios.delete('/cart/clear'),
};

// Testimonial service
export const testimonialService = {
  getTestimonials: () => axios.get('/testimonials'),
  getTestimonialStats: () => axios.get('/testimonials/stats'),
  getUserTestimonial: () => axios.get('/testimonials/user'),
  createTestimonial: (data: { rating: number; comment: string }) =>
    axios.post('/testimonials', data),
  updateTestimonial: (data: { rating: number; comment: string }) =>
    axios.put('/testimonials', data),
  deleteTestimonial: () => axios.delete('/testimonials'),
}; 