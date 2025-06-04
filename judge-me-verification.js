/**
 * Judge.me Integration Verification Script
 * 
 * Copy and paste this script into your browser's DevTools Console
 * on the product page to verify the Judge.me integration is working correctly.
 */

console.log('🔍 Judge.me Integration Verification Starting...\n');

// 1. Check if Judge.me script is loaded
console.log('1. Script Loading Check:');
if (typeof window.jdgm !== 'undefined') {
  console.log('✅ window.jdgm is defined');
  console.log('   Available methods:', Object.keys(window.jdgm).filter(key => typeof window.jdgm[key] === 'function'));
  
  if (typeof window.jdgm.renderWidgets === 'function') {
    console.log('✅ renderWidgets() method is available');
  } else {
    console.log('❌ renderWidgets() method is NOT available');
  }
} else {
  console.log('❌ window.jdgm is NOT defined - script may not be loaded');
}

// 2. Check script loading in Network tab
console.log('\n2. Network Check:');
console.log('🔍 Check DevTools → Network tab → filter by "judge.me"');
console.log('   You should see exactly ONE request to:');
console.log('   https://cdnwidget.judge.me/widget_preloader.js (200 OK)');

// 3. Check for Judge.me containers
console.log('\n3. Widget Container Check:');
const reviewWidgets = document.querySelectorAll('.jdgm-review-widget');
const ugcWidgets = document.querySelectorAll('.jdgm-ugc-media-wrapper');

console.log(`   Found ${reviewWidgets.length} review widget container(s)`);
console.log(`   Found ${ugcWidgets.length} UGC media grid container(s)`);

reviewWidgets.forEach((widget, index) => {
  const dataId = widget.getAttribute('data-id');
  const locale = widget.getAttribute('data-locale');
  console.log(`   Review Widget ${index + 1}:`);
  console.log(`     data-id: ${dataId}`);
  console.log(`     data-locale: ${locale}`);
  console.log(`     classes: ${widget.className}`);
});

ugcWidgets.forEach((widget, index) => {
  const productId = widget.getAttribute('data-product-id');
  const locale = widget.getAttribute('data-locale');
  console.log(`   UGC Widget ${index + 1}:`);
  console.log(`     data-product-id: ${productId}`);
  console.log(`     data-locale: ${locale}`);
});

// 4. Check for any conflicting CSS
console.log('\n4. CSS Check:');
reviewWidgets.forEach((widget, index) => {
  const styles = window.getComputedStyle(widget);
  const display = styles.display;
  const visibility = styles.visibility;
  const opacity = styles.opacity;
  
  console.log(`   Review Widget ${index + 1} styles:`);
  console.log(`     display: ${display}`);
  console.log(`     visibility: ${visibility}`);
  console.log(`     opacity: ${opacity}`);
  
  if (display === 'none' || visibility === 'hidden' || opacity === '0') {
    console.log('   ⚠️  Widget may be hidden by CSS');
  }
});

// 5. Test manual rendering
console.log('\n5. Manual Render Test:');
if (typeof window.jdgm !== 'undefined' && typeof window.jdgm.renderWidgets === 'function') {
  console.log('🔄 Calling window.jdgm.renderWidgets()...');
  try {
    window.jdgm.renderWidgets();
    console.log('✅ renderWidgets() called successfully');
    console.log('   Check if reviews appeared in the containers above');
  } catch (error) {
    console.log('❌ Error calling renderWidgets():', error);
  }
} else {
  console.log('❌ Cannot test manual rendering - renderWidgets() not available');
}

// 6. Check Judge.me configuration
console.log('\n6. Configuration Check:');
if (typeof window.jdgm !== 'undefined') {
  console.log(`   SHOP_DOMAIN: ${window.jdgm.SHOP_DOMAIN}`);
  console.log(`   PLATFORM: ${window.jdgm.PLATFORM}`);
  console.log(`   PUBLIC_TOKEN: ${window.jdgm.PUBLIC_TOKEN ? '***' + window.jdgm.PUBLIC_TOKEN.slice(-4) : 'NOT SET'}`);
}

// 7. Console error check
console.log('\n7. Console Error Check:');
console.log('🔍 Check DevTools → Console for any errors containing:');
console.log('   - "jdgm is not defined"');
console.log('   - "Cannot read property \'renderWidgets\'"');
console.log('   - Any other Judge.me related errors');

console.log('\n🎯 Verification Complete!');
console.log('\nNext Steps:');
console.log('1. If window.jdgm is undefined → Check index.html script tags');
console.log('2. If renderWidgets() is undefined → Check script loading errors');
console.log('3. If containers are found but empty → Check data-id matches Judge.me Admin');
console.log('4. If manual renderWidgets() works → Check React useEffect timing');