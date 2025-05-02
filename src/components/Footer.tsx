import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, color: "#2A7A7A" } // Teal light color
  };

  return (
    <footer className="bg-teal-dark text-white" role="contentinfo" aria-label="Información del sitio y enlaces">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-xl mb-4">
              <div className="vida-logo">
                <span className="vida-logo-silla text-[#E8DED1]">Silla</span>
                <span className="vida-logo-vida text-[#F5F0E8]">Vida</span>
              </div>
            </h3>
            {/* Tagline removed as requested */}
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-heading font-semibold mb-4 text-[#E8DED1]" id="footer-links">Enlaces</h4>
            <ul className="space-y-3" aria-labelledby="footer-links">
              <motion.li variants={itemVariants}>
                <Link to="/tienda" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  Tienda
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/category/sillavida-esencial" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  SillaVida Esencial
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/category/sillavida-confort" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  SillaVida Confort
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/category/sillavida-zen" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  SillaVida Zen
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/nosotros" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  Nosotros
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-heading font-semibold mb-4 text-[#E8DED1]" id="footer-help">Ayuda</h4>
            <ul className="space-y-3" aria-labelledby="footer-help">
              <motion.li variants={itemVariants}>
                <Link to="/faq" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  Preguntas Frecuentes
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/envios" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  Envíos
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/garantia" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  Garantía
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/contacto" className="text-[#F5F0E8] hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center font-body">
                  Contacto
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-heading font-semibold mb-4 text-[#E8DED1]" id="footer-social">Síguenos</h4>
            <div className="flex space-x-6" aria-labelledby="footer-social">
              <motion.a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="text-[#F5F0E8]"
                variants={iconVariants}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="text-[#F5F0E8]"
                variants={iconVariants}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="mailto:info@sillavida.com" 
                aria-label="Contáctanos por correo"
                className="text-[#F5F0E8]"
                variants={iconVariants}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 pt-6 sm:pt-8 border-t border-teal text-center text-beige-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm font-body footer-text">&copy; {new Date().getFullYear()} 
            <span className="vida-logo mx-1">
              <span className="vida-logo-silla text-[#E8DED1]">Silla</span>
              <span className="vida-logo-vida text-[#F5F0E8]">Vida</span>
            </span>
            Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
