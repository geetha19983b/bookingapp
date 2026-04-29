import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { vendorFormSchema, type VendorFormValues } from '../schemas/vendorValidation';

/**
 * Default form values
 */
const defaultValues: VendorFormValues = {
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

  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'tax' | 'bank'>('basic');
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(false);

  const isEditMode = Boolean(id);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues,
  });

  // Watch billing address fields for copy functionality
  const billingAddressLine1 = watch('billingAddressLine1');
  const billingAddressLine2 = watch('billingAddressLine2');
  const billingCity = watch('billingCity');
  const billingState = watch('billingState');
  const billingCountry = watch('billingCountry');
  const billingZipCode = watch('billingZipCode');

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

  // Populate form when editing
  useEffect(() => {
    if (selectedVendor && isEditMode) {
      reset({
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
  }, [selectedVendor, isEditMode, reset]);

  useEffect(() => {
    if (successMessage && !loading) {
      const timer = setTimeout(() => {
        navigate('/vendors');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, loading, navigate]);

  // Copy billing address to shipping when checkbox is checked
  useEffect(() => {
    if (copyBillingToShipping) {
      setValue('shippingAddressLine1', billingAddressLine1 || '');
      setValue('shippingAddressLine2', billingAddressLine2 || '');
      setValue('shippingCity', billingCity || '');
      setValue('shippingState', billingState || '');
      setValue('shippingCountry', billingCountry || '');
      setValue('shippingZipCode', billingZipCode || '');
    }
  }, [
    copyBillingToShipping,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingState,
    billingCountry,
    billingZipCode,
    setValue,
  ]);

  const onSubmit = async (data: VendorFormValues) => {
    try {
      if (isEditMode && id) {
        await dispatch(updateVendor({ id: Number(id), payload: data })).unwrap();
      } else {
        await dispatch(createVendor(data)).unwrap();
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
    <div className="p-6 max-h-full">
      {/* Header */}
      <div className="mb-4">
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
          <h2 className="text-2xl font-semibold m-0">
            {isEditMode ? 'Edit Vendor' : 'New Vendor'}
          </h2>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4">
          <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </Alert>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4">
          <Alert variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[calc(100vh-10rem)]">
        <div className={`${styles.formBody} rounded-2xl shadow-lg border border-theme-light overflow-hidden flex flex-col max-h-full`}>
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
                  {...register('displayName')}
                  error={errors.displayName?.message}
                  maxLength={255}
                />

                <Input
                  label="Company Name"
                  {...register('companyName')}
                  error={errors.companyName?.message}
                  maxLength={255}
                />

                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  maxLength={255}
                />

                <Input
                  label="Work Phone"
                  type="tel"
                  {...register('workPhone')}
                  error={errors.workPhone?.message}
                  maxLength={20}
                />

                <Input
                  label="Mobile Phone"
                  type="tel"
                  {...register('mobilePhone')}
                  error={errors.mobilePhone?.message}
                  maxLength={20}
                />

                <Input
                  label="Currency"
                  {...register('currency')}
                  error={errors.currency?.message}
                  placeholder="INR (default)"
                  maxLength={3}
                  className="uppercase"
                />

                <Input
                  label="Opening Balance"
                  type="number"
                  {...register('openingBalance', { valueAsNumber: true })}
                  error={errors.openingBalance?.message}
                  step="0.01"
                />

                <Input
                  label="Payment Terms"
                  {...register('paymentTerms')}
                  error={errors.paymentTerms?.message}
                  placeholder="Due on Receipt (default)"
                  maxLength={100}
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Remarks"
                    {...register('remarks')}
                    error={errors.remarks?.message}
                    rows={3}
                    resize="none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
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
                        {...register('billingAddressLine1')}
                        error={errors.billingAddressLine1?.message}
                        maxLength={255}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 2"
                        {...register('billingAddressLine2')}
                        error={errors.billingAddressLine2?.message}
                        maxLength={255}
                      />
                    </div>

                    <Input
                      label="City"
                      {...register('billingCity')}
                      error={errors.billingCity?.message}
                      maxLength={100}
                    />

                    <Input
                      label="State"
                      {...register('billingState')}
                      error={errors.billingState?.message}
                      maxLength={100}
                    />

                    <Input
                      label="Country"
                      {...register('billingCountry')}
                      error={errors.billingCountry?.message}
                      maxLength={100}
                    />

                    <Input
                      label="Zip Code"
                      {...register('billingZipCode')}
                      error={errors.billingZipCode?.message}
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
                        {...register('shippingAddressLine1')}
                        error={errors.shippingAddressLine1?.message}
                        maxLength={255}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 2"
                        {...register('shippingAddressLine2')}
                        error={errors.shippingAddressLine2?.message}
                        maxLength={255}
                      />
                    </div>

                    <Input
                      label="City"
                      {...register('shippingCity')}
                      error={errors.shippingCity?.message}
                      maxLength={100}
                    />

                    <Input
                      label="State"
                      {...register('shippingState')}
                      error={errors.shippingState?.message}
                      maxLength={100}
                    />

                    <Input
                      label="Country"
                      {...register('shippingCountry')}
                      error={errors.shippingCountry?.message}
                      maxLength={100}
                    />

                    <Input
                      label="Zip Code"
                      {...register('shippingZipCode')}
                      error={errors.shippingZipCode?.message}
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
                  {...register('gstTreatment')}
                  error={errors.gstTreatment?.message}
                  maxLength={100}
                />

                <Input
                  label="GSTIN"
                  {...register('gstin')}
                  error={errors.gstin?.message}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  className="uppercase"
                />

                <Input
                  label="Source of Supply"
                  {...register('sourceOfSupply')}
                  error={errors.sourceOfSupply?.message}
                  maxLength={100}
                />

                <Input
                  label="PAN"
                  {...register('pan')}
                  error={errors.pan?.message}
                  placeholder="AAAAA0000A"
                  maxLength={10}
                  className="uppercase"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isMsmeRegistered')}
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
                    {...register('bankName')}
                    error={errors.bankName?.message}
                    maxLength={255}
                  />
                </div>

                <Input
                  label="Account Number"
                  {...register('bankAccountNumber')}
                  error={errors.bankAccountNumber?.message}
                  maxLength={50}
                />

                <Input
                  label="IFSC Code"
                  {...register('bankIfscCode')}
                  error={errors.bankIfscCode?.message}
                  placeholder="ABCD0123456"
                  maxLength={11}
                  className="uppercase"
                />

                <div className="md:col-span-2">
                  <Input
                    label="Branch"
                    {...register('bankBranch')}
                    error={errors.bankBranch?.message}
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
