import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitBranch,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Gift,
  Calendar,
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/Common/StatCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import Table from '../../components/Common/Table';
import { analyticsApi, strategiesApi, customerGroupsApi } from '../../api/client';
import useAppStore from '../../stores/appStore';
import type { Strategy, AnalyticsData } from '../../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, strategies, customerGroups, analytics, setStats, setStrategies, setCustomerGroups, setAnalytics } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, strategiesData, groupsData, analyticsData] = await Promise.all([
        analyticsApi.getStats(),
        strategiesApi.getAll(),
        customerGroupsApi.getAll(),
        analyticsApi.getCompare(),
      ]);
      setStats(statsData);
      setStrategies(strategiesData);
      setCustomerGroups(groupsData);
      setAnalytics(analyticsData);
    };
    fetchData();
  }, [setStats, setStrategies, setCustomerGroups, setAnalytics]);

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

  const analyticsChartData = {
    labels: analytics.map((a: AnalyticsData) => a.strategyName),
    datasets: [
      {
        label: '转化率',
        data: analytics.map((a: AnalyticsData) => a.conversionRate),
        backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B'],
        borderRadius: 6,
      },
    ],
  };

  const columns = [
    { key: 'name', label: '策略名称', width: '30%' },
    { key: 'group', label: '目标客群', width: '20%' },
    { key: 'status', label: '状态', width: '15%' },
    { key: 'reach', label: '触达量', width: '15%' },
    { key: 'conversion', label: '转化率', width: '15%' },
  ];

  const renderRow = (item: unknown) => {
    const strategy = item as Strategy;
    const strategyAnalytics = analytics.find((a: AnalyticsData) => a.strategyId === strategy.id);
    
    const statusColors = {
      active: 'bg-green-100 text-green-700',
      draft: 'bg-slate-100 text-slate-600',
      review: 'bg-yellow-100 text-yellow-700',
      paused: 'bg-orange-100 text-orange-700',
      ended: 'bg-red-100 text-red-600',
    };

    const statusLabels = {
      active: '运行中',
      draft: '草稿',
      review: '审核中',
      paused: '已暂停',
      ended: '已结束',
    };

    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <GitBranch size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">{strategy.name}</p>
              <p className="text-sm text-slate-500">{strategy.id}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{strategy.customerGroupName}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[strategy.status]}`}>
            {statusLabels[strategy.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{strategyAnalytics?.reachCount?.toLocaleString() || '-'}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{strategyAnalytics?.conversionRate?.toFixed(2)}%</span>
        </td>
      </>
    );
  };

  return (
    <Layout title="数据概览">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="策略总数"
          value={stats?.totalStrategies || 0}
          icon={<GitBranch className="text-white" size={24} />}
          trend={{ value: '+2', isUp: true }}
          color="purple"
        />
        <StatCard
          title="运行中策略"
          value={stats?.activeStrategies || 0}
          icon={<Zap className="text-white" size={24} />}
          trend={{ value: '+1', isUp: true }}
          color="blue"
        />
        <StatCard
          title="触达总量"
          value={(stats?.totalReach || 0).toLocaleString()}
          icon={<MessageSquare className="text-white" size={24} />}
          trend={{ value: '5.2%', isUp: true }}
          color="green"
        />
        <StatCard
          title="转化数"
          value={(stats?.totalConversion || 0).toLocaleString()}
          icon={<TrendingUp className="text-white" size={24} />}
          trend={{ value: '3.8%', isUp: true }}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart data={trendData} title="触达趋势" />
        <BarChart data={analyticsChartData} title="策略转化率对比" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">快捷入口</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/customer-groups')}
            className="p-4 bg-slate-50 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <Users className="text-purple-600" size={20} />
            </div>
            <p className="font-medium text-slate-700">客群中心</p>
            <p className="text-sm text-slate-500">{customerGroups.length} 个客群</p>
          </button>
          <button
            onClick={() => navigate('/strategy')}
            className="p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
              <GitBranch className="text-indigo-600" size={20} />
            </div>
            <p className="font-medium text-slate-700">策略中心</p>
            <p className="text-sm text-slate-500">{strategies.length} 个策略</p>
          </button>
          <button
            onClick={() => navigate('/benefits')}
            className="p-4 bg-slate-50 rounded-xl hover:bg-green-50 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <Gift className="text-green-600" size={20} />
            </div>
            <p className="font-medium text-slate-700">权益中心</p>
            <p className="text-sm text-slate-500">管理权益</p>
          </button>
          <button
            onClick={() => navigate('/activities')}
            className="p-4 bg-slate-50 rounded-xl hover:bg-orange-50 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
              <Calendar className="text-orange-600" size={20} />
            </div>
            <p className="font-medium text-slate-700">活动中心</p>
            <p className="text-sm text-slate-500">创建活动</p>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">策略概览</h3>
          <button
            onClick={() => navigate('/strategy')}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
          >
            查看全部
            <ArrowUpRight size={16} />
          </button>
        </div>
        <Table
          columns={columns}
          data={strategies.slice(0, 5)}
          renderRow={renderRow}
        />
      </div>
    </Layout>
  );
}
