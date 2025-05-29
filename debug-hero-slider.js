// Debug script to inspect HeroSlider DOM and data
console.log('=== HERO SLIDER DEBUG ANALYSIS ===');

// 1. Check if HeroSlider section exists
const heroSection = document.querySelector('section.relative.overflow-hidden');
console.log('Hero Section Found:', !!heroSection);

if (heroSection) {
  // 2. Get the main title
  const title = heroSection.querySelector('h1[data-component-name="HeroSlider"]');
  console.log('Current Title:', title?.textContent);

  // 3. Get the description
  const description = heroSection.querySelector('p.text-xl.mb-4');
  console.log('Current Description:', description?.textContent);

  // 4. Get the price
  const price = heroSection.querySelector('.text-4xl.font-heading.font-bold');
  console.log('Current Price:', price?.textContent);

  // 5. Get the original price
  const originalPrice = heroSection.querySelector('.line-through');
  console.log('Original Price:', originalPrice?.textContent);

  // 6. Get the image
  const image = heroSection.querySelector('img');
  console.log('Current Image:', {
    src: image?.src,
    alt: image?.alt
  });

  // 7. Get features
  const features = Array.from(heroSection.querySelectorAll('.bg-black\\/10')).map(el => el.textContent?.trim());
  console.log('Current Features:', features);

  // 8. Get navigation dots
  const dots = heroSection.querySelectorAll('.w-3.h-3.rounded-full');
  console.log('Navigation Dots:', dots.length);
  console.log('Active Dot Index:', Array.from(dots).findIndex(dot => dot.classList.contains('scale-125')));

  // 9. Check for error messages
  const errorMsg = heroSection.querySelector('.bg-black\\/80');
  console.log('Error Message:', errorMsg?.textContent || 'None');

  // 10. Get button URLs
  const buyButton = heroSection.querySelector('button[data-component-name="HeroSlider"]');
  const detailsLink = heroSection.querySelector('a[href^="/product/"]');
  console.log('Buy Button:', buyButton?.textContent);
  console.log('Details Link:', detailsLink?.href);

  // 11. Check for loading state
  const loadingState = document.querySelector('.animate-pulse');
  console.log('Loading State Active:', !!loadingState);

  // 12. Get complete HTML structure
  console.log('=== COMPLETE HTML STRUCTURE ===');
  console.log(heroSection.outerHTML);
}

// 13. Check console for Shopify API logs
console.log('=== CHECKING FOR SHOPIFY LOGS ===');
console.log('Check browser console for "Fetching hero slides..." and related logs');

// 14. Check if React DevTools shows component state
console.log('=== REACT STATE CHECK ===');
console.log('Use React DevTools to inspect HeroSlider component state');
