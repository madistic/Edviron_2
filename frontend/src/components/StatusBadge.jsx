import React from 'react'

const StatusBadge = ({ status }) => {
  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'status-success'
      case 'pending':
        return 'status-pending'
      case 'failed':
        return 'status-failed'
      default:
        return 'status-badge bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return '✓'
      case 'pending':
        return '⏳'
      case 'failed':
        return '✗'
      default:
        return '?'
    }
  }

  return (
    <span className={getStatusClasses(status)}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {status || 'Unknown'}
    </span>
  )
}

export default StatusBadge