import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RandomProductImage from './RandomProductImage';

const ErgonomicEducationalSectionCondensed: React.FC = () => {
  return (
    <div className="bg-[#111827] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="md:max-w-[50%] w-full">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">¿Por qué invertir en una silla ergonómica?</h2>
            <p className="text-xl text-white/90 mb-8 font-body">Una inversión en tu bienestar que se amortiza día tras día</p>
            
            <div className="grid gap-6 mb-8">
              <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-lg hover:translate-y-[-3px] transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 flex items-center justify-center bg-neutral-800 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 16C25.6569 16 27 14.6569 27 13C27 11.3431 25.6569 10 24 10C22.3431 10 21 11.3431 21 13C21 14.6569 22.3431 16 24 16Z" fill="white"/>
                    <path d="M24 16V30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 22H30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 36L24 30L30 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white mb-1">Mejora de la Postura</h3>
                  <p className="text-sm text-white/80">Reduce la presión en los discos lumbares hasta en un 30%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-lg hover:translate-y-[-3px] transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 flex items-center justify-center bg-neutral-800 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 14C25.1046 14 26 13.1046 26 12C26 10.8954 25.1046 10 24 10C22.8954 10 22 10.8954 22 12C22 13.1046 22.8954 14 24 14Z" fill="white"/>
                    <path d="M32 20C33.1046 20 34 19.1046 34 18C34 16.8954 33.1046 16 32 16C30.8954 16 30 16.8954 30 18C30 19.1046 30.8954 20 32 20Z" fill="white"/>
                    <path d="M16 20C17.1046 20 18 19.1046 18 18C18 16.8954 17.1046 16 16 16C14.8954 16 14 16.8954 14 18C14 19.1046 14.8954 20 16 20Z" fill="white"/>
                    <path d="M24 38C28.4183 38 32 34.4183 32 30C32 25.5817 28.4183 22 24 22C19.5817 22 16 25.5817 16 30C16 34.4183 19.5817 38 24 38Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 26V30L27 33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white mb-1">Mayor Concentración</h3>
                  <p className="text-sm text-white/80">25% mayor concentración con estaciones de trabajo ergonómicas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-lg hover:translate-y-[-3px] transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 flex items-center justify-center bg-neutral-800 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 28H32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 20V36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M32 12L16 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12L32 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white mb-1">Inversión en Salud</h3>
                  <p className="text-sm text-white/80">Retorno de inversión 3:1 durante un período de 5 años</p>
                </div>
              </div>
            </div>
            
            <Link to="/educacion/por-que-invertir-en-silla-ergonomica" className="inline-flex items-center text-accent hover:text-white transition-colors font-heading font-semibold">
              Descubre más <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="md:max-w-[45%] w-full h-[450px] md:h-[450px] rounded-lg overflow-hidden shadow-md">
            <RandomProductImage 
              className="w-full h-full object-cover"
              alt="Beneficios de sillas ergonómicas" 
              interval={7000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErgonomicEducationalSectionCondensed;
