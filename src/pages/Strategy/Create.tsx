import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Zap, Gift, Calendar, MessageSquare, Plus, Sparkles, Check, X, Edit } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { strategiesApi, customerGroupsApi, eventsApi, benefitsApi, activitiesApi, contentApi, channelsApi } from '../../api/client';
import useAppStore from '../../stores/appStore';

interface StrategyAction {
  type: 'benefit' | 'activity' | 'message';
  targetId: string;
  targetName: string;
  channel: 'sms' | 'call' | 'wechat';
  contentId: string;
  contentName: string;
}

export default function CreateStrategy() {
  const navigate = useNavigate();
  const { customerGroups, events, benefits, activities, contents, channels } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customerGroupId: '',
    customerGroupName: '',
    triggerType: 'event' as 'event' | 'schedule' | 'api',
    triggerConfig: {},
    actions: [] as StrategyAction[],
  });
  const [selectedStep, setSelectedStep] = useState<'group' | 'trigger' | 'action'>('group');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);

  const handleSelectGroup = (groupId: string, groupName: string) => {
    setFormData({ ...formData, customerGroupId: groupId, customerGroupName: groupName });
    setSelectedStep('trigger');
  };

  const handleSelectTrigger = (triggerType: 'event' | 'schedule' | 'api', config: object) => {
    setFormData({ ...formData, triggerType, triggerConfig: config });
    setSelectedStep('action');
  };

  const handleAddAction = () => {
    const newAction: StrategyAction = {
      type: 'benefit',
      targetId: '',
      targetName: '',
      channel: 'sms',
      contentId: '',
      contentName: '',
    };
    setFormData({ ...formData, actions: [...formData.actions, newAction] });
    setCurrentActionIndex(formData.actions.length);
    setShowChannelModal(true);
  };

  const handleConfigureAction = (index: number) => {
    setCurrentActionIndex(index);
    setShowChannelModal(true);
  };

  const handleSaveAction = (type: 'benefit' | 'activity' | 'message', targetId: string, targetName: string, channel: 'sms' | 'call' | 'wechat', contentId: string, contentName: string) => {
    const newActions = [...formData.actions];
    newActions[currentActionIndex] = { type, targetId, targetName, channel, contentId, contentName };
    setFormData({ ...formData, actions: newActions });
    setShowChannelModal(false);
  };

  const handleRemoveAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: newActions });
  };

  const handleAiSuggestion = async () => {
    setIsAiLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAiSuggestions([
      '推荐使用短信+企微组合触达，提升触达率',
      '建议在工作日9:00-12:00或14:00-18:00进行触达',
      '针对新客户推荐开户礼包权益',
      '可考虑设置延时触发，等待客户完成开户流程',
    ]);
    setIsAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await strategiesApi.create({
      ...formData,
      status: 'draft',
    });
    navigate(`/strategy/${data.id}`);
  };

  const groupStepComplete = !!formData.customerGroupId;
  const triggerStepComplete = !!formData.triggerType && Object.keys(formData.triggerConfig).length > 0;

  const actionIcons = {
    benefit: Gift,
    activity: Calendar,
    message: MessageSquare,
  };

  const actionLabels = {
    benefit: '发放权益',
    activity: '关联活动',
    message: '发送消息',
  };

  const channelLabels = {
    sms: '短信',
    call: '外呼',
    wechat: '企微',
  };

  return (
    <Layout title="创建策略">
      <div className="mb-6">
        <button
          onClick={() => navigate('/strategy')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          返回策略列表
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">策略基本信息</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">策略名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="请输入策略名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="请输入策略描述"
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Button variant="outline" onClick={handleAiSuggestion} disabled={isAiLoading}>
                <Sparkles size={16} />
                {isAiLoading ? 'AI思考中...' : 'AI辅助编排'}
              </Button>
            </div>

            {aiSuggestions.length > 0 && (
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4">
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
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">策略画布</h3>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex flex-col items-center ${groupStepComplete ? '' : selectedStep === 'group' ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${groupStepComplete ? 'bg-green-500' : 'bg-slate-200'}`}>
                  {groupStepComplete ? <Check className="text-white" size={24} /> : <Users className="text-slate-500" size={24} />}
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700">选择客户</span>
              </div>
              <div className={`w-24 h-0.5 ${groupStepComplete ? 'bg-green-500' : 'bg-slate-200'}`} />
              <div className={`flex flex-col items-center ${triggerStepComplete ? '' : selectedStep === 'trigger' ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${triggerStepComplete ? 'bg-green-500' : 'bg-slate-200'}`}>
                  {triggerStepComplete ? <Check className="text-white" size={24} /> : <Zap className="text-slate-500" size={24} />}
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700">触发时机</span>
              </div>
              <div className={`w-24 h-0.5 ${triggerStepComplete ? 'bg-green-500' : 'bg-slate-200'}`} />
              <div className={`flex flex-col items-center ${selectedStep === 'action' ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.actions.length > 0 ? 'bg-green-500' : 'bg-slate-200'}`}>
                  {formData.actions.length > 0 ? <Check className="text-white" size={24} /> : <Gift className="text-slate-500" size={24} />}
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700">权益/活动</span>
              </div>
              <div className={`w-24 h-0.5 ${formData.actions.length > 0 ? 'bg-green-500' : 'bg-slate-200'}`} />
              <div className={`flex flex-col items-center ${formData.actions.length > 0 && formData.actions.every(a => a.channel && a.contentId) ? '' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.actions.length > 0 && formData.actions.every(a => a.channel && a.contentId) ? 'bg-green-500' : 'bg-slate-200'}`}>
                  {formData.actions.length > 0 && formData.actions.every(a => a.channel && a.contentId) ? <Check className="text-white" size={24} /> : <MessageSquare className="text-slate-500" size={24} />}
                </div>
                <span className="mt-2 text-sm font-medium text-slate-700">触达通道</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              {selectedStep === 'group' && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">选择目标客群</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerGroups.map((group: { id: string; name: string; memberCount: number; type: string; status: string }) => (
                      <button
                        key={group.id}
                        onClick={() => handleSelectGroup(group.id, group.name)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.customerGroupId === group.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{group.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {group.status === 'active' ? '活跃' : '停用'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{group.memberCount.toLocaleString()} 成员</span>
                          <span>{group.type === 'static' ? '静态' : '动态'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedStep === 'trigger' && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">设置触发时机</h4>
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedStep('group')}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      ← 返回选择客群
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => {
                          setFormData({ ...formData, triggerType: 'event', triggerConfig: {} });
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.triggerType === 'event'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <Zap className="text-purple-600 mb-2" size={24} />
                        <span className="font-medium text-slate-800">事件触发</span>
                        <p className="text-sm text-slate-500 mt-1">当指定事件发生时触发</p>
                      </button>

                      <button
                        onClick={() => {
                          setFormData({ ...formData, triggerType: 'schedule', triggerConfig: { schedule: '0 9 * * 1-5' } });
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.triggerType === 'schedule'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <Calendar className="text-blue-600 mb-2" size={24} />
                        <span className="font-medium text-slate-800">定时触发</span>
                        <p className="text-sm text-slate-500 mt-1">按照指定时间定时触发</p>
                      </button>

                      <button
                        onClick={() => {
                          setFormData({ ...formData, triggerType: 'api', triggerConfig: {} });
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.triggerType === 'api'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <MessageSquare className="text-green-600 mb-2" size={24} />
                        <span className="font-medium text-slate-800">API触发</span>
                        <p className="text-sm text-slate-500 mt-1">通过API调用触发</p>
                      </button>
                    </div>

                    {formData.triggerType === 'event' && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-3">选择触发事件</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {events.map((event: { id: string; name: string; type: string }) => (
                            <button
                              key={event.id}
                              onClick={() => handleSelectTrigger('event', { eventId: event.id, eventName: event.name })}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                (formData.triggerConfig as { eventId?: string }).eventId === event.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-slate-200 hover:border-green-300'
                              }`}
                            >
                              <span className="font-medium text-slate-800">{event.name}</span>
                              <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                {event.type === 'behavior' ? '行为' : event.type === 'business' ? '业务' : '延时'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.triggerType === 'schedule' && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cron表达式</label>
                        <input
                          type="text"
                          value={(formData.triggerConfig as { schedule?: string }).schedule || ''}
                          onChange={(e) => setFormData({ ...formData, triggerConfig: { schedule: e.target.value } })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                          placeholder="0 9 * * 1-5"
                        />
                        <button
                          onClick={() => handleSelectTrigger('schedule', formData.triggerConfig)}
                          className="mt-3 Button"
                        >
                          确认触发时机
                        </button>
                      </div>
                    )}

                    {formData.triggerType === 'api' && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-600 mb-3">策略将通过API调用触发，无需额外配置。</p>
                        <button
                          onClick={() => handleSelectTrigger('api', {})}
                          className="Button"
                        >
                          确认触发时机
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedStep === 'action' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-700">配置触达动作</h4>
                    <button
                      onClick={() => setSelectedStep('trigger')}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      ← 返回触发时机
                    </button>
                  </div>

                  {formData.actions.length === 0 ? (
                    <div className="text-center py-12">
                      <Gift className="mx-auto text-slate-300 mb-4" size={48} />
                      <p className="text-slate-500 mb-4">暂无触达动作，请添加</p>
                      <Button onClick={handleAddAction}>
                        <Plus size={18} />
                        添加触达动作
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.actions.map((action, index) => {
                        const ActionIcon = actionIcons[action.type];
                        return (
                          <div key={index} className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <ActionIcon className="text-purple-600" size={20} />
                                </div>
                                <div>
                                  <span className="font-medium text-slate-800">{actionLabels[action.type]}</span>
                                  {action.targetName && (
                                    <span className="ml-2 text-sm text-slate-500">{action.targetName}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {action.channel && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    action.channel === 'sms' ? 'bg-blue-100 text-blue-700' :
                                    action.channel === 'call' ? 'bg-orange-100 text-orange-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {channelLabels[action.channel]}
                                  </span>
                                )}
                                <button
                                  onClick={() => handleConfigureAction(index)}
                                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Edit className="text-slate-500" size={16} />
                                </button>
                                <button
                                  onClick={() => handleRemoveAction(index)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="text-red-500" size={16} />
                                </button>
                              </div>
                            </div>
                            {action.contentName && (
                              <div className="text-sm text-slate-500">
                                使用内容: {action.contentName}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <Button variant="outline" onClick={handleAddAction}>
                        <Plus size={18} />
                        添加触达动作
                      </Button>
                    </div>
                  )}

                  {formData.actions.length > 0 && (
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}>
                        保存策略
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showChannelModal}
        onClose={() => setShowChannelModal(false)}
        title="配置触达动作"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">动作类型</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  const newActions = [...formData.actions];
                  if (currentActionIndex >= 0) {
                    newActions[currentActionIndex] = { ...newActions[currentActionIndex], type: 'benefit' };
                    setFormData({ ...formData, actions: newActions });
                  }
                }}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.actions[currentActionIndex]?.type === 'benefit'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <Gift className="mx-auto mb-2" size={20} />
                <span className="text-sm font-medium">发放权益</span>
              </button>
              <button
                onClick={() => {
                  const newActions = [...formData.actions];
                  if (currentActionIndex >= 0) {
                    newActions[currentActionIndex] = { ...newActions[currentActionIndex], type: 'activity' };
                    setFormData({ ...formData, actions: newActions });
                  }
                }}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.actions[currentActionIndex]?.type === 'activity'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <Calendar className="mx-auto mb-2" size={20} />
                <span className="text-sm font-medium">关联活动</span>
              </button>
              <button
                onClick={() => {
                  const newActions = [...formData.actions];
                  if (currentActionIndex >= 0) {
                    newActions[currentActionIndex] = { ...newActions[currentActionIndex], type: 'message' };
                    setFormData({ ...formData, actions: newActions });
                  }
                }}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.actions[currentActionIndex]?.type === 'message'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <MessageSquare className="mx-auto mb-2" size={20} />
                <span className="text-sm font-medium">发送消息</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {formData.actions[currentActionIndex]?.type === 'benefit' ? '选择权益' :
               formData.actions[currentActionIndex]?.type === 'activity' ? '选择活动' : '选择目标'}
            </label>
            <select
              value={formData.actions[currentActionIndex]?.targetId || ''}
              onChange={(e) => {
                const newActions = [...formData.actions];
                const targetList = formData.actions[currentActionIndex]?.type === 'benefit' ? benefits : activities;
                const target = targetList.find((t: { id: string }) => t.id === e.target.value);
                if (currentActionIndex >= 0) {
                  newActions[currentActionIndex] = {
                    ...newActions[currentActionIndex],
                    targetId: e.target.value,
                    targetName: target?.name || '',
                  };
                  setFormData({ ...formData, actions: newActions });
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">请选择</option>
              {(formData.actions[currentActionIndex]?.type === 'benefit' ? benefits : activities).map((item: { id: string; name: string }) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">触达渠道</label>
            <div className="grid grid-cols-3 gap-3">
              {(['sms', 'call', 'wechat'] as const).map((channel) => (
                <button
                  key={channel}
                  onClick={() => {
                    const newActions = [...formData.actions];
                    if (currentActionIndex >= 0) {
                      newActions[currentActionIndex] = { ...newActions[currentActionIndex], channel };
                      setFormData({ ...formData, actions: newActions });
                    }
                  }}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.actions[currentActionIndex]?.channel === channel
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-sm font-medium">{channelLabels[channel]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">选择内容</label>
            <select
              value={formData.actions[currentActionIndex]?.contentId || ''}
              onChange={(e) => {
                const newActions = [...formData.actions];
                const content = contents.find((c: { id: string }) => c.id === e.target.value);
                if (currentActionIndex >= 0) {
                  newActions[currentActionIndex] = {
                    ...newActions[currentActionIndex],
                    contentId: e.target.value,
                    contentName: content?.name || '',
                  };
                  setFormData({ ...formData, actions: newActions });
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">请选择</option>
              {contents.filter((c: { type: string }) => 
                formData.actions[currentActionIndex]?.channel === 'wechat' ? c.type === 'material' : c.type === 'script'
              ).map((item: { id: string; name: string }) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowChannelModal(false)}>
              取消
            </Button>
            <Button onClick={() => {
              if (currentActionIndex >= 0) {
                const action = formData.actions[currentActionIndex];
                handleSaveAction(action.type, action.targetId, action.targetName, action.channel, action.contentId, action.contentName);
              }
            }}>
              确认配置
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
