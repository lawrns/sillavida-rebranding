import React from 'react';
import ErgonomicEducationalSection from '../components/ErgonomicEducationalSection';
import { Helmet } from 'react-helmet';
import './ErgonomicEducationPage.css';

const ErgonomicEducationPage: React.FC = () => {
  return (
    <div className="ergonomic-education-page">
      <Helmet>
        <title>Por qué invertir en una silla ergonómica | SillaVida</title>
        <meta 
          name="description" 
          content="Descubre los beneficios para la salud, productividad y valor a largo plazo de invertir en una silla ergonómica. Una inversión en tu bienestar que se amortiza día tras día." 
        />
        <meta 
          name="keywords" 
          content="silla ergonómica, beneficios ergonomía, salud laboral, productividad oficina, postura correcta, dolor de espalda, inversión salud" 
        />
        <meta property="og:title" content="Por qué invertir en una silla ergonómica | SillaVida" />
        <meta 
          property="og:description" 
          content="Descubre los beneficios para la salud, productividad y valor a largo plazo de invertir en una silla ergonómica. Una inversión en tu bienestar." 
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://sillavida.com/educacion/por-que-invertir-en-silla-ergonomica" />
        <meta property="og:image" content="https://sillavida.com/images/ergonomic-chair-benefits.jpg" />
        <link rel="canonical" href="https://sillavida.com/educacion/por-que-invertir-en-silla-ergonomica" />
      </Helmet>

      <div className="page-header">
        <div className="container">
          <h1>Por qué invertir en una silla ergonómica</h1>
          <p className="subtitle">Una inversión en tu bienestar que se amortiza día tras día</p>
        </div>
      </div>

      <ErgonomicEducationalSection />

      <div className="related-content">
        <div className="container">
          <h2>Contenido relacionado</h2>
          <div className="related-content-grid">
            <div className="related-content-item">
              <h3>Guía de ajustes ergonómicos</h3>
              <p>Aprende a ajustar correctamente tu silla ergonómica para obtener el máximo beneficio.</p>
              <a href="/educacion/guia-ajustes-ergonomicos" className="button tertiary">Leer más</a>
            </div>
            <div className="related-content-item">
              <h3>Ejercicios para hacer en tu silla</h3>
              <p>Ejercicios simples que puedes hacer mientras estás sentado para mejorar tu circulación y reducir la tensión.</p>
              <a href="/educacion/ejercicios-en-silla" className="button tertiary">Leer más</a>
            </div>
            <div className="related-content-item">
              <h3>Cómo elegir la silla perfecta</h3>
              <p>Factores a considerar para encontrar la silla ergonómica que mejor se adapte a tus necesidades específicas.</p>
              <a href="/educacion/como-elegir-silla-ergonomica" className="button tertiary">Leer más</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErgonomicEducationPage;
