import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ErgonomicEducationalSectionCondensed.css';

const ErgonomicEducationalSectionCondensed: React.FC = () => {
  return (
    <div className="ergonomic-educational-section-condensed">
      <div className="container">
        <div className="content-wrapper">
          <div className="text-content">
            <h2>¿Por qué invertir en una silla ergonómica?</h2>
            <p className="subtitle">Una inversión en tu bienestar que se amortiza día tras día</p>
            
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 16C25.6569 16 27 14.6569 27 13C27 11.3431 25.6569 10 24 10C22.3431 10 21 11.3431 21 13C21 14.6569 22.3431 16 24 16Z" fill="#F5F5DC"/>
                    <path d="M24 16V30" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 22H30" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 36L24 30L30 36" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="benefit-text">
                  <h3>Mejora de la Postura</h3>
                  <p>Reduce la presión en los discos lumbares hasta en un 30%</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 14C25.1046 14 26 13.1046 26 12C26 10.8954 25.1046 10 24 10C22.8954 10 22 10.8954 22 12C22 13.1046 22.8954 14 24 14Z" fill="#F5F5DC"/>
                    <path d="M32 20C33.1046 20 34 19.1046 34 18C34 16.8954 33.1046 16 32 16C30.8954 16 30 16.8954 30 18C30 19.1046 30.8954 20 32 20Z" fill="#F5F5DC"/>
                    <path d="M16 20C17.1046 20 18 19.1046 18 18C18 16.8954 17.1046 16 16 16C14.8954 16 14 16.8954 14 18C14 19.1046 14.8954 20 16 20Z" fill="#F5F5DC"/>
                    <path d="M24 38C28.4183 38 32 34.4183 32 30C32 25.5817 28.4183 22 24 22C19.5817 22 16 25.5817 16 30C16 34.4183 19.5817 38 24 38Z" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 26V30L27 33" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="benefit-text">
                  <h3>Mayor Concentración</h3>
                  <p>25% mayor concentración con estaciones de trabajo ergonómicas</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 28H32" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 20V36" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M32 12L16 20" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12L32 20" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="benefit-text">
                  <h3>Inversión en Salud</h3>
                  <p>Retorno de inversión 3:1 durante un período de 5 años</p>
                </div>
              </div>
            </div>
            
            <Link to="/educacion/por-que-invertir-en-silla-ergonomica" className="learn-more-link">
              Descubre más <ArrowRight className="arrow-icon" />
            </Link>
          </div>
          
          <div className="image-content">
            <img 
              src="/images/ergonomica.png" 
              alt="Beneficios de sillas ergonómicas" 
              className="main-image"
            />
            <div className="statistic-overlay">
              <div className="statistic-value">80%</div>
              <div className="statistic-label">de los adultos experimentan dolor de espalda</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErgonomicEducationalSectionCondensed;
