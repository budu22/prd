import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, FileCode, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { eventsApi } from '../../api/client';
import type { Event } from '../../types';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'behavior' as 'behavior' | 'business' | 'delayed',
    description: '',
    payloadSchema: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await eventsApi.getAll();
    setEvents(data);
  };

  const filteredEvents = events.filter((event) => {
    const matchSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || event.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    const payloadSchema = formData.payloadSchema ? JSON.parse(formData.payloadSchema) : {};
    await eventsApi.create({ ...formData, payloadSchema });
    fetchEvents();
    setShowCreateModal(false);
    setFormData({ name: '', type: 'behavior', description: '', payloadSchema: '' });
  };

  const handleDelete = async (id: string) => {
    await eventsApi.delete(id);
    fetchEvents();
  };

  const columns = [
    { key: 'name', label: '事件名称', width: '25%' },
    { key: 'type', label: '事件类型', width: '15%' },
    { key: 'description', label: '描述', width: '35%' },
    { key: 'status', label: '状态', width: '15%' },
    { key: 'actions', label: '操作', width: '10%' },
  ];

  const typeIcons = {
    behavior: <FileCode size={16} className="text-blue-500" />,
    business: <Zap size={16} className="text-green-500" />,
    delayed: <Clock size={16} className="text-orange-500" />,
  };

  const typeLabels = {
    behavior: '行为事件',
    business: '业务事件',
    delayed: '延时事件',
  };

  const typeColors = {
    behavior: 'bg-blue-100 text-blue-700',
    business: 'bg-green-100 text-green-700',
    delayed: 'bg-orange-100 text-orange-700',
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
    const event = item as Event;
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              {typeIcons[event.type]}
            </div>
            <span className="font-medium text-slate-800">{event.name}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[event.type]}`}>
            {typeLabels[event.type]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600 truncate max-w-xs">{event.description}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[event.status]}`}>
            {statusLabels[event.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedEvent(event); setShowDetailModal(true); }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(event.id)}
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
    <Layout title="事件中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">事件管理</h2>
          <p className="text-slate-500 mt-1">管理行为事件、业务事件和延时事件</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          创建事件
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索事件名称或描述..."
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
            <option value="behavior">行为事件</option>
            <option value="business">业务事件</option>
            <option value="delayed">延时事件</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredEvents} renderRow={renderRow} />

      <Modal
        title="创建事件"
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormData({ name: '', type: 'behavior', description: '', payloadSchema: '' }); }}
        onConfirm={handleCreate}
        confirmText="创建"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">事件名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入事件名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">事件类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'behavior' | 'business' | 'delayed' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="behavior">行为事件</option>
              <option value="business">业务事件</option>
              <option value="delayed">延时事件</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入事件描述"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payload Schema (JSON)</label>
            <textarea
              value={formData.payloadSchema}
              onChange={(e) => setFormData({ ...formData, payloadSchema: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              placeholder='{"field": "type"}'
              rows={4}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="事件详情"
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedEvent(null); }}
        confirmText="关闭"
        hasConfirm={false}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                {typeIcons[selectedEvent.type]}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{selectedEvent.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[selectedEvent.type]}`}>
                  {typeLabels[selectedEvent.type]}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
              <p className="text-slate-600">{selectedEvent.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payload Schema</label>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm font-mono text-slate-600 overflow-x-auto">
                {JSON.stringify(selectedEvent.payloadSchema, null, 2)}
              </pre>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">创建时间: {new Date(selectedEvent.createdAt).toLocaleString()}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedEvent.status]}`}>
                {statusLabels[selectedEvent.status]}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}