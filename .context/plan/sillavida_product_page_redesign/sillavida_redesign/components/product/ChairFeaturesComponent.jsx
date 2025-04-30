import React, { useState } from 'react';

// Placeholder features - ideally, these would come from product data/metafields
const features = [
  {
    id: 'headrest',
    name: 'Reposacabezas Ajustable',
    description: 'Soporte adaptable para cuello y cabeza, ajustable en altura e inclinación.',
    position: { top: '15%', left: '50%' } // Adjust positions based on the actual image
  },
  {
    id: 'backrest',
    name: 'Respaldo Ergonómico Transpirable',
    description: 'Malla de alta calidad que se adapta a tu espalda y permite el flujo de aire.',
    position: { top: '40%', left: '50%' }
  },
  {
    id: 'lumbar',
    name: 'Soporte Lumbar Dinámico',
    description: 'Soporte ajustable que promueve una postura saludable.',
    position: { top: '55%', left: '45%' }
  },
  {
    id: 'armrests',
    name: 'Reposabrazos 3D/4D',
    description: 'Ajustables en múltiples direcciones para un soporte personalizado del antebrazo.',
    position: { top: '50%', left: '25%' }
  },
  {
    id: 'seat',
    name: 'Asiento Confortable',
    description: 'Diseño ergonómico con espuma de alta densidad o malla para confort duradero.',
    position: { top: '65%', left: '50%' }
  },
  {
    id: 'mechanism',
    name: 'Mecanismo Avanzado',
    description: 'Permite reclinación sincronizada y ajuste de tensión.',
    position: { top: '75%', left: '55%' }
  },
  {
    id: 'base',
    name: 'Base Robusta y Ruedas Suaves',
    description: 'Base estable con ruedas diseñadas para deslizarse fácilmente en diversas superficies.',
    position: { top: '90%', left: '50%' }
  }
];

const ChairFeaturesComponent = ({ product }) => {
  const [activeFeature, setActiveFeature] = useState(null);

  const handleMarkerClick = (featureId) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  // Basic inline styles - replace with CSS classes later
  const styles = {
    section: {
      padding: '40px 0',
      borderBottom: '1px solid #eee',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '2em',
      fontWeight: '600',
      color: '#333',
    },
    content: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '30px',
      alignItems: 'flex-start',
    },
    imageContainer: {
      flex: '1 1 50%',
      position: 'relative',
      minWidth: '300px',
      maxWidth: '600px', // Limit max width
      margin: '0 auto', // Center if it becomes single column
    },
    chairImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
      borderRadius: '8px',
    },
    featureMarker: {
      position: 'absolute',
      transform: 'translate(-50%, -50%)', // Center the marker
      cursor: 'pointer',
    },
    markerDot: {
      width: '15px',
      height: '15px',
      backgroundColor: 'rgba(0, 128, 128, 0.8)', // Teal with some transparency
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 0 5px rgba(0,0,0,0.3)',
    },
    markerPulse: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '15px',
      height: '15px',
      backgroundColor: 'rgba(0, 128, 128, 0.5)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%) scale(1)',
      animation: 'pulse 1.5s infinite ease-out',
      zIndex: -1,
    },
    featureTooltip: {
        position: 'absolute',
        bottom: 'calc(100% + 10px)', // Position above the marker
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '0.9em',
        whiteSpace: 'nowrap',
        zIndex: 10,
        minWidth: '200px', // Ensure enough space for text
        textAlign: 'center',
    },
    featureCards: {
      flex: '1 1 45%',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    featureCard: {
      padding: '15px',
      border: '1px solid #eee',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    featureCardActive: {
      borderColor: '#008080', // Teal border
      boxShadow: '0 0 8px rgba(0, 128, 128, 0.3)',
    },
    featureCardTitle: {
      margin: '0 0 5px 0',
      fontSize: '1.1em',
      fontWeight: '600',
      color: '#008080', // Teal title
    },
    featureCardDescription: {
      margin: 0,
      fontSize: '0.95em',
      color: '#555',
      lineHeight: 1.5,
    },
    // Keyframes for pulse animation
    '@keyframes pulse': {
        '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.7 },
        '70%': { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 },
        '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
    }
  };

  // Inject keyframes into the document head (simple approach for inline styles)
  // In a real app, use CSS files or CSS-in-JS libraries
  React.useEffect(() => {
    const styleSheet = document.styleSheets[0];
    try {
        styleSheet.insertRule(`@keyframes pulse { ${styles['@keyframes pulse']['0%']} ${styles['@keyframes pulse']['70%']} ${styles['@keyframes pulse']['100%']} }`, styleSheet.cssRules.length);
    } catch (e) {
        console.warn('Could not insert keyframes rule:', e);
        // Fallback or alternative method might be needed for stricter environments
        const keyframesStyle = document.createElement('style');
        keyframesStyle.textContent = `@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; } 70% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 0; } }`;
        document.head.appendChild(keyframesStyle);
    }
  }, []);

  return (
    <section style={styles.section} className="chair-features-section">
      <div style={styles.header} className="section-header">
        <h2 style={styles.title}>Características Clave</h2>
      </div>

      <div style={styles.content} className="section-content">
        <div style={styles.imageContainer} className="chair-image-container">
          {/* Use a placeholder image path - ensure this exists in your public folder */}
          <img
            src="/images/chair-features.png" // Make sure this path is correct
            alt={`Características de ${product.title}`}
            style={styles.chairImage}
            className="chair-features-image"
          />

          {features.map(feature => (
            <div
              key={feature.id}
              style={{ ...styles.featureMarker, ...feature.position }}
              className={`feature-marker ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => handleMarkerClick(feature.id)}
              onMouseEnter={() => setActiveFeature(feature.id)} // Show tooltip on hover
              onMouseLeave={() => setActiveFeature(null)} // Hide tooltip on leave
            >
              <div style={styles.markerDot} className="marker-dot"></div>
              <div style={styles.markerPulse} className="marker-pulse"></div>

              {activeFeature === feature.id && (
                <div style={styles.featureTooltip} className="feature-tooltip">
                  {feature.name}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.featureCards} className="feature-cards">
          {features.map(feature => (
            <div
              key={feature.id}
              style={{
                ...styles.featureCard,
                ...(activeFeature === feature.id ? styles.featureCardActive : {}),
              }}
              className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => handleMarkerClick(feature.id)} // Allow clicking card too
              onMouseEnter={() => setActiveFeature(feature.id)} // Highlight card on hover
              onMouseLeave={() => setActiveFeature(null)} // Remove highlight on leave
            >
              <h3 style={styles.featureCardTitle}>{feature.name}</h3>
              <p style={styles.featureCardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChairFeaturesComponent;

