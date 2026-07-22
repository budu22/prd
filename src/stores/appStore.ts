import { create } from 'zustand';
import type { CustomerGroup, Strategy, Event, Channel, Content, Product, Benefit, Activity, AnalyticsData, DashboardStats } from '../types';

interface AppState {
  customerGroups: CustomerGroup[];
  strategies: Strategy[];
  events: Event[];
  channels: Channel[];
  contents: Content[];
  products: Product[];
  benefits: Benefit[];
  activities: Activity[];
  analytics: AnalyticsData[];
  stats: DashboardStats | null;
  loading: boolean;

  setCustomerGroups: (groups: CustomerGroup[]) => void;
  setStrategies: (strategies: Strategy[]) => void;
  setEvents: (events: Event[]) => void;
  setChannels: (channels: Channel[]) => void;
  setContents: (contents: Content[]) => void;
  setProducts: (products: Product[]) => void;
  setBenefits: (benefits: Benefit[]) => void;
  setActivities: (activities: Activity[]) => void;
  setAnalytics: (analytics: AnalyticsData[]) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({
  customerGroups: [],
  strategies: [],
  events: [],
  channels: [],
  contents: [],
  products: [],
  benefits: [],
  activities: [],
  analytics: [],
  stats: null,
  loading: false,

  setCustomerGroups: (groups) => set({ customerGroups: groups }),
  setStrategies: (strategies) => set({ strategies: strategies }),
  setEvents: (events) => set({ events: events }),
  setChannels: (channels) => set({ channels: channels }),
  setContents: (contents) => set({ contents: contents }),
  setProducts: (products) => set({ products: products }),
  setBenefits: (benefits) => set({ benefits: benefits }),
  setActivities: (activities) => set({ activities: activities }),
  setAnalytics: (analytics) => set({ analytics: analytics }),
  setStats: (stats) => set({ stats: stats }),
  setLoading: (loading) => set({ loading: loading }),
}));

export default useAppStore;
