import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from '../AIAssistant';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
