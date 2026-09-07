import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  itemName?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50],
  itemName = 'data',
  className = '',
  variant = 'light',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  const isDark = variant === 'dark';

  // Generate page numbers to show with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  const borderClass = isDark ? 'border-slate-800' : 'border-slate-200/80';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const textHighlightClass = isDark ? 'text-slate-200' : 'text-slate-900';
  const btnBaseClass = isDark
    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-700 disabled:opacity-30'
    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40';

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t ${borderClass} text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} ${className}`}>
      {/* Left info & per page selector */}
      <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
        <p className={`font-medium ${textMutedClass}`}>
          Menampilkan <span className={`font-bold ${textHighlightClass}`}>{startItem}</span> - <span className={`font-bold ${textHighlightClass}`}>{endItem}</span> dari <span className={`font-bold ${textHighlightClass}`}>{totalItems}</span> {itemName}
        </p>

        {onItemsPerPageChange && (
          <div className={`flex items-center gap-1.5 pl-2 sm:border-l ${borderClass}`}>
            <span className={isDark ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}>Per halaman:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold focus:outline-none cursor-pointer shadow-2xs ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-slate-200 focus:border-slate-600'
                  : 'bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Page Controls */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage <= 1}
          className={`p-1.5 rounded-lg border disabled:pointer-events-none transition-all cursor-pointer shadow-2xs ${btnBaseClass}`}
          title="Halaman Pertama"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous page button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className={`p-1.5 px-2.5 rounded-lg border disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 font-bold shadow-2xs ${btnBaseClass}`}
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 mx-0.5">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className={`px-1 font-bold select-none ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === safeCurrentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? isDark
                      ? 'bg-slate-700 text-white font-black shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs font-black'
                    : btnBaseClass
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next page button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className={`p-1.5 px-2.5 rounded-lg border disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 font-bold shadow-2xs ${btnBaseClass}`}
          title="Halaman Berikutnya"
        >
          <span className="hidden sm:inline text-[11px]">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last page button */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          className={`p-1.5 rounded-lg border disabled:pointer-events-none transition-all cursor-pointer shadow-2xs ${btnBaseClass}`}
          title="Halaman Terakhir"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
