import { useState, useEffect } from 'react';
import { Gift, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { benefitsApi, productsApi } from '../../api/client';
import type { Benefit, Product } from '../../types';

export default function Benefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    value: 0,
    totalCount: 0,
    productId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [benefitsData, productsData] = await Promise.all([
      benefitsApi.getAll(),
      productsApi.getAll(),
    ]);
    setBenefits(benefitsData);
    setProducts(productsData);
  };

  const filteredBenefits = benefits.filter((benefit) => {
    const matchSearch = benefit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || benefit.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    const product = products.find(p => p.id === formData.productId);
    await benefitsApi.create({ 
      ...formData, 
      productName: product?.name || '',
      usedCount: 0,
      status: 'active' 
    });
    fetchData();
    setShowCreateModal(false);
    setFormData({ name: '', type: '', description: '', value: 0, totalCount: 0, productId: '' });
  };

  const handleDelete = async (id: string) => {
    await benefitsApi.delete(id);
    fetchData();
  };

  const columns = [
    { key: 'name', label: '权益名称', width: '20%' },
    { key: 'type', label: '权益类型', width: '12%' },
    { key: 'value', label: '价值', width: '10%' },
    { key: 'product', label: '关联产品', width: '18%' },
    { key: 'usage', label: '使用情况', width: '20%' },
    { key: 'status', label: '状态', width: '10%' },
    { key: 'actions', label: '操作', width: '10%' },
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-600',
  };

  const statusLabels = {
    active: '启用',
    inactive: '停用',
  };

  const renderRow = (item: unknown) => {
    const benefit = item as Benefit;
    const usagePercent = (benefit.usedCount / benefit.totalCount) * 100;
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Gift size={16} className="text-green-500" />
            </div>
            <span className="font-medium text-slate-800">{benefit.name}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
            {benefit.type}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600 font-medium">¥{benefit.value}</span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600">{benefit.productName}</span>
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
              {benefit.usedCount}/{benefit.totalCount}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[benefit.status]}`}>
            {statusLabels[benefit.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedBenefit(benefit); setShowDetailModal(true); }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(benefit.id)}
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
    <Layout title="权益中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">权益管理</h2>
          <p className="text-slate-500 mt-1">管理营销权益</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          创建权益
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索权益名称..."
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
            {[...new Set(benefits.map(b => b.type))].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredBenefits} renderRow={renderRow} />

      <Modal
        title="创建权益"
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormData({ name: '', type: '', description: '', value: 0, totalCount: 0, productId: '' }); }}
        onConfirm={handleCreate}
        confirmText="创建"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">权益名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入权益名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">权益类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">请选择类型</option>
              <option value="利率优惠">利率优惠</option>
              <option value="现金红包">现金红包</option>
              <option value="积分权益">积分权益</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">价值</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入权益价值"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发放总数</label>
            <input
              type="number"
              value={formData.totalCount}
              onChange={(e) => setFormData({ ...formData, totalCount: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入发放总数"
            />
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入权益描述"
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="权益详情"
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedBenefit(null); }}
        confirmText="关闭"
        hasConfirm={false}
      >
        {selectedBenefit && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Gift size={20} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{selectedBenefit.name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                  {selectedBenefit.type}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">价值</label>
                <span className="text-slate-800 font-bold text-lg">¥{selectedBenefit.value}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">关联产品</label>
                <span className="text-slate-600">{selectedBenefit.productName}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">使用情况</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(selectedBenefit.usedCount / selectedBenefit.totalCount) * 100}%`,
                        backgroundColor: (selectedBenefit.usedCount / selectedBenefit.totalCount) > 0.8 ? '#EF4444' : (selectedBenefit.usedCount / selectedBenefit.totalCount) > 0.5 ? '#F59E0B' : '#10B981',
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 w-32 text-right">
                  {(selectedBenefit.usedCount / selectedBenefit.totalCount * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                已使用: {selectedBenefit.usedCount} / 总数: {selectedBenefit.totalCount}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
              <p className="text-slate-600">{selectedBenefit.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">创建时间: {new Date(selectedBenefit.createdAt).toLocaleString()}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedBenefit.status]}`}>
                {statusLabels[selectedBenefit.status]}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}