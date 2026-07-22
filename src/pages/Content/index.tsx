import { useState, useEffect } from 'react';
import { FileText, Image, Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { contentApi } from '../../api/client';
import type { Content } from '../../types';

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'material' as 'material' | 'script',
    category: '',
    content: '',
    variables: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const data = await contentApi.getAll();
    setContents(data);
  };

  const filteredContents = contents.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    const variables = formData.variables ? formData.variables.split(',').map(v => v.trim()).filter(v => v) : [];
    await contentApi.create({ ...formData, variables, version: '1.0', status: 'draft' });
    fetchContent();
    setShowCreateModal(false);
    setFormData({ name: '', type: 'material', category: '', content: '', variables: '' });
  };

  const handleDelete = async (id: string) => {
    await contentApi.delete(id);
    fetchContent();
  };

  const columns = [
    { key: 'name', label: '内容名称', width: '20%' },
    { key: 'type', label: '类型', width: '10%' },
    { key: 'category', label: '分类', width: '15%' },
    { key: 'variables', label: '变量', width: '15%' },
    { key: 'version', label: '版本', width: '10%' },
    { key: 'status', label: '状态', width: '15%' },
    { key: 'actions', label: '操作', width: '15%' },
  ];

  const typeIcons = {
    material: <Image size={16} className="text-purple-500" />,
    script: <FileText size={16} className="text-blue-500" />,
  };

  const typeLabels = {
    material: '素材',
    script: '话术',
  };

  const typeColors = {
    material: 'bg-purple-100 text-purple-700',
    script: 'bg-blue-100 text-blue-700',
  };

  const statusIcons = {
    approved: <CheckCircle size={16} className="text-green-500" />,
    draft: <Clock size={16} className="text-slate-400" />,
    rejected: <XCircle size={16} className="text-red-500" />,
  };

  const statusColors = {
    approved: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-600',
    rejected: 'bg-red-100 text-red-600',
  };

  const statusLabels = {
    approved: '已审核',
    draft: '草稿',
    rejected: '已驳回',
  };

  const renderRow = (item: unknown) => {
    const content = item as Content;
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              {typeIcons[content.type]}
            </div>
            <span className="font-medium text-slate-800">{content.name}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[content.type]}`}>
            {typeLabels[content.type]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{content.category}</span>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {content.variables.map((v, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                {v}
              </span>
            ))}
            {content.variables.length === 0 && <span className="text-slate-400 text-sm">-</span>}
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{content.version}</span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {statusIcons[content.status]}
            <span className={`text-sm font-medium ${statusColors[content.status]}`}>
              {statusLabels[content.status]}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedContent(content); setShowDetailModal(true); }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(content.id)}
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
    <Layout title="内容中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">内容管理</h2>
          <p className="text-slate-500 mt-1">管理素材、话术等营销内容</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          创建内容
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索内容名称或分类..."
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
            <option value="material">素材</option>
            <option value="script">话术</option>
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredContents} renderRow={renderRow} />

      <Modal
        title="创建内容"
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormData({ name: '', type: 'material', category: '', content: '', variables: '' }); }}
        onConfirm={handleCreate}
        confirmText="创建"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">内容名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入内容名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'material' | 'script' })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="material">素材</option>
              <option value="script">话术</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入分类"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">内容</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入内容"
              rows={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">变量 (逗号分隔)</label>
            <input
              type="text"
              value={formData.variables}
              onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="customer_name, amount, rate"
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="内容详情"
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedContent(null); }}
        confirmText="关闭"
        hasConfirm={false}
      >
        {selectedContent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  {typeIcons[selectedContent.type]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{selectedContent.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[selectedContent.type]}`}>
                    {typeLabels[selectedContent.type]}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedContent.status]}`}>
                {statusLabels[selectedContent.status]}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
              <span className="text-slate-600">{selectedContent.category}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">版本</label>
              <span className="text-slate-600">{selectedContent.version}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">变量</label>
              <div className="flex flex-wrap gap-2">
                {selectedContent.variables.map((v, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">内容</label>
              <div className="bg-slate-50 p-4 rounded-lg text-slate-600 whitespace-pre-wrap">
                {selectedContent.content}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">创建时间: {new Date(selectedContent.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}