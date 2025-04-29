import React, { useEffect, useState } from 'react';
import themeSwitcher from '../utils/theme-switcher';
import '../styles/theme-switcher.css';

const ThemePreviewPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('enhanced');

  useEffect(() => {
    // Initialize theme switcher
    themeSwitcher.init();
    setCurrentTheme(themeSwitcher.currentTheme);

    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail.theme);
    };

    document.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      document.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const handleToggleTheme = () => {
    const newTheme = themeSwitcher.toggleTheme();
    setCurrentTheme(newTheme);
  };

  // Color swatches for the preview
  const colorSwatches = [
    { name: 'Teal', variable: '--color-teal' },
    { name: 'Teal Light', variable: '--color-teal-light' },
    { name: 'Teal Dark', variable: '--color-teal-dark' },
    { name: 'Beige', variable: '--color-beige' },
    { name: 'Beige Light', variable: '--color-beige-light' },
    { name: 'Beige Dark', variable: '--color-beige-dark' },
    { name: 'Sage', variable: '--color-sage' },
    { name: 'Sage Light', variable: '--color-sage-light' },
    { name: 'Sage Dark', variable: '--color-sage-dark' },
    { name: 'Terracotta', variable: '--color-terracotta' },
    { name: 'Terracotta Light', variable: '--color-terracotta-light' },
    { name: 'Terracotta Dark', variable: '--color-terracotta-dark' },
  ];

  // Get CSS variable value
  const getCssVariable = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  };

  return (
    <div className="theme-preview">
      <h1>SillaVida Theme Preview</h1>
      
      <div className="theme-toggle-container" style={{ marginBottom: '2rem' }}>
        <button 
          className="theme-toggle-btn" 
          onClick={handleToggleTheme}
          style={{ 
            backgroundColor: getCssVariable('--color-teal'),
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem'
          }}
        >
          {currentTheme === 'enhanced' ? 'Cambiar a Diseño Original' : 'Cambiar a Diseño Mejorado'}
        </button>
        <span style={{ marginLeft: '1rem', fontWeight: 500 }}>
          Tema Actual: {currentTheme === 'enhanced' ? 'Mejorado' : 'Original'}
        </span>
      </div>
      
      <div className="theme-preview-section">
        <h2>Paleta de Colores</h2>
        <div className="color-swatch-container">
          {colorSwatches.map((swatch) => (
            <div className="color-swatch" key={swatch.variable}>
              <div 
                className="color-swatch-color" 
                style={{ backgroundColor: getCssVariable(swatch.variable) }}
              ></div>
              <div className="color-swatch-info">
                <div className="color-swatch-name">{swatch.name}</div>
                <div className="color-swatch-value">{getCssVariable(swatch.variable)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="theme-preview-section">
        <h2>Botones</h2>
        <div className="component-preview">
          <div className="component-preview-item">
            <div className="component-preview-header">Botón Primario</div>
            <div className="component-preview-content">
              <button 
                className="btn-primary"
                style={{
                  backgroundColor: getCssVariable('--btn-primary-bg'),
                  color: getCssVariable('--btn-primary-text'),
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Botón Primario
              </button>
            </div>
          </div>
          
          <div className="component-preview-item">
            <div className="component-preview-header">Botón Secundario</div>
            <div className="component-preview-content">
              <button 
                className="btn-secondary"
                style={{
                  backgroundColor: getCssVariable('--btn-secondary-bg'),
                  color: getCssVariable('--btn-secondary-text'),
                  padding: '0.75rem 1.5rem',
                  border: `1px solid ${getCssVariable('--btn-secondary-border')}`,
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Botón Secundario
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="theme-preview-section">
        <h2>Tarjetas</h2>
        <div className="component-preview">
          <div className="component-preview-item">
            <div className="component-preview-header">Tarjeta Estándar</div>
            <div className="component-preview-content">
              <div 
                style={{
                  backgroundColor: getCssVariable('--color-card-bg'),
                  border: `1px solid ${getCssVariable('--color-card-border')}`,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: getCssVariable('--shadow-card')
                }}
              >
                <h3 style={{ color: getCssVariable('--color-teal'), marginBottom: '0.5rem' }}>
                  Título de Tarjeta
                </h3>
                <p style={{ color: getCssVariable('--text-secondary') }}>
                  Este es un ejemplo de tarjeta con el estilo actual.
                </p>
              </div>
            </div>
          </div>
          
          <div className="component-preview-item">
            <div className="component-preview-header">Tarjeta Alternativa</div>
            <div className="component-preview-content">
              <div 
                style={{
                  backgroundColor: getCssVariable('--color-card-bg-alt'),
                  border: `1px solid ${getCssVariable('--color-card-border-alt')}`,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: getCssVariable('--shadow-card')
                }}
              >
                <h3 style={{ color: getCssVariable('--color-teal'), marginBottom: '0.5rem' }}>
                  Título de Tarjeta
                </h3>
                <p style={{ color: getCssVariable('--text-secondary') }}>
                  Este es un ejemplo de tarjeta alternativa con el estilo actual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="theme-preview-section">
        <h2>Tipografía</h2>
        <div className="component-preview">
          <div className="component-preview-item">
            <div className="component-preview-header">Encabezados</div>
            <div className="component-preview-content">
              <h1 style={{ color: getCssVariable('--text-primary'), marginBottom: '0.5rem' }}>
                Encabezado 1
              </h1>
              <h2 style={{ color: getCssVariable('--text-primary'), marginBottom: '0.5rem' }}>
                Encabezado 2
              </h2>
              <h3 style={{ color: getCssVariable('--text-primary'), marginBottom: '0.5rem' }}>
                Encabezado 3
              </h3>
              <h4 style={{ color: getCssVariable('--text-primary'), marginBottom: '0.5rem' }}>
                Encabezado 4
              </h4>
            </div>
          </div>
          
          <div className="component-preview-item">
            <div className="component-preview-header">Texto</div>
            <div className="component-preview-content">
              <p style={{ color: getCssVariable('--text-primary'), marginBottom: '0.5rem' }}>
                Este es un párrafo de texto principal.
              </p>
              <p style={{ color: getCssVariable('--text-secondary'), marginBottom: '0.5rem' }}>
                Este es un párrafo de texto secundario.
              </p>
              <p>
                <a href="#" style={{ color: getCssVariable('--text-accent') }}>
                  Este es un enlace de texto
                </a>
              </p>
              <p style={{ color: getCssVariable('--text-price'), fontWeight: 'bold', marginTop: '0.5rem' }}>
                $1,299.00 MXN
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="theme-preview-section">
        <h2>Comparación de Temas</h2>
        <p style={{ marginBottom: '1rem' }}>
          Esta sección muestra una comparación visual entre los temas original y mejorado.
          Cambia entre los temas usando el botón en la parte superior para ver las diferencias.
        </p>
        
        <div className="theme-comparison">
          <div className="theme-comparison-column">
            <div className="theme-comparison-header" style={{ backgroundColor: getCssVariable('--color-teal'), color: 'white' }}>
              Tema {currentTheme === 'enhanced' ? 'Mejorado' : 'Original'}
            </div>
            <div className="theme-comparison-content">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: getCssVariable('--color-teal'), marginBottom: '0.5rem' }}>
                  Producto Destacado
                </h3>
                <div 
                  style={{
                    backgroundColor: getCssVariable('--color-card-bg'),
                    border: `1px solid ${getCssVariable('--color-card-border')}`,
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    boxShadow: getCssVariable('--shadow-card')
                  }}
                >
                  <h4 style={{ color: getCssVariable('--text-primary'), marginBottom: '0.5rem' }}>
                    Silla Ergonómica Vida
                  </h4>
                  <p style={{ color: getCssVariable('--text-secondary'), marginBottom: '0.5rem' }}>
                    Diseñada para mejorar tu postura y bienestar.
                  </p>
                  <p style={{ color: getCssVariable('--text-price'), fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    $1,299.00 MXN
                  </p>
                  <button 
                    style={{
                      backgroundColor: getCssVariable('--btn-primary-bg'),
                      color: getCssVariable('--btn-primary-text'),
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewPage;
