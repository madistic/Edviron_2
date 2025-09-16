import React, { useState } from 'react'
import { transactionAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const StatusCheck = () => {
  const [customOrderId, setCustomOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [error, setError] = useState('')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return format(new Date(date), 'PPpp')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customOrderId.trim()) {
      setError('Please enter a custom order ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      setTransactionData(null)
      
      const response = await transactionAPI.getTransactionStatus(customOrderId.trim())
      setTransactionData(response.data)
      
      if (!response.data) {
        setError('Transaction not found')
      }
    } catch (error) {
      console.error('Error checking transaction status:', error)
      if (error.response?.status === 404) {
        setError('Transaction not found with the provided ID')
      } else {
        setError('Failed to check transaction status. Please try again.')
      }
      toast.error('Failed to check transaction status')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCustomOrderId('')
    setTransactionData(null)
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Status Check</h1>
        <p className="mt-2 text-gray-600">
          Check the current status of any transaction using its order ID
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customOrderId" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Order ID
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                id="customOrderId"
                className="form-input flex-1"
                placeholder="Enter transaction/order ID (e.g., 64a1b2c3d4e5f6789012345a)"
                value={customOrderId}
                onChange={(e) => setCustomOrderId(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !customOrderId.trim()}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <span>🔍</span>}
                <span>Check Status</span>
              </button>
              {(transactionData || error) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  Clear
                </button>
              )}
            </div>
            {error && (
              <p className="mt-2 text-sm text-error-600">{error}</p>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {transactionData && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Transaction Status</h2>
              <StatusBadge status={transactionData.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Order ID</div>
                <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {transactionData.collect_id}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Order Amount</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(transactionData.order_amount)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Transaction Amount</div>
                <div className="text-lg font-bold text-success-600">
                  {formatCurrency(transactionData.transaction_amount)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Payment Mode</div>
                <div className="text-sm text-gray-900">
                  {transactionData.payment_mode || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Gateway</div>
                  <div className="text-sm text-gray-900">{transactionData.gateway || 'N/A'}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Bank Reference</div>
                  <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                    {transactionData.bank_reference || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Payment Time</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(transactionData.payment_time)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Payment Details</div>
                  <div className="text-sm text-gray-900">
                    {transactionData.payment_details || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Student Name</div>
                  <div className="text-sm text-gray-900">
                    {transactionData.student_info?.name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Student ID</div>
                  <div className="text-sm font-mono text-gray-900">
                    {transactionData.student_info?.id || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Student Email</div>
                  <div className="text-sm text-gray-900">
                    {transactionData.student_info?.email || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">School ID</div>
                  <div className="text-sm font-mono text-gray-900">
                    {transactionData.school_id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages and Errors */}
          {(transactionData.payment_message || transactionData.error_message) && (
            <div className="space-y-4">
              {transactionData.payment_message && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Message</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-700">{transactionData.payment_message}</div>
                  </div>
                </div>
              )}
              
              {transactionData.error_message && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Message</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-700">{transactionData.error_message}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="card p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to use</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            • Enter the Custom Order ID (same as collect_id) that you received when creating a payment
          </p>
          <p>
            • The system will fetch the latest status and details for that transaction
          </p>
          <p>
            • Status can be: <span className="status-success">Success</span>, 
            <span className="status-pending ml-1">Pending</span>, or 
            <span className="status-failed ml-1">Failed</span>
          </p>
          <p>
            • For pending transactions, check back later or contact support if the issue persists
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatusCheck