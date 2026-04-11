import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// NavItem component - extracted outside to avoid re-creation on each render
function NavItem({ to, icon, label, hasSubmenu, onClick, children, isActive, expandedItems }) {
  const active = isActive(to);
  
  return (
    <div>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
          active 
            ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold shadow-lg transform scale-[1.02]' 
            : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </div>
        {hasSubmenu && (
          <span className="text-xs">{expandedItems[label.toLowerCase()] ? '▼' : '▶'}</span>
        )}
      </Link>
      {children}
    </div>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({ items: true });

  const toggleExpand = (section) => {
    setExpandedItems(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-sidebar min-h-screen flex flex-col shadow-2xl border-r border-sidebar-border">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-sidebar">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-accent-cyan to-accent-blue p-3 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight block">Books</span>
            <span className="text-sidebar-muted text-xs">Pro Edition</span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <NavItem to="/home" icon="🏠" label="Home" isActive={isActive} expandedItems={expandedItems} />
        
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
        {expandedItems.items && (
          <div className="ml-2 mr-2 mb-2 bg-sidebar-hover bg-opacity-40 rounded-lg overflow-hidden">
            <Link 
              to="/" 
              className={`flex items-center px-6 py-2.5 text-sm transition-colors rounded-lg ${
                isActive('/') ? 'text-accent-cyan font-semibold bg-sidebar-hover' : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover'
              }`}
            >
              <span className="ml-6">Items</span>
            </Link>
            <Link 
              to="/add" 
              className={`flex items-center px-6 py-2.5 text-sm transition-colors rounded-lg ${
                isActive('/add') ? 'text-accent-cyan font-semibold bg-sidebar-hover' : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover'
              }`}
            >
              <span className="ml-6">New Item</span>
            </Link>
          </div>
        )}

        <NavItem to="/inventory" icon="📊" label="Inventory" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/sales" icon="💰" label="Sales" isActive={isActive} expandedItems={expandedItems} />
        <NavItem to="/purchases" icon="🛒" label="Purchases" isActive={isActive} expandedItems={expandedItems} />
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
        <button className="text-sm text-sidebar-muted hover:text-white hover:bg-sidebar-hover rounded-xl px-4 py-3 transition-all flex items-center gap-3 w-full group">
          <span className="text-lg">⚙️</span>
          <span>Configure Features</span>
          <span className="ml-auto text-xs transition-transform group-hover:translate-x-1">›</span>
        </button>
      </div>
    </div>
  );
}
