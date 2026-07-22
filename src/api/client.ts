import { CustomerGroup, Strategy, Event, Channel, Content, Product, Benefit, Activity, AnalyticsData, DashboardStats } from '../types';

const BASE_URL = '/api';

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    return response.json();
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

export const customerGroupsApi = {
  getAll: () => apiClient.get<CustomerGroup[]>('/customer-groups'),
  getById: (id: string) => apiClient.get<CustomerGroup>(`/customer-groups/${id}`),
  create: (data: unknown) => apiClient.post<CustomerGroup>('/customer-groups', data),
  update: (id: string, data: unknown) => apiClient.put<CustomerGroup>(`/customer-groups/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/customer-groups/${id}`),
};

export const strategiesApi = {
  getAll: () => apiClient.get<Strategy[]>('/strategies'),
  getById: (id: string) => apiClient.get<Strategy>(`/strategies/${id}`),
  create: (data: unknown) => apiClient.post<Strategy>('/strategies', data),
  update: (id: string, data: unknown) => apiClient.put<Strategy>(`/strategies/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/strategies/${id}`),
  publish: (id: string) => apiClient.post<Strategy>(`/strategies/${id}/publish`, {}),
  pause: (id: string) => apiClient.post<Strategy>(`/strategies/${id}/pause`, {}),
};

export const eventsApi = {
  getAll: () => apiClient.get<Event[]>('/events'),
  getById: (id: string) => apiClient.get<Event>(`/events/${id}`),
  create: (data: unknown) => apiClient.post<Event>('/events', data),
  update: (id: string, data: unknown) => apiClient.put<Event>(`/events/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/events/${id}`),
};

export const channelsApi = {
  getAll: () => apiClient.get<Channel[]>('/channels'),
  getById: (id: string) => apiClient.get<Channel>(`/channels/${id}`),
  create: (data: unknown) => apiClient.post<Channel>('/channels', data),
  update: (id: string, data: unknown) => apiClient.put<Channel>(`/channels/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/channels/${id}`),
  toggle: (id: string) => apiClient.post<Channel>(`/channels/${id}/toggle`, {}),
};

export const contentApi = {
  getAll: () => apiClient.get<Content[]>('/content'),
  getById: (id: string) => apiClient.get<Content>(`/content/${id}`),
  create: (data: unknown) => apiClient.post<Content>('/content', data),
  update: (id: string, data: unknown) => apiClient.put<Content>(`/content/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/content/${id}`),
};

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  create: (data: unknown) => apiClient.post<Product>('/products', data),
  update: (id: string, data: unknown) => apiClient.put<Product>(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/products/${id}`),
};

export const benefitsApi = {
  getAll: () => apiClient.get<Benefit[]>('/benefits'),
  getById: (id: string) => apiClient.get<Benefit>(`/benefits/${id}`),
  create: (data: unknown) => apiClient.post<Benefit>('/benefits', data),
  update: (id: string, data: unknown) => apiClient.put<Benefit>(`/benefits/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/benefits/${id}`),
};

export const activitiesApi = {
  getAll: () => apiClient.get<Activity[]>('/activities'),
  getById: (id: string) => apiClient.get<Activity>(`/activities/${id}`),
  create: (data: unknown) => apiClient.post<Activity>('/activities', data),
  update: (id: string, data: unknown) => apiClient.put<Activity>(`/activities/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/activities/${id}`),
};

export const analyticsApi = {
  getStrategy: (id: string) => apiClient.get<AnalyticsData[]>(`/analytics/strategy/${id}`),
  getCompare: () => apiClient.get<AnalyticsData[]>('/analytics/compare'),
  getReport: () => apiClient.get<DashboardStats>('/analytics/report'),
  getStats: () => apiClient.get<DashboardStats>('/analytics/stats'),
  getTrend: () => apiClient.get<AnalyticsData[]>('/analytics/trend'),
};
