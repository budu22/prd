import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Eye, ArrowUpRight } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/Common/StatCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { analyticsApi, strategiesApi } from '../../api/client';
import useAppStore from '../../stores/appStore';
import type { AnalyticsData, Strategy } from '../../types';

export default function Analytics() {
  const { analytics, strategies, setAnalytics, setStrategies } = useAppStore();
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [analyticsData, strategiesData] = await Promise.all([
      analyticsApi.getCompare(),
      strategiesApi.getAll(),
    ]);
    setAnalytics(analyticsData);
    setStrategies(strategiesData);
  };

  const trendData = {
    labels: ['2/1', '2/2', '2/3', '2/4', '2/5', '2/6', '2/7', '2/8', '2/9', '2/10', '2/11', '2/12', '2/13', '2/14', '2/15'],
    datasets: [
      {
        label: '触达量',
        data: [8500, 8800, 9200, 8900, 9100, 9500, 9300, 9800, 9600, 9400, 9700, 10100, 9900, 10200, 10083],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
      },
      {
        label: '转化数',
        data: [420, 450, 480, 460, 475, 510, 490, 530, 515, 500, 525, 550, 535, 560, 479],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
    ],
  };

  const conversionChartData = {
    labels: analytics.map((a: AnalyticsData) => a.strategyName),
    datasets: [
      {
        label: '转化率 (%)',
        data: analytics.map((a: AnalyticsData) => a.conversionRate),
        backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
        borderRadius: 6,
      },
    ],
  };

  const roiChartData = {
    labels: analytics.map((a: AnalyticsData) => a.strategyName),
    datasets: [
      {
        label: 'ROI (%)',
        data: analytics.map((a: AnalyticsData) => a.roi),
        backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
        borderRadius: 6,
      },
    ],
  };

  const totalReach = analytics.reduce((sum: number, a: AnalyticsData) => sum + a.reachCount, 0);
  const totalConversion = analytics.reduce((sum: number, a: AnalyticsData) => sum + a.conversionCount, 0);
  const avgConversionRate = analytics.length > 0 
    ? (analytics.reduce((sum: number, a: AnalyticsData) => sum + a.conversionRate, 0) / analytics.length).toFixed(2)
    : '0';
  const totalCost = analytics.reduce((sum: number, a: AnalyticsData) => sum + a.cost, 0);
  const avgRoi = analytics.length > 0 
    ? (analytics.reduce((sum: number, a: AnalyticsData) => sum + a.roi, 0) / analytics.length).toFixed(1)
    : '0';

  const toggleStrategy = (id: string) => {
    if (compareMode) {
      setSelectedStrategies(prev => 
        prev.includes(id) 
          ? prev.filter(s => s !== id)
          : [...prev, id]
      );
    } else {
      setSelectedStrategy(id);
    }
  };

  const filteredAnalytics = compareMode
    ? analytics.filter((a: AnalyticsData) => selectedStrategies.includes(a.strategyId))
    : selectedStrategy
      ? analytics.filter((a: AnalyticsData) => a.strategyId === selectedStrategy)
      : analytics;

  return (
    <Layout title="分析中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">策略分析</h2>
          <p className="text-slate-500 mt-1">单策略及多策略对比分析</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">模式:</span>
            <button
              onClick={() => { setCompareMode(false); setSelectedStrategy(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!compareMode ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}
            >
              单策略
            </button>
            <button
              onClick={() => { setCompareMode(true); setSelectedStrategies([]); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${compareMode ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}
            >
              多策略对比
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700">选择策略:</span>
          {strategies.map((strategy: Strategy) => {
            const isSelected = compareMode 
              ? selectedStrategies.includes(strategy.id)
              : selectedStrategy === strategy.id;
            return (
              <button
                key={strategy.id}
                onClick={() => toggleStrategy(strategy.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {strategy.name}
              </button>
            );
          })}
          {(!compareMode && !selectedStrategy) && (
            <span className="text-sm text-slate-400">显示全部策略</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="触达总量"
          value={totalReach.toLocaleString()}
          icon={<Eye className="text-white" size={24} />}
          trend={{ value: '+5.2%', isUp: true }}
          color="purple"
        />
        <StatCard
          title="转化总数"
          value={totalConversion.toLocaleString()}
          icon={<Target className="text-white" size={24} />}
          trend={{ value: '+3.8%', isUp: true }}
          color="green"
        />
        <StatCard
          title="平均转化率"
          value={`${avgConversionRate}%`}
          icon={<TrendingUp className="text-white" size={24} />}
          trend={{ value: '+0.5%', isUp: true }}
          color="blue"
        />
        <StatCard
          title="总投入成本"
          value={`¥${totalCost.toLocaleString()}`}
          icon={<DollarSign className="text-white" size={24} />}
          trend={{ value: '+2.1%', isUp: false }}
          color="orange"
        />
        <StatCard
          title="平均ROI"
          value={`${avgRoi}%`}
          icon={<BarChart3 className="text-white" size={24} />}
          trend={{ value: '+1.2%', isUp: true }}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart data={trendData} title="触达趋势" />
        <BarChart data={conversionChartData} title="策略转化率" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart data={roiChartData} title="策略ROI对比" />
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">策略效果排名</h3>
          <div className="space-y-4">
            {filteredAnalytics.length > 0 ? (
              filteredAnalytics
                .sort((a: AnalyticsData, b: AnalyticsData) => b.conversionRate - a.conversionRate)
                .map((item: AnalyticsData, index: number) => (
                  <div key={item.strategyId} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-slate-100 text-slate-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.strategyName}</p>
                      <p className="text-sm text-slate-500">触达: {item.reachCount.toLocaleString()} | 转化: {item.conversionCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{item.conversionRate.toFixed(2)}%</p>
                      <p className="text-sm text-slate-500">转化率</p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                暂无数据
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">详细数据</h3>
          <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium">
            导出报告
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">策略名称</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">触达量</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">点击量</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">转化数</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">转化率</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">成本</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">ROI</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalytics.length > 0 ? (
                filteredAnalytics.map((item: AnalyticsData) => (
                  <tr key={item.strategyId} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-800 font-medium">{item.strategyName}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{item.reachCount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{item.clickCount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{item.conversionCount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-medium ${item.conversionRate >= 10 ? 'text-green-600' : item.conversionRate >= 5 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {item.conversionRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-slate-600">¥{item.cost.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-medium ${item.roi >= 30 ? 'text-green-600' : item.roi >= 10 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {item.roi}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}