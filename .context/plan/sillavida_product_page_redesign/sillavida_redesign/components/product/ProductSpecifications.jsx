import React from 'react';

// Mock data structure, assuming fetched from product.metafields or similar
const mockSpecifications = {
  dimensions: {
    title: 'Dimensiones Generales',
    specs: [
      { label: 'Altura Total', value: '115 - 125 cm' },
      { label: 'Ancho del Asiento', value: '52 cm' },
      { label: 'Profundidad del Asiento', value: '48 cm' },
      { label: 'Altura del Respaldo', value: '75 cm' },
      { label: 'Ancho del Respaldo', value: '50 cm' },
      { label: 'Altura del Asiento (desde el suelo)', value: '45 - 55 cm' },
    ]
  },
  technical: {
    title: 'Detalles Técnicos',
    specs: [
      { label: 'Peso Máximo Soportado', value: '130 kg' },
      { label: 'Material del Tapizado', value: 'Malla transpirable de alta resistencia' },
      { label: 'Material de la Estructura', value: 'Nylon reforzado y Acero' },
      { label: 'Material de la Base', value: 'Aluminio pulido' },
      { label: 'Tipo de Ruedas', value: 'Nylon con recubrimiento PU (aptas para suelos delicados)' },
      { label: 'Mecanismo', value: 'Sincronizado con bloqueo multiposición' },
    ]
  },
  adjustments: {
    title: 'Capacidades de Ajuste',
    specs: [
      { label: 'Reposacabezas', value: 'Ajustable en altura y ángulo' },
      { label: 'Reposabrazos', value: 'Ajustables 4D (altura, anchura, profundidad, ángulo)' },
      { label: 'Soporte Lumbar', value: 'Ajustable en altura y profundidad' },
      { label: 'Altura del Asiento', value: 'Ajustable (pistón de gas Clase 4)' },
      { label: 'Reclinación del Respaldo', value: 'Hasta 135° con bloqueo' },
      { label: 'Tensión de Inclinación', value: 'Ajustable' },
    ]
  },
  warranty: {
      title: 'Garantía y Certificaciones',
      specs: [
          { label: 'Garantía', value: '3 años en estructura y componentes' },
          { label: 'Certificaciones', value: 'BIFMA, SGS' },
      ]
  }
};

const ProductSpecifications = ({ product }) => {
  // In a real scenario, parse specifications from product.metafields
  // const specifications = product.metafields?.specifications ? JSON.parse(product.metafields.specifications) : mockSpecifications;
  const specifications = mockSpecifications; // Using mock data for now

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
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive columns
      gap: '30px',
    },
    column: {
      // Styles for each spec category column
    },
    subtitle: {
      fontSize: '1.4em',
      fontWeight: '600',
      color: '#008080', // Teal subtitle
      marginBottom: '15px',
      borderBottom: '2px solid #e0e0e0',
      paddingBottom: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableRow: {
      borderBottom: '1px solid #f0f0f0',
    },
    tableCellLabel: {
      padding: '10px 5px 10px 0',
      textAlign: 'left',
      fontWeight: '500',
      color: '#444',
      width: '50%', // Adjust width as needed
      verticalAlign: 'top',
    },
    tableCellValue: {
      padding: '10px 0 10px 5px',
      textAlign: 'left',
      color: '#666',
      verticalAlign: 'top',
    },
  };

  return (
    <section style={styles.section} className="specifications-section">
      <div style={styles.header} className="section-header">
        <h2 style={styles.title}>Especificaciones Técnicas</h2>
      </div>

      <div style={styles.content} className="specs-container">
        {Object.entries(specifications).map(([key, category]) => (
          <div key={key} style={styles.column} className={`specs-column specs-column-${key}`}>
            <h3 style={styles.subtitle}>{category.title}</h3>
            <table style={styles.table} className="specs-table">
              <tbody>
                {category.specs.map((spec, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCellLabel} className="spec-label">{spec.label}</td>
                    <td style={styles.tableCellValue} className="spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSpecifications;

