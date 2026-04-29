# React Hook Form Integration Guide

This guide explains how the VendorForm has been refactored to use React Hook Form and how to apply the same pattern to other forms.

## Benefits of React Hook Form

1. **Performance**: Minimizes re-renders - only fields that change will re-render
2. **Less Code**: Reduced boilerplate compared to manual state management
3. **Built-in Validation**: Integrates seamlessly with Zod for type-safe validation
4. **Better UX**: Native form validation with clear error messages
5. **TypeScript Support**: Excellent type inference from Zod schemas

## Installation

```bash
npm install react-hook-form @hookform/resolvers zod
```

## Key Changes Made to VendorForm

### 1. Created Validation Schema (`vendorValidation.ts`)

```typescript
import { z } from 'zod';

export const vendorFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(255),
  email: z.string().email('Invalid email address').max(255).optional().nullable(),
  gstin: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .optional()
    .nullable()
    .or(z.literal('')),
  // ... other fields
});

export type VendorFormValues = z.infer<typeof vendorFormSchema>;
```

### 2. Replaced Manual State with `useForm` Hook

**Before:**
```typescript
const [formData, setFormData] = useState<VendorFormData>(initialFormState);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```

**After:**
```typescript
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
```

### 3. Updated Input Components

**Before:**
```tsx
<Input
  label="Display Name"
  name="displayName"
  value={formData.displayName}
  onChange={handleChange}
  required
/>
```

**After:**
```tsx
<Input
  label="Display Name"
  {...register('displayName')}
  error={errors.displayName?.message}
/>
```

### 4. Simplified Form Submission

**Before:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  await dispatch(createVendor(formData)).unwrap();
};
```

**After:**
```typescript
const onSubmit = async (data: VendorFormValues) => {
  await dispatch(createVendor(data)).unwrap();
};

// In JSX:
<form onSubmit={handleSubmit(onSubmit)}>
```

## Patterns and Use Cases

### Basic Input Field
```tsx
<Input
  label="Email"
  type="email"
  {...register('email')}
  error={errors.email?.message}
/>
```

### Number Input
```tsx
<Input
  label="Opening Balance"
  type="number"
  {...register('openingBalance', { valueAsNumber: true })}
  error={errors.openingBalance?.message}
  step="0.01"
/>
```

### Checkbox
```tsx
<input
  type="checkbox"
  {...register('isActive')}
/>
```

### Watching Values
```tsx
const email = watch('email');
const allValues = watch(); // Watch all fields
```

### Setting Values Programmatically
```tsx
setValue('shippingAddress', billingAddress);
```

### Resetting Form
```tsx
reset(defaultValues); // Reset to defaults
reset(vendorData); // Reset to specific values
```

### Custom Validation
```tsx
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## Validation Examples

### Email Validation
```typescript
email: z.string().email('Invalid email address').optional().nullable()
```

### Regex Validation (GSTIN)
```typescript
gstin: z.string()
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 
    'Invalid GSTIN format')
  .optional()
  .nullable()
  .or(z.literal(''))
```

### Min/Max Length
```typescript
displayName: z.string().min(1, 'Required').max(255, 'Too long')
```

### Number Range
```typescript
age: z.number().min(18, 'Must be 18+').max(100)
```

## Tips for Your Components

1. **Use `forwardRef`**: Our Input/TextArea components already use `forwardRef`, which is required for React Hook Form
2. **Error Prop**: Add an `error` prop to your input components to display validation messages
3. **Type Safety**: Always infer types from your Zod schema using `z.infer<typeof schema>`
4. **Optional vs Nullable**: Use `.optional().nullable()` for fields that can be empty or null
5. **Empty Strings**: Use `.or(z.literal(''))` for fields that might have empty strings instead of null

## Performance Benefits

With 30+ fields across 4 tabs:
- **Before**: Every keystroke re-renders the entire form component
- **After**: Only the specific input field re-renders
- **Result**: Smoother UX, especially on slower devices

## Next Steps

Consider applying this pattern to:
- Customer forms
- Invoice forms
- Item/Product forms
- Any other complex forms with validation

## Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
