import React, { useState } from 'react'
import { paymentAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const CreatePayment = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    callback_url: 'https://google.com',
    student_info: {
      name: '',
      id: '',
      email: '',
    },
    trustee_id: '65b0e552dd31950a9b41c5ba',
  })
  const [paymentResult, setPaymentResult] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('student_info.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        student_info: {
          ...prev.student_info,
          [field]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPaymentResult(null)

    try {
      const response = await paymentAPI.createPayment(formData)
      setPaymentResult(response.data)
      toast.success('Payment request created successfully!')
    } catch (error) {
      console.error('Error creating payment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create payment request'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRedirect = () => {
    if (paymentResult?.Collect_request_url) {
      window.open(paymentResult.Collect_request_url, '_blank')
    }
  }

  const handleReset = () => {
    setFormData({
      amount: '',
      callback_url: 'https://google.com',
      student_info: {
        name: '',
        id: '',
        email: '',
      },
      trustee_id: '65b0e552dd31950a9b41c5ba',
    })
    setPaymentResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Payment Request</h1>
        <p className="mt-2 text-gray-600">
          Generate a payment request for student fee collection
        </p>
      </div>

      {!paymentResult ? (
        /* Payment Form */
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Payment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (INR) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="1"
                    step="0.01"
                    className="form-input"
                    placeholder="Enter amount (e.g., 1000)"
                    value={formData.amount}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="trustee_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Trustee ID *
                  </label>
                  <input
                    type="text"
                    id="trustee_id"
                    name="trustee_id"
                    required
                    className="form-input"
                    value={formData.trustee_id}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="callback_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Callback URL *
                </label>
                <input
                  type="url"
                  id="callback_url"
                  name="callback_url"
                  required
                  className="form-input"
                  placeholder="https://your-callback-url.com"
                  value={formData.callback_url}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL where users will be redirected after payment completion
                </p>
              </div>
            </div>

            {/* Student Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Student Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="student_name"
                    name="student_info.name"
                    required
                    className="form-input"
                    placeholder="Enter student's full name"
                    value={formData.student_info.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    id="student_id"
                    name="student_info.id"
                    required
                    className="form-input"
                    placeholder="Enter student ID (e.g., STU001)"
                    value={formData.student_info.id}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="student_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email *
                </label>
                <input
                  type="email"
                  id="student_email"
                  name="student_info.email"
                  required
                  className="form-input"
                  placeholder="student@example.com"
                  value={formData.student_info.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 flex-1 justify-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : <span>💳</span>}
                <span>{loading ? 'Creating Payment Request...' : 'Create Payment Request'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Payment Result */
        <div className="space-y-6">
          {/* Success Message */}
          <div className="card p-6 border-l-4 border-success-500 bg-success-50">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">✅</span>
              <h2 className="text-xl font-semibold text-success-900">
                Payment Request Created Successfully!
              </h2>
            </div>
            <p className="text-success-700">
              Your payment request has been generated. Use the details below to complete the payment.
            </p>
          </div>

          {/* Payment Details */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Collect Request ID</div>
                <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded mt-1">
                  {paymentResult.collect_request_id}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Order ID</div>
                <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded mt-1">
                  {paymentResult.order_id}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-gray-500">Payment URL</div>
                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1 break-all">
                  {paymentResult.Collect_request_url}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRedirect}
              className="btn-success flex items-center justify-center space-x-2 flex-1"
            >
              <span>🌐</span>
              <span>Proceed to Payment</span>
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(paymentResult.Collect_request_url)
                toast.success('Payment URL copied to clipboard!')
              }}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <span>📋</span>
              <span>Copy Payment URL</span>
            </button>
            
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <span>🔄</span>
              <span>Create Another Payment</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. Click "Proceed to Payment" to redirect to the payment gateway
              </p>
              <p>
                2. Complete the payment using your preferred payment method
              </p>
              <p>
                3. You will be redirected to the callback URL after payment completion
              </p>
              <p>
                4. Use the "Transaction Status Check" feature to verify payment status
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="card p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            • Ensure all student information is accurate before creating the payment request
          </p>
          <p>
            • The callback URL should be accessible and handle payment confirmations
          </p>
          <p>
            • Payment amounts are in Indian Rupees (INR)
          </p>
          <p>
            • Keep the Collect Request ID safe for future reference and status checks
          </p>
          <p>
            • The system uses a fixed School ID: 65b0e6293e9f76a9694d84b4
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreatePayment