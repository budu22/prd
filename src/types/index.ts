export interface CustomerGroup {
  id: string;
  name: string;
  type: 'static' | 'dynamic';
  description: string;
  tags: string[];
  rule: string;
  memberCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StrategyAction {
  type: 'benefit' | 'activity' | 'message';
  targetId: string;
  channel: 'sms' | 'call' | 'wechat';
  contentId: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  customerGroupId: string;
  customerGroupName: string;
  triggerType: 'event' | 'schedule' | 'api';
  triggerConfig: object;
  actions: StrategyAction[];
  status: 'draft' | 'review' | 'active' | 'paused' | 'ended';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  type: 'behavior' | 'business' | 'delayed';
  description: string;
  payloadSchema: object;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'sms' | 'call' | 'wechat';
  status: 'active' | 'inactive';
  config: object;
  quota: number;
  used: number;
}

export interface Content {
  id: string;
  name: string;
  type: 'material' | 'script';
  category: string;
  content: string;
  variables: string[];
  version: string;
  status: 'draft' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Benefit {
  id: string;
  name: string;
  type: string;
  description: string;
  value: number;
  totalCount: number;
  usedCount: number;
  productId: string;
  productName: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  description: string;
  startTime: string;
  endTime: string;
  productId: string;
  productName: string;
  status: 'draft' | 'active' | 'ended';
  createdAt: string;
}

export interface AnalyticsData {
  strategyId: string;
  strategyName: string;
  reachCount: number;
  clickCount: number;
  conversionCount: number;
  conversionRate: number;
  cost: number;
  roi: number;
  date: string;
}

export interface DashboardStats {
  totalStrategies: number;
  activeStrategies: number;
  totalReach: number;
  totalConversion: number;
  avgConversionRate: number;
  totalCost: number;
  totalRoi: number;
}

export interface TriggerConfig {
  eventId?: string;
  eventName?: string;
  schedule?: string;
}
