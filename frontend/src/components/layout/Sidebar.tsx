import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  hasSubmenu?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  isActive: (path: string) => boolean;
  expandedItems: Record<string, boolean>;
}

// NavItem component - extracted outside to avoid re-creation on each render
function NavItem({ to, icon, label, hasSubmenu, onClick, children, isActive, expandedItems }: NavItemProps) {
  const active = isActive(to);
  const isExpanded = expandedItems[label.toLowerCase()];

  return (
    <div className="mb-1">
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-300 ease-in-out rounded-lg mx-2 ${
          active
            ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-sidebar-text font-semibold shadow-lg'
            : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg transition-transform duration-300">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        {hasSubmenu && (
          <svg
            className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>
      {children}
    </div>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ 
    items: true,
    purchases: true,
  });

  const toggleExpand = (section: string) => {
    setExpandedItems((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-sidebar-bg min-h-screen flex flex-col shadow-2xl border-r border-sidebar">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-sidebar">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-accent-cyan to-accent-blue p-3 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <svg className="w-6 h-6 text-sidebar-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <span className="text-sidebar-text font-bold text-xl tracking-tight block">Books</span>
            <span className="text-sidebar-muted text-xs">Pro Edition</span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <NavItem to="/home" icon="🏠" label="Home" isActive={isActive} expandedItems={expandedItems} />

        {/* Items Section */}
        <NavItem
          to="/"
          icon="📦"
          label="Items"
          hasSubmenu
          onClick={(e) => {
            e.preventDefault();
            toggleExpand('items');
          }}
          isActive={isActive}
          expandedItems={expandedItems}
        />
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedItems.items ? 'max-h-32 opacity-100 mb-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="ml-2 mr-2 mt-1 bg-sidebar-hover bg-opacity-30 rounded-lg">
            <Link
              to="/"
              className={`flex items-center px-6 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                isActive('/')
                  ? 'text-accent-cyan font-semibold bg-sidebar-hover bg-opacity-50'
                  : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover hover:bg-opacity-50'
              }`}
            >
              <span className="ml-6">Items</span>
            </Link>
            <Link
              to="/add"
              className={`flex items-center px-6 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                isActive('/add')
                  ? 'text-accent-cyan font-semibold bg-sidebar-hover bg-opacity-50'
                  : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover hover:bg-opacity-50'
              }`}
            >
              <span className="ml-6">New Item</span>
            </Link>
          </div>
        </div>

        <NavItem to="/inventory" icon="📊" label="Inventory" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/sales" icon="💰" label="Sales" isActive={isActive} expandedItems={expandedItems} />

        {/* Purchases Section with Vendors */}
        <NavItem
          to="/purchases"
          icon="🛒"
          label="Purchases"
          hasSubmenu
          onClick={(e) => {
            e.preventDefault();
            toggleExpand('purchases');
          }}
          isActive={isActive}
          expandedItems={expandedItems}
        />
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedItems.purchases ? 'max-h-32 opacity-100 mb-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="ml-2 mr-2 mt-1 bg-sidebar-hover bg-opacity-30 rounded-lg">
            <div className="flex items-center justify-between group">
              <Link
                to="/vendors"
                className={`flex-1 flex items-center px-6 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                  isActive('/vendors') || location.pathname.startsWith('/vendors')
                    ? 'text-accent-cyan font-semibold bg-sidebar-hover bg-opacity-50'
                    : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover hover:bg-opacity-50'
                }`}
              >
                <span className="ml-6">Vendors</span>
              </Link>
              <button
                onClick={() => navigate('/vendors/new')}
                className="mr-2 p-1.5 rounded-md hover:bg-accent-blue hover:bg-opacity-30 transition-all duration-200"
                title="Add New Vendor"
              >
                <svg className="w-3.5 h-3.5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <NavItem to="/time-tracking" icon="⏱️" label="Time Tracking" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/banking" icon="🏦" label="Banking" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/compliance" icon="📋" label="Filing & Compliance" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/accountant" icon="👤" label="Accountant" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/reports" icon="📈" label="Reports" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/documents" icon="📄" label="Documents" isActive={isActive} expandedItems={expandedItems} />

        {/* Apps Section */}
        <div className="mt-6 px-4">
          <div className="text-xs text-sidebar-muted font-semibold mb-3 uppercase tracking-wider">Apps</div>
          <NavItem to="/payroll" icon="💵" label="Zoho Payroll" isActive={isActive} expandedItems={expandedItems} />
          <NavItem to="/payments" icon="💳" label="Zoho Payments" isActive={isActive} expandedItems={expandedItems} />
        </div>
      </nav>

      {/* Configure Features */}
      <div className="border-t border-sidebar p-4">
        <button className="text-sm text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover rounded-xl px-4 py-3 transition-all duration-300 ease-in-out flex items-center gap-3 w-full group">
          <span className="text-lg transition-transform duration-300 group-hover:rotate-90">⚙️</span>
          <span className="font-medium">Configure Features</span>
          <span className="ml-auto text-xs transition-transform duration-300 group-hover:translate-x-1">›</span>
        </button>
      </div>
    </div>
  );
}
