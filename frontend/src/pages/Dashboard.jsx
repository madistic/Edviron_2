import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { transactionAPI } from "../services/api";
import TransactionTable from "../components/TransactionTable";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    school_id: searchParams.get("school_id") || "",
    gateway: searchParams.get("gateway") || "",
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 10,
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
  });

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "success", label: "Success" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  const gatewayOptions = [
    { value: "", label: "All Gateways" },
    { value: "Cashfree", label: "Cashfree" },
    { value: "Razorpay", label: "Razorpay" },
    { value: "PayU", label: "PayU" },
  ];

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchTransactions = async () => {
    try {
      console.log("Filters applied:", filters); // Debugging the filters
      setLoading(true);
      const response = await transactionAPI.getTransactions(filters);
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSort = (field, order) => {
    setFilters((prev) => ({
      ...prev,
      sort: field,
      order,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      school_id: "",
      gateway: "",
      page: 1,
      limit: 10,
      sort: "createdAt",
      order: "desc",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Transaction Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Monitor and manage all payment transactions
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gateway Filter
            </label>
            <select
              className="form-select"
              value={filters.gateway}
              onChange={(e) => handleFilterChange("gateway", e.target.value)}
            >
              {gatewayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School ID
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter school ID"
              value={filters.school_id}
              onChange={(e) => handleFilterChange("school_id", e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per Page
            </label>
            <select
              className="form-select"
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange("limit", parseInt(e.target.value))
              }
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={fetchTransactions}
              className="btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : <span>🔍</span>}
              <span>Search</span>
            </button>
            <button onClick={resetFilters} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {!loading && pagination && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">
              Total Transactions
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {pagination.total}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">
              Current Page
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {pagination.page}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">Total Pages</div>
            <div className="text-2xl font-bold text-gray-900">
              {pagination.totalPages}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-500">
              Results Shown
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {transactions.length}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Transactions
          </h2>
          <p className="text-sm text-gray-600">
            Hover over rows to see additional transaction details
          </p>
        </div>

        <TransactionTable
          transactions={transactions}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          currentSort={{ field: filters.sort, order: filters.order }}
          showTooltip={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
