import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchVendorById, clearSelectedVendor, deleteVendor, clearError, clearSuccessMessage } from '../store/vendorSlice';
import { Button, Alert, Badge, Card, Spinner } from '@components/ui';
import { AddressDisplay } from '@components/AddressDisplay';
import styles from './VendorDetail.module.scss';

type TabType = 'overview' | 'comments' | 'transactions' | 'mails' | 'statement';

export default function VendorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedVendor, loading, error, successMessage } = useAppSelector((state) => state.vendors);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedSections, setExpandedSections] = useState<{
    address: boolean;
    otherDetails: boolean;
    taxInfo: boolean;
  }>({
    address: true,
    otherDetails: true,
    taxInfo: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchVendorById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedVendor());
    };
  }, [id, dispatch]);

  const handleEdit = () => {
    navigate(`/vendors/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      if (id) {
        await dispatch(deleteVendor(Number(id))).unwrap();
        navigate('/vendors');
      }
    }
  };

  const handleBack = () => {
    navigate('/vendors');
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

  if (!selectedVendor && !loading) {
    return (
      <div className="p-6">
        <Alert variant="error">Vendor not found</Alert>
      </div>
    );
  }

  if (!selectedVendor) {
    return null;
  }

  return (
    <div className={styles.vendorDetailContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm" onClick={handleBack} className={styles.backButton}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className={styles.vendorName}>{selectedVendor.displayName}</h1>
          <Badge variant={selectedVendor.isActive ? 'success' : 'error'} size="md">
            {selectedVendor.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="md" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="primary" size="md">
            New Transaction
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
          { key: 'comments', label: 'Comments' },
          { key: 'transactions', label: 'Transactions' },
          { key: 'mails', label: 'Mails' },
          { key: 'statement', label: 'Statement' },
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
              {/* Contact Information Card */}
              <Card className={styles.contactCard}>
                <div className={styles.contactHeader}>
                  <div className={styles.avatar}>
                    {selectedVendor.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.contactInfo}>
                    <h3 className={styles.contactName}>
                      {selectedVendor.displayName}
                    </h3>
                    {selectedVendor.email && (
                      <a href={`mailto:${selectedVendor.email}`} className={styles.contactEmail}>
                        {selectedVendor.email}
                      </a>
                    )}
                    {selectedVendor.workPhone && (
                      <div className={styles.contactPhone}>
                        📞 {selectedVendor.workPhone}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Address Section */}
              <Card className={styles.section}>
                <div className={styles.sectionHeader} onClick={() => toggleSection('address')}>
                  <h3 className={styles.sectionTitle}>ADDRESS</h3>
                  <button type="button" className={styles.toggleButton}>
                    {expandedSections.address ? '−' : '+'}
                  </button>
                </div>
                {expandedSections.address && (
                  <div className={styles.sectionContent}>
                    <div className={styles.addressGrid}>
                      <div>
                        <h4 className={styles.addressLabel}>Billing Address</h4>
                        {selectedVendor.billingAddressLine1 ? (
                          <AddressDisplay
                            addressLine1={selectedVendor.billingAddressLine1}
                            addressLine2={selectedVendor.billingAddressLine2}
                            city={selectedVendor.billingCity}
                            stateCode={selectedVendor.billingState}
                            countryCode={selectedVendor.billingCountry}
                            zipCode={selectedVendor.billingZipCode}
                            textClassName={styles.addressText}
                          />
                        ) : (
                          <p className={styles.noData}>
                            No Billing Address -{' '}
                            <button type="button" onClick={handleEdit} className={styles.link}>
                              New Address
                            </button>
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className={styles.addressLabel}>Shipping Address</h4>
                        {selectedVendor.shippingAddressLine1 ? (
                          <AddressDisplay
                            addressLine1={selectedVendor.shippingAddressLine1}
                            addressLine2={selectedVendor.shippingAddressLine2}
                            city={selectedVendor.shippingCity}
                            stateCode={selectedVendor.shippingState}
                            countryCode={selectedVendor.shippingCountry}
                            zipCode={selectedVendor.shippingZipCode}
                            textClassName={styles.addressText}
                          />
                        ) : (
                          <p className={styles.noData}>
                            No Shipping Address -{' '}
                            <button type="button" onClick={handleEdit} className={styles.link}>
                              New Address
                            </button>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Other Details Section */}
              <Card className={styles.section}>
                <div className={styles.sectionHeader} onClick={() => toggleSection('otherDetails')}>
                  <h3 className={styles.sectionTitle}>OTHER DETAILS</h3>
                  <button type="button" className={styles.toggleButton}>
                    {expandedSections.otherDetails ? '−' : '+'}
                  </button>
                </div>
                {expandedSections.otherDetails && (
                  <div className={styles.sectionContent}>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Default Currency</span>
                        <span className={styles.detailValue}>{selectedVendor.currency || 'INR'}</span>
                      </div>
                      {selectedVendor.gstTreatment && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>GST Treatment</span>
                          <span className={styles.detailValue}>{selectedVendor.gstTreatment}</span>
                        </div>
                      )}
                      {selectedVendor.gstin && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>GSTIN</span>
                          <span className={styles.detailValue}>{selectedVendor.gstin}</span>
                        </div>
                      )}
                      {selectedVendor.sourceOfSupply && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Source of Supply</span>
                          <span className={styles.detailValue}>{selectedVendor.sourceOfSupply}</span>
                        </div>
                      )}
                      {selectedVendor.pan && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>PAN</span>
                          <span className={styles.detailValue}>{selectedVendor.pan}</span>
                        </div>
                      )}
                      {selectedVendor.isMsmeRegistered !== undefined && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>MSME Registered?</span>
                          <span className={styles.detailValue}>
                            {selectedVendor.isMsmeRegistered ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )}
                      {selectedVendor.paymentTerms && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Payment Terms</span>
                          <span className={styles.detailValue}>{selectedVendor.paymentTerms}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {/* Tax Information Section */}
              {(selectedVendor.gstin || selectedVendor.sourceOfSupply) && (
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
                        {selectedVendor.gstin && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>GSTIN / UIN</span>
                            <span className={styles.detailValue}>
                              {selectedVendor.gstin}{' '}
                              <Badge variant="primary" size="sm">
                                Primary
                              </Badge>
                            </span>
                          </div>
                        )}
                        {selectedVendor.sourceOfSupply && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Source of Supply</span>
                            <span className={styles.detailValue}>{selectedVendor.sourceOfSupply}</span>
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
              {/* Payment Summary */}
              <Card className={styles.paymentCard}>
                <div className={styles.paymentHeader}>
                  <span className={styles.paymentLabel}>Payment due period</span>
                  <span className={styles.paymentTerms}>
                    {selectedVendor.paymentTerms || 'Due on Receipt'}
                  </span>
                </div>
                <h3 className={styles.payablesTitle}>Payables</h3>
                <div className={styles.paymentGrid}>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>CURRENCY</span>
                    <span className={styles.paymentLabel}>OUTSTANDING PAYABLES</span>
                    <span className={styles.paymentLabel}>UNUSED CREDITS</span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentValue}>
                      {selectedVendor.currency || 'INR'}- Indian Rupee
                    </span>
                    <span className={styles.paymentAmount}>₹0.00</span>
                    <span className={styles.paymentAmount}>₹0.00</span>
                  </div>
                </div>
                <button type="button" className={styles.openingBalanceLink}>
                  Enter Opening Balance
                </button>
              </Card>

              {/* What's Next Card */}
              <Card className={styles.whatsNextCard}>
                <h3 className={styles.whatsNextTitle}>✨ WHAT'S NEXT?</h3>
                <p className={styles.whatsNextText}>
                  Create a <button type="button" className={styles.link}>purchase order</button> or{' '}
                  <button type="button" className={styles.link}>record a bill</button> for your vendor purchases.
                </p>
              </Card>

              {/* Remarks */}
              {selectedVendor.remarks && (
                <Card className={styles.remarksCard}>
                  <h3 className={styles.remarksTitle}>Remarks</h3>
                  <p className={styles.remarksText}>{selectedVendor.remarks}</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className={styles.emptyState}>
            <p>Comments feature coming soon...</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className={styles.emptyState}>
            <p>Transactions feature coming soon...</p>
          </div>
        )}

        {activeTab === 'mails' && (
          <div className={styles.emptyState}>
            <p>Mails feature coming soon...</p>
          </div>
        )}

        {activeTab === 'statement' && (
          <div className={styles.emptyState}>
            <p>Statement feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
