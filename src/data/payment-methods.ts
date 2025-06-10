/**
 * Payment Methods Data
 * Configuration for payment method icons and information displayed in footer
 */

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'bank' | 'digital' | 'convenience';
  alt: string;
}

export const paymentMethods: PaymentMethod[] = [
  // Credit Cards
  {
    id: 'visa',
    name: 'Visa',
    icon: '/icons/Metodos%20de%20pago/visa.sxIq5Dot.svg',
    type: 'card',
    alt: 'Tarjeta Visa'
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    icon: '/icons/Metodos%20de%20pago/master.CzeoQWmc.svg',
    type: 'card',
    alt: 'Tarjeta Mastercard'
  },
  {
    id: 'amex',
    name: 'American Express',
    icon: '/icons/Metodos%20de%20pago/american_express.C3z4WB9r.svg',
    type: 'card',
    alt: 'American Express'
  },
  
  // Banking
  {
    id: 'bbva',
    name: 'BBVA',
    icon: '/icons/Metodos%20de%20pago/bbvacie.ClnMUhdH.svg',
    type: 'bank',
    alt: 'BBVA Bancomer'
  },
  {
    id: 'spei',
    name: 'SPEI',
    icon: '/icons/Metodos%20de%20pago/spei.D-9zZLEi.svg',
    type: 'bank',
    alt: 'Transferencia SPEI'
  },
  
  // Digital Payments
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '/images/Metodos de pago/PayPal-1024x271px.svg.png',
    type: 'digital',
    alt: 'PayPal'
  },
  {
    id: 'conekta',
    name: 'Conekta',
    icon: '/images/Metodos de pago/Logotipo_Conekta_2023_logotipo_conekta_arquitectura+copia+3.png',
    type: 'digital',
    alt: 'Procesado por Conekta'
  },
  
  // Convenience Stores
  {
    id: 'circle-k',
    name: 'Circle K',
    icon: '/icons/Metodos%20de%20pago/circlek.DCOZEm2y.svg',
    type: 'convenience',
    alt: 'Pago en Circle K'
  },
  {
    id: 'seven-eleven',
    name: '7-Eleven',
    icon: '/icons/Metodos%20de%20pago/seveneleven.JDz9NISN.svg',
    type: 'convenience',
    alt: 'Pago en 7-Eleven'
  }
];

// Get payment methods by type for organized display
export const getPaymentMethodsByType = (type: PaymentMethod['type']): PaymentMethod[] => {
  return paymentMethods.filter(method => method.type === type);
};

// Get all major payment methods (cards + digital)
export const getMajorPaymentMethods = (): PaymentMethod[] => {
  return paymentMethods.filter(method => 
    method.type === 'card' || method.type === 'digital'
  );
};

// Get payment method display order priority
export const getPaymentMethodsDisplayOrder = (): PaymentMethod[] => {
  const displayOrder = ['visa', 'mastercard', 'amex', 'paypal', 'bbva', 'spei', 'conekta'];
  
  return displayOrder
    .map(id => paymentMethods.find(method => method.id === id))
    .filter((method): method is PaymentMethod => method !== undefined)
    .concat(
      paymentMethods.filter(method => !displayOrder.includes(method.id))
    );
};