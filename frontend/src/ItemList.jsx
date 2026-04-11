import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("http://localhost:5174/api/items");
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary">Loading items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-primary">All Items ∨</h2>
        </div>
        <Link 
          to="/add"
          className="btn-theme-primary px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-lg border border-theme-light p-16 text-center">
          <div className="text-muted mb-5">
            <svg className="w-20 h-20 mx-auto text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-3">No items found</h3>
          <p className="text-secondary mb-8 text-base">Get started by creating your first item</p>
          <Link 
            to="/add"
            className="btn-theme-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create New Item
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-lg border border-theme-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light">
              <thead className="bg-gradient-to-r from-theme-lightest to-accent-mist">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <input type="checkbox" className="rounded-md border-theme-medium text-accent-blue focus:ring-accent-cyan" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    PURCHASE DESCRIPTION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    PURCHASE RATE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                    RATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                    STOCK ON HAND
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                    HSN
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border-light">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-hover transition">
                    <td className="px-2 py-4">
                      <input type="checkbox" className="rounded border-theme-medium text-theme-medium focus:ring-accent-blue" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-hover rounded flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-theme-medium hover:text-accent-blue cursor-pointer">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted">{item.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {item.purchaseDescription || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {item.costPrice ? `₹${parseFloat(item.costPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {item.salesDescription || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {item.sellingPrice ? `₹${parseFloat(item.sellingPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary text-center">
                      {item.trackInventory ? '0' : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{item.hsn || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-hover px-6 py-3 flex items-center justify-between border-t border-theme-light">
            <div className="text-sm text-secondary">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{items.length}</span> of{' '}
              <span className="font-medium">{items.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-theme-medium rounded text-sm text-secondary hover:bg-hover disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-theme-medium rounded text-sm text-secondary hover:bg-hover disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
