import React from 'react';

/**
 * PaymentMethods - Display accepted payment methods
 * Shows PayPal and Conekta logos with proper branding
 */
const PaymentMethods: React.FC = () => {
  return (
    <div className="pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-600 mb-3 text-center">
        Métodos de pago aceptados:
      </p>
      
      {/* First row - Main payment processors */}
      <div className="flex items-center justify-center space-x-3 mb-3">
        {/* PayPal */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[80px] h-10">
          <img
            src="/images/Metodos de pago/PayPal-1024x271px.svg.png"
            alt="PayPal"
            className="h-8 object-contain"
            loading="lazy"
          />
        </div>

        {/* Conekta */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[80px] h-10">
          <img
            src="/images/Metodos de pago/Logotipo_Conekta_2023_logotipo_conekta_arquitectura+copia+3.png"
            alt="Conekta"
            className="h-8 object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Second row - Credit cards and additional methods */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {/* Visa */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/visa.sxIq5Dot.svg"
            alt="Visa"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>

        {/* MasterCard */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/master.CzeoQWmc.svg"
            alt="MasterCard"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>

        {/* American Express */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/american_express.C3z4WB9r.svg"
            alt="American Express"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>

        {/* BBVA */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/bbvacie.ClnMUhdH.svg"
            alt="BBVA"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>

        {/* SPEI */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/spei.D-9zZLEi.svg"
            alt="SPEI"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>

        {/* 7-Eleven */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/seveneleven.JDz9NISN.svg"
            alt="7-Eleven"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>

        {/* Circle K */}
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
          <img
            src="/icons/Metodos de pago/circlek.DCOZEm2y.svg"
            alt="Circle K"
            className="h-5 object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Additional payment info */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Pagos seguros con encriptación SSL
      </p>
    </div>
  );
};

export default PaymentMethods;