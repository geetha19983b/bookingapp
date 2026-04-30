import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchItemById, clearSelectedItem, deleteItem, clearError, clearSuccessMessage } from '../store/itemSlice';
import { Button, Alert, Badge, Card, Spinner } from '@components/ui';
import styles from './ItemDetail.module.scss';

type TabType = 'overview' | 'transactions' | 'history';

export default function ItemDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedItem, loading, error, successMessage } = useAppSelector((state) => state.items);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedSections, setExpandedSections] = useState<{
    salesInfo: boolean;
    purchaseInfo: boolean;
    taxInfo: boolean;
    inventoryInfo: boolean;
  }>({
    salesInfo: true,
    purchaseInfo: true,
    taxInfo: true,
    inventoryInfo: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedItem());
    };
  }, [id, dispatch]);

  const handleEdit = () => {
    navigate(`/items/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (id) {
        await dispatch(deleteItem(Number(id))).unwrap();
        navigate('/items');
      }
    }
  };

  const handleBack = () => {
    navigate('/items');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedItem && !loading) {
    return (
      <div className="p-6">
        <Alert variant="error">Item not found</Alert>
      </div>
    );
  }

  if (!selectedItem) {
    return null;
  }

  return (
    <div className={styles.itemDetailContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm" onClick={handleBack} className={styles.backButton}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className={styles.itemName}>{selectedItem.name}</h1>
          <Badge variant={selectedItem.isActive ? 'success' : 'error'} size="md">
            {selectedItem.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant={selectedItem.itemType === 'goods' ? 'primary' : 'info'} size="md">
            {selectedItem.itemType === 'goods' ? 'Goods' : 'Service'}
          </Badge>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="md" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="danger" size="md" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className={styles.alertContainer}>
          <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </Alert>
        </div>
      )}
      {error && (
        <div className={styles.alertContainer}>
          <Alert variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'transactions', label: 'Transactions' },
          { key: 'history', label: 'History' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Basic Information Card */}
              <Card className={styles.basicInfoCard}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemIcon}>
                    {selectedItem.imageUrl ? (
                      <img 
                        src={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1').replace('/api/v1', '')}${selectedItem.imageUrl}`} 
                        alt={selectedItem.name} 
                        className={styles.itemImage}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {selectedItem.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{selectedItem.name}</h3>
                    <div className={styles.itemMeta}>
                      <span>Item Type: {selectedItem.itemType === 'goods' ? 'Goods' : 'Service'}</span>
                      {selectedItem.sku && <span className={styles.separator}>•</span>}
                      {selectedItem.sku && <span>SKU: {selectedItem.sku}</span>}
                    </div>
                    <div className={styles.itemMeta}>
                      {selectedItem.unit && <span>Unit: {selectedItem.unit}</span>}
                      {selectedItem.hsnCode && <span className={styles.separator}>•</span>}
                      {selectedItem.hsnCode && <span>HSN: {selectedItem.hsnCode}</span>}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sales Information Section */}
              {selectedItem.isSellable && (
                <Card className={styles.section}>
                  <div className={styles.sectionHeader} onClick={() => toggleSection('salesInfo')}>
                    <h3 className={styles.sectionTitle}>SALES INFORMATION</h3>
                    <button type="button" className={styles.toggleButton}>
                      {expandedSections.salesInfo ? '−' : '+'}
                    </button>
                  </div>
                  {expandedSections.salesInfo && (
                    <div className={styles.sectionContent}>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Selling Price</span>
                          <span className={styles.detailValue}>
                            {selectedItem.sellingPrice !== null && selectedItem.sellingPrice !== undefined
                              ? `₹${Number(selectedItem.sellingPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : '-'}
                          </span>
                        </div>
                        {selectedItem.salesAccount && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Sales Account</span>
                            <span className={styles.detailValue}>{selectedItem.salesAccount}</span>
                          </div>
                        )}
                        {selectedItem.salesDescription && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Description</span>
                            <span className={styles.detailValue}>{selectedItem.salesDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Purchase Information Section */}
              {selectedItem.isPurchasable && (
                <Card className={styles.section}>
                  <div className={styles.sectionHeader} onClick={() => toggleSection('purchaseInfo')}>
                    <h3 className={styles.sectionTitle}>PURCHASE INFORMATION</h3>
                    <button type="button" className={styles.toggleButton}>
                      {expandedSections.purchaseInfo ? '−' : '+'}
                    </button>
                  </div>
                  {expandedSections.purchaseInfo && (
                    <div className={styles.sectionContent}>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Cost Price</span>
                          <span className={styles.detailValue}>
                            {selectedItem.costPrice !== null && selectedItem.costPrice !== undefined
                              ? `₹${Number(selectedItem.costPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : '-'}
                          </span>
                        </div>
                        {selectedItem.purchaseAccount && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Purchase Account</span>
                            <span className={styles.detailValue}>{selectedItem.purchaseAccount}</span>
                          </div>
                        )}
                        {selectedItem.preferredVendor && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Preferred Vendor</span>
                            <span className={styles.detailValue}>{selectedItem.preferredVendor.displayName}</span>
                          </div>
                        )}
                        {selectedItem.purchaseDescription && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Description</span>
                            <span className={styles.detailValue}>{selectedItem.purchaseDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Tax Information Section */}
              {selectedItem.taxPreference === 'taxable' && (
                <Card className={styles.section}>
                  <div className={styles.sectionHeader} onClick={() => toggleSection('taxInfo')}>
                    <h3 className={styles.sectionTitle}>TAX INFORMATION</h3>
                    <button type="button" className={styles.toggleButton}>
                      {expandedSections.taxInfo ? '−' : '+'}
                    </button>
                  </div>
                  {expandedSections.taxInfo && (
                    <div className={styles.sectionContent}>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Tax Preference</span>
                          <span className={styles.detailValue}>
                            {selectedItem.taxPreference === 'taxable' ? 'Taxable' : 'Non-Taxable'}
                          </span>
                        </div>
                        {selectedItem.intraStateTaxRate && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Intra State Tax Rate</span>
                            <span className={styles.detailValue}>
                              {selectedItem.intraStateTaxRate}
                              {selectedItem.intraStateTaxPercentage && ` (${selectedItem.intraStateTaxPercentage}%)`}
                            </span>
                          </div>
                        )}
                        {selectedItem.interStateTaxRate && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Inter State Tax Rate</span>
                            <span className={styles.detailValue}>
                              {selectedItem.interStateTaxRate}
                              {selectedItem.interStateTaxPercentage && ` (${selectedItem.interStateTaxPercentage}%)`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Inventory Information Section */}
              {selectedItem.itemType === 'goods' && selectedItem.trackInventory && (
                <Card className={styles.section}>
                  <div className={styles.sectionHeader} onClick={() => toggleSection('inventoryInfo')}>
                    <h3 className={styles.sectionTitle}>INVENTORY INFORMATION</h3>
                    <button type="button" className={styles.toggleButton}>
                      {expandedSections.inventoryInfo ? '−' : '+'}
                    </button>
                  </div>
                  {expandedSections.inventoryInfo && (
                    <div className={styles.sectionContent}>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Opening Stock</span>
                          <span className={styles.detailValue}>
                            {selectedItem.openingStock !== null && selectedItem.openingStock !== undefined
                              ? `${selectedItem.openingStock} ${selectedItem.unit || ''}`
                              : '-'}
                          </span>
                        </div>
                        {selectedItem.openingStockRate !== null && selectedItem.openingStockRate !== undefined && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Opening Stock Rate</span>
                            <span className={styles.detailValue}>
                              ₹{Number(selectedItem.openingStockRate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                        {selectedItem.reorderLevel !== null && selectedItem.reorderLevel !== undefined && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Reorder Level</span>
                            <span className={styles.detailValue}>
                              {selectedItem.reorderLevel} {selectedItem.unit || ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Stock Summary Card */}
              {selectedItem.itemType === 'goods' && (
                <Card className={styles.stockCard}>
                  <h3 className={styles.stockTitle}>Stock on Hand</h3>
                  <div className={styles.stockValue}>
                    {selectedItem.openingStock || 0} {selectedItem.unit || 'Units'}
                  </div>
                  <div className={styles.stockMeta}>
                    Stock Value: ₹{((selectedItem.openingStock || 0) * (selectedItem.openingStockRate || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </Card>
              )}

              {/* Reporting Tags Card */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <Card className={styles.tagsCard}>
                  <h3 className={styles.tagsTitle}>Reporting Tags</h3>
                  <div className={styles.tagsList}>
                    {selectedItem.tags.map((tag, index) => (
                      <Badge key={index} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className={styles.emptyState}>
            <p>Transactions feature coming soon...</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.emptyState}>
            <p>History feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
