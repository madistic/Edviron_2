import React, { useState } from 'react'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge'
import LoadingSpinner from './LoadingSpinner'

const TransactionTable = ({ 
  transactions, 
  loading, 
  pagination, 
  onPageChange, 
  onSort,
  currentSort,
  showTooltip = true
}) => {
  const [hoveredRow, setHoveredRow] = useState(null)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
  }

  const handleSort = (field) => {
    const newOrder = 
      currentSort.field === field && currentSort.order === 'desc' ? 'asc' : 'desc'
    onSort(field, newOrder)
  }

  const getSortIcon = (field) => {
    if (currentSort.field !== field) return '↕️'
    return currentSort.order === 'desc' ? '↓' : '↑'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No transactions found</div>
        <div className="text-gray-400">Try adjusting your filters</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                School ID
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('transaction_amount')}
              >
                Amount {getSortIcon('transaction_amount')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gateway
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('payment_time')}
              >
                Payment Time {getSortIcon('payment_time')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.collect_id}
                className="table-row relative"
                onMouseEnter={() => showTooltip && setHoveredRow(transaction.collect_id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {transaction.collect_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.school_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(transaction.transaction_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={transaction.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.gateway}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.payment_time)}
                </td>

                {/* Hover Tooltip */}
                {showTooltip && hoveredRow === transaction.collect_id && (
                  <td className="absolute top-full left-0 right-0 z-10 mx-6 mb-2">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-2">
                      <h4 className="font-semibold text-gray-900">Transaction Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Student:</span>
                          <br />
                          <span className="text-gray-900">
                            {transaction.student_info?.name || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Student ID:</span>
                          <br />
                          <span className="text-gray-900">
                            {transaction.student_info?.id || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Order Amount:</span>
                          <br />
                          <span className="text-gray-900">
                            {formatCurrency(transaction.order_amount)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Payment Mode:</span>
                          <br />
                          <span className="text-gray-900">
                            {transaction.payment_mode || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.collect_id} className="card p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-mono text-gray-600">
                  ID: {transaction.collect_id}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(transaction.transaction_amount)}
                </div>
              </div>
              <StatusBadge status={transaction.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">School:</span>
                <br />
                <span className="text-gray-900">{transaction.school_id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Gateway:</span>
                <br />
                <span className="text-gray-900">{transaction.gateway}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Payment Time:</span>
                <br />
                <span className="text-gray-900">{formatDate(transaction.payment_time)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <span>‹</span>
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i
                  if (pageNum > pagination.totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNum === pagination.page
                          ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <span>›</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionTable