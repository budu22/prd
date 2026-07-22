import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Tag, Calendar, FileText, Download } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Common/Button';
import { customerGroupsApi } from '../../api/client';
import type { CustomerGroup } from '../../types';

export default function CustomerGroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<CustomerGroup | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await customerGroupsApi.getById(id || '');
      setGroup(data);
    };
    fetchData();
  }, [id]);

  if (!group) {
    return (
      <Layout title="客群详情">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      </Layout>
    );
  }

  const typeLabels = {
    static: '静态客群',
    dynamic: '动态客群',
  };

  const statusLabels = {
    active: '活跃',
    inactive: '停用',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-red-100 text-red-600',
  };

  return (
    <Layout title="客群详情">
      <div className="mb-6">
        <button
          onClick={() => navigate('/customer-groups')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          返回客群列表
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-800">{group.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[group.status]}`}>
                {statusLabels[group.status]}
              </span>
            </div>
            <p className="text-slate-500">{group.id}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(`/customer-groups/${group.id}/edit`)}>
              编辑
            </Button>
            <Button>
              <Download size={18} />
              导出成员
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-purple-600" />
              <span className="text-slate-500 text-sm">成员数量</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{group.memberCount.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Tag size={20} className="text-blue-600" />
              <span className="text-slate-500 text-sm">客群类型</span>
            </div>
            <p className="text-xl font-semibold text-slate-800">{typeLabels[group.type]}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-green-600" />
              <span className="text-slate-500 text-sm">创建时间</span>
            </div>
            <p className="text-lg font-medium text-slate-800">
              {new Date(group.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-orange-600" />
              <span className="text-slate-500 text-sm">更新时间</span>
            </div>
            <p className="text-lg font-medium text-slate-800">
              {new Date(group.updatedAt).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">描述</h3>
          <p className="text-slate-600">{group.description || '-'}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">关联标签</h3>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {group.type === 'dynamic' && group.rule && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-indigo-600" />
            筛选规则
          </h3>
          <pre className="p-4 bg-slate-900 text-green-400 rounded-lg text-sm font-mono">
            {group.rule}
          </pre>
        </div>
      )}
    </Layout>
  );
}
