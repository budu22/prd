import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, Bot, User, Users, Zap, BarChart3, Check, ChevronRight, AlertCircle, Target, TrendingUp, Filter, PieChart, GitBranch } from 'lucide-react';

type AICapability = 'segment' | 'strategy' | 'analysis' | null;

type AnalysisScope = 'single' | 'overall' | null;

type AnalysisDimension = 'target' | 'process' | 'conversion' | 'task' | 'channel' | 'ab' | null;

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  capability?: AICapability;
  actions?: MessageAction[];
  analysisScope?: AnalysisScope;
  analysisDimension?: AnalysisDimension;
  analysisStep?: 'clarify' | 'processing' | 'result';
}

interface MessageAction {
  label: string;
  type: 'navigate' | 'confirm' | 'select';
  payload?: string;
}

// 意图匹配关键词表
const INTENT_KEYWORDS: Record<string, string[]> = {
  segment: [
    '圈客', '圈人', '客群', '人群', '分群', '标签', '筛选客户', '目标客户',
    '找客户', '选客', '定向', '受众', '潜客', '新客', '老客', '沉睡客户',
    '高净值', 'VIP', '活跃用户', '客户分群', '客户画像', '客户筛选',
    '创建客群', '组合规则', '动态客群', '静态客群',
  ],
  strategy: [
    '策略', '编排', '画布', '触达', '营销方案', '活动策略', '运营策略',
    '创建策略', '触发', '权益', '发放', '推送', '触达通道', '短信发送',
    '外呼', '企微推送', '定时营销', '事件触发', '策略画布', 'AI编排',
    '营销流程', '自动化', '话术', '素材', '活动关联', '渠道选择',
    '帮我创建', '我要做', '想发起', '推荐方案',
  ],
  analysis: [
    '分析', '效果', '数据', '转化率', 'ROI', '点击率', '触达率',
    'A/B', 'AB测试', '对比', '报告', '看数据', '目标达成', '过程分析',
    '转化分析', '任务分析', '渠道效果', '整体效果', '策略效果',
    '复盘', '洞察', '指标', 'KPI', '达成率', '漏斗', '归因',
    '深入分析', '单策略', '多策略', '看板', '全面分析',
  ],
};

// 分析维度关键词
const DIMENSION_KEYWORDS: Record<string, string[]> = {
  target: ['目标', '达成', 'kpi', '指标完成', '目标完成'],
  process: ['过程', '执行过程', '触达过程', '漏斗过程'],
  conversion: ['转化', '转化率', '转化漏斗', '漏斗', '点击转化'],
  task: ['任务', '任务完成', '触达任务', '执行任务'],
  channel: ['渠道', '通道', '短信效果', '外呼效果', '企微效果'],
  ab: ['ab', 'a/b', '测试', '实验', '对比测试'],
};

function matchIntent(input: string): AICapability {
  const lower = input.toLowerCase();
  let maxScore = 0;
  let matched: AICapability = null;

  for (const [capability, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      matched = capability as AICapability;
    }
  }
  return matched;
}

function matchDimension(input: string): AnalysisDimension | null {
  const lower = input.toLowerCase();
  for (const [dim, keywords] of Object.entries(DIMENSION_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return dim as AnalysisDimension;
      }
    }
  }
  return null;
}

function matchScope(input: string): AnalysisScope | null {
  const lower = input.toLowerCase();
  // 单策略关键词
  const singleKeywords = ['这条', '单个', '单条', '指定', '具体', '某个', '新客', '沉睡', '高净值', '理财', '礼包', '唤醒'];
  for (const kw of singleKeywords) {
    if (lower.includes(kw)) return 'single';
  }
  // 整体关键词
  const overallKeywords = ['整体', '全部', '总览', '所有', '综合', '整体效果', '全量'];
  for (const kw of overallKeywords) {
    if (lower.includes(kw)) return 'overall';
  }
  return null;
}

// ========== AI圈客模块 ==========
function generateSegmentResponse(input: string): { content: string; actions?: MessageAction[] } {
  const lower = input.toLowerCase();

  if (lower.includes('高净值') || lower.includes('vip') || lower.includes('资产')) {
    return {
      content: '🎯 **AI圈客 · 高净值客户识别**\n\n我为您解析出以下圈客规则：\n\n📋 **推荐标签组合**\n├ 资产等级 = VIP/SVIP\n├ 且 近30天登录次数 ≥ 1\n└ 且 持有产品数 ≥ 2\n\n📊 **预估人群**：约 2,568 人\n🔄 建议设为 **动态客群**，每日自动更新\n\n请确认是否按此规则创建客群？',
      actions: [
        { label: '✅ 确认创建', type: 'confirm', payload: 'segment-vip' },
        { label: '✏️ 调整规则', type: 'select', payload: 'segment-adjust' },
        { label: '📍 前往客群中心', type: 'navigate', payload: '/customer-groups/create' },
      ],
    };
  }

  if (lower.includes('沉睡') || lower.includes('流失') || lower.includes('不活跃')) {
    return {
      content: '🎯 **AI圈客 · 沉睡客户识别**\n\n我为您解析出以下圈客规则：\n\n📋 **推荐标签组合**\n├ 近90天交易次数 = 0\n├ 且 近180天登录次数 ≤ 1\n└ 且 账户状态 = 正常\n\n📊 **预估人群**：约 5,623 人\n⚠️ 沉睡客户唤醒建议结合多渠道策略\n\n请确认是否按此规则创建客群？',
      actions: [
        { label: '✅ 确认创建', type: 'confirm', payload: 'segment-sleep' },
        { label: '✏️ 调整规则', type: 'select', payload: 'segment-adjust' },
        { label: '📍 前往客群中心', type: 'navigate', payload: '/customer-groups/create' },
      ],
    };
  }

  if (lower.includes('新客') || lower.includes('新户') || lower.includes('开户')) {
    return {
      content: '🎯 **AI圈客 · 新开户客户识别**\n\n我为您解析出以下圈客规则：\n\n📋 **推荐标签组合**\n├ 开户日期 ≥ 近30天\n├ 且 账户状态 = 正常\n└ 且 首次入金金额 > 0\n\n📊 **预估人群**：约 1,892 人\n💡 新客建议30天内完成首触，转化率提升40%\n\n请确认是否按此规则创建客群？',
      actions: [
        { label: '✅ 确认创建', type: 'confirm', payload: 'segment-new' },
        { label: '✏️ 调整规则', type: 'select', payload: 'segment-adjust' },
        { label: '📍 前往客群中心', type: 'navigate', payload: '/customer-groups/create' },
      ],
    };
  }

  return {
    content: '🎯 **AI圈客助手**\n\n请告诉我您想圈选哪类客户？\n\n**1. 按客户特征**\n　如"高净值客户"、"沉睡客户"\n\n**2. 按标签组合**\n　如"资产>50万且近30天有交易"\n\n**3. 按行为事件**\n　如"近7天浏览过理财页面"',
    actions: [
      { label: '👥 高净值客户', type: 'select', payload: 'segment-vip-desc' },
      { label: '😴 沉睡客户', type: 'select', payload: 'segment-sleep-desc' },
      { label: '🆕 新开户客户', type: 'select', payload: 'segment-new-desc' },
    ],
  };
}

// ========== AI策略模块 ==========
function generateStrategyResponse(input: string): { content: string; actions?: MessageAction[] } {
  const lower = input.toLowerCase();

  if (lower.includes('沉睡') || lower.includes('唤醒') || lower.includes('激活')) {
    return {
      content: '⚡ **AI策略编排 · 沉睡客户唤醒**\n\n📋 **策略画布**\n\n**① 选择客户** → 沉睡客户客群（5,623人）\n**② 触发时机** → 定时触发：每月1日9:00\n**③ 权益/活动** → 发放唤醒礼包 + 关联限时活动\n**④ 触达通道** → 外呼（优先）→ 短信（补充）\n\n💡 **AI建议**：外呼转化率更高(18%)',
      actions: [
        { label: '✅ 确认编排', type: 'navigate', payload: '/strategy/create' },
        { label: '✏️ 调整配置', type: 'select', payload: 'strategy-adjust' },
      ],
    };
  }

  if (lower.includes('新客') || lower.includes('新户') || lower.includes('开户')) {
    return {
      content: '⚡ **AI策略编排 · 新客欢迎与转化**\n\n📋 **策略画布**\n\n**① 选择客户** → 新开户客户客群（1,892人）\n**② 触发时机** → 事件触发：开户成功\n**③ 权益/活动** → 发放开户礼包 + 关联新客专享活动\n**④ 触达通道** → 短信（即时）→ 企微（24h后跟进）\n\n💡 **AI建议**：转化率可达12%+',
      actions: [
        { label: '✅ 确认编排', type: 'navigate', payload: '/strategy/create' },
        { label: '✏️ 调整配置', type: 'select', payload: 'strategy-adjust' },
      ],
    };
  }

  if (lower.includes('理财') || lower.includes('产品推荐') || lower.includes('推荐')) {
    return {
      content: '⚡ **AI策略编排 · 理财产品推荐**\n\n📋 **策略画布**\n\n**① 选择客户** → 高净值客户客群（2,568人）\n**② 触发时机** → 事件触发：资产变动\n**③ 权益/活动** → 发放专属利率优惠 + 关联理财活动\n**④ 触达通道** → 企微（图文推荐）→ 短信（关键信息）',
      actions: [
        { label: '✅ 确认编排', type: 'navigate', payload: '/strategy/create' },
        { label: '✏️ 调整配置', type: 'select', payload: 'strategy-adjust' },
      ],
    };
  }

  return {
    content: '⚡ **AI策略助手**\n\n请用自然语言描述您的营销需求：\n\n• "帮沉睡客户做唤醒策略"\n• "新开户客户发礼包"\n• "给高净值客户推荐理财产品"',
    actions: [
      { label: '😴 沉睡唤醒策略', type: 'select', payload: 'strategy-sleep-desc' },
      { label: '🆕 新客转化策略', type: 'select', payload: 'strategy-new-desc' },
      { label: '💰 理财推荐策略', type: 'select', payload: 'strategy-finance-desc' },
    ],
  };
}

// ========== AI分析模块 - 意图澄清环节 ==========
function generateAnalysisClarifyResponse(input: string): { content: string; actions?: MessageAction[]; scope?: AnalysisScope } {
  const scope = matchScope(input);
  
  // 如果用户已明确单策略或整体，直接返回
  if (scope === 'overall') {
    return {
      content: '📊 **AI分析 · 整体效果分析准备中...**\n\n正在为您分析所有策略的整体效果，请稍候。',
      actions: [
        { label: '▶️ 开始分析', type: 'select', payload: 'analysis-overall-start' },
      ],
      scope: 'overall',
    };
  }

  if (scope === 'single') {
    // 检查是否包含具体策略名称
    const lower = input.toLowerCase();
    if (lower.includes('新客') || lower.includes('礼包') || lower.includes('开户')) {
      return {
        content: '📊 **AI分析 · 新客礼包策略分析准备中...**\n\n即将分析「新开户礼包发放」策略，请稍候。',
        actions: [
          { label: '▶️ 开始分析', type: 'select', payload: 'analysis-single-st002-start' },
        ],
        scope: 'single',
      };
    }
    if (lower.includes('沉睡') || lower.includes('唤醒')) {
      return {
        content: '📊 **AI分析 · 沉睡唤醒策略分析准备中...**\n\n即将分析「沉睡客户唤醒计划」策略，请稍候。',
        actions: [
          { label: '▶️ 开始分析', type: 'select', payload: 'analysis-single-st003-start' },
        ],
        scope: 'single',
      };
    }
    if (lower.includes('高净值') || lower.includes('理财')) {
      return {
        content: '📊 **AI分析 · 高净值理财策略分析准备中...**\n\n即将分析「高净值客户专属理财推荐」策略，请稍候。',
        actions: [
          { label: '▶️ 开始分析', type: 'select', payload: 'analysis-single-st001-start' },
        ],
        scope: 'single',
      };
    }
    
    // 包含单策略意图但未指定具体策略
    return {
      content: '📊 **AI分析 · 意图澄清**\n\n检测到您想分析**单条策略**，请选择具体策略：\n\n📝 **当前活跃策略列表**\n\n1. 高净值客户专属理财推荐\n　状态：运行中 | 触达：2,568人\n\n2. 新开户礼包发放 ⭐\n　状态：运行中 | 触达：1,892人 | 转化率：12.4%\n\n3. 沉睡客户唤醒计划 ⚠️\n　状态：已暂停 | 触达：5,623人 | 转化率：1.6%',
      actions: [
        { label: '📊 高净值理财策略', type: 'select', payload: 'analysis-single-st001-start' },
        { label: '📊 新客礼包策略', type: 'select', payload: 'analysis-single-st002-start' },
        { label: '📊 沉睡唤醒策略', type: 'select', payload: 'analysis-single-st003-start' },
      ],
      scope: 'single',
    };
  }

  // 未明确范围，需要澄清
  return {
    content: '📊 **AI分析 · 意图澄清**\n\n请先确认分析范围：\n\n**🔵 单条策略分析**\n深入分析指定策略的各维度表现，包含：\n　• 目标达成度\n　• 执行过程追踪\n　• 转化漏斗分析\n　• 任务完成情况\n　• 渠道效果对比\n　• A/B测试结果\n\n**🟣 整体效果分析**\n全量策略综合分析，包含：\n　• 核心指标总览\n　• 策略效果排名\n　• AI洞察与建议\n\n请选择分析范围：',
    actions: [
      { label: '📊 单条策略分析', type: 'select', payload: 'analysis-single-select' },
      { label: '📈 整体效果分析', type: 'select', payload: 'analysis-overall-start' },
    ],
  };
}

// ========== AI分析模块 - 分析过程展示 ==========
function generateAnalysisProcessingResponse(scope: AnalysisScope, strategyId?: string): { content: string; actions?: MessageAction[]; step: 'processing' } {
  if (scope === 'overall') {
    return {
      content: '📊 **AI分析 · 整体效果分析过程**\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ 🔍 **分析进行中...**               ┃\n┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n┃ ✅ 数据采集完成                    ┃\n┃ ✅ 指标计算完成                    ┃\n┃ ✅ 策略排名完成                    ┃\n┃ ⏳ AI洞察生成中...                 ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n**已完成的维度分析**\n\n┌──────────────────────────────────┐\n│ 📈 核心指标总览                    │\n│ ├ 总触达量：10,083人次             │\n│ ├ 总转化量：479人                  │\n│ ├ 平均转化率：6.08%                │\n│ └ 综合ROI：38.4%                   │\n└──────────────────────────────────┘\n\n您可查看各维度分析过程：',
      actions: [
        { label: '📈 目标达成维度', type: 'select', payload: 'analysis-dimension-target' },
        { label: '🔄 转化漏斗维度', type: 'select', payload: 'analysis-dimension-conversion' },
        { label: '📱 渠道效果维度', type: 'select', payload: 'analysis-dimension-channel' },
        { label: '🧪 A/B测试维度', type: 'select', payload: 'analysis-dimension-ab' },
        { label: '📋 查看完整报告', type: 'select', payload: 'analysis-overall-result' },
      ],
      step: 'processing',
    };
  }

  // 单策略分析过程
  const strategyName = strategyId === 'st001' ? '高净值客户专属理财推荐' :
                       strategyId === 'st002' ? '新开户礼包发放' : '沉睡客户唤醒计划';

  return {
    content: `📊 **AI分析 · ${strategyName}分析过程**\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ 🔍 **分析进行中...**               ┃\n┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n┃ ✅ 策略配置解析完成                ┃\n┃ ✅ 触达数据采集完成                ┃\n┃ ✅ 转化链路追踪完成                ┃\n┃ ⏳ 多维度分析中...                 ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n**已完成的维度分析**\n\n┌──────────────────────────────────┐\n│ 🎯 目标达成维度                    │\n│ ├ 目标转化率：12% → 实际12.4% ✅   │\n│ ├ 目标ROI：50% → 实际61.8% ✅      │\n│ └ 达成状态：超额完成               │\n└──────────────────────────────────┘\n\n您可查看各维度详细分析：`,
    actions: [
      { label: '🎯 目标达成维度', type: 'select', payload: `analysis-dimension-target-${strategyId}` },
      { label: '📊 过程追踪维度', type: 'select', payload: `analysis-dimension-process-${strategyId}` },
      { label: '🔄 转化漏斗维度', type: 'select', payload: `analysis-dimension-conversion-${strategyId}` },
      { label: '📋 任务完成维度', type: 'select', payload: `analysis-dimension-task-${strategyId}` },
      { label: '📱 渠道效果维度', type: 'select', payload: `analysis-dimension-channel-${strategyId}` },
      { label: '🧪 A/B测试维度', type: 'select', payload: `analysis-dimension-ab-${strategyId}` },
    ],
    step: 'processing',
  };
}

// ========== AI分析模块 - 维度分析结果 ==========
function generateDimensionAnalysis(dimension: AnalysisDimension, scope: AnalysisScope, strategyId?: string): { content: string; actions?: MessageAction[] } {
  const strategyName = strategyId === 'st001' ? '高净值客户专属理财推荐' :
                       strategyId === 'st002' ? '新开户礼包发放' : '沉睡客户唤醒计划';

  const dimensionConfigs: Record<AnalysisDimension, { icon: string; name: string }> = {
    target: { icon: '🎯', name: '目标达成维度' },
    process: { icon: '📊', name: '过程追踪维度' },
    conversion: { icon: '🔄', name: '转化漏斗维度' },
    task: { icon: '📋', name: '任务完成维度' },
    channel: { icon: '📱', name: '渠道效果维度' },
    ab: { icon: '🧪', name: 'A/B测试维度' },
  };

  const config = dimensionConfigs[dimension];

  // 目标达成维度
  if (dimension === 'target') {
    return {
      content: `${config.icon} **${config.name}分析**\n\n${scope === 'overall' ? '**整体目标达成情况**' : `**${strategyName}目标达成**`}\n\n┌───────────────────────────────────────┐\n│ 指标          │ 目标值  │ 实际值  │ 达成率  │\n├───────────────────────────────────────┤\n│ 触达量        │ 10,000 │ 10,083 │ 100.8%✅│\n│ 转化率        │  5.0%  │  6.1%  │ 122.0%✅│\n│ ROI          │ 35.0%  │ 38.4%  │ 109.7%✅│\n│ 成本控制      │¥22,000 │¥20,166 │ 108.3%✅│\n└───────────────────────────────────────┘\n\n**💡 AI洞察**\n• 整体目标达成良好，转化率超预期22%\n• 成本控制优秀，节省¥1,834\n• 建议下期目标上浮15%`,
      actions: [
        { label: '📊 查看过程维度', type: 'select', payload: `analysis-dimension-process-${strategyId || 'overall'}` },
        { label: '🔄 查看转化维度', type: 'select', payload: `analysis-dimension-conversion-${strategyId || 'overall'}` },
        { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
      ],
    };
  }

  // 过程追踪维度
  if (dimension === 'process') {
    return {
      content: `${config.icon} **${config.name}分析**\n\n**执行时间线**\n\nT+0h ━━━━━━━━ 策略启动\n  └ 短信发送 1,892条\n  └ 企微推送 2,388条\n\nT+1h ━━━━━━━━ 首批触达完成\n  └ 触达率：98.2%\n  └ 失败原因：号码失效 34条\n\nT+24h ━━━━━━ 转化跟踪\n  └ 点击率：22.3%\n  └ 转化率：12.4%\n\nT+48h ━━━━━━ 二次触达\n  └ 外呼补触 125通\n  └ 成功率：84%\n\n**💡 AI洞察**\n• 首次触达执行效率高\n• 二次触达补充效果明显，建议常态化`,
      actions: [
        { label: '🎯 查看目标维度', type: 'select', payload: `analysis-dimension-target-${strategyId || 'overall'}` },
        { label: '🔄 查看转化维度', type: 'select', payload: `analysis-dimension-conversion-${strategyId || 'overall'}` },
        { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
      ],
    };
  }

  // 转化漏斗维度
  if (dimension === 'conversion') {
    return {
      content: `${config.icon} **${config.name}分析**\n\n**全链路转化漏斗**\n\n触达 10,083 ━━━━━━━━━━━━━━━ 100%\n    │\n    ▼ 点击 2,002 (19.8%)\n    │\n    ▼ 意向 856 (8.5%)\n    │\n    ▼ 转化 479 (4.7%)\n\n**各环节转化率**\n\n┌──────────────┬──────────┬──────────┐\n│ 环节         │ 转化率   │ 同比     │\n├──────────────┼──────────┼──────────┤\n│ 触达→点击    │  19.8%   │ ↑ 3.2%   │\n│ 点击→意向    │  42.8%   │ ↑ 5.1%   │\n│ 意向→转化    │  55.8%   │ ↑ 2.3%   │\n└──────────────┴──────────┴──────────┘\n\n**💡 AI洞察**\n• 点击→意向转化率最高，话术效果佳\n• 触达→点击环节有提升空间，建议优化标题`,
      actions: [
        { label: '📱 查看渠道维度', type: 'select', payload: `analysis-dimension-channel-${strategyId || 'overall'}` },
        { label: '🧪 查看AB测试', type: 'select', payload: `analysis-dimension-ab-${strategyId || 'overall'}` },
        { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
      ],
    };
  }

  // 任务完成维度
  if (dimension === 'task') {
    return {
      content: `${config.icon} **${config.name}分析**\n\n**任务执行统计**\n\n┌──────────────┬────────┬────────┬────────┐\n│ 任务类型     │ 计划量 │ 实际量 │ 完成率 │\n├──────────────┼────────┼────────┼────────┤\n│ 短信发送     │  6,500 │  6,460 │  99.4% │\n│ 外呼拨打     │  1,300 │  1,235 │  95.0% │\n│ 企微推送     │  2,500 │  2,388 │  95.5% │\n└──────────────┴────────┴────────┴────────┘\n\n**失败原因分析**\n\n• 短信失败：号码失效 40条 (0.6%)\n• 外呼失败：无人接听 65通 (5.0%)\n• 企微失败：已离职员工 12人 (0.5%)\n\n**💡 AI洞察**\n• 任务完成率整体良好\n• 外呼无人接听比例偏高，建议调整拨打时段`,
      actions: [
        { label: '📊 查看过程维度', type: 'select', payload: `analysis-dimension-process-${strategyId || 'overall'}` },
        { label: '📱 查看渠道维度', type: 'select', payload: `analysis-dimension-channel-${strategyId || 'overall'}` },
        { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
      ],
    };
  }

  // 渠道效果维度
  if (dimension === 'channel') {
    return {
      content: `${config.icon} **${config.name}分析**\n\n**各渠道效果对比**\n\n┌──────┬──────┬──────┬──────┬──────┬──────┐\n│ 渠道 │ 触达量│ 点击率│ 转化率│ 成本 │ ROI  │\n├──────┼──────┼──────┼──────┼──────┼──────┤\n│ 短信 │ 6,460│  3.2%│  2.1%│¥0.5/条│ 42% │\n│ 外呼 │ 1,235│ 22.0%│ 18.0%│¥3.0/通│ 36% │\n│ 企微 │ 2,388│ 12.5%│  8.6%│¥0.1/条│ 86% │\n└──────┴──────┴──────┴──────┴──────┴──────┘\n\n**渠道效率排名**\n\n🥇 企微：ROI最高，性价比最优\n🥈 外呼：转化率最高，但成本较高\n🥉 短信：触达量大，但转化率偏低\n\n**💡 AI建议**\n• 扩大企微使用范围\n• 外呼仅用于高价值客户\n• 短信配合短链使用效果更佳`,
      actions: [
        { label: '🔄 查看转化维度', type: 'select', payload: `analysis-dimension-conversion-${strategyId || 'overall'}` },
        { label: '🧪 查看AB测试', type: 'select', payload: `analysis-dimension-ab-${strategyId || 'overall'}` },
        { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
      ],
    };
  }

  // A/B测试维度
  if (dimension === 'ab') {
    return {
      content: `${config.icon} **${config.name}分析**\n\n**当前运行中的测试**\n\n┌─────────────────────────────────────────┐\n│ 测试1：触达渠道对比                      │\n├─────────────────────────────────────────┤\n│ A组：短信触达  → 转化率 1.2%            │\n│ B组：外呼触达  → 转化率 3.8%            │\n│ 样本量：各500人                          │\n│ 显著性：p<0.05 ✅ B组显著优于A组         │\n└─────────────────────────────────────────┘\n\n┌─────────────────────────────────────────┐\n│ 测试2：礼包金额对比                      │\n├─────────────────────────────────────────┤\n│ A组：50元礼包  → 转化率 10.5%           │\n│ B组：100元礼包 → 转化率 12.4%           │\n│ 样本量：各200人                          │\n│ 显著性：p=0.23 ⏳ 样本量不足，继续观察   │\n└─────────────────────────────────────────┘\n\n**💡 AI建议**\n• 测试1：建议全量切换至外呼渠道\n• 测试2：继续观察，需增加样本至各500人`,
      actions: [
        { label: '🎯 查看目标维度', type: 'select', payload: `analysis-dimension-target-${strategyId || 'overall'}` },
        { label: '📱 查看渠道维度', type: 'select', payload: `analysis-dimension-channel-${strategyId || 'overall'}` },
        { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
      ],
    };
  }

  return {
    content: '📊 请选择分析维度',
  };
}

// ========== AI分析模块 - 最终结果 ==========
function generateAnalysisOverallResult(): { content: string; actions?: MessageAction[] } {
  return {
    content: '📊 **AI分析 · 整体效果分析报告**\n\n**📈 核心指标总览**\n├ 活跃策略：2个\n├ 总触达量：10,083人次\n├ 总转化量：479人\n├ 平均转化率：6.08%\n├ 总投入成本：¥20,166\n└ 综合ROI：38.4%\n\n**🏆 策略效果排名**\n\n1. 新开户礼包发放 ⭐\n　转化率：12.37% | ROI：61.8%\n　评级：优秀 | 建议：扩大客群\n\n2. 高净值理财推荐\n　转化率：6.08% | ROI：45.2%\n　评级：良好 | 建议：优化内容\n\n3. 沉睡客户唤醒 ⚠️\n　转化率：1.58% | ROI：8.2%\n　评级：待优化 | 建议：更换渠道\n\n**💡 AI综合洞察**\n\n✅ **优势**\n• 新客策略表现优异，建议复制推广\n• 企微渠道ROI最高，性价比突出\n\n⚠️ **待优化**\n• 沉睡唤醒ROI偏低，建议优化话术或换渠道\n• 短信转化率偏低，建议加强内容吸引力\n\n🎯 **下一步行动建议**\n1. 扩大新客礼包策略客群范围\n2. 优化沉睡唤醒策略触达方式\n3. 增加企微渠道使用比例',
    actions: [
      { label: '🔍 新客礼包深入分析', type: 'select', payload: 'analysis-single-st002-start' },
      { label: '🔍 沉睡唤醒优化分析', type: 'select', payload: 'analysis-single-st003-start' },
      { label: '📍 前往分析中心', type: 'navigate', payload: '/analytics' },
    ],
  };
}

// ========== 主组件 ==========
export default function AIAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCapability, setActiveCapability] = useState<AICapability>(null);
  const [analysisScope, setAnalysisScope] = useState<AnalysisScope>(null);
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString(), timestamp: new Date() }]);
  }, []);

  const handleAction = useCallback((action: MessageAction) => {
    const payload = action.payload || '';
    
    if (action.type === 'navigate') {
      navigate(payload);
      return;
    }
    
    if (action.type === 'confirm') {
      addMessage({
        type: 'system',
        content: '✅ 已确认，正在为您处理...',
        capability: activeCapability,
      });
      if (payload.startsWith('segment-')) {
        setTimeout(() => navigate('/customer-groups/create'), 800);
      }
      return;
    }
    
    if (action.type === 'select') {
      // 圈客相关
      if (payload.startsWith('segment-')) {
        const descMap: Record<string, string> = {
          'segment-vip-desc': '帮我圈选高净值客户',
          'segment-sleep-desc': '帮我圈选沉睡客户',
          'segment-new-desc': '帮我圈选新开户客户',
          'segment-adjust': '我想调整圈客规则的条件',
        };
        if (descMap[payload]) {
          setTimeout(() => handleUserInput(descMap[payload]), 100);
          return;
        }
      }
      
      // 策略相关
      if (payload.startsWith('strategy-')) {
        const descMap: Record<string, string> = {
          'strategy-sleep-desc': '帮沉睡客户做唤醒策略',
          'strategy-new-desc': '新开户客户发礼包',
          'strategy-finance-desc': '给高净值客户推荐理财产品',
          'strategy-adjust': '我想调整策略编排的配置',
        };
        if (descMap[payload]) {
          setTimeout(() => handleUserInput(descMap[payload]), 100);
          return;
        }
      }
      
      // 分析相关 - 意图澄清
      if (payload === 'analysis-single-select') {
        setTimeout(() => handleUserInput('分析单条策略'), 100);
        return;
      }
      
      // 分析相关 - 开始分析
      if (payload.startsWith('analysis-overall-start')) {
        setAnalysisScope('overall');
        setTimeout(() => handleUserInput('__analysis_overall_process__'), 100);
        return;
      }
      
      if (payload.startsWith('analysis-single-st0')) {
        const stId = payload.replace('analysis-single-', '').replace('-start', '');
        setAnalysisScope('single');
        setCurrentStrategyId(stId);
        setTimeout(() => handleUserInput(`__analysis_single_process_${stId}__`), 100);
        return;
      }
      
      // 分析相关 - 维度分析
      if (payload.startsWith('analysis-dimension-')) {
        const parts = payload.replace('analysis-dimension-', '').split('-');
        const dimension = parts[0] as AnalysisDimension;
        const stId = parts[1] || currentStrategyId || undefined;
        setTimeout(() => handleUserInput(`__analysis_dimension_${dimension}_${stId || 'overall'}__`), 100);
        return;
      }
      
      // 分析相关 - 最终结果
      if (payload === 'analysis-overall-result') {
        setTimeout(() => handleUserInput('__analysis_overall_result__'), 100);
        return;
      }
      
      // 分析相关 - 澄清后快速选择
      if (payload.startsWith('analysis-')) {
        const descMap: Record<string, string> = {
          'analysis-overall': '分析所有策略的整体效果',
          'analysis-conversion': '分析转化漏斗',
          'analysis-channel': '分析渠道效果',
          'analysis-ab': '分析AB测试结果',
        };
        if (descMap[payload]) {
          setTimeout(() => handleUserInput(descMap[payload]), 100);
          return;
        }
      }
    }
  }, [navigate, activeCapability, addMessage, analysisScope, currentStrategyId]);

  const handleUserInput = useCallback((text: string) => {
    // 特殊处理分析过程和结果
    if (text.startsWith('__analysis_')) {
      // 整体分析过程
      if (text === '__analysis_overall_process__') {
        const response = generateAnalysisProcessingResponse('overall');
        addMessage({
          type: 'ai',
          content: response.content,
          capability: 'analysis',
          actions: response.actions,
          analysisScope: 'overall',
          analysisStep: 'processing',
        });
        return;
      }
      
      // 整体分析结果
      if (text === '__analysis_overall_result__') {
        const response = generateAnalysisOverallResult();
        addMessage({
          type: 'ai',
          content: response.content,
          capability: 'analysis',
          actions: response.actions,
          analysisScope: 'overall',
          analysisStep: 'result',
        });
        return;
      }
      
      // 单策略分析过程
      const singleMatch = text.match(/__analysis_single_process_(st\d+)__/);
      if (singleMatch) {
        const stId = singleMatch[1];
        const response = generateAnalysisProcessingResponse('single', stId);
        addMessage({
          type: 'ai',
          content: response.content,
          capability: 'analysis',
          actions: response.actions,
          analysisScope: 'single',
          analysisStep: 'processing',
        });
        return;
      }
      
      // 维度分析
      const dimensionMatch = text.match(/__analysis_dimension_(\w+)_(\w+)__/);
      if (dimensionMatch) {
        const dimension = dimensionMatch[1] as AnalysisDimension;
        const stId = dimensionMatch[2];
        const scope = stId === 'overall' ? 'overall' : 'single';
        const response = generateDimensionAnalysis(dimension, scope, stId !== 'overall' ? stId : undefined);
        addMessage({
          type: 'ai',
          content: response.content,
          capability: 'analysis',
          actions: response.actions,
          analysisScope: scope,
          analysisDimension: dimension,
        });
        return;
      }
    }

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      type: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, { ...userMessage, id: Date.now().toString(), timestamp: new Date() }]);
    setInputValue('');
    setIsTyping(true);

    const capability = matchIntent(text);
    setActiveCapability(capability);

    setTimeout(() => {
      let response: { content: string; actions?: MessageAction[]; scope?: AnalysisScope; step?: 'processing' };

      switch (capability) {
        case 'segment':
          response = generateSegmentResponse(text);
          break;
        case 'strategy':
          response = generateStrategyResponse(text);
          break;
        case 'analysis':
          response = generateAnalysisClarifyResponse(text);
          if (response.scope) {
            setAnalysisScope(response.scope);
          }
          break;
        default:
          response = {
            content: '🤖 我是营销AI助手，专注以下三大能力：\n\n🎯 **AI圈客** — 描述目标客户，我自动生成标签规则\n⚡ **AI策略** — 描述营销需求，我自动编排策略画布\n📊 **AI分析** — 描述分析意图，我多维度输出洞察\n\n请直接告诉我您的需求，我来匹配对应能力！',
          };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.content,
          capability,
          actions: response.actions,
          timestamp: new Date(),
          analysisScope: response.scope,
        },
      ]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }, [addMessage]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    handleUserInput(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCapabilityClick = (capability: AICapability) => {
    setActiveCapability(capability);
    const introMap: Record<string, string> = {
      segment: '我想圈选客户',
      strategy: '帮我创建营销策略',
      analysis: '帮我分析策略效果',
    };
    handleUserInput(introMap[capability] || '');
  };

  const capabilityConfig = [
    { key: 'segment' as const, icon: Users, label: 'AI圈客', color: 'from-blue-500 to-cyan-500', desc: '标签规则·快速圈客' },
    { key: 'strategy' as const, icon: Zap, label: 'AI策略', color: 'from-purple-500 to-pink-500', desc: '语言识别·画布编排' },
    { key: 'analysis' as const, icon: BarChart3, label: 'AI分析', color: 'from-amber-500 to-orange-500', desc: '多维洞察·效果分析' },
  ];

  const getCapabilityBadge = (cap?: AICapability) => {
    if (!cap) return null;
    const map = {
      segment: { label: 'AI圈客', color: 'bg-blue-100 text-blue-700' },
      strategy: { label: 'AI策略', color: 'bg-purple-100 text-purple-700' },
      analysis: { label: 'AI分析', color: 'bg-amber-100 text-amber-700' },
    };
    const cfg = map[cap];
    return <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>;
  };

  const getScopeBadge = (scope?: AnalysisScope) => {
    if (!scope) return null;
    const map = {
      single: { label: '单策略', color: 'bg-indigo-100 text-indigo-700' },
      overall: { label: '整体', color: 'bg-rose-100 text-rose-700' },
    };
    const cfg = map[scope];
    return <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white z-50 hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="打开AI助手"
      >
        <Sparkles size={24} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[420px] h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 overflow-hidden border border-slate-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none translate-y-4'
        }`}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-semibold">营销AI助手</h3>
              <p className="text-xs text-white/80">AI圈客 · AI策略 · AI分析</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        {messages.length === 0 && (
          <div className="p-4 bg-gradient-to-b from-purple-50 to-white border-b border-slate-100">
            <p className="text-xs text-slate-500 mb-3 text-center">选择能力，或直接输入需求我来自动匹配</p>
            <div className="grid grid-cols-3 gap-2">
              {capabilityConfig.map((cap) => (
                <button
                  key={cap.key}
                  onClick={() => handleCapabilityClick(cap.key)}
                  className="flex flex-col items-center p-3 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cap.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <cap.icon size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{cap.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{cap.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex gap-2.5 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.type !== 'system' && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {message.type === 'ai' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                )}
                <div
                  className={`${
                    message.type === 'system'
                      ? 'mx-auto px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-200'
                      : message.type === 'ai'
                        ? 'max-w-[85%] px-3.5 py-2.5 bg-white text-slate-800 rounded-2xl rounded-tl-none shadow-sm'
                        : 'max-w-[85%] px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none'
                  }`}
                >
                  {message.capability && message.type === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {getCapabilityBadge(message.capability)}
                      {message.analysisScope && getScopeBadge(message.analysisScope)}
                    </div>
                  )}
                  <p className="text-[13px] whitespace-pre-line leading-relaxed font-mono">{message.content}</p>
                </div>
              </div>

              {message.actions && message.actions.length > 0 && (
                <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                  {message.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(action)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        action.type === 'navigate'
                          ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                          : action.type === 'confirm'
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {action.type === 'navigate' && <ChevronRight size={12} />}
                      {action.type === 'confirm' && <Check size={12} />}
                      {action.type === 'select' && <AlertCircle size={12} />}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-200 bg-white">
          {activeCapability && (
            <div className="flex items-center gap-2 mb-2">
              {getCapabilityBadge(activeCapability)}
              {analysisScope && getScopeBadge(analysisScope)}
              <button
                onClick={() => { setActiveCapability(null); setAnalysisScope(null); }}
                className="text-[10px] text-slate-400 hover:text-slate-600 ml-auto"
              >
                重置
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={activeCapability
                ? `输入${activeCapability === 'segment' ? '圈客' : activeCapability === 'strategy' ? '策略' : '分析'}需求...`
                : '输入需求，我来自动匹配能力...'}
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                inputValue.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}