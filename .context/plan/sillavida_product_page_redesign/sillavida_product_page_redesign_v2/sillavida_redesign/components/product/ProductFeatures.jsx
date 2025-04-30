import React from 'react';

// Mock data for features/benefits - ideally from product metafields
const mockFeatures = [
  {
    id: 'ergonomics',
    title: 'Diseño Ergonómico Superior',
    description: 'Promueve una postura saludable y reduce la tensión durante largas horas de uso, adaptándose a la curvatura natural de tu espalda.',
    icon: '/images/icons/ergonomics.svg', // Placeholder icon path
  },
  {
    id: 'comfort',
    title: 'Confort Inigualable',
    description: 'Materiales premium como malla transpirable y espuma de alta densidad aseguran comodidad y frescura todo el día.',
    icon: '/images/icons/comfort.svg',
  },
  {
    id: 'adjustability',
    title: 'Ajustabilidad Completa',
    description: 'Personaliza cada aspecto de tu silla, desde el reposacabezas hasta los reposabrazos y el soporte lumbar, para un ajuste perfecto.',
    icon: '/images/icons/adjustability.svg',
  },
  {
    id: 'durability',
    title: 'Construcción Duradera',
    description: 'Fabricada con materiales de alta calidad y una estructura robusta para garantizar años de uso confiable y soporte.',
    icon: '/images/icons/durability.svg',
  },
  {
    id: 'productivity',
    title: 'Potencia tu Productividad',
    description: 'Al mantenerte cómodo y bien apoyado, la silla te ayuda a concentrarte mejor y a ser más productivo en tus tareas.',
    icon: '/images/icons/productivity.svg',
  },
];

const ProductFeatures = ({ product }) => {
  // In a real scenario, parse features from product.metafields
  // const features = product.metafields?.features ? JSON.parse(product.metafields.features) : mockFeatures;
  const features = mockFeatures; // Using mock data

  // Basic inline styles - replace with CSS classes later
  const styles = {
    section: {
      padding: '40px 0',
      // borderBottom: '1px solid #eee', // Optional: remove border for last section
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '2em',
      fontWeight: '600',
      color: '#333',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
      gap: '30px',
    },
    featureCard: {
      textAlign: 'center',
      padding: '25px',
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
      backgroundColor: '#fff',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    featureCardHover: { // Example hover style (apply with CSS :hover)
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.08)',
    },
    iconContainer: {
      marginBottom: '15px',
    },
    icon: {
      width: '50px', // Adjust size as needed
      height: '50px',
      // Add color styling if using SVG icons that support it
    },
    featureTitle: {
      fontSize: '1.3em',
      fontWeight: '600',
      color: '#008080', // Teal title
      margin: '0 0 10px 0',
    },
    featureDescription: {
      fontSize: '0.95em',
      color: '#555',
      lineHeight: '1.6',
      margin: 0,
    },
  };

  return (
    <section style={styles.section} className="product-features-section">
      <div style={styles.header} className="section-header">
        <h2 style={styles.title}>Beneficios y Características</h2>
      </div>

      <div style={styles.content} className="features-container">
        {features.map((feature) => (
          <div key={feature.id} style={styles.featureCard} className="feature-card">
            <div style={styles.iconContainer} className="icon-container">
              {/* Placeholder for icon - replace with actual <img> or SVG component */}
              <img src={feature.icon} alt={`${feature.title} icon`} style={styles.icon} />
            </div>
            <h3 style={styles.featureTitle}>{feature.title}</h3>
            <p style={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeatures;

