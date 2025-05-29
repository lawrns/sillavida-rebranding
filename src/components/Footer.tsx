import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollections } from '../lib/shopify';
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Truck,
  CreditCard,
  Clock,
  Send,
  Users,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

const SillaVidaFooter: React.FC<FooterProps> = ({ className = "" }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [tiendaHandle, setTiendaHandle] = useState<string | null>(null);

  // Fetch collections to get tienda handle (same logic as Navbar)
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getCollections();
        const tiendaCollection = collectionsData.find((c: any) => 
          c.title.toLowerCase().includes('tienda')
        );
        if (tiendaCollection) {
          setTiendaHandle(tiendaCollection.handle);
        }
      } catch (error) {
        console.error('Footer: Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      // Email marketing service integration
      console.log('Newsletter subscription:', email);
      setSubscriptionMessage('¡Gracias por suscribirte!');
      setEmail('');
    } catch (error) {
      setSubscriptionMessage('Error al suscribirse. Intenta de nuevo.');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionMessage(''), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Newsletter Bar Above Footer */}
      <section className="bg-gray-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Únete a la Comunidad SillaVida
              </h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Recibe consejos de ergonomía, ofertas exclusivas y las últimas novedades 
                directamente en tu correo. Únete a miles de profesionales que ya cuidan su bienestar.
              </p>
              
              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>+15,000 suscriptores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>97% satisfacción</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Sin spam garantizado</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Newsletter Form */}
            <div className="relative">
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-4 rounded-lg border border-gray-600 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                  >
                    {isSubscribing ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Suscribirse
                      </>
                    )}
                  </button>
                </div>
                
                {/* Success/Error Message */}
                {subscriptionMessage && (
                  <div className={`flex items-center space-x-2 text-sm ${subscriptionMessage.includes('Gracias') ? 'text-green-400' : 'text-red-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{subscriptionMessage}</span>
                  </div>
                )}
                
                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>Consejos de ergonomía semanales</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>Ofertas exclusivas para suscriptores</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>Acceso anticipado a nuevos productos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>Guías descargables gratuitas</span>
                  </div>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className={`relative pt-20 pb-10 overflow-hidden bg-black ${className}`}>
        {/* Subtle background elements - monochromatic */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-[10%] w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-[15%] w-80 h-80 rounded-full bg-gray-500/5 blur-3xl"></div>
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">

          {/* Company Info - SillaVida Branding */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="flex items-center group">
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xl group-hover:bg-gray-100 transition-colors">
                  SV
                </div>
                <span className="ml-3 text-2xl font-heading font-bold text-white">SillaVida</span>
              </Link>
            </div>

            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Especialistas en sillas ergonómicas de alta calidad. Mejoramos tu bienestar y productividad
              con diseños innovadores que cuidan tu postura y salud durante largas jornadas de trabajo.
            </p>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-300 text-sm">
                <Shield className="h-4 w-4 mr-2 text-gray-400" />
                <span>5 años garantía</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Truck className="h-4 w-4 mr-2 text-gray-400" />
                <span>Envío gratis</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                <span>12 MSI disponible</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>30 días prueba</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/sillavida"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/sillavida"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/sillavida"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/sillavida"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/category/tienda"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link
                  to="/promociones"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Promociones
                </Link>
              </li>
              <li>
                <Link
                  to="/category/mas-vendidos"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Más Vendidos
                </Link>
              </li>
              <li>
                <Link
                  to="/educacion/por-que-invertir-en-silla-ergonomica"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Ergonomía
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Categorías</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/category/sillavida-esencial"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  SillaVida Esencial
                </Link>
              </li>
              <li>
                <Link
                  to="/category/sillavida-confort"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  SillaVida Confort
                </Link>
              </li>
              <li>
                <Link
                  to="/category/sillavida-zen"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  SillaVida Zen
                </Link>
              </li>
              <li>
                <Link
                  to="/category/mas-vendidos"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Más Vendidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Av. Insurgentes Sur 1234,<br />
                  Col. Del Valle, CDMX 03100
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:hola@sillavida.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  hola@sillavida.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+525555123456"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  +52 (55) 5512-3456
                </a>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2 text-sm">Horarios de Atención</h4>
              <div className="text-gray-300 text-xs space-y-1">
                <div>Lun - Vie: 9:00 AM - 7:00 PM</div>
                <div>Sáb: 10:00 AM - 6:00 PM</div>
                <div>Dom: 11:00 AM - 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>


        {/* Copyright and Legal Links */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} SillaVida. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              to="/privacidad"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/terminos"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Términos de Servicio
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Política de Cookies
            </Link>
            <Link
              to="/garantia"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Garantía
            </Link>
            <Link
              to="/envios"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Envíos y Devoluciones
            </Link>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
};

export default SillaVidaFooter;
