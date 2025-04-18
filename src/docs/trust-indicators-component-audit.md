# Trust Indicators Component Audit

This document identifies all components that display trust indicators across the SillaVida website and outlines the changes needed to implement wellness-focused messaging based on the trust messaging framework.

## 1. Product Page (src/pages/ProductPage.tsx)

### Current Trust Indicators

```jsx
<div className="space-y-4 border-t pt-6">
  <div className="flex items-center gap-3">
    <Truck className="h-6 w-6 text-gray-600" />
    <div>
      <h4 className="font-semibold">Envío Gratis</h4>
      <p className="text-sm text-gray-600">En pedidos mayores a $999 MXN</p>
    </div>
  </div>
  <div className="flex items-center gap-3">
    <Shield className="h-6 w-6 text-gray-600" />
    <div>
      <h4 className="font-semibold">Garantía de 12 Meses</h4>
      <p className="text-sm text-gray-600">En todos nuestros productos</p>
    </div>
  </div>
  <div className="flex items-center gap-3">
    <CreditCard className="h-6 w-6 text-gray-600" />
    <div>
      <h4 className="font-semibold">Pago Seguro</h4>
      <p className="text-sm text-gray-600">Múltiples métodos de pago</p>
    </div>
  </div>
</div>
```

### Proposed Changes

1. Update heading and text for each trust indicator:
   - "Envío Gratis" → "Envío Consciente"
   - "Garantía de 12 Meses" → "Garantía de Bienestar"
   - "Pago Seguro" → "Pago Sereno"

2. Update descriptions to focus on wellness benefits:
   - Shipping: Focus on bringing wellness to your space with minimal stress
   - Warranty: Focus on protecting the customer's investment in their health and comfort
   - Payment: Focus on a peaceful, stress-free investment process

3. Add a new "Compromiso Vida" section highlighting the brand's dedication to customer wellbeing

4. Update icon colors to use the SillaVida color palette (sage, teal)

5. Add subtle "Vida" theme elements to the design

## 2. Cart Page (src/pages/CartPage.tsx)

### Current Trust Indicators

```jsx
<div className="mt-8 space-y-5">
  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Compra con confianza</h3>
  <motion.div 
    className="p-4 border border-gray-200 rounded-lg"
    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-3">
      <Truck className="h-6 w-6 text-teal" />
      <div>
        <h4 className="font-semibold">Envío Gratis</h4>
        <p className="text-sm text-gray-600">En pedidos mayores a $10,000 MXN</p>
      </div>
    </div>
  </motion.div>
  
  <motion.div 
    className="p-4 border border-gray-200 rounded-lg"
    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-3">
      <Shield className="h-6 w-6 text-teal" />
      <div>
        <h4 className="font-semibold">Garantía de 12 Meses</h4>
        <p className="text-sm text-gray-600">En todos nuestros productos</p>
      </div>
    </div>
  </motion.div>
  
  <motion.div 
    className="p-4 border border-gray-200 rounded-lg"
    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-3">
      <CreditCard className="h-6 w-6 text-teal" />
      <div>
        <h4 className="font-semibold">Pago Seguro</h4>
        <p className="text-sm text-gray-600">Múltiples métodos de pago</p>
      </div>
    </div>
  </motion.div>
  
  <!-- Payment methods logos -->
  <div className="mt-4 flex justify-center gap-3">
    <img src="/images/visa.png" alt="Visa" className="h-6" />
    <img src="/images/mastercard.png" alt="Mastercard" className="h-6" />
    <img src="/images/amex.png" alt="American Express" className="h-6" />
    <img src="/images/paypal.png" alt="PayPal" className="h-6" />
  </div>
</div>
```

### Proposed Changes

1. Update section heading:
   - "Compra con confianza" → "Invierte en tu bienestar con confianza"

2. Update heading and text for each trust indicator (same as Product Page):
   - "Envío Gratis" → "Envío Consciente"
   - "Garantía de 12 Meses" → "Garantía de Bienestar"
   - "Pago Seguro" → "Pago Sereno"

3. Update descriptions to focus on wellness benefits (same as Product Page)

4. Add a new "Compromiso Vida" section

5. Update the design to incorporate the "Vida" theme elements

6. Add subtle leaf or wellness symbols to the icons

## 3. Checkout Redirect (src/components/CheckoutRedirect.tsx)

### Current Trust Indicators

```jsx
<motion.div 
  className="mt-8 border-t pt-6"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
>
  <p className="text-base font-medium text-gray-800 mb-4">Pago 100% Seguro</p>
  
  <!-- Security Badges -->
  <div className="flex flex-wrap justify-center gap-4 mb-6">
    <motion.div 
      className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg"
      whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Lock className="h-6 w-6 text-green-600 mb-1" aria-label="Conexión Segura" />
      <span className="text-xs font-medium text-gray-700">Conexión Segura</span>
    </motion.div>
    
    <motion.div 
      className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg"
      whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Shield className="h-6 w-6 text-green-600 mb-1" aria-label="Protección de Datos" />
      <span className="text-xs font-medium text-gray-700">Datos Protegidos</span>
    </motion.div>
    
    <motion.div 
      className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg"
      whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <CreditCard className="h-6 w-6 text-green-600 mb-1" aria-label="Pago Seguro" />
      <span className="text-xs font-medium text-gray-700">Pago Seguro</span>
    </motion.div>
  </div>
  
  <!-- Payment Method Logos -->
  <p className="text-sm font-medium text-gray-700 mb-3">Aceptamos</p>
  <div className="flex items-center justify-center space-x-4 mb-4">
    <img src="/images/visa.png" alt="Visa" className="h-8" />
    <img src="/images/mastercard.png" alt="Mastercard" className="h-8" />
    <img src="/images/amex.png" alt="American Express" className="h-8" />
    <img src="/images/paypal.png" alt="PayPal" className="h-8" />
  </div>
</motion.div>
```

### Proposed Changes

1. Update section heading:
   - "Pago 100% Seguro" → "Invierte en tu bienestar con total tranquilidad"

2. Update security badge text:
   - "Conexión Segura" → "Conexión Protegida"
   - "Datos Protegidos" → "Datos Resguardados"
   - "Pago Seguro" → "Pago Sereno"

3. Update icon colors to use the SillaVida color palette (sage, teal)

4. Add subtle wellness elements to the security badges

5. Add a brief message about the "Compromiso Vida" below the payment logos

## 4. MiniCart Component (src/components/MiniCart.tsx)

The MiniCart component doesn't currently display trust indicators, but it would be beneficial to add a small trust indicator at the bottom of the mini cart to reinforce the wellness-focused messaging.

### Proposed Addition

Add a small "Garantía de Bienestar" badge at the bottom of the mini cart with a brief message about investing in wellbeing.

## Implementation Priority

1. Product Page - High Priority
   - Most visible to customers during the product evaluation phase
   - Critical for building trust during the decision-making process

2. Cart Page - High Priority
   - Important for reinforcing trust during the checkout process
   - Directly impacts conversion rates

3. Checkout Redirect - Medium Priority
   - Reinforces trust during the transition to payment
   - Less critical as the customer has already decided to purchase

4. MiniCart Component - Low Priority
   - Enhances the overall messaging consistency
   - Less critical for immediate implementation

## Next Steps

1. Design visual badges for each trust category based on the trust messaging framework
2. Update the Product Page trust indicators
3. Update the Cart Page trust indicators
4. Update the Checkout Redirect trust indicators
5. Add a trust indicator to the MiniCart component
