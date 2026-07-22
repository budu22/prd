import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface TableProps {
  columns: Column[];
  data: unknown[];
  renderRow: (item: unknown, index: number) => ReactNode;
  onEdit?: (item: unknown) => void;
  onDelete?: (item: unknown) => void;
  actions?: ReactNode;
  total?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Table({ columns, data, renderRow, actions, total = 0, currentPage = 1, onPageChange }: TableProps) {
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                {renderRow(item, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)} 条，共 {total} 条
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
