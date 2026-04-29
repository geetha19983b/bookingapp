# Styling Guide

This document outlines the standardized styling approach for the BookKeeping App frontend.

## Overview

We use a **Tailwind CSS + CSS Modules hybrid approach**:
- **Tailwind CSS** for utility classes and rapid UI development
- **CSS Modules** for complex, component-specific styles

## Core Principles

### 1. When to Use Tailwind CSS

Use Tailwind utility classes for:
- **Layout and spacing**: `flex`, `grid`, `p-4`, `m-2`, `gap-4`
- **Simple styling**: `bg-indigo`, `text-white`, `rounded-lg`
- **Responsive design**: `md:flex-row`, `lg:p-8`
- **State variants**: `hover:bg-peach`, `focus:ring-2`
- **Quick prototyping**: Building new components rapidly

**Example:**
```tsx
<div className="flex items-center gap-4 p-4 bg-eggshell rounded-lg">
  <span className="text-sm font-medium text-indigo">Username</span>
  <button className="px-4 py-2 bg-peach text-white rounded-md hover:bg-opacity-90">
    Submit
  </button>
</div>
```

### 2. When to Use CSS Modules

Use CSS Modules for:
- **Complex component logic**: Multi-state components, intricate animations
- **Component-specific theming**: Component variants with multiple style combinations
- **Overriding libraries**: When Tailwind becomes too verbose
- **Reusable component libraries**: Buttons, Inputs, Cards (in `components/ui/`)
- **Scoped styles**: Styles that should not leak to other components

**Example:**
```tsx
// Button.tsx
import styles from './Button.module.scss';

export default function Button({ variant, size, children }) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${styles[size]}`}>
      {children}
    </button>
  );
}
```

```scss
// Button.module.scss
@use '../../styles/theme' as theme;

.button {
  @include theme.button-base;
  display: inline-flex;
  align-items: center;
  gap: theme.$spacing-sm;
}

.primary {
  background-color: theme.$color-button-primary;
  color: theme.$color-button-primary-text;
  
  &:hover:not(:disabled) {
    background-color: theme.$color-button-primary-hover;
  }
}

.sm {
  padding: 0.375rem 0.75rem;
  font-size: theme.$font-size-sm;
  height: 2rem;
}
```

### 3. Combining Tailwind + CSS Modules

You can combine both approaches when appropriate:

```tsx
import styles from './Card.module.scss';

export default function Card({ children }) {
  return (
    <div className={`${styles.card} flex flex-col gap-4`}>
      {children}
    </div>
  );
}
```

## Theme Configuration

### Colors

Our color palette is defined in both SCSS and Tailwind:

**SCSS Variables** (`src/styles/_theme.scss`):
```scss
$color-eggshell: #F4F1DE;    // Backgrounds
$color-peach: #E07A5F;       // Accents, buttons
$color-indigo: #3D405B;      // Dark surfaces, text
$color-teal: #81B29A;        // Highlights, secondary
$color-apricot: #F2CC8F;     // Cards, highlights
```

**Tailwind Classes** (`tailwind.config.js`):
```js
bg-eggshell, text-indigo, bg-peach, border-teal, bg-apricot
```

### Typography

**Font Sizes** (reduced for better readability):

| Size Class | SCSS Variable | Tailwind | Pixels | Usage |
|------------|---------------|----------|--------|-------|
| xs         | `$font-size-xs` | `text-xs` | 11px | Small labels, badges |
| sm         | `$font-size-sm` | `text-sm` | 13px | Body text, buttons |
| base       | `$font-size-base` | `text-base` | 15px | Default text |
| lg         | `$font-size-lg` | `text-lg` | 16px | Subheadings |
| xl         | `$font-size-xl` | `text-xl` | 18px | Section headings |
| 2xl        | `$font-size-2xl` | `text-2xl` | 22px | Page titles |
| 3xl        | `$font-size-3xl` | `text-3xl` | 26px | Hero text |

**Font Weights**:
- `font-normal` / `$font-weight-normal`: 400
- `font-medium` / `$font-weight-medium`: 500
- `font-semibold` / `$font-weight-semibold`: 600
- `font-bold` / `$font-weight-bold`: 700

### Spacing

Use Tailwind spacing utilities (`p-4`, `m-2`, `gap-4`) which match our theme:

```scss
// Complement Tailwind with custom spacing if needed
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
```

### Border Radius

```scss
// SCSS
$radius-sm: 0.375rem;   // 6px
$radius-md: 0.5rem;     // 8px
$radius-lg: 0.75rem;    // 12px
$radius-xl: 1rem;       // 16px

// Tailwind
rounded-sm, rounded-md, rounded-lg, rounded-xl
```

### Shadows

```scss
// SCSS
$shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
$shadow-md: 0 4px 8px -2px rgba(0, 0, 0, 0.12);
$shadow-lg: 0 12px 20px -4px rgba(0, 0, 0, 0.15);

// Tailwind
shadow-sm, shadow-md, shadow-lg
```

## Component Structure

### Reusable UI Components (`src/components/ui/`)

Follow this pattern for all UI components:

```
components/ui/
  ├── Button.tsx
  ├── Button.module.scss
  ├── Input.tsx
  ├── Input.module.scss
  ├── Card.tsx
  ├── Card.module.scss
  └── index.ts  # Export all components
```

**Component Template:**

```tsx
// Component.tsx
import { ReactNode } from 'react';
import styles from './Component.module.scss';

interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;  // Allow external Tailwind classes
}

export default function Component({ 
  variant = 'primary', 
  size = 'md',
  children,
  className = ''
}: ComponentProps) {
  return (
    <div className={`${styles.component} ${styles[variant]} ${styles[size]} ${className}`}>
      {children}
    </div>
  );
}
```

```scss
// Component.module.scss
@use '../../styles/theme' as theme;

.component {
  // Base styles using theme variables
  border-radius: theme.$radius-md;
  transition: all theme.$transition-base;
}

.primary {
  background-color: theme.$color-button-primary;
  color: theme.$color-button-primary-text;
}

.sm {
  padding: theme.$spacing-sm theme.$spacing-md;
  font-size: theme.$font-size-sm;
}
```

### Feature Components (`src/features/*/components/`)

For feature-specific components:
- Use **Tailwind** for layout and simple styling
- Use **CSS Modules** only when complexity warrants it
- Import and use UI components from `@components/ui`

**Example:**

```tsx
// features/vendors/components/VendorList.tsx
import { Button, Card, Badge } from '@components/ui';
import styles from './VendorList.module.scss';  // Only if needed

export default function VendorList() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-indigo">Vendors</h2>
          <Button variant="primary" size="sm">Add Vendor</Button>
        </div>
      </Card>
      {/* More content */}
    </div>
  );
}
```

## Best Practices

### 1. Avoid Inline Styles

❌ **Don't:**
```tsx
<div style={{ backgroundColor: '#E07A5F', padding: '16px' }}>
```

✅ **Do:**
```tsx
<div className="bg-peach p-4">
```

### 2. Use Semantic Class Names in CSS Modules

❌ **Don't:**
```scss
.div1 { }
.red-text { }
```

✅ **Do:**
```scss
.vendorCard { }
.activeStatus { }
```

### 3. Leverage Theme Variables

❌ **Don't:**
```scss
.button {
  color: #E07A5F;
  padding: 8px 16px;
  border-radius: 8px;
}
```

✅ **Do:**
```scss
@use '../../styles/theme' as theme;

.button {
  color: theme.$color-peach;
  padding: theme.$spacing-sm theme.$spacing-md;
  border-radius: theme.$radius-md;
}
```

### 4. Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="flex flex-col md:flex-row gap-4 p-4 lg:p-8">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### 5. Accessibility

Always include:
- `focus:` states for interactive elements
- `aria-*` attributes where needed
- Semantic HTML elements

```tsx
<button 
  className="px-4 py-2 bg-peach text-white rounded-md 
             hover:bg-opacity-90 focus:ring-2 focus:ring-teal focus:outline-none"
  aria-label="Submit form"
>
  Submit
</button>
```

## Migration Strategy

When refactoring existing components:

1. **Evaluate complexity**: Simple → Tailwind, Complex → CSS Modules
2. **Extract reusable patterns** to `components/ui/`
3. **Remove redundant global styles** from `App.scss`
4. **Consolidate similar components** (e.g., multiple button variants → one Button component)
5. **Test responsive behavior** across breakpoints

## File Organization

```
src/
├── styles/
│   ├── _theme.scss          # SCSS variables, mixins, functions
│   └── _examples.scss       # Usage examples (optional)
├── components/
│   ├── ui/                  # Reusable UI components with CSS Modules
│   │   ├── Button.tsx
│   │   ├── Button.module.scss
│   │   └── index.ts
│   └── layout/              # Layout components (Sidebar, TopNavbar)
│       ├── Sidebar.tsx
│       └── Sidebar.module.scss
├── features/                # Feature-specific components
│   └── vendors/
│       └── components/
│           └── VendorForm.tsx  # Use Tailwind + import UI components
├── index.scss               # Global styles, Tailwind imports
└── App.scss                 # Minimal global app styles
```

## Common Patterns

### Form Layout

```tsx
<form className="flex flex-col gap-6 max-w-2xl mx-auto p-6">
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-indigo">Email</label>
    <Input type="email" placeholder="Enter email" />
  </div>
  
  <div className="flex gap-4 justify-end">
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </div>
</form>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  {items.map(item => (
    <Card key={item.id} className="p-4">
      <h3 className="text-lg font-semibold text-indigo">{item.title}</h3>
      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
    </Card>
  ))}
</div>
```

### Data Table

```tsx
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead className="bg-apricot">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold text-indigo">Name</th>
        <th className="px-4 py-3 text-left text-sm font-semibold text-indigo">Email</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-4 py-3 text-sm">{row.name}</td>
          <td className="px-4 py-3 text-sm">{row.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Sass Documentation](https://sass-lang.com/documentation)

---

**Questions?** Refer to this guide when styling new components or refactoring existing ones. Follow these patterns for consistency across the application.
