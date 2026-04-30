import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './ItemForm.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  createItem,
  updateItem,
  fetchItemById,
  clearSelectedItem,
  clearError,
  clearSuccessMessage,
} from '../store/itemSlice';
import { fetchVendors } from '@features/vendors/store/vendorSlice';
import { Input, TextArea, Button, Alert, Spinner } from '@components/ui';
import { itemFormSchema } from '../schemas/itemValidation';
import type { CreateItemPayload } from '../types/item.types';
import { itemService } from '../services/itemService';

// Use CreateItemPayload as form data type to avoid Zod preprocessing type issues
type ItemFormData = CreateItemPayload & {
  taxPreference?: 'taxable' | 'non-taxable';
  itemType: 'goods' | 'service';
};

/**
 * Default form values
 */
const defaultValues: ItemFormData = {
  itemType: 'goods',
  name: '',
  sku: '',
  unit: '',
  hsnCode: '',
  taxPreference: 'taxable',
  intraStateTaxRate: '',
  intraStateTaxPercentage: undefined,
  interStateTaxRate: '',
  interStateTaxPercentage: undefined,
  isSellable: true,
  sellingPrice: undefined,
  salesAccount: '',
  salesDescription: '',
  isPurchasable: true,
  costPrice: undefined,
  purchaseAccount: '',
  purchaseDescription: '',
  preferredVendorId: undefined,
  trackInventory: false,
  openingStock: undefined,
  openingStockRate: undefined,
  reorderLevel: undefined,
  imageUrl: '',
  imageUrls: [],
  customFields: undefined,
  tags: [],
  isActive: true,
  createdBy: '',
  updatedBy: '',
};

export default function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedItem, loading, error, successMessage } = useAppSelector((state) => state.items);
  const { vendors } = useAppSelector((state) => state.vendors);

  const isEditMode = Boolean(id);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Initialize React Hook Form
  const methods = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema) as any, // Type assertion needed due to Zod preprocessing
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const itemType = watch('itemType');
  const isSellable = watch('isSellable');
  const isPurchasable = watch('isPurchasable');
  const taxPreference = watch('taxPreference');

  useEffect(() => {
    // Fetch vendors for dropdown
    dispatch(fetchVendors());

    if (isEditMode && id) {
      dispatch(fetchItemById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedItem());
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [id, isEditMode, dispatch]);

  // Populate form when editing
  useEffect(() => {
    if (selectedItem && isEditMode) {
      reset({
        itemType: (selectedItem.itemType || 'goods') as 'goods' | 'service',
        name: selectedItem.name || '',
        sku: selectedItem.sku || '',
        unit: selectedItem.unit || '',
        hsnCode: selectedItem.hsnCode || '',
        taxPreference: (selectedItem.taxPreference || 'taxable') as 'taxable' | 'non-taxable',
        intraStateTaxRate: selectedItem.intraStateTaxRate || '',
        intraStateTaxPercentage: selectedItem.intraStateTaxPercentage ?? undefined,
        interStateTaxRate: selectedItem.interStateTaxRate || '',
        interStateTaxPercentage: selectedItem.interStateTaxPercentage ?? undefined,
        isSellable: selectedItem.isSellable ?? true,
        sellingPrice: selectedItem.sellingPrice ?? undefined,
        salesAccount: selectedItem.salesAccount || '',
        salesDescription: selectedItem.salesDescription || '',
        isPurchasable: selectedItem.isPurchasable ?? true,
        costPrice: selectedItem.costPrice ?? undefined,
        purchaseAccount: selectedItem.purchaseAccount || '',
        purchaseDescription: selectedItem.purchaseDescription || '',
        preferredVendorId: selectedItem.preferredVendorId ?? undefined,
        trackInventory: selectedItem.trackInventory || false,
        openingStock: selectedItem.openingStock ?? undefined,
        openingStockRate: selectedItem.openingStockRate ?? undefined,
        reorderLevel: selectedItem.reorderLevel ?? undefined,
        imageUrl: selectedItem.imageUrl || '',
        imageUrls: selectedItem.imageUrls || [],
        customFields: selectedItem.customFields ?? undefined,
        tags: selectedItem.tags || [],
        isActive: selectedItem.isActive ?? true,
        createdBy: selectedItem.createdBy || '',
        updatedBy: selectedItem.updatedBy || '',
      });
      // Set image preview if editing and has image
      if (selectedItem.imageUrl) {
        const serverUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1').replace('/api/v1', '');
        setImagePreview(`${serverUrl}${selectedItem.imageUrl}`);
      }
    } else if (!isEditMode) {
      reset(defaultValues);
      setImagePreview('');
    }
  }, [selectedItem, isEditMode, reset]);

  useEffect(() => {
    if (successMessage && !loading) {
      const timer = setTimeout(() => {
        navigate('/items');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, loading, navigate]);

  // Transform form data to match API payload types (convert null to undefined)
  const transformFormData = (data: ItemFormData) => {
    const transformed: any = { ...data };
    
    // Convert null to undefined for fields that don't accept null
    const fieldsToTransform = [
      'openingStock', 'openingStockRate', 'sellingPrice', 'costPrice',
      'intraStateTaxPercentage', 'interStateTaxPercentage', 'preferredVendorId',
      'reorderLevel'
    ];
    
    fieldsToTransform.forEach(field => {
      if (transformed[field] === null) {
        transformed[field] = undefined;
      }
    });
    
    return transformed;
  };

  const onSubmit = async (data: ItemFormData) => {
    try {
      const payload = transformFormData(data);
      
      if (isEditMode && id) {
        await dispatch(updateItem({ id: Number(id), payload })).unwrap();
      } else {
        await dispatch(createItem(payload)).unwrap();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    navigate('/items');
  };

  // Handle image file selection and upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError('');
    setIsUploadingImage(true);

    try {
      const { setValue, getValues } = methods;
      const currentImageUrl = getValues('imageUrl');

      // Delete old image if exists
      if (currentImageUrl && currentImageUrl.trim() !== '') {
        try {
          await itemService.deleteImage(currentImageUrl);
          console.log('Old image deleted successfully');
        } catch (deleteError) {
          console.warn('Failed to delete old image:', deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Upload new image
      const result = await itemService.uploadImage(file);
      
      // Update form with new image URL
      setValue('imageUrl', result.url);
      
      // Set preview
      const serverUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5174/api/v1').replace('/api/v1', '');
      setImagePreview(`${serverUrl}${result.url}`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Remove image
  const handleRemoveImage = async () => {
    const { setValue, getValues } = methods;
    const currentImageUrl = getValues('imageUrl');

    // Delete the image file from server
    if (currentImageUrl && currentImageUrl.trim() !== '') {
      try {
        await itemService.deleteImage(currentImageUrl);
        console.log('Image deleted successfully');
      } catch (deleteError) {
        console.warn('Failed to delete image:', deleteError);
        setUploadError('Failed to delete image file');
      }
    }

    setValue('imageUrl', '');
    setImagePreview('');
    setUploadError('');
  };

  const vendorOptions = vendors.map((vendor) => ({
    label: vendor.displayName,
    value: vendor.id.toString(),
  }));

  return (
    <div className="p-3 max-h-full bg-gray-50">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className={styles.headerContainer}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            title="Back to items"
            className={styles.backButton}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 m-0">
            {isEditMode ? 'Edit Item' : 'New Item'}
          </h1>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-2">
          <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </Alert>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-2">
          <Alert variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[calc(100vh-8rem)]">
        <div className={`${styles.formBody} flex flex-col h-full`}>
          {/* Form Content */}
          <div className={styles.formContent}>
            {/* Basic Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionHeader}>Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('itemType')}
                        value="goods"
                        className="mr-2 cursor-pointer"
                      />
                      <span>Goods</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('itemType')}
                        value="service"
                        className="mr-2 cursor-pointer"
                      />
                      <span>Service</span>
                    </label>
                  </div>
                  {errors.itemType && (
                    <p className="text-red-500 text-sm mt-1">{errors.itemType.message}</p>
                  )}
                </div>

                <Input
                  label="Name"
                  {...register('name')}
                  error={errors.name?.message}
                  maxLength={255}
                  required
                />

                <Input
                  label="SKU"
                  {...register('sku')}
                  error={errors.sku?.message}
                  maxLength={100}
                />

                <Input
                  label="Unit"
                  {...register('unit')}
                  error={errors.unit?.message}
                  maxLength={50}
                  placeholder="e.g., Nos, Kg, Meter"
                />

                <Input
                  label="HSN Code"
                  {...register('hsnCode')}
                  error={errors.hsnCode?.message}
                  maxLength={20}
                  placeholder="4-8 digits"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Preference
                  </label>
                  <select
                    {...register('taxPreference')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="taxable">Taxable</option>
                    <option value="non-taxable">Non-Taxable</option>
                  </select>
                  {errors.taxPreference && (
                    <p className="text-red-500 text-sm mt-1">{errors.taxPreference.message}</p>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isUploadingImage ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingImage}
                      className="sr-only"
                    />
                  </label>
                  {isUploadingImage && <Spinner size="sm" />}
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}

                {/* Help Text */}
                <p className="text-gray-500 text-xs mt-2">
                  Accepted formats: JPG, PNG, GIF, WebP. Max size: 5MB
                </p>
              </div>
            </div>

            {/* Tax Rates */}
            {taxPreference === 'taxable' && (
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeader}>Default Tax Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Intra State Tax Rate"
                    {...register('intraStateTaxRate')}
                    error={errors.intraStateTaxRate?.message}
                    maxLength={50}
                    placeholder="e.g., GST18 [18 %]"
                  />

                  <Input
                    label="Intra State Tax Percentage"
                    type="number"
                    step="0.01"
                    {...register('intraStateTaxPercentage')}
                    error={errors.intraStateTaxPercentage?.message}
                    placeholder="e.g., 18.00"
                  />

                  <Input
                    label="Inter State Tax Rate"
                    {...register('interStateTaxRate')}
                    error={errors.interStateTaxRate?.message}
                    maxLength={50}
                    placeholder="e.g., IGST18 [18 %]"
                  />

                  <Input
                    label="Inter State Tax Percentage"
                    type="number"
                    step="0.01"
                    {...register('interStateTaxPercentage')}
                    error={errors.interStateTaxPercentage?.message}
                    placeholder="e.g., 18.00"
                  />
                </div>
              </div>
            )}

            {/* Sales Information */}
            <div className={styles.formSection}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  {...register('isSellable')}
                  id="isSellable"
                  className="cursor-pointer"
                />
                <label htmlFor="isSellable" className={`${styles.sectionHeader} m-0 cursor-pointer`}>
                  Sales Information
                </label>
              </div>

              {isSellable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Selling Price"
                    type="number"
                    step="0.01"
                    {...register('sellingPrice')}
                    error={errors.sellingPrice?.message}
                    placeholder="0.00"
                  />

                  <Input
                    label="Sales Account"
                    {...register('salesAccount')}
                    error={errors.salesAccount?.message}
                    maxLength={100}
                    placeholder="e.g., Sales"
                  />

                  <div className="md:col-span-2">
                    <TextArea
                      label="Sales Description"
                      {...register('salesDescription')}
                      error={errors.salesDescription?.message}
                      rows={3}
                      maxLength={10000}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Information */}
            <div className={styles.formSection}>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  {...register('isPurchasable')}
                  id="isPurchasable"
                  className="cursor-pointer"
                />
                <label htmlFor="isPurchasable" className={`${styles.sectionHeader} m-0 cursor-pointer`}>
                  Purchase Information
                </label>
              </div>

              {isPurchasable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Cost Price"
                    type="number"
                    step="0.01"
                    {...register('costPrice')}
                    error={errors.costPrice?.message}
                    placeholder="0.00"
                  />

                  <Input
                    label="Purchase Account"
                    {...register('purchaseAccount')}
                    error={errors.purchaseAccount?.message}
                    maxLength={100}
                    placeholder="e.g., GST Payable"
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Vendor
                    </label>
                    <select
                      {...register('preferredVendorId')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select a vendor</option>
                      {vendorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.preferredVendorId && (
                      <p className="text-red-500 text-sm mt-1">{errors.preferredVendorId.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <TextArea
                      label="Purchase Description"
                      {...register('purchaseDescription')}
                      error={errors.purchaseDescription?.message}
                      rows={3}
                      maxLength={10000}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Management */}
            {itemType === 'goods' && (
              <div className={styles.formSection}>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    {...register('trackInventory')}
                    id="trackInventory"
                    className="cursor-pointer"
                  />
                  <label htmlFor="trackInventory" className={`${styles.sectionHeader} m-0 cursor-pointer`}>
                    Track Inventory for this Item
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" isLoading={loading}>
              {isEditMode ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
