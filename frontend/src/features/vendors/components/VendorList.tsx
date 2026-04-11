import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchVendors, deleteVendor, clearSuccessMessage, clearError } from '../store/vendorSlice';
import type { Vendor } from '../types/vendor.types';

export default function VendorList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { vendors, loading, error, successMessage } = useAppSelector((state) => state.vendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = (vendorId: number) => {
    navigate(`/vendors/edit/${vendorId}`);
  };

  const handleDelete = async (vendorId: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      await dispatch(deleteVendor(vendorId));
    }
  };

  const toggleVendorSelection = (vendorId: number) => {
    const newSelection = new Set(selectedVendors);
    if (newSelection.has(vendorId)) {
      newSelection.delete(vendorId);
    } else {
      newSelection.add(vendorId);
    }
    setSelectedVendors(newSelection);
  };

  const toggleAllVendors = () => {
    if (selectedVendors.size === filteredVendors.length) {
      setSelectedVendors(new Set());
    } else {
      setSelectedVendors(new Set(filteredVendors.map((v) => v.id)));
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const query = searchQuery.toLowerCase();
    return (
      vendor.display_name?.toLowerCase().includes(query) ||
      vendor.company_name?.toLowerCase().includes(query) ||
      vendor.email?.toLowerCase().includes(query) ||
      vendor.source_of_supply?.toLowerCase().includes(query)
    );
  });

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-success bg-opacity-10 border border-success text-success px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-primary">Active Vendors</h2>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md flex-1 mx-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-accent-light transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search in Vendors ( / )"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-2.5 border border-sidebar rounded-xl leading-5 bg-sidebar-hover bg-opacity-50 text-navbar-text placeholder-sidebar-muted focus:outline-none focus:placeholder-accent-light focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-lg border border-theme-light p-16 text-center">
          <div className="text-muted mb-5">
            <svg
              className="w-20 h-20 mx-auto text-accent-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-3">
            {searchQuery ? 'No vendors found' : 'No vendors yet'}
          </h3>
          <p className="text-secondary mb-8 text-base">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Get started by creating your first vendor'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/vendors/new')}
              className="btn-theme-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create New Vendor
            </button>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-lg border border-theme-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light">
              <thead className="bg-gradient-to-r from-theme-lightest to-accent-mist">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVendors.size === filteredVendors.length && filteredVendors.length > 0}
                      onChange={toggleAllVendors}
                      className="rounded-md border-theme-medium text-accent-blue focus:ring-accent-cyan"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    COMPANY NAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    WORK PHONE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    SOURCE OF SUPPLY
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    PAYABLES (BCY)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    UNUSED CREDITS (BCY)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-secondary uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border-light">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-hover transition">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVendors.has(vendor.id)}
                        onChange={() => toggleVendorSelection(vendor.id)}
                        className="rounded border-theme-medium text-theme-medium focus:ring-accent-blue"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(vendor.id)}
                        className="text-sm font-medium text-theme-medium hover:text-accent-blue cursor-pointer transition"
                      >
                        {vendor.display_name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {vendor.company_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">{vendor.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {vendor.work_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {vendor.source_of_supply || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">₹0.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">₹0.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(vendor.id)}
                          className="text-accent-blue hover:text-accent-cyan p-1.5 rounded transition"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="text-error hover:text-red-700 p-1.5 rounded transition"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
