# Styling Guide for BookKeeping App

## Color Palette

This application uses a **Professional Dark Theme** - a premium dark blue palette with vibrant teal accents, perfect for financial and bookkeeping applications. The theme provides excellent contrast, smooth rounded edges, and a polished, modern look.

### Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Deep Navy | `#1C344E` | Sidebar background, navbar, primary dark surfaces |
| Rich Teal | `#286A8C` | Secondary emphasis, depth, medium accents |
| Bright Blue | `#428BB5` | Primary buttons, CTAs, interactive elements |
| Vibrant Cyan | `#5EAECD` | Highlights, hover effects, active states |
| Soft Gray-Blue | `#C4CDD2` | Borders, muted text, subtle elements |
| Clean Background | `#F0F4F8` | Main canvas, light backgrounds |

![Deep Navy](https://via.placeholder.com/600x150/1C344E/ffffff?text=Deep+Navy+-+Dark+Surfaces) 
![Rich Teal](https://via.placeholder.com/600x150/286A8C/ffffff?text=Rich+Teal+-+Accents)
![Bright Blue](https://via.placeholder.com/600x150/428BB5/ffffff?text=Bright+Blue+-+Primary+Actions)
![Vibrant Cyan](https://via.placeholder.com/600x150/5EAECD/ffffff?text=Vibrant+Cyan+-+Highlights)

### Design Principles

- **High Contrast**: Pure white text (#FFFFFF) on dark backgrounds for maximum readability
- **Smooth Edges**: Generous border-radius (8px-24px) for a polished, modern look
- **Depth & Shadows**: Layered shadows create visual hierarchy
- **Vibrant Accents**: Gradient buttons and interactive elements stand out
- **Professional Polish**: Suitable for long work sessions with financial data

## Architecture

The app uses **SCSS + Tailwind CSS** for styling:

- **SCSS** for theme variables, mixins, and reusable component styles
- **Tailwind** for utility-first rapid development

## File Structure

```
src/
├── styles/
│   └── _theme.scss          # Theme variables, colors, mixins
├── index.scss               # Global styles, Tailwind imports
├── App.scss                 # App-specific component styles
└── components...
```

## Using Theme Variables

### In SCSS Files

```scss
@import './styles/theme';

.my-component {
  background-color: $color-primary-dark;
  color: $color-text-white;
  padding: $spacing-md;
  border-radius: $radius-lg;
  
  &:hover {
    background-color: $color-primary-medium;
  }
}
```

### Using Mixins

```scss
@import './styles/theme';

.my-button {
  @include button-primary;
}

.my-card {
  @include card;
}

.my-input {
  @include input-base;
}
```

### In Tailwind Classes

```jsx
// Use theme colors
<div className="bg-theme-dark text-white">...</div>
<div className="bg-theme-medium hover:bg-theme-dark">...</div>
<div className="border-theme-light">...</div>

// Sidebar-specific colors
<aside className="bg-sidebar-bg text-sidebar-text">...</aside>
```

## Available SCSS Variables

### Colors
- `$color-primary-dark`, `$color-primary-medium`, `$color-primary-light`, `$color-primary-lightest`
- `$color-text-primary`, `$color-text-secondary`, `$color-text-muted`
- `$color-bg-main`, `$color-bg-card`, `$color-bg-hover`
- `$color-border-light`, `$color-border-medium`, `$color-border-dark`
- `$color-success`, `$color-warning`, `$color-error`, `$color-info`

### Spacing
- `$spacing-xs` (4px), `$spacing-sm` (8px), `$spacing-md` (16px)
- `$spacing-lg` (24px), `$spacing-xl` (32px), `$spacing-2xl` (48px)

### Typography
- `$font-size-xs` through `$font-size-3xl`
- `$font-weight-normal`, `$font-weight-medium`, `$font-weight-semibold`, `$font-weight-bold`

### Shadows, Borders, Transitions
- `$shadow-sm`, `$shadow-md`, `$shadow-lg`, `$shadow-xl`
- `$radius-sm`, `$radius-md`, `$radius-lg`, `$radius-xl`, `$radius-full`
- `$transition-fast`, `$transition-base`, `$transition-slow`

## Available Mixins

- `@include flex-center` - Flexbox with centered content
- `@include flex-between` - Flexbox with space-between
- `@include card` - Standard card styling
- `@include button-base` - Base button styles
- `@include button-primary` - Primary button styles
- `@include input-base` - Input field styles

## CSS Classes

### Component Classes
- `.btn-primary` - Primary button
- `.card` - Card container
- `.input-base` - Form input

### Utility Classes
- `.bg-theme-dark`, `.bg-theme-medium`, `.bg-theme-light`, `.bg-theme-lightest`
- `.text-theme-dark`, `.text-theme-medium`
- `.border-theme`

### Layout Classes
- `.sidebar__nav-item`, `.sidebar__nav-item--active`
- `.topnav__search`, `.topnav__button`
- `.table-container`
- `.empty-state`
- `.form-group`

### Alert Classes
- `.alert--error`, `.alert--success`, `.alert--warning`, `.alert--info`

### Badge Classes
- `.badge--success`, `.badge--warning`, `.badge--error`

## Best Practices

1. **Use SCSS variables** for colors, spacing, and typography to maintain consistency
2. **Leverage mixins** for commonly repeated patterns
3. **Use Tailwind utilities** for quick layout and spacing adjustments
4. **Combine approaches**: Use Tailwind for layout, SCSS for custom components
5. **Keep theme colors in sync** between SCSS variables and Tailwind config

## Example Component

```jsx
import './styles/MyComponent.scss';

function MyComponent() {
  return (
    <div className="my-component card">
      <h2 className="text-2xl font-semibold text-theme-dark mb-4">
        Title
      </h2>
      <button className="btn-primary">
        Click Me
      </button>
    </div>
  );
}
```

```scss
// MyComponent.scss
@import './styles/theme';

.my-component {
  padding: $spacing-xl;
  
  &__special-element {
    background: linear-gradient(to right, $color-primary-dark, $color-primary-medium);
    color: $color-text-white;
    border-radius: $radius-lg;
  }
}
```

## Updating the Theme

To change the color scheme:

1. Update color variables in [`src/styles/_theme.scss`](src/styles/_theme.scss)
2. Update Tailwind theme colors in [`tailwind.config.js`](tailwind.config.js)
3. The changes will automatically apply throughout the app!
