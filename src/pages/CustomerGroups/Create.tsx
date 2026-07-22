import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Sparkles } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Common/Button';
import { customerGroupsApi } from '../../api/client';

export default function CreateCustomerGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'dynamic' as 'static' | 'dynamic',
    description: '',
    tags: [] as string[],
    rule: '',
    memberCount: 0,
  });
  const [newTag, setNewTag] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleGetAiSuggestions = async () => {
    setIsAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAiSuggestions([
      '资产>100万',
      '近30天无交易',
      '信用卡用户',
      '新开户客户',
      '高活跃用户',
    ]);
    setIsAiLoading(false);
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (!formData.tags.includes(suggestion)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, suggestion],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await customerGroupsApi.create({
      ...formData,
      status: 'active',
    });
    navigate(`/customer-groups/${data.id}`);
  };

  return (
    <Layout title="新建客群">
      <div className="mb-6">
        <button
          onClick={() => navigate('/customer-groups')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          返回客群列表
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">创建客群</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">客群名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入客群名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">客群类型 *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="static"
                    checked={formData.type === 'static'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'static' | 'dynamic' })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-slate-700">静态客群</span>
                  <span className="text-xs text-slate-500">(手动选择客户)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="dynamic"
                    checked={formData.type === 'dynamic'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'static' | 'dynamic' })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-slate-700">动态客群</span>
                  <span className="text-xs text-slate-500">(标签规则自动更新)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入客群描述"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">关联标签</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="输入标签后按回车添加"
                />
                <Button size="sm" onClick={handleAddTag}>
                  <Plus size={16} />
                  添加
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <Button variant="outline" size="sm" onClick={handleGetAiSuggestions} disabled={isAiLoading}>
                <Sparkles size={16} />
                {isAiLoading ? 'AI思考中...' : 'AI智能推荐标签'}
              </Button>

              {aiSuggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {formData.type === 'dynamic' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">筛选规则</label>
                <textarea
                  value={formData.rule}
                  onChange={(e) => setFormData({ ...formData, rule: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  placeholder="例如: asset_value > 1000000"
                  rows={4}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate('/customer-groups')}>
                取消
              </Button>
              <Button type="submit">
                创建客群
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
