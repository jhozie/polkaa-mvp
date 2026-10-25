'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FintechPaginationProps {
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  itemName?: string
}

export function FintechPagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemName = 'records',
}: FintechPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(totalItems, currentPage * pageSize)

  // Generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  if (totalItems === 0) return null

  return (
    <div className="px-4 sm:px-6 py-3 border-t border-border/40 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
      {/* Range Info & Page Size */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground tabular-nums">{startIndex}</span>–
          <span className="font-semibold text-foreground tabular-nums">{endIndex}</span> of{' '}
          <span className="font-semibold text-foreground tabular-nums">{totalItems}</span> {itemName}
        </p>

        {onPageSizeChange && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                onPageChange(1)
              }}
              className="bg-secondary/40 border border-border/60 rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
        {/* Mobile Page Indicator */}
        <span className="text-xs text-muted-foreground sm:hidden">
          Page <strong className="text-foreground">{currentPage}</strong> of{' '}
          <strong className="text-foreground">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={cn(
              'flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md border border-border/60 transition-colors min-h-[44px] sm:min-h-[32px] min-w-[44px] sm:min-w-0 cursor-pointer',
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed bg-transparent text-muted-foreground'
                : 'bg-card text-foreground hover:bg-secondary/40 active:bg-secondary/60 shadow-xs'
            )}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Numbers (Desktop) */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted-foreground">
                    ...
                  </span>
                )
              }
              const pageNum = Number(page)
              const isActive = pageNum === currentPage
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center text-xs font-medium rounded-md transition-colors cursor-pointer',
                    isActive
                      ? 'bg-primary text-white shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              'flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md border border-border/60 transition-colors min-h-[44px] sm:min-h-[32px] min-w-[44px] sm:min-w-0 cursor-pointer',
              currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed bg-transparent text-muted-foreground'
                : 'bg-card text-foreground hover:bg-secondary/40 active:bg-secondary/60 shadow-xs'
            )}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
