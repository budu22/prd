import { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Eye, Play, Square } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { activitiesApi, productsApi } from '../../api/client';
import type { Activity, Product } from '../../types';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    startTime: '',
    endTime: '',
    productId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [activitiesData, productsData] = await Promise.all([
      activitiesApi.getAll(),
      productsApi.getAll(),
    ]);
    setActivities(activitiesData);
    setProducts(productsData);
  };

  const filteredActivities = activities.filter((activity) => {
    const matchSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || activity.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    const product = products.find(p => p.id === formData.productId);
    await activitiesApi.create({ 
      ...formData, 
      productName: product?.name || '',
      status: 'draft' 
    });
    fetchData();
    setShowCreateModal(false);
    setFormData({ name: '', type: '', description: '', startTime: '', endTime: '', productId: '' });
  };

  const handleToggle = async (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      const newStatus = activity.status === 'active' ? 'ended' : 'active';
      await activitiesApi.update(id, { ...activity, status: newStatus });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    await activitiesApi.delete(id);
    fetchData();
  };

  const columns = [
    { key: 'name', label: '活动名称', width: '25%' },
    { key: 'type', label: '活动类型', width: '15%' },
    { key: 'product', label: '关联产品', width: '18%' },
    { key: 'time', label: '时间范围', width: '22%' },
    { key: 'status', label: '状态', width: '10%' },
    { key: 'actions', label: '操作', width: '10%' },
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-600',
    ended: 'bg-red-100 text-red-600',
  };

  const statusLabels = {
    active: '进行中',
    draft: '草稿',
    ended: '已结束',
  };

  const renderRow = (item: unknown) => {
    const activity = item as Activity;
    const startDate = new Date(activity.startTime).toLocaleDateString('zh-CN');
    const endDate = new Date(activity.endTime).toLocaleDateString('zh-CN');
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Calendar size={16} className="text-orange-500" />
            </div>
            <span className="font-medium text-slate-800">{activity.name}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
            {activity.type}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{activity.productName}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600 text-sm">{startDate} - {endDate}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[activity.status]}`}>
            {statusLabels[activity.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedActivity(activity); setShowDetailModal(true); }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            {activity.status !== 'draft' && (
              <button
                onClick={() => handleToggle(activity.id)}
                className={`p-2 rounded-lg transition-colors ${activity.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
              >
                {activity.status === 'active' ? <Square size={16} /> : <Play size={16} />}
              </button>
            )}
            <button
              onClick={() => handleDelete(activity.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </>
    );
  };

  return (
    <Layout title="活动中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">活动管理</h2>
          <p className="text-slate-500 mt-1">管理营销活动</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          创建活动
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索活动名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="all">全部类型</option>
            {[...new Set(activities.map(a => a.type))].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredActivities} renderRow={renderRow} />

      <Modal
        title="创建活动"
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormData({ name: '', type: '', description: '', startTime: '', endTime: '', productId: '' }); }}
        onConfirm={handleCreate}
        confirmText="创建"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">活动名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入活动名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">活动类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">请选择类型</option>
              <option value="满减活动">满减活动</option>
              <option value="新人活动">新人活动</option>
              <option value="抽奖活动">抽奖活动</option>
              <option value="积分活动">积分活动</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">关联产品</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">请选择产品</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入活动描述"
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="活动详情"
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedActivity(null); }}
        confirmText="关闭"
        hasConfirm={false}
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Calendar size={20} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{selectedActivity.name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                  {selectedActivity.type}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">关联产品</label>
                <span className="text-slate-600">{selectedActivity.productName}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedActivity.status]}`}>
                  {statusLabels[selectedActivity.status]}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
                <span className="text-slate-600">{new Date(selectedActivity.startTime).toLocaleString('zh-CN')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
                <span className="text-slate-600">{new Date(selectedActivity.endTime).toLocaleString('zh-CN')}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
              <p className="text-slate-600">{selectedActivity.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">创建时间: {new Date(selectedActivity.createdAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}