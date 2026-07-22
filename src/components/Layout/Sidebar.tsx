import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Zap,
  MessageSquare,
  FileText,
  Package,
  Gift,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: '首页', path: '/' },
  { icon: Users, label: '客群中心', path: '/customer-groups' },
  { icon: GitBranch, label: '策略中心', path: '/strategy' },
  { icon: Zap, label: '事件中心', path: '/events' },
  { icon: MessageSquare, label: '触达中心', path: '/channels' },
  { icon: FileText, label: '内容中心', path: '/content' },
  { icon: Package, label: '产品中心', path: '/products' },
  { icon: Gift, label: '权益中心', path: '/benefits' },
  { icon: Calendar, label: '活动中心', path: '/activities' },
  { icon: BarChart3, label: '分析中心', path: '/analytics' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-slate-900 min-h-screen border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          AI营销平台
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-400 border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-white font-medium">A</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">管理员</p>
            <p className="text-slate-500 text-xs">营销系统</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
