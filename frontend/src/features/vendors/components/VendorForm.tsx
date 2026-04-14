import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
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
import type { VendorFormData } from '../types/vendor.types';

const initialFormState: VendorFormData = {
  display_name: '',
  company_name: '',
  email: '',
  work_phone: '',
  mobile_phone: '',
  billing_address_line1: '',
  billing_address_line2: '',
  billing_city: '',
  billing_state: '',
  billing_country: '',
  billing_zip_code: '',
  shipping_address_line1: '',
  shipping_address_line2: '',
  shipping_city: '',
  shipping_state: '',
  shipping_country: '',
  shipping_zip_code: '',
  gst_treatment: '',
  gstin: '',
  source_of_supply: '',
  pan: '',
  is_msme_registered: false,
  currency: 'INR',
  opening_balance: 0,
  payment_terms: '',
  bank_name: '',
  bank_account_number: '',
  bank_ifsc_code: '',
  bank_branch: '',
  remarks: '',
  is_active: true,
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
        display_name: selectedVendor.display_name || '',
        company_name: selectedVendor.company_name || '',
        email: selectedVendor.email || '',
        work_phone: selectedVendor.work_phone || '',
        mobile_phone: selectedVendor.mobile_phone || '',
        billing_address_line1: selectedVendor.billing_address_line1 || '',
        billing_address_line2: selectedVendor.billing_address_line2 || '',
        billing_city: selectedVendor.billing_city || '',
        billing_state: selectedVendor.billing_state || '',
        billing_country: selectedVendor.billing_country || '',
        billing_zip_code: selectedVendor.billing_zip_code || '',
        shipping_address_line1: selectedVendor.shipping_address_line1 || '',
        shipping_address_line2: selectedVendor.shipping_address_line2 || '',
        shipping_city: selectedVendor.shipping_city || '',
        shipping_state: selectedVendor.shipping_state || '',
        shipping_country: selectedVendor.shipping_country || '',
        shipping_zip_code: selectedVendor.shipping_zip_code || '',
        gst_treatment: selectedVendor.gst_treatment || '',
        gstin: selectedVendor.gstin || '',
        source_of_supply: selectedVendor.source_of_supply || '',
        pan: selectedVendor.pan || '',
        is_msme_registered: selectedVendor.is_msme_registered || false,
        currency: selectedVendor.currency || 'INR',
        opening_balance: selectedVendor.opening_balance || 0,
        payment_terms: selectedVendor.payment_terms || '',
        bank_name: selectedVendor.bank_name || '',
        bank_account_number: selectedVendor.bank_account_number || '',
        bank_ifsc_code: selectedVendor.bank_ifsc_code || '',
        bank_branch: selectedVendor.bank_branch || '',
        remarks: selectedVendor.remarks || '',
        is_active: selectedVendor.is_active ?? true,
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
        shipping_address_line1: prev.billing_address_line1,
        shipping_address_line2: prev.billing_address_line2,
        shipping_city: prev.billing_city,
        shipping_state: prev.billing_state,
        shipping_country: prev.billing_country,
        shipping_zip_code: prev.billing_zip_code,
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleCancel}
            className="text-accent-blue hover:text-accent-cyan transition"
            title="Back to vendors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-primary">
            {isEditMode ? 'Edit Vendor' : 'New Vendor'}
          </h2>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-success bg-opacity-10 border border-success toast-text-white text-success px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-error bg-opacity-10 border border-error toast-text-white text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-2xl shadow-lg border border-theme-light overflow-hidden">
          {/* Tabs */}
          <div className="bg-gradient-to-r from-theme-lightest to-accent-mist border-b border-border-light">
            <div className="flex gap-1 p-2">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-accent-blue text-white shadow-md'
                      : 'text-secondary hover:bg-hover hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Basic Details Tab */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Display Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Work Phone</label>
                  <input
                    type="tel"
                    name="work_phone"
                    value={formData.work_phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Mobile Phone</label>
                  <input
                    type="tel"
                    name="mobile_phone"
                    value={formData.mobile_phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency || ''}
                    onChange={handleChange}
                    placeholder="INR"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Opening Balance</label>
                  <input
                    type="number"
                    name="opening_balance"
                    value={formData.opening_balance}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Payment Terms</label>
                  <input
                    type="text"
                    name="payment_terms"
                    value={formData.payment_terms || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm resize-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
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
                      <label className="block text-sm font-medium text-primary mb-2">Address Line 1</label>
                      <input
                        type="text"
                        name="billing_address_line1"
                        value={formData.billing_address_line1 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-primary mb-2">Address Line 2</label>
                      <input
                        type="text"
                        name="billing_address_line2"
                        value={formData.billing_address_line2 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">City</label>
                      <input
                        type="text"
                        name="billing_city"
                        value={formData.billing_city || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">State</label>
                      <input
                        type="text"
                        name="billing_state"
                        value={formData.billing_state || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Country</label>
                      <input
                        type="text"
                        name="billing_country"
                        value={formData.billing_country || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="billing_zip_code"
                        value={formData.billing_zip_code || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>
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
                      <label className="block text-sm font-medium text-primary mb-2">Address Line 1</label>
                      <input
                        type="text"
                        name="shipping_address_line1"
                        value={formData.shipping_address_line1 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-primary mb-2">Address Line 2</label>
                      <input
                        type="text"
                        name="shipping_address_line2"
                        value={formData.shipping_address_line2 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">City</label>
                      <input
                        type="text"
                        name="shipping_city"
                        value={formData.shipping_city || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">State</label>
                      <input
                        type="text"
                        name="shipping_state"
                        value={formData.shipping_state || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Country</label>
                      <input
                        type="text"
                        name="shipping_country"
                        value={formData.shipping_country || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="shipping_zip_code"
                        value={formData.shipping_zip_code || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tax & Compliance Tab */}
            {activeTab === 'tax' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">GST Treatment</label>
                  <input
                    type="text"
                    name="gst_treatment"
                    value={formData.gst_treatment || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">GSTIN</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin || ''}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Source of Supply</label>
                  <input
                    type="text"
                    name="source_of_supply"
                    value={formData.source_of_supply || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">PAN</label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan || ''}
                    onChange={handleChange}
                    placeholder="AAAAA0000A"
                    maxLength={10}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm uppercase"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_msme_registered"
                    checked={formData.is_msme_registered}
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
                  <label className="block text-sm font-medium text-primary mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Account Number</label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="bank_ifsc_code"
                    value={formData.bank_ifsc_code || ''}
                    onChange={handleChange}
                    placeholder="ABCD0123456"
                    maxLength={11}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm uppercase"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">Branch</label>
                  <input
                    type="text"
                    name="bank_branch"
                    value={formData.bank_branch || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="bg-gradient-to-r from-theme-lightest to-accent-mist px-6 py-3 border-t border-border-light flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:bg-hover transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-theme-primary px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Vendor' : 'Create Vendor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
