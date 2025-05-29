import React from 'react';
import { createLazyComponent } from '../common/LazyComponent';

// Lazy load Judge.me components
const LazyVerifiedBadge = createLazyComponent(() => 
  import('../judgeMe').then(module => ({ default: module.VerifiedBadge }))
);

/**
 * EmailSubscriptionSection - Newsletter subscription with social proof
 * Self-contained component with verification badges
 */
const EmailSubscriptionSection: React.FC = () => {
  return (
    <section className="bg-[#000000] py-12 sm:py-16" data-component-name="HomePage">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
          {/* Left column: Form and social proof */}
          <div className="lg:w-3/5 text-center lg:text-left mb-10 lg:mb-0">
            <div className="inline-block bg-[#666666] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              DESCUENTOS EXCLUSIVOS
            </div>

            <LazyVerifiedBadge
              showText={true}
              containerClassName="mb-4"
              className="flex justify-center lg:justify-start"
            />

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
              Recibe ofertas especiales y novedades
            </h2>

            <p className="text-white/80 mb-6 max-w-2xl lg:max-w-none mx-auto lg:mx-0 font-body text-base">
              Únete a más de 5,000 clientes satisfechos y recibe un <span className="font-bold">10% de descuento</span> en tu primera compra.
            </p>

            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#000000] flex items-center justify-center text-xs text-gray-800">A</div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#000000] flex items-center justify-center text-xs text-gray-800">B</div>
                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#000000] flex items-center justify-center text-xs text-gray-800">C</div>
                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#000000] flex items-center justify-center text-xs text-gray-800">D</div>
              </div>
              <span className="text-white/70 ml-3 text-sm">+5,000 personas ya están suscritas</span>
            </div>

            <form className="max-w-md mx-auto lg:mx-0 flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#666666] text-base"
                aria-label="Correo electrónico para descuento"
              />
              <button
                type="submit"
                className="bg-[#666666] text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-[#666666]/90 transition-colors text-base"
                aria-label="Obtener descuento"
                data-component-name="HomePage"
              >
                Obtener 10% de descuento
              </button>
            </form>

            <div className="text-white/60 text-xs">
              Al suscribirte, aceptas recibir correos de marketing. Puedes darte de baja en cualquier momento.
            </div>
          </div>

          {/* Right column: Testimonials */}
          <div className="lg:w-2/5">
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              <div className="bg-[#000000] p-4 rounded-lg flex items-start">
                <div className="flex-shrink-0 mr-3 flex">
                  <LazyVerifiedBadge
                    showText={false}
                    containerClassName="m-0"
                  />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm">Gracias a la newsletter conseguí mi silla con un 15% de descuento.</p>
                  <p className="text-white/60 text-xs mt-1">María J. · Cliente verificada</p>
                </div>
              </div>

              <div className="bg-[#000000] p-4 rounded-lg flex items-start">
                <div className="flex-shrink-0 mr-3 flex">
                  <LazyVerifiedBadge
                    showText={false}
                    containerClassName="m-0"
                  />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm">Siempre recibo las mejores ofertas antes que nadie.</p>
                  <p className="text-white/60 text-xs mt-1">Carlos M. · Cliente verificado</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">
                <span className="font-semibold text-white">Excelencia en ofertas</span> ·
                <span className="text-white/60">Calificado por nuestros clientes</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailSubscriptionSection;