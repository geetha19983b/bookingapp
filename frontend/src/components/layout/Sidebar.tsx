import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';

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
    <div className={styles.navItem}>
      <Link
        to={to}
        onClick={onClick}
        className={`${styles.navLink} ${active ? styles.active : ''}`}
      >
        <div className={styles.navLinkContent}>
          <span className={styles.navIcon}>{icon}</span>
          <span className={styles.navLabel}>{label}</span>
        </div>
        {hasSubmenu && (
          <svg
            className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
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
    items: false,
    purchases: false,
  });

  // Auto-expand the section containing the current active route
  useEffect(() => {
    const path = location.pathname;
    
    // Determine which section should be expanded based on current route
    if (path === '/' || path === '/add') {
      setExpandedItems({ items: true, purchases: false });
    } else if (path.startsWith('/vendors') || path.startsWith('/purchases')) {
      setExpandedItems({ items: false, purchases: true });
    } else {
      // For all other routes (regular nav items), close all expandable sections
      setExpandedItems({ items: false, purchases: false });
    }
  }, [location.pathname]);

  const toggleExpand = (section: string, firstChildPath?: string) => {
    setExpandedItems((prev) => {
      const wasExpanded = prev[section];
      
      // Accordion behavior: close all other sections
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      
      // Toggle the clicked section
      newState[section] = !wasExpanded;
      
      // Schedule navigation after render completes
      if (!wasExpanded && firstChildPath) {
        setTimeout(() => navigate(firstChildPath), 0);
      }
      
      return newState;
    });
  };

  const isActive = (path: string) => location.pathname === path;

  // Check if parent should be highlighted based on active child routes
  const isParentActive = (childPaths: string[]) => {
    return childPaths.some(childPath => 
      location.pathname === childPath || location.pathname.startsWith(childPath + '/')
    );
  };

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.title}>Books</span>
            <span className={styles.subtitle}>Pro Edition</span>
          </div>
        </div>
      </div>

      {/* Navigation Items - Scrollable */}
      <nav className={styles.navContent}>
        <NavItem to="/home" icon="🏠" label="Home" isActive={isActive} expandedItems={expandedItems} />

        {/* Items Section */}
        <NavItem
          to="/"
          icon="📦"
          label="Items"
          hasSubmenu
          onClick={(e) => {
            e.preventDefault();
            toggleExpand('items', '/');
          }}
          isActive={(path) => isActive(path) || isParentActive(['/', '/add'])}
          expandedItems={expandedItems}
        />
        <div className={`${styles.submenuContainer} ${expandedItems.items ? styles.expanded : styles.collapsed}`}>
          <div className={styles.submenuWrapper}>
            <Link
              to="/"
              className={`${styles.submenuItem} ${isActive('/') ? styles.active : ''}`}
            >
              <span className={styles.submenuLabel}>Items</span>
            </Link>
            <Link
              to="/add"
              className={`${styles.submenuItem} ${isActive('/add') ? styles.active : ''}`}
            >
              <span className={styles.submenuLabel}>New Item</span>
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
            toggleExpand('purchases', '/vendors');
          }}
          isActive={(path) => isActive(path) || isParentActive(['/vendors'])}
          expandedItems={expandedItems}
        />
        <div className={`${styles.submenuContainer} ${expandedItems.purchases ? styles.expanded : styles.collapsed}`}>
          <div className={styles.submenuWrapper}>
            <div className={styles.submenuItemWithButton}>
              <Link
                to="/vendors"
                className={`${styles.submenuItem} ${
                  isActive('/vendors') || location.pathname.startsWith('/vendors') ? styles.active : ''
                }`}
              >
                <span className={styles.submenuLabel}>Vendors</span>
              </Link>
              <button
                onClick={() => navigate('/vendors/new')}
                className={styles.addButton}
                title="Add New Vendor"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className={styles.appsSection}>
          <div className={styles.appsSectionTitle}>Apps</div>
          <NavItem to="/payroll" icon="💵" label="Zoho Payroll" isActive={isActive} expandedItems={expandedItems} />
          <NavItem to="/payments" icon="💳" label="Zoho Payments" isActive={isActive} expandedItems={expandedItems} />
        </div>
      </nav>

      {/* Configure Features - Frozen at bottom */}
      <div className={styles.configureSection}>
        <button className={styles.configureButton}>
          <span className={styles.configureIcon}>⚙️</span>
          <span className={styles.configureLabel}>Configure Features</span>
          <span className={styles.configureArrow}>›</span>
        </button>
      </div>
    </div>
  );
}
