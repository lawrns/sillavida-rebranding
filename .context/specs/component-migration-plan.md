# Component Migration Plan for Hbada Theme

## Priority 1: Core Layout Components
These components establish the overall look and feel of the site and appear on all pages.

1. **Navbar.tsx**
   - Replace teal background with black (#222429)
   - Update typography to Inter font
   - Use white text for nav items
   - Red accent for hover/active states

2. **Footer.tsx**
   - Replace teal background with black (#222429) 
   - Update typography to Inter font
   - White text for all elements
   - Red accents for links/buttons

3. **ShippingPromoBanner.tsx**
   - Convert to black background 
   - White text with red accent elements

4. **WhatsAppButton.tsx**
   - Consider changing to match Hbada style (possibly red)

## Priority 2: Home Page Components
These components appear on the landing page, which is the first impression for users.

1. **HeroSlider.tsx**
   - Clean white/black design
   - Large product images on white background
   - Black header text with red price/accent elements
   - Minimalist design aesthetic

2. **ProductCard.tsx / ProductCardSimple.tsx**
   - White cards with minimal shadow
   - Black text for product names
   - Red text for prices/CTAs
   - Simplified layout with more whitespace

3. **VidaBenefits.tsx / TrustIndicatorGroup.tsx**
   - Match Hbada clean aesthetic
   - Icon + text layout similar to mockup
   - Proper spacing between items

4. **CategoryShowcase.tsx / ProductGallery.tsx**
   - Clean grid layout with white cards
   - Minimal borders and shadows
   - Black text with red accents

## Priority 3: Product Page Components
These components appear on product detail pages, critical for conversion.

1. **ProductHeroShowcase.tsx**
   - Clean white background
   - Large product images
   - Black header text, red price
   - Add to cart buttons in black/red
   - Match Hbada spacing/layout

2. **ProductDetailSections.tsx / ProductFeatures.tsx**
   - Organized tab system similar to mockup
   - Black/white color scheme with red accents
   - Clean spacing and typography

3. **StickyAddToCart.tsx**
   - Black background with white text
   - Red accent for price/buttons

4. **BenefitTabs.tsx / ChairFeaturesComponent.tsx**
   - Update to clean black/white with red accents
   - Match Hbada spacing and typography

## Priority 4: Cart & Checkout Components
Critical for conversion completion.

1. **CartPage.tsx** (in pages folder)
   - Clean white background
   - Black table headers
   - Red accents for prices and CTAs
   - Streamlined layout matching Hbada

2. **MiniCart.tsx**
   - Black/white theme with red accents
   - Clean itemized layout

3. **CheckoutRedirect.tsx**
   - Simple, clean styling matching Hbada aesthetic

## Priority 5: Secondary Components
Components that appear but are less visually impactful.

1. **Pagination.tsx**
   - Simple black/white with red active state

2. **PromoBanner.tsx / ShopifyPromoBanner.tsx**
   - Clean design matching Hbada aesthetic

3. **TestimonialCarousel.tsx**
   - Dark gradient background with white text
   - Red accents for controls/highlights
   
4. **JudgeMeReviews.tsx**
   - Clean black/white styling with red star ratings

## Implementation Approach for Each Component

1. Identify legacy colors and classes
2. Map to new tokens:
   - Legacy teal → new black primary
   - Legacy terracotta/orange → new red accent
   - Legacy beige → white/light gray
3. Update typography to Inter font
4. Adjust spacing to match Hbada aesthetic
5. Test for visual alignment with mockup
6. Verify all functionality remains intact

## Key Design Patterns to Implement

1. **Headers and Navigation**
   - Black background (#222429)
   - White text
   - Red accents for active/hover states
   - Clean, minimalist layout

2. **Content Areas**
   - White backgrounds
   - Black text
   - Red accents for prices, buttons, highlights
   - Clean spacing with adequate whitespace

3. **Cards and Containers**
   - White backgrounds
   - Minimal borders (light gray)
   - Very subtle shadows (xs or sm)
   - Clean typography with proper hierarchy

4. **Buttons**
   - Primary: Black with white text
   - Secondary: White with black text and border
   - Accent/CTA: Red with white text
   - Minimal border radius (2px)

5. **Product Imagery**
   - Clean, white backgrounds
   - Generous spacing
   - Minimal decoration or overlays
