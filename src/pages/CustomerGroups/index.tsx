import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Filter, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Common/Table';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { customerGroupsApi } from '../../api/client';
import useAppStore from '../../stores/appStore';
import type { CustomerGroup } from '../../types';

export default function CustomerGroups() {
  const navigate = useNavigate();
  const { customerGroups, setCustomerGroups } = useAppStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      const data = await customerGroupsApi.getAll();
      setCustomerGroups(data);
    };
    fetchData();
  }, [setCustomerGroups]);

  const handleDelete = async () => {
    if (deleteId) {
      await customerGroupsApi.delete(deleteId);
      const data = await customerGroupsApi.getAll();
      setCustomerGroups(data);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const filteredGroups = filterType === 'all' 
    ? customerGroups 
    : customerGroups.filter((g: CustomerGroup) => g.type === filterType);

  const columns = [
    { key: 'name', label: '客群名称', width: '25%' },
    { key: 'type', label: '类型', width: '15%' },
    { key: 'members', label: '成员数量', width: '15%' },
    { key: 'status', label: '状态', width: '15%' },
    { key: 'tags', label: '标签', width: '20%' },
    { key: 'actions', label: '操作', width: '10%' },
  ];

  const renderRow = (item: unknown) => {
    const group = item as CustomerGroup;

    const typeColors = {
      static: 'bg-blue-100 text-blue-700',
      dynamic: 'bg-green-100 text-green-700',
    };

    const typeLabels = {
      static: '静态客群',
      dynamic: '动态客群',
    };

    const statusColors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-red-100 text-red-600',
    };

    const statusLabels = {
      active: '活跃',
      inactive: '停用',
    };

    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">{group.name}</p>
              <p className="text-sm text-slate-500">{group.id}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[group.type]}`}>
            {typeLabels[group.type]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-slate-600 font-medium">{group.memberCount.toLocaleString()}</span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[group.status]}`}>
            {statusLabels[group.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {group.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                {tag}
              </span>
            ))}
            {group.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">
                +{group.tags.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/customer-groups/${group.id}`)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="查看详情"
            >
              <Eye size={16} className="text-slate-500" />
            </button>
            <button
              onClick={() => navigate(`/customer-groups/${group.id}/edit`)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 size={16} className="text-slate-500" />
            </button>
            <button
              onClick={() => handleOpenDeleteModal(group.id)}
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
    <Layout title="客群中心">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/customer-groups/create')}>
            <Plus size={18} />
            新建客群
          </Button>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">全部类型</option>
              <option value="static">静态客群</option>
              <option value="dynamic">动态客群</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          共 {customerGroups.length} 个客群
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredGroups}
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
        <p className="text-slate-600 mb-4">确定要删除该客群吗？此操作不可恢复。</p>
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
