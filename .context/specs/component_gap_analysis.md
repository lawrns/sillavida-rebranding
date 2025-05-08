# Component Gap Analysis & Design Standardization

> **Last Updated**: 2025-05-08T00:30:37-06:00

## Table of Contents

1. [Introduction](#introduction)
2. [Design Tokens](#design-tokens)
   - [Color Palette](#updated-color-palette)
   - [Typography](#typography)
   - [Spacing System](#spacing-system)
   - [Shadows & Elevation](#shadows-and-elevation)
   - [Border Radius](#border-radius)
3. [Component Analysis](#component-analysis)
   - [Navigation Components](#navigation-components)
   - [Hero & Banner Components](#hero-and-banner-components)
   - [Product Components](#product-components)
   - [Layout Components](#layout-components)
   - [Form Components](#form-components)
   - [Feedback Components](#feedback-components)
4. [Page-Level Analysis](#page-level-analysis)
   - [Homepage](#homepage)
   - [Product Page](#product-page)
   - [Collection Page](#collection-page)
   - [Cart & Checkout](#cart-and-checkout)
5. [Implementation Guidelines](#implementation-guidelines)
6. [Gap Closure Priorities](#gap-closure-priorities)

## Introduction

This document provides a comprehensive analysis of the visual gaps between the current SillaVida implementation and the Hbada reference design. The goal is to standardize our component library to align with the established design system while maintaining our e-commerce functionality.

Key areas of focus:

1. **Visual Consistency**: Ensuring all components follow the standardized design tokens
2. **Layout Precision**: Addressing spacing and alignment issues across components
3. **Typography Hierarchy**: Establishing clear text styles for different content types
4. **Interactive States**: Standardizing hover, focus, and active states across components
5. **Responsive Behavior**: Ensuring components adapt appropriately across breakpoints

This document serves as the reference for all future component development and refactoring.

## Design Tokens

### Updated Color Palette

### Primary Colors
- **Dark Blue-Gray (Primary Dark)**: `#111827` (RGB: 17, 24, 39)
  - Use for: Footer backgrounds, section backgrounds, banners, headers, headings
- **Blue (Primary Accent)**: `#4b7cae` (RGB: 75, 124, 174)
  - Use for: Buttons, links, highlights, interactive elements
- **Light Blue**: `#6b9cce` (RGB: 107, 156, 206)
  - Use for: Hover states, secondary accents
- **Dark Blue**: `#3b6188` (RGB: 59, 97, 136)
  - Use for: Active states, text emphasis
- **Very Light Blue**: `#e6f0f9` (RGB: 230, 240, 249)
  - Use for: Background accents, hover backgrounds

### Neutral Colors
- **White**: `#FFFFFF` (RGB: 255, 255, 255)
  - Use for: Backgrounds, cards, text on dark backgrounds
- **Off-White/Light Gray**: `#F4F4F5` (RGB: 244, 244, 245)
  - Use for: Background colors, disabled states
- **Light Gray**: `#E6E6E6` (RGB: 230, 230, 230)
  - Use for: Borders, dividers
- **Medium Gray**: `#9A9A9A` (RGB: 154, 154, 154)
  - Use for: Secondary text, disabled text
- **Dark Gray**: `#4A4A4A` (RGB: 74, 74, 74)
  - Use for: Secondary text, borders

## Component-Specific Color Usage

### Dark Background Elements (Standardized to #111827)
- **Footer**: Update from current to `#111827`
- **ShippingPromoBanner**: Update from `#1a2b3c` to `#111827`
- **Dark Sections**: Maintain `#111827`
- **Navbar**: Keep white background with dark text

### Text Elements
- **Headers/Headings**: Maintain `#111827`
- **Testimonial Text**: Maintain `#111827`
- **Body Text**: Use `#111827` for better readability

### Accent Elements
- **Buttons/Links**: Maintain `#4b7cae` (Blue)
- **Indicators/Highlights**: Maintain `#4b7cae` (Blue) or `#111827` (Dark Blue-Gray)

## Required Component Updates

### ShippingPromoBanner
- Update background color from `#1a2b3c` to `#111827`
- Maintain blue accent color for links and highlights

### Other Sections
- Ensure all section backgrounds that should be dark are consistently using `#111827`
- Check for any instances of `#222429` or other dark colors and standardize to `#111827`

## CSS Variables Update Needed

```css
:root {
  /* Primary Colors - Updated to use #111827 */
  --color-primary: #111827; /* Dark Blue-Gray as primary */
  --color-primary-light: #4A4A4A; /* Medium Gray */
  --color-primary-dark: #000000; /* Darker Black */
  --color-primary-extralight: #F4F4F5; /* Very Light Gray */

  /* Accent Color - Blue */
  --color-accent: #4b7cae; /* Blue */
  --color-accent-light: #6b9cce; /* Lighter Blue */
  --color-accent-dark: #3b6188; /* Darker Blue */
  --color-accent-extralight: #e6f0f9; /* Very Light Blue */
}
```

## Implementation Notes
- When updating components, ensure text contrast remains accessible
- Maintain blue accent color for interactive elements
- Use `#111827` consistently for all major dark backgrounds
- Update any instances of `#1a2b3c` or `#222429` to `#111827` for consistency

### Typography

Standardizing typography across the site is essential for maintaining visual hierarchy and readability.

#### Font Families
- **Primary (Headings)**: `'Montserrat', sans-serif`
  - Used for: All headings (h1-h6), buttons, navigation
- **Secondary (Body)**: `'Lato', sans-serif`
  - Used for: Body text, paragraphs, lists, product descriptions

#### Type Scale
- **h1**: `2rem/32px` (desktop), `1.75rem/28px` (mobile)
  - Font weight: 700 (Bold)
  - Line height: 1.2
  - Letter spacing: -0.01em
  - Color: `#111827`
- **h2**: `1.75rem/28px` (desktop), `1.5rem/24px` (mobile)
  - Font weight: 700 (Bold)
  - Line height: 1.3
  - Letter spacing: -0.01em
  - Color: `#111827`
- **h3**: `1.5rem/24px` (desktop), `1.25rem/20px` (mobile)
  - Font weight: 600 (Semibold)
  - Line height: 1.3
  - Letter spacing: normal
  - Color: `#111827`
- **h4**: `1.25rem/20px` (desktop), `1.125rem/18px` (mobile)
  - Font weight: 600 (Semibold)
  - Line height: 1.4
  - Letter spacing: normal
  - Color: `#111827`
- **h5**: `1.125rem/18px` (desktop), `1rem/16px` (mobile)
  - Font weight: 600 (Semibold)
  - Line height: 1.4
  - Letter spacing: normal
  - Color: `#111827`
- **h6**: `1rem/16px` (desktop), `0.875rem/14px` (mobile)
  - Font weight: 600 (Semibold)
  - Line height: 1.4
  - Letter spacing: normal
  - Color: `#111827`

#### Body Text
- **Body (Regular)**: `1rem/16px`
  - Font weight: 400 (Regular)
  - Line height: 1.5
  - Letter spacing: normal
  - Color: `#4A4A4A`
- **Body (Small)**: `0.875rem/14px`
  - Font weight: 400 (Regular)
  - Line height: 1.5
  - Letter spacing: normal
  - Color: `#4A4A4A`
- **Caption**: `0.75rem/12px`
  - Font weight: 400 (Regular)
  - Line height: 1.5
  - Letter spacing: 0.02em
  - Color: `#9A9A9A`

#### Special Text Styles
- **Button Text**: `0.875rem/14px`
  - Font weight: 600 (Semibold)
  - Text transform: Uppercase
  - Letter spacing: 0.05em
  - Font family: Montserrat
- **Nav Links**: `1rem/16px`
  - Font weight: 500 (Medium)
  - Text transform: None
  - Letter spacing: 0.01em
  - Font family: Montserrat
- **Product Price**: `1.25rem/20px`
  - Font weight: 700 (Bold)
  - Color: `#4b7cae` (Blue Accent)

### Spacing System

Consistent spacing is crucial for visual harmony across the interface. The spacing system is based on a 4px grid.

#### Spacing Tokens
- **2XS**: `0.25rem/4px` - For minimal separation (e.g., between icon and text)
- **XS**: `0.5rem/8px` - For tight spacing (e.g., between related elements)
- **S**: `0.75rem/12px` - For compact components
- **M**: `1rem/16px` - Base spacing unit (default)
- **L**: `1.5rem/24px` - For medium separation
- **XL**: `2rem/32px` - For clear separation between sections
- **2XL**: `3rem/48px` - For major section breaks
- **3XL**: `4rem/64px` - For large vertical separation between sections (desktop only)

#### Component Padding
- **Buttons**: `0.75rem 1.5rem` (padding-y, padding-x) for medium buttons
- **Cards**: `1.5rem` padding all around
- **Section containers**: `2rem` padding on desktop, `1.5rem` on mobile
- **Form fields**: `0.75rem 1rem` (padding-y, padding-x)

#### Component Margins
- **Between paragraphs**: `1rem` bottom margin
- **Between headings and content**: `0.75rem` bottom margin
- **Between sections**: `3rem` on desktop, `2rem` on mobile
- **Between form fields**: `1rem` bottom margin
- **Between cards in a grid**: `1.5rem` gap

### Shadows and Elevation

Consistent shadow styles help establish a sense of depth and hierarchy.

#### Shadow Tokens
- **Level 1** (Subtle): `0 1px 3px rgba(0, 0, 0, 0.05)`
  - Used for: Cards, form inputs, subtle interactive elements
- **Level 2** (Medium): `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
  - Used for: Dropdown menus, popovers, buttons
- **Level 3** (Pronounced): `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
  - Used for: Modals, sticky elements, floating actions
- **Level 4** (Heavy): `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
  - Used for: Top-level modals, critical notifications

### Border Radius

Consistent rounding of corners contributes to the modern, clean aesthetic.

#### Border Radius Tokens
- **None**: `0` - For square elements
- **XS**: `0.125rem/2px` - For subtle rounding
- **S**: `0.25rem/4px` - For buttons, input fields
- **M**: `0.375rem/6px` - For cards, modals (default)
- **L**: `0.5rem/8px` - For larger components
- **XL**: `1rem/16px` - For floating components, feature cards
- **Pill**: `9999px` - For tags, pills, badges

## Component Analysis

### Navigation Components

#### Navbar

**Current Implementation**: `src/components/Navbar.tsx` and `src/components/VidaNavbar.tsx`

**Gap Analysis**:
- **Color**: Update background to white, with borders using standardized `--color-primary-extralight` (#F4F4F5).
- **Typography**: Update to use Montserrat with `1rem/16px` size, 500 weight for consistent navigation.
- **Spacing**: 
  - Increase horizontal spacing between nav items to `1.5rem/24px`.
  - Adjust vertical padding to `1rem/16px` to match Hbada reference.
- **Interaction**: 
  - Add subtle hover effect with blue accent color underline animation.
  - Active page should use accent color to indicate current selection.

**Required Changes**:
```css
/* Navbar background */
.navbar {
  background-color: #FFFFFF;
  border-bottom: 1px solid #F4F4F5;
  padding: 1rem 2rem;
}

/* Nav items */
.nav-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0.75rem;
  transition: color 0.2s ease;
  position: relative;
}

/* Nav item hover effect */
.nav-link:hover {
  color: #4b7cae;
}

/* Nav item active state */
.nav-link.active {
  color: #4b7cae;
}

/* Mobile menu */
.mobile-menu {
  background-color: #FFFFFF;
  border-top: 1px solid #F4F4F5;
}
```

#### Footer

**Current Implementation**: `src/components/Footer.tsx`

**Gap Analysis**:
- **Color**: Update background to standardized dark blue-gray `#111827` for consistent branding. Currently inconsistent.
- **Typography**:
  - Footer headings should use Montserrat, `1.125rem/18px`, 600 weight, white color.
  - Footer links should use Lato, `0.875rem/14px`, 400 weight, light gray (#E6E6E6).
- **Spacing**:
  - Increase section spacing to `2rem/32px`.
  - Add proper padding: `3rem/48px` top and bottom, `2rem/32px` left and right.
- **Structure**:
  - Change to 4-column layout on desktop, stacked on mobile.
  - Add subtle separators between sections on mobile view.

**Required Changes**:
```css
/* Footer background */
.footer {
  background-color: #111827;
  padding: 3rem 2rem;
  color: #FFFFFF;
}

/* Footer headings */
.footer-heading {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 1rem;
}

/* Footer links */
.footer-link {
  font-family: 'Lato', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #E6E6E6;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

/* Footer link hover */
.footer-link:hover {
  color: #4b7cae;
}

/* Footer columns */
.footer-section {
  margin-bottom: 2rem;
}
```

#### Mobile Menu

**Current Implementation**: `src/components/VidaMobileMenu.tsx`

**Gap Analysis**:
- **Color**: Update background to white with subtle gray border for visual separation.
- **Typography**: Match the Navbar font styles for consistency.
- **Interaction**: 
  - Add slide-in animation for better user experience.
  - Add subtle hover effects using accent color.
- **Structure**:  
  - Move close button to top-right for easier access.
  - Add proper spacing between menu items (`1rem/16px`).

**Required Changes**:
```jsx
// Animation props for mobile menu
const mobileMenuVariants = {
  closed: { x: '100%', opacity: 0 },
  open: { x: '0%', opacity: 1, transition: { ease: 'easeOut', duration: 0.3 } }
};

// Style updates
<motion.div 
  className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 overflow-y-auto"
  variants={mobileMenuVariants}
  initial="closed"
  animate={isOpen ? 'open' : 'closed'}
>
  {/* Menu content here */}
</motion.div>
```

### Hero and Banner Components

#### HeroSlider

**Current Implementation**: `src/components/HeroSlider.tsx`

**Gap Analysis**:
- **Color**: Update overlay color to use standardized `#111827` with appropriate opacity for better text readability.
- **Typography**: 
  - Headings: Increase size to `2.5rem/40px` on desktop, `1.75rem/28px` on mobile, using Montserrat.
  - Subheading: Use Lato, `1.125rem/18px`, with proper line height (1.6).
- **Spacing**: 
  - Add more padding around text content: `3rem/48px` horizontally.
  - Ensure proper vertical spacing between heading and subheading (`1rem/16px`).
- **Structure**:
  - Adjust image aspect ratio to 16:9 on desktop, 3:4 on mobile.
  - Add subtle gradient overlay for better text visibility.
- **Interaction**:
  - Improve pagination indicators using blue accent color for active state.
  - Add subtle transitions between slides.

**Required Changes**:
```jsx
// Hero container styling
<div className="relative overflow-hidden">
  {/* Image */}
  <div className="relative w-full" style={{ height: '600px' }}>
    <img 
      src={slide.imageUrl} 
      alt={slide.alt || 'Hero Image'} 
      className="w-full h-full object-cover"
    />
    {/* Gradient overlay */}
    <div 
      className="absolute inset-0" 
      style={{ 
        background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.2), rgba(17, 24, 39, 0.7))' 
      }}
    ></div>
    
    {/* Content */}
    <div className="absolute inset-0 flex items-center justify-center text-center px-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading leading-tight">
          {slide.title}
        </h1>
        <p className="text-base md:text-lg text-white mb-8 font-body max-w-2xl mx-auto">
          {slide.subtitle}
        </p>
        <button className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-colors duration-300">
          {slide.buttonText}
        </button>
      </div>
    </div>
  </div>
</div>
```

#### ShippingPromoBanner

**Current Implementation**: `src/components/ShippingPromoBanner.tsx`

**Gap Analysis**:
- **Color**: Update background color from `#1a2b3c` to standardized `#111827`.
- **Typography**: 
  - Use Lato, `0.875rem/14px` on mobile, `1rem/16px` on desktop.
  - Set proper font weight (500) and color (white).
- **Spacing**: 
  - Add proper horizontal padding: `1rem/16px` on mobile, `2rem/32px` on desktop.
  - Reduce vertical padding to `0.75rem/12px` to make it less obtrusive.
- **Interaction**:
  - Add close button functionality with smooth fade-out animation.
  - Optional: Add subtle horizontal scrolling animation for content.

**Required Changes**:
```css
/* Banner container */
.shipping-promo-banner {
  background-color: #111827;
  padding: 0.75rem 2rem;
  color: #FFFFFF;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Close button */
.close-banner-btn {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
}

.close-banner-btn:hover {
  color: #FFFFFF;
}

/* Animation */
@keyframes slideText {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}

.animate-text {
  animation: slideText 15s linear infinite;
  white-space: nowrap;
}
```

#### PersonalizedBanner

**Current Implementation**: `src/components/PersonalizedBanner.tsx`

**Gap Analysis**:
- **Color**: Use a light gray background (`#F4F4F5`) with `#111827` text for maximum readability.
- **Typography**: 
  - Use Montserrat, `1.125rem/18px`, semi-bold (600) for primary text.
  - Use Lato, `0.875rem/14px`, regular (400) for secondary text.
- **Layout**: 
  - Center-align content with proper icon + text spacing.
  - Add proper horizontal padding: `1.5rem/24px`.
- **Structure**:
  - Add subtle border radius (`0.25rem/4px`)
  - Add level 1 shadow for slight elevation.
- **Interaction**:
  - Add hover effect (slight scale or background color change) for clickable banners.

**Required Changes**:
```jsx
<div 
  className="bg-gray-100 py-3 px-6 rounded shadow-sm hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
  onClick={onBannerClick}
>
  <div className="flex items-center justify-center gap-3">
    {icon && <span className="text-accent">{icon}</span>}
    <div className="text-center">
      <p className="font-heading text-lg font-semibold text-primary">{primaryText}</p>
      {secondaryText && (
        <p className="font-body text-sm text-primary-light">{secondaryText}</p>
      )}
    </div>
  </div>
</div>
```

### Product Components

#### ProductCard

**Current Implementation**: `src/components/ProductCard.tsx` and `src/components/ProductCardSimple.tsx`

**Gap Analysis**:
- **Color**: Update to use white background with subtle border (`#E6E6E6`) and Level 1 shadow.
- **Typography**: 
  - Product title: Montserrat, `1rem/16px`, 600 weight, `#111827` color.
  - Price: Montserrat, `1.125rem/18px`, 700 weight, accent blue color (`#4b7cae`).
  - Sale price styling: Original price should be strikethrough, smaller (`0.875rem/14px`), gray (`#9A9A9A`).
- **Spacing**: 
  - Add consistent padding: `1rem/16px` all around.
  - Ensure proper spacing between image and text: `0.75rem/12px`.
- **Structure**:
  - Add hover effect: Slight shadow increase.
  - Maintain consistent image aspect ratio (1:1).
  - Add standardized 'Sale' tag for discounted items.
- **Interaction**:
  - Add subtle scale on hover (1.02) for desktop.
  - Add 'Quick View' button on hover.

**Required Changes**:
```jsx
<div 
  className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {/* Image container with fixed aspect ratio */}
  <div className="relative pt-[100%] overflow-hidden bg-gray-50">
    <img 
      src={product.featuredImage?.url} 
      alt={product.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
      style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
    />
    
    {/* Sale tag if discounted */}
    {product.compareAtPrice > product.price && (
      <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
        Sale
      </div>
    )}
    
    {/* Quick view button on hover */}
    {isHovered && (
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-90 transform transition-transform duration-300">
        <button className="w-full py-2 text-center text-primary font-heading text-sm font-medium hover:text-accent transition-colors">
          Quick View
        </button>
      </div>
    )}
  </div>
  
  {/* Product info */}
  <div className="p-4">
    <h3 className="font-heading text-base font-semibold text-primary mb-1 line-clamp-2">
      {product.title}
    </h3>
    <div className="flex items-center mt-2">
      <span className="font-heading text-lg font-bold text-accent">
        {formatPrice(product.price)}
      </span>
      {product.compareAtPrice > product.price && (
        <span className="ml-2 text-sm text-gray-500 line-through">
          {formatPrice(product.compareAtPrice)}
        </span>
      )}
    </div>
  </div>
</div>
```

#### ProductHeroShowcase

**Current Implementation**: `src/components/product/ProductHeroShowcase.tsx`

**Gap Analysis**:
- **Layout**:
  - Improve layout to 60% (images) / 40% (info) on desktop.
  - Stack vertically on mobile (image first, then info).
- **Image Gallery**:
  - Add subtle shadow to active thumbnail image.
  - Make thumbnails square with aspect ratio enforcement.
  - Keep main image larger with consistent aspect ratio.
- **Typography**:
  - Product title: Montserrat, `1.75rem/28px`, 700 weight on desktop; `1.5rem/24px` on mobile.
  - Price: Montserrat, `1.5rem/24px`, 700 weight, accent blue color.
  - Description: Lato, `1rem/16px`, 400 weight, `#4A4A4A` color.
  - Variant selector: Montserrat, `0.875rem/14px`, 500 weight.
- **Buttons & Interactions**:
  - Improve variant selector with consistent styling.
  - Add to Cart button: Increase size, use accent color, add hover state.
  - Quantity selector: Improve with +/- buttons and consistent styling.

**Required Changes**:
```jsx
// Image gallery improvements
<div className="image-gallery-container relative">
  <div className="main-image-container relative mb-4 overflow-hidden rounded-md shadow-md">
    <img 
      src={selectedImage} 
      alt={product.title}
      className="w-full h-auto object-cover"
    />
  </div>
  
  <div className="thumbnails-container flex flex-wrap gap-2">
    {product.images.edges.map((image, index) => (
      <button
        key={`thumb-${index}`}
        className={`
          thumbnail-item relative w-16 h-16 overflow-hidden rounded-md border-2 
          ${selectedImage === image.node.url 
            ? 'border-accent shadow-sm' 
            : 'border-transparent hover:border-gray-200'}
        `}
        onClick={() => handleThumbnailClick(image.node.url)}
      >
        <img 
          src={image.node.url} 
          alt={image.node.altText || `${product.title} - View ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </button>
    ))}
  </div>
</div>

// Product info improvements
<div className="product-info-container">
  <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-heading">
    {product.title}
  </h1>
  
  <div className="flex items-center mt-4 mb-4">
    <span className="text-xl md:text-2xl font-bold text-accent font-heading">
      {formatPrice(product.price)}
    </span>
    {product.compareAtPrice > product.price && (
      <span className="ml-3 text-base text-gray-500 line-through font-body">
        {formatPrice(product.compareAtPrice)}
      </span>
    )}
  </div>
  
  <div className="product-description text-base text-primary-light font-body mb-6">
    {product.description}
  </div>
  
  {/* Variant selector with improved styling */}
  <div className="variant-selector mb-6">
    <label className="block mb-2 text-sm font-medium text-primary font-heading">Variants</label>
    <div className="flex flex-wrap gap-2">
      {product.variants.edges.map(variant => (
        <button
          key={variant.node.id}
          className={`
            py-2 px-4 border rounded text-sm font-medium transition-colors 
            ${selectedVariant?.id === variant.node.id 
              ? 'border-accent bg-accent/10 text-accent' 
              : 'border-gray-200 bg-white text-primary-light hover:border-accent hover:text-accent'}
            ${!variant.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => handleVariantChange(variant.node.id)}
          disabled={!variant.node.availableForSale}
        >
          {variant.node.title}
        </button>
      ))}
    </div>
  </div>
  
  {/* Add to cart button with improved styling */}
  <button 
    className="
      w-full py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-md 
      transition-colors flex items-center justify-center gap-2 font-heading
    "
    onClick={handleAddToCart}
    disabled={!isAvailable}
  >
    <span>Add to Cart</span>
  </button>
</div>
```

#### ProductDetailSections

**Current Implementation**: `src/components/product/ProductDetailSections.tsx`

**Gap Analysis**:
- **Layout**:
  - Ensure consistent section spacing: `3rem/48px` between sections.
  - Use grid layout for specifications (3 columns on desktop, 2 on tablet, 1 on mobile).
  - Add tabbed interface for Features/Specifications/Reviews.
- **Typography**:
  - Section headings: Montserrat, `1.5rem/24px`, 600 weight, `#111827` color.
  - Feature titles: Montserrat, `1.25rem/20px`, 600 weight, `#111827` color.
  - Feature descriptions: Lato, `1rem/16px`, 400 weight, `#4A4A4A` color.
- **Cards & Containers**:
  - Add consistent card styling with white background, subtle border, and shadow.
  - Add hover effects to cards (subtle shadow increase).
  - Ensure proper padding: `1.5rem/24px` for cards.

**Required Changes**:
```jsx
// Tabbed interface for product details
const [activeTab, setActiveTab] = useState('features');

// Tab navigation
<div className="product-tabs border-b border-gray-200 mb-6">
  <div className="container max-w-6xl mx-auto">
    <nav className="flex space-x-8" aria-label="Product Information Tabs">
      <button
        className={`
          py-4 px-1 border-b-2 font-medium text-sm font-heading transition-colors
          ${activeTab === 'features'
            ? 'border-accent text-accent'
            : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'}
        `}
        onClick={() => setActiveTab('features')}
      >
        Features
      </button>
      <button
        className={`
          py-4 px-1 border-b-2 font-medium text-sm font-heading transition-colors
          ${activeTab === 'specifications'
            ? 'border-accent text-accent'
            : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'}
        `}
        onClick={() => setActiveTab('specifications')}
      >
        Specifications
      </button>
      <button
        className={`
          py-4 px-1 border-b-2 font-medium text-sm font-heading transition-colors
          ${activeTab === 'reviews'
            ? 'border-accent text-accent'
            : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'}
        `}
        onClick={() => setActiveTab('reviews')}
      >
        Reviews
      </button>
    </nav>
  </div>
</div>

// Features tab content
{activeTab === 'features' && (
  <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {featureItems.map((feature, index) => (
      <div 
        key={`feature-${index}`}
        className="feature-card bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="feature-image aspect-w-16 aspect-h-9">
          <img 
            src={feature.imageUrl} 
            alt={feature.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="feature-content p-6">
          <h3 className="text-xl font-semibold text-primary mb-2 font-heading">{feature.title}</h3>
          <p className="text-primary-light font-body">{feature.description}</p>
        </div>
      </div>
    ))}
  </div>
)}
```

### Form Components

#### Input Fields

**Current Implementation**: Various form inputs throughout the application

**Gap Analysis**:
- **Typography**: 
  - Labels: Montserrat, `0.875rem/14px`, 500 weight, `#111827` color.
  - Input text: Lato, `1rem/16px`, 400 weight, `#111827` color.
  - Placeholder text: Lato, `1rem/16px`, 400 weight, `#9A9A9A` color.
- **Styling**:
  - Increase height to `2.75rem/44px` for better touch targets.
  - Add consistent border color (`#E6E6E6`) with accent color focus state.
  - Add subtle background color (`#F9F9F9`) for better distinction.
  - Add proper border radius (`0.25rem/4px`).
- **States**:
  - Improve focus state with accent color border.
  - Improve error state with red border and error message.
  - Add loading/disabled states with appropriate styling.

**Required Changes**:
```css
/* Input container */
.form-group {
  margin-bottom: 1.25rem;
}

/* Label */
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

/* Input field */
.form-input {
  width: 100%;
  height: 2.75rem;
  padding: 0.5rem 1rem;
  background-color: #F9F9F9;
  border: 1px solid #E6E6E6;
  border-radius: 0.25rem;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: #111827;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Placeholder */
.form-input::placeholder {
  color: #9A9A9A;
}

/* Focus state */
.form-input:focus {
  border-color: #4b7cae;
  box-shadow: 0 0 0 1px rgba(75, 124, 174, 0.2);
  outline: none;
}

/* Error state */
.form-input.error {
  border-color: #EF4444;
  background-color: #FEF2F2;
}

/* Error message */
.form-error {
  margin-top: 0.25rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: #EF4444;
}
```

#### Buttons

**Current Implementation**: Various buttons throughout the application

**Gap Analysis**:
- **Typography**: 
  - Button text: Montserrat, `0.875rem/14px`, 600 weight, uppercase.
  - Large buttons: `1rem/16px`, medium buttons: `0.875rem/14px`, small buttons: `0.75rem/12px`.
- **Sizing**:
  - Large: Padding `0.75rem 1.5rem`.
  - Medium (default): Padding `0.5rem 1.25rem`.
  - Small: Padding `0.375rem 0.75rem`.
- **Colors**:
  - Primary: Blue accent (`#4b7cae`) with darker hover state (`#3b6188`).
  - Secondary: White with blue accent border.
  - Tertiary: Gray with darker gray hover state.
- **States**:
  - Hover: Darken background color or adjust opacity.
  - Active: Further darken or add inner shadow effect.
  - Disabled: Reduce opacity and add not-allowed cursor.
  - Loading: Add spinning indicator and prevent multiple clicks.

**Required Changes**:
```css
/* Base button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
  cursor: pointer;
}

/* Button sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-md {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* Button variants */
.btn-primary {
  background-color: #4b7cae;
  color: white;
  border: 1px solid #4b7cae;
}

.btn-primary:hover {
  background-color: #3b6188;
  border-color: #3b6188;
}

.btn-secondary {
  background-color: white;
  color: #4b7cae;
  border: 1px solid #4b7cae;
}

.btn-secondary:hover {
  background-color: rgba(75, 124, 174, 0.1);
}

.btn-tertiary {
  background-color: #F4F4F5;
  color: #4A4A4A;
  border: 1px solid #F4F4F5;
}

.btn-tertiary:hover {
  background-color: #E6E6E6;
  border-color: #E6E6E6;
}

/* Active state */
.btn:active {
  transform: translateY(1px);
}

/* Disabled state */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## Implementation Guidelines

To efficiently implement the design standardization, follow these guidelines:

### 1. Component-First Approach

Prioritize the implementation of high-impact components in this order:

1. **Core UI Elements**: Buttons, form inputs, and typography styles
2. **Navigation Components**: Navbar, mobile menu, and footer
3. **Product Components**: Product cards, detail pages, and gallery
4. **Marketing Components**: Hero banner, promotional sections

### 2. CSS Variables Implementation

Update the global CSS variables to match the standardized design tokens:

```css
:root {
  /* Colors */
  --color-primary: #111827;
  --color-primary-light: #4A4A4A;
  --color-primary-extralight: #F4F4F5;
  
  --color-accent: #4b7cae;
  --color-accent-light: #6b9cce;
  --color-accent-dark: #3b6188;
  
  /* Typography */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Lato', sans-serif;
  
  /* Spacing */
  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-s: 0.75rem;
  --space-m: 1rem;
  --space-l: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}
```

### 3. Tailwind Extension

Extend the Tailwind configuration to incorporate the design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111827',
          light: '#4A4A4A',
          extralight: '#F4F4F5',
        },
        accent: {
          DEFAULT: '#4b7cae',
          light: '#6b9cce',
          dark: '#3b6188',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
};
```

### 4. Testing & Verification

After implementing changes, verify against these criteria:

- **Visual Consistency**: Compare updated components with the design specifications.
- **Responsive Behavior**: Test components across mobile, tablet, and desktop breakpoints.
- **Interactive States**: Verify hover, active, focus, and disabled states for all components.
- **Accessibility**: Ensure color contrast meets WCAG AA standards (4.5:1 for normal text).

### 5. Phased Rollout

Implement the changes in phases:

1. **Phase 1**: Update global design tokens and core components
2. **Phase 2**: Update product-related components
3. **Phase 3**: Update marketing and secondary components
4. **Phase 4**: Final polish and cross-component consistency checks

## Gap Closure Priorities

Based on the gap analysis, here are the component updates in order of priority:

1. **Critical Fixes** (High Priority)
   - Standardize dark background colors to `#111827`
   - Implement consistent typography styles
   - Update primary button styling
   - Standardize form inputs

2. **Enhanced User Experience** (Medium Priority)
   - Improve product card hover effects
   - Enhance mobile menu interactions
   - Add consistent spacing to page sections
   - Improve ProductHeroShowcase layout and gallery

3. **Visual Polish** (Lower Priority)
   - Add subtle animations and transitions
   - Enhance shadows and elevation
   - Refine hover and interactive states
   - Add special states (loading, empty, error)
