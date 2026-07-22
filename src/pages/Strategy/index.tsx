import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, GitBranch, Play, Pause, Eye, Edit2, Trash2, Sparkles } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { strategiesApi } from '../../api/client';
import useAppStore from '../../stores/appStore';
import type { Strategy } from '../../types';

export default function StrategyCenter() {
  const navigate = useNavigate();
  const { strategies, setStrategies } = useAppStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await strategiesApi.getAll();
      setStrategies(data);
    };
    fetchData();
  }, [setStrategies]);

  const handleDelete = async () => {
    if (deleteId) {
      await strategiesApi.delete(deleteId);
      const data = await strategiesApi.getAll();
      setStrategies(data);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handlePublish = async (id: string) => {
    await strategiesApi.publish(id);
    const data = await strategiesApi.getAll();
    setStrategies(data);
  };

  const handlePause = async (id: string) => {
    await strategiesApi.pause(id);
    const data = await strategiesApi.getAll();
    setStrategies(data);
  };

  const handleAiSuggestion = async () => {
    setIsAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAiSuggestions([
      '建议使用多渠道组合触达，提高转化率',
      '针对高净值客户推荐高端理财产品',
      '考虑设置延时触发，避开客户休息时间',
      '增加A/B测试，优化触达内容',
    ]);
    setIsAiLoading(false);
  };

  const columns = [
    { key: 'name', label: '策略名称', width: '30%' },
    { key: 'group', label: '目标客群', width: '20%' },
    { key: 'trigger', label: '触发方式', width: '15%' },
    { key: 'status', label: '状态', width: '15%' },
    { key: 'actions', label: '操作', width: '20%' },
  ];

  const renderRow = (item: unknown) => {
    const strategy = item as Strategy;

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

    const triggerLabels = {
      event: '事件触发',
      schedule: '定时触发',
      api: 'API触发',
    };

    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <GitBranch size={20} className="text-indigo-600" />
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
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {triggerLabels[strategy.triggerType]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[strategy.status]}`}>
            {statusLabels[strategy.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/strategy/${strategy.id}`)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="查看详情"
            >
              <Eye size={16} className="text-slate-500" />
            </button>
            <button
              onClick={() => navigate(`/strategy/${strategy.id}/edit`)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 size={16} className="text-slate-500" />
            </button>
            {strategy.status === 'active' && (
              <button
                onClick={() => handlePause(strategy.id)}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                title="暂停"
              >
                <Pause size={16} className="text-orange-500" />
              </button>
            )}
            {strategy.status === 'paused' && (
              <button
                onClick={() => handlePublish(strategy.id)}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                title="发布"
              >
                <Play size={16} className="text-green-500" />
              </button>
            )}
            <button
              onClick={() => {
                setDeleteId(strategy.id);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </td>
      </>
    );
  };

  return (
    <Layout title="策略中心">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/strategy/create')}>
            <Plus size={18} />
            创建策略
          </Button>
          <Button variant="outline" onClick={handleAiSuggestion} disabled={isAiLoading}>
            <Sparkles size={16} />
            {isAiLoading ? 'AI思考中...' : 'AI辅助编排'}
          </Button>
        </div>
        <div className="text-sm text-slate-500">
          共 {strategies.length} 个策略
        </div>
      </div>

      {aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4 mb-6">
          <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            AI智能建议
          </h3>
          <ul className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-purple-700">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Table
        columns={columns}
        data={strategies}
        renderRow={renderRow}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        title="确认删除"
      >
        <p className="text-slate-600 mb-4">确定要删除该策略吗？此操作不可恢复。</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
