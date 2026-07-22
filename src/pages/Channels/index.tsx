import { useState, useEffect } from 'react';
import { MessageSquare, Phone, MessageCircle, Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { channelsApi } from '../../api/client';
import type { Channel } from '../../types';

export default function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sms' as 'sms' | 'call' | 'wechat',
    config: '',
    quota: 0,
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const data = await channelsApi.getAll();
    setChannels(data);
  };

  const filteredChannels = channels.filter((channel) => {
    const matchSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || channel.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    const config = formData.config ? JSON.parse(formData.config) : {};
    await channelsApi.create({ ...formData, config, used: 0 });
    fetchChannels();
    setShowCreateModal(false);
    setFormData({ name: '', type: 'sms', config: '', quota: 0 });
  };

  const handleToggle = async (id: string) => {
    await channelsApi.toggle(id);
    fetchChannels();
  };

  const handleDelete = async (id: string) => {
    await channelsApi.delete(id);
    fetchChannels();
  };

  const columns = [
    { key: 'name', label: '通道名称', width: '25%' },
    { key: 'type', label: '通道类型', width: '15%' },
    { key: 'quota', label: '配额使用', width: '20%' },
    { key: 'status', label: '状态', width: '15%' },
    { key: 'actions', label: '操作', width: '25%' },
  ];

  const typeIcons = {
    sms: <MessageSquare size={16} className="text-blue-500" />,
    call: <Phone size={16} className="text-green-500" />,
    wechat: <MessageCircle size={16} className="text-orange-500" />,
  };

  const typeLabels = {
    sms: '短信',
    call: '外呼',
    wechat: '企微',
  };

  const typeColors = {
    sms: 'bg-blue-100 text-blue-700',
    call: 'bg-green-100 text-green-700',
    wechat: 'bg-orange-100 text-orange-700',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-600',
  };

  const statusLabels = {
    active: '启用',
    inactive: '停用',
  };

  const renderRow = (item: unknown) => {
    const channel = item as Channel;
    const usagePercent = (channel.used / channel.quota) * 100;
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              {typeIcons[channel.type]}
            </div>
            <span className="font-medium text-slate-800">{channel.name}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[channel.type]}`}>
            {typeLabels[channel.type]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${usagePercent}%`,
                    backgroundColor: usagePercent > 80 ? '#EF4444' : usagePercent > 50 ? '#F59E0B' : '#10B981',
                  }}
                />
              </div>
            </div>
            <span className="text-sm text-slate-600 w-24 text-right">
              {channel.used.toLocaleString()}/{channel.quota.toLocaleString()}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[channel.status]}`}>
            {statusLabels[channel.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedChannel(channel); setShowDetailModal(true); }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleToggle(channel.id)}
              className={`p-2 rounded-lg transition-colors ${channel.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
            >
              {channel.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            </button>
            <button
              onClick={() => handleDelete(channel.id)}
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
    <Layout title="触达中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">通道管理</h2>
          <p className="text-slate-500 mt-1">管理短信、外呼和企微渠道</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          创建通道
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索通道名称..."
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
            <option value="sms">短信</option>
            <option value="call">外呼</option>
            <option value="wechat">企微</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredChannels} renderRow={renderRow} />

      <Modal
        title="创建通道"
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormData({ name: '', type: 'sms', config: '', quota: 0 }); }}
        onConfirm={handleCreate}
        confirmText="创建"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">通道名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入通道名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">通道类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sms' | 'call' | 'wechat' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="sms">短信</option>
              <option value="call">外呼</option>
              <option value="wechat">企微</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">配额</label>
            <input
              type="number"
              value={formData.quota}
              onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入配额数量"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">配置 (JSON)</label>
            <textarea
              value={formData.config}
              onChange={(e) => setFormData({ ...formData, config: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              placeholder='{"apiKey": "xxx", "endpoint": "xxx"}'
              rows={4}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="通道详情"
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedChannel(null); }}
        confirmText="关闭"
        hasConfirm={false}
      >
        {selectedChannel && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                {typeIcons[selectedChannel.type]}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{selectedChannel.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[selectedChannel.type]}`}>
                  {typeLabels[selectedChannel.type]}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">配额使用情况</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(selectedChannel.used / selectedChannel.quota) * 100}%`,
                        backgroundColor: (selectedChannel.used / selectedChannel.quota) > 0.8 ? '#EF4444' : (selectedChannel.used / selectedChannel.quota) > 0.5 ? '#F59E0B' : '#10B981',
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 w-32 text-right">
                  {(selectedChannel.used / selectedChannel.quota * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                已使用: {selectedChannel.used.toLocaleString()} / 总配额: {selectedChannel.quota.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">配置信息</label>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm font-mono text-slate-600 overflow-x-auto">
                {JSON.stringify(selectedChannel.config, null, 2)}
              </pre>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">状态: {statusLabels[selectedChannel.status]}</span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}