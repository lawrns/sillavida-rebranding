import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { Facebook, Instagram, Mail, ExternalLink } from 'lucide-react';

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
    hover: { scale: 1.2, color: "#ffffff" }
  };

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo" aria-label="Información del sitio y enlaces">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Silla Vida</h3>
            <p className="text-gray-400 text-sm md:text-base">
              Comodidad y estilo para tu espacio de trabajo y gaming.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4" id="footer-links">Enlaces</h4>
            <ul className="space-y-3" aria-labelledby="footer-links">
              <motion.li variants={itemVariants}>
                <Link to="/tienda" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Tienda
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/oficina" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Sillas de Oficina
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/gamer" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Sillas Gamer
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/nosotros" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Nosotros
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4" id="footer-help">Ayuda</h4>
            <ul className="space-y-3" aria-labelledby="footer-help">
              <motion.li variants={itemVariants}>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Preguntas Frecuentes
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/envios" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Envíos
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/garantia" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Garantía
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link to="/contacto" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base inline-flex items-center">
                  Contacto
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4" id="footer-social">Síguenos</h4>
            <div className="flex space-x-6" aria-labelledby="footer-social">
              <motion.a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="text-gray-400"
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
                className="text-gray-400"
                variants={iconVariants}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="mailto:info@sillavida.com" 
                aria-label="Contáctanos por correo"
                className="text-gray-400"
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
          className="mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">&copy; {new Date().getFullYear()} Silla Vida. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
