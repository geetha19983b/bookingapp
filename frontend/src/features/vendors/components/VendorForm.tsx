import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import styles from './VendorForm.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  createVendor,
  updateVendor,
  fetchVendorById,
  clearSelectedVendor,
  clearError,
  clearSuccessMessage,
} from '../store/vendorSlice';
import { Input, TextArea, Button, Alert } from '@components/ui';
import type { VendorFormData } from '../types/vendor.types';

const initialFormState: VendorFormData = {
  displayName: '',
  companyName: '',
  email: '',
  workPhone: '',
  mobilePhone: '',
  billingAddressLine1: '',
  billingAddressLine2: '',
  billingCity: '',
  billingState: '',
  billingCountry: '',
  billingZipCode: '',
  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCity: '',
  shippingState: '',
  shippingCountry: '',
  shippingZipCode: '',
  gstTreatment: '',
  gstin: '',
  sourceOfSupply: '',
  pan: '',
  isMsmeRegistered: false,
  currency: 'INR',
  openingBalance: 0,
  paymentTerms: '',
  bankName: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  bankBranch: '',
  remarks: '',
  isActive: true,
};

export default function VendorForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedVendor, loading, error, successMessage } = useAppSelector((state) => state.vendors);

  const [formData, setFormData] = useState<VendorFormData>(initialFormState);
  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'tax' | 'bank'>('basic');
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchVendorById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedVendor());
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (selectedVendor && isEditMode) {
      setFormData({
        displayName: selectedVendor.displayName || '',
        companyName: selectedVendor.companyName || '',
        email: selectedVendor.email || '',
        workPhone: selectedVendor.workPhone || '',
        mobilePhone: selectedVendor.mobilePhone || '',
        billingAddressLine1: selectedVendor.billingAddressLine1 || '',
        billingAddressLine2: selectedVendor.billingAddressLine2 || '',
        billingCity: selectedVendor.billingCity || '',
        billingState: selectedVendor.billingState || '',
        billingCountry: selectedVendor.billingCountry || '',
        billingZipCode: selectedVendor.billingZipCode || '',
        shippingAddressLine1: selectedVendor.shippingAddressLine1 || '',
        shippingAddressLine2: selectedVendor.shippingAddressLine2 || '',
        shippingCity: selectedVendor.shippingCity || '',
        shippingState: selectedVendor.shippingState || '',
        shippingCountry: selectedVendor.shippingCountry || '',
        shippingZipCode: selectedVendor.shippingZipCode || '',
        gstTreatment: selectedVendor.gstTreatment || '',
        gstin: selectedVendor.gstin || '',
        sourceOfSupply: selectedVendor.sourceOfSupply || '',
        pan: selectedVendor.pan || '',
        isMsmeRegistered: selectedVendor.isMsmeRegistered || false,
        currency: selectedVendor.currency || 'INR',
        openingBalance: selectedVendor.openingBalance || 0,
        paymentTerms: selectedVendor.paymentTerms || '',
        bankName: selectedVendor.bankName || '',
        bankAccountNumber: selectedVendor.bankAccountNumber || '',
        bankIfscCode: selectedVendor.bankIfscCode || '',
        bankBranch: selectedVendor.bankBranch || '',
        remarks: selectedVendor.remarks || '',
        isActive: selectedVendor.isActive ?? true,
      });
    }
  }, [selectedVendor, isEditMode]);

  useEffect(() => {
    if (successMessage && !loading) {
      const timer = setTimeout(() => {
        navigate('/vendors');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, loading, navigate]);

  useEffect(() => {
    if (copyBillingToShipping) {
      setFormData((prev) => ({
        ...prev,
        shippingAddressLine1: prev.billingAddressLine1,
        shippingAddressLine2: prev.billingAddressLine2,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingCountry: prev.billingCountry,
        shippingZipCode: prev.billingZipCode,
      }));
    }
  }, [copyBillingToShipping]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? null : value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && id) {
        await dispatch(updateVendor({ id: Number(id), payload: formData })).unwrap();
      } else {
        await dispatch(createVendor(formData)).unwrap();
      }
    } catch (err) {
      // Error is handled in Redux slice
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  return (
    <div style={{ padding: '1.5rem', maxHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div className={styles.headerContainer}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            title="Back to vendors"
            className={styles.backButton}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
            {isEditMode ? 'Edit Vendor' : 'New Vendor'}
          </h2>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{ marginBottom: '1rem' }}>
          <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </Alert>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <Alert variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
        <div className={styles.formBody + " rounded-2xl shadow-lg border border-theme-light overflow-hidden flex flex-col"} style={{ maxHeight: '100%' }}>
          {/* Tabs */}
          <div className={styles.formHeaderTabs}>
            {[
              { key: 'basic', label: 'Basic Details' },
              { key: 'address', label: 'Address' },
              { key: 'tax', label: 'Tax & Compliance' },
              { key: 'bank', label: 'Bank Details' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={
                  styles.formTabButton +
                  (activeTab === tab.key ? ' ' + styles.active : '')
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Basic Details Tab */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  maxLength={255}
                />

                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  maxLength={255}
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  maxLength={255}
                />

                <Input
                  label="Work Phone"
                  type="tel"
                  name="workPhone"
                  value={formData.workPhone || ''}
                  onChange={handleChange}
                  maxLength={20}
                />

                <Input
                  label="Mobile Phone"
                  type="tel"
                  name="mobilePhone"
                  value={formData.mobilePhone || ''}
                  onChange={handleChange}
                  maxLength={20}
                />

                <Input
                  label="Currency"
                  name="currency"
                  value={formData.currency || ''}
                  onChange={handleChange}
                  placeholder="INR (default)"
                  maxLength={3}
                  style={{ textTransform: 'uppercase' }}
                />

                <Input
                  label="Opening Balance"
                  type="number"
                  name="openingBalance"
                  value={formData.openingBalance}
                  onChange={handleChange}
                  step="0.01"
                />

                <Input
                  label="Payment Terms"
                  name="paymentTerms"
                  value={formData.paymentTerms || ''}
                  onChange={handleChange}
                  placeholder="Due on Receipt (default)"
                  maxLength={100}
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks || ''}
                    onChange={handleChange}
                    rows={3}
                    resize="none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="rounded border-theme-medium text-accent-blue focus:ring-accent-cyan mr-2"
                  />
                  <label className="text-sm font-medium text-primary">Active</label>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-8">
                {/* Billing Address */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 1"
                        name="billingAddressLine1"
                        value={formData.billingAddressLine1 || ''}
                        onChange={handleChange}
                        maxLength={255}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 2"
                        name="billingAddressLine2"
                        value={formData.billingAddressLine2 || ''}
                        onChange={handleChange}
                        maxLength={255}
                      />
                    </div>

                    <Input
                      label="City"
                      name="billingCity"
                      value={formData.billingCity || ''}
                      onChange={handleChange}
                      maxLength={100}
                    />

                    <Input
                      label="State"
                      name="billingState"
                      value={formData.billingState || ''}
                      onChange={handleChange}
                      maxLength={100}
                    />

                    <Input
                      label="Country"
                      name="billingCountry"
                      value={formData.billingCountry || ''}
                      onChange={handleChange}
                      maxLength={100}
                    />

                    <Input
                      label="Zip Code"
                      name="billingZipCode"
                      value={formData.billingZipCode || ''}
                      onChange={handleChange}
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Copy to Shipping */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={copyBillingToShipping}
                    onChange={(e) => setCopyBillingToShipping(e.target.checked)}
                    className="rounded border-theme-medium text-accent-blue focus:ring-accent-cyan mr-2"
                  />
                  <label className="text-sm font-medium text-primary">Copy billing address to shipping</label>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 1"
                        name="shippingAddressLine1"
                        value={formData.shippingAddressLine1 || ''}
                        onChange={handleChange}
                        maxLength={255}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 2"
                        name="shippingAddressLine2"
                        value={formData.shippingAddressLine2 || ''}
                        onChange={handleChange}
                        maxLength={255}
                      />
                    </div>

                    <Input
                      label="City"
                      name="shippingCity"
                      value={formData.shippingCity || ''}
                      onChange={handleChange}
                      maxLength={100}
                    />

                    <Input
                      label="State"
                      name="shippingState"
                      value={formData.shippingState || ''}
                      onChange={handleChange}
                      maxLength={100}
                    />

                    <Input
                      label="Country"
                      name="shippingCountry"
                      value={formData.shippingCountry || ''}
                      onChange={handleChange}
                      maxLength={100}
                    />

                    <Input
                      label="Zip Code"
                      name="shippingZipCode"
                      value={formData.shippingZipCode || ''}
                      onChange={handleChange}
                      maxLength={20}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tax & Compliance Tab */}
            {activeTab === 'tax' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="GST Treatment"
                  name="gstTreatment"
                  value={formData.gstTreatment || ''}
                  onChange={handleChange}
                  maxLength={100}
                />

                <Input
                  label="GSTIN"
                  name="gstin"
                  value={formData.gstin || ''}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  style={{ textTransform: 'uppercase' }}
                />

                <Input
                  label="Source of Supply"
                  name="sourceOfSupply"
                  value={formData.sourceOfSupply || ''}
                  onChange={handleChange}
                  maxLength={100}
                />

                <Input
                  label="PAN"
                  name="pan"
                  value={formData.pan || ''}
                  onChange={handleChange}
                  placeholder="AAAAA0000A"
                  maxLength={10}
                  style={{ textTransform: 'uppercase' }}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isMsmeRegistered"
                    checked={formData.isMsmeRegistered}
                    onChange={handleChange}
                    className="rounded border-theme-medium text-accent-blue focus:ring-accent-cyan mr-2"
                  />
                  <label className="text-sm font-medium text-primary">MSME Registered</label>
                </div>
              </div>
            )}

            {/* Bank Details Tab */}
            {activeTab === 'bank' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName || ''}
                    onChange={handleChange}
                    maxLength={255}
                  />
                </div>

                <Input
                  label="Account Number"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber || ''}
                  onChange={handleChange}
                  maxLength={50}
                />

                <Input
                  label="IFSC Code"
                  name="bankIfscCode"
                  value={formData.bankIfscCode || ''}
                  onChange={handleChange}
                  placeholder="ABCD0123456"
                  maxLength={11}
                  style={{ textTransform: 'uppercase' }}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Branch"
                    name="bankBranch"
                    value={formData.bankBranch || ''}
                    onChange={handleChange}
                    maxLength={255}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.formFooter}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              {isEditMode ? 'Update Vendor' : 'Create Vendor'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
