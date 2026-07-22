import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { productsApi } from '../../api/client';
import type { Product } from '../../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    description: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await productsApi.getAll();
    setProducts(data);
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || product.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    await productsApi.create({ ...formData, status: 'active' });
    fetchProducts();
    setShowCreateModal(false);
    setFormData({ name: '', code: '', type: '', description: '' });
  };

  const handleToggle = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      await productsApi.update(id, { ...product, status: product.status === 'active' ? 'inactive' : 'active' });
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    await productsApi.delete(id);
    fetchProducts();
  };

  const columns = [
    { key: 'name', label: '产品名称', width: '25%' },
    { key: 'code', label: '产品编码', width: '15%' },
    { key: 'type', label: '产品类型', width: '15%' },
    { key: 'description', label: '描述', width: '30%' },
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
    const product = item as Product;
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Package size={16} className="text-purple-500" />
            </div>
            <div>
              <span className="font-medium text-slate-800">{product.name}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600 font-mono text-sm">{product.code}</span>
        </td>
        <td className="px-6 py-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {product.type}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600 truncate max-w-xs">{product.description}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[product.status]}`}>
            {statusLabels[product.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedProduct(product); setShowDetailModal(true); }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleToggle(product.id)}
              className={`p-2 rounded-lg transition-colors ${product.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
            >
              {product.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            </button>
            <button
              onClick={() => handleDelete(product.id)}
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
    <Layout title="产品中心">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">产品管理</h2>
          <p className="text-slate-500 mt-1">管理银行产品信息</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          创建产品
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索产品名称或编码..."
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
            {[...new Set(products.map(p => p.type))].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <Table columns={columns} data={filteredProducts} renderRow={renderRow} />

      <Modal
        title="创建产品"
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormData({ name: '', code: '', type: '', description: '' }); }}
        onConfirm={handleCreate}
        confirmText="创建"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入产品名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品编码</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入产品编码"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">请选择类型</option>
              <option value="理财产品">理财产品</option>
              <option value="权益产品">权益产品</option>
              <option value="信用卡">信用卡</option>
              <option value="存款产品">存款产品</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入产品描述"
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="产品详情"
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedProduct(null); }}
        confirmText="关闭"
        hasConfirm={false}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Package size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{selectedProduct.name}</h3>
                <span className="text-sm text-slate-500 font-mono">{selectedProduct.code}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">产品类型</label>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {selectedProduct.type}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
              <p className="text-slate-600">{selectedProduct.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">创建时间: {new Date(selectedProduct.createdAt).toLocaleString()}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedProduct.status]}`}>
                {statusLabels[selectedProduct.status]}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}