import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { transactionAPI } from '../services/api'
import TransactionTable from '../components/TransactionTable'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const SchoolTransactions = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(
    searchParams.get('school_id') || '65b0e6293e9f76a9694d84b4'
  )
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc',
  })

  const schoolOptions = [
    { value: '65b0e6293e9f76a9694d84b4', label: 'School 65b0e6293e9f76a9694d84b4' },
    { value: '65b0e6293e9f76a9694d84b5', label: 'School 65b0e6293e9f76a9694d84b5' },
    { value: '65b0e6293e9f76a9694d84b6', label: 'School 65b0e6293e9f76a9694d84b6' },
  ]

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ]

  useEffect(() => {
    if (selectedSchool) {
      fetchSchoolTransactions()
    }
  }, [selectedSchool, filters])

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams()
    if (selectedSchool) params.set('school_id', selectedSchool)
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    setSearchParams(params)
  }, [selectedSchool, filters, setSearchParams])

  const fetchSchoolTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionAPI.getSchoolTransactions(selectedSchool, filters)
      setTransactions(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch school transactions')
      console.error('Error fetching school transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page,
    }))
  }

  const handleSort = (field, order) => {
    setFilters(prev => ({
      ...prev,
      sort: field,
      order,
      page: 1,
    }))
  }

  const handleSchoolChange = (schoolId) => {
    setSelectedSchool(schoolId)
    setFilters(prev => ({
      ...prev,
      page: 1,
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">School Transactions</h1>
        <p className="mt-2 text-gray-600">View transactions for specific schools</p>
      </div>

      {/* School Selection & Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select School
            </label>
            <select
              className="form-select"
              value={selectedSchool}
              onChange={(e) => handleSchoolChange(e.target.value)}
            >
              <option value="">Select a school</option>
              {schoolOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per Page
            </label>
            <select
              className="form-select"
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={fetchSchoolTransactions}
              className="btn-primary flex items-center space-x-2"
              disabled={loading || !selectedSchool}
            >
              {loading ? <LoadingSpinner size="sm" /> : <span>🔍</span>}
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* School Info */}
      {selectedSchool && !loading && pagination && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">School ID</div>
            <div className="text-lg font-bold text-gray-900">{selectedSchool}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">Current Results</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedSchool ? `Transactions for School ${selectedSchool}` : 'School Transactions'}
          </h2>
          <p className="text-sm text-gray-600">
            {selectedSchool 
              ? 'All transactions for the selected school'
              : 'Please select a school to view transactions'
            }
          </p>
        </div>
        
        {selectedSchool ? (
          <TransactionTable
            transactions={transactions}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            currentSort={{ field: filters.sort, order: filters.order }}
            showTooltip={true}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No school selected</div>
            <div className="text-gray-400">Please select a school to view transactions</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchoolTransactions