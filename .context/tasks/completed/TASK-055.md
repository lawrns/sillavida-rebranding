---
title: Implement Enhanced Product Pages with Shopify Integration
type: task
status: completed
created: 2025-04-24T21:22:30
updated: 2025-04-24T16:55:24-06:00
id: TASK-055
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-040, TASK-041, TASK-042]
tags: [product-page, shopify, redesign]
---

# Implement Enhanced Product Pages with Shopify Integration

## Description
Rebuild the product page layout following the vertical HBADA style (detailing everything downwards) while preserving the existing Shopify integration for product information. This task focuses on expanding product details in a vertical layout, adding a chair features component, and removing the existing tabbed interface and "Historias de vida" slider while maintaining the Shopify data integration.

## Objectives
- Implement vertical layout for product pages following HBADA style
- Preserve existing Shopify integration for product information
- Add chair features component with interactive elements
- Remove tabbed interface (Bienestar, Productividad, Durabilidad, Especificaciones)
- Remove "Historias de vida" slider
- Ensure responsive design across all device sizes
- Maintain visual consistency with SillaVida brand guidelines

## Steps
1. Create base component structure for ProductPage
   ```jsx
   // src/components/product/ProductPage.jsx
   import React, { useEffect, useState } from 'react';
   import { useParams } from 'react-router-dom';
   import { useShopify } from '../../hooks/useShopify';
   
   import ProductHeroShowcase from './ProductHeroShowcase';
   import ChairFeaturesComponent from './ChairFeaturesComponent';
   import ProductSpecifications from './ProductSpecifications';
   import ProductFeatures from './ProductFeatures';
   import VidaBenefits from './VidaBenefits';
   import RelatedProducts from './RelatedProducts';
   
   const ProductPage = () => {
     const { handle } = useParams();
     const [product, setProduct] = useState(null);
     const [loading, setLoading] = useState(true);
     const { getProductByHandle } = useShopify();
     
     useEffect(() => {
       const fetchProduct = async () => {
         setLoading(true);
         try {
           const productData = await getProductByHandle(handle);
           setProduct(productData);
         } catch (error) {
           console.error('Error fetching product:', error);
         } finally {
           setLoading(false);
         }
       };
       
       fetchProduct();
     }, [handle, getProductByHandle]);
     
     if (loading) {
       return <div className="product-loading">Loading product details...</div>;
     }
     
     if (!product) {
       return <div className="product-error">Product not found</div>;
     }
     
     return (
       <div className="product-page">
         <ProductHeroShowcase product={product} />
         
         <div className="product-sections">
           <ChairFeaturesComponent product={product} />
           <ProductSpecifications product={product} />
           <ProductFeatures product={product} />
           <VidaBenefits product={product} />
           <RelatedProducts product={product} />
         </div>
       </div>
     );
   };
   
   export default ProductPage;
   ```

2. Implement ProductHeroShowcase component with Shopify data integration
   ```jsx
   // src/components/product/ProductHeroShowcase.jsx
   import React, { useState } from 'react';
   import { useCart } from '../../context/CartContext';
   
   const ProductHeroShowcase = ({ product }) => {
     const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
     const [quantity, setQuantity] = useState(1);
     const { addItem } = useCart();
     
     const handleVariantChange = (variantId) => {
       const variant = product.variants.find(v => v.id === variantId);
       setSelectedVariant(variant);
     };
     
     const handleQuantityChange = (value) => {
       const newQuantity = Math.max(1, value);
       setQuantity(newQuantity);
     };
     
     const handleAddToCart = () => {
       addItem(selectedVariant.id, quantity);
     };
     
     return (
       <div className="product-hero">
         <div className="product-gallery">
           <div className="main-image">
             <img 
               src={product.featuredImage?.url || '/images/placeholder.jpg'} 
               alt={product.title} 
               className="product-image"
             />
           </div>
           
           <div className="thumbnail-gallery">
             {product.images.map((image, index) => (
               <img 
                 key={index}
                 src={image.url} 
                 alt={image.altText || `${product.title} - Image ${index + 1}`}
                 className="thumbnail"
                 onClick={() => {
                   // Logic to change main image
                 }}
               />
             ))}
           </div>
         </div>
         
         <div className="product-info">
           <h1 className="product-title">{product.title}</h1>
           <p className="product-subtitle">{product.subtitle || 'La mejor silla ergonómica para tu vida diaria'}</p>
           
           <div className="product-price">
             <span className="price">${selectedVariant.price}</span>
             {selectedVariant.compareAtPrice && (
               <span className="original-price">${selectedVariant.compareAtPrice}</span>
             )}
             <span className="stock-status">
               {selectedVariant.available ? 'En stock' : 'Agotado'}
             </span>
           </div>
           
           {product.variants.length > 1 && (
             <div className="variant-selector">
               <label htmlFor="variant-select">Variante:</label>
               <select 
                 id="variant-select"
                 value={selectedVariant.id}
                 onChange={(e) => handleVariantChange(e.target.value)}
               >
                 {product.variants.map(variant => (
                   <option key={variant.id} value={variant.id}>
                     {variant.title}
                   </option>
                 ))}
               </select>
             </div>
           )}
           
           <div className="quantity-selector">
             <button 
               className="quantity-btn decrease"
               onClick={() => handleQuantityChange(quantity - 1)}
               disabled={quantity <= 1}
             >
               -
             </button>
             <input 
               type="number" 
               value={quantity} 
               min="1" 
               className="quantity-input"
               onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
             />
             <button 
               className="quantity-btn increase"
               onClick={() => handleQuantityChange(quantity + 1)}
             >
               +
             </button>
           </div>
           
           <div className="product-actions">
             <button 
               className="add-to-cart-button"
               onClick={handleAddToCart}
               disabled={!selectedVariant.available}
             >
               {selectedVariant.available ? 'Agregar al carrito' : 'Agotado'}
             </button>
             <button className="secondary-button">Compartir</button>
           </div>
           
           <div className="product-description" 
             dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
           />
         </div>
       </div>
     );
   };
   
   export default ProductHeroShowcase;
   ```

3. Create ChairFeaturesComponent with interactive markers
   ```jsx
   // src/components/product/ChairFeaturesComponent.jsx
   import React, { useState } from 'react';
   
   const ChairFeaturesComponent = ({ product }) => {
     const [activeFeature, setActiveFeature] = useState(null);
     
     // Define chair features
     const features = [
       {
         id: 'headrest',
         name: 'Reposacabezas Ajustable',
         description: 'Soporte para el cuello y la cabeza, ajustable en altura e inclinación.',
         position: { top: '10%', left: '50%' }
       },
       {
         id: 'backrest',
         name: 'Respaldo Ergonómico',
         description: 'Diseñado para mantener la curvatura natural de la columna y proporcionar soporte lumbar.',
         position: { top: '30%', left: '50%' }
       },
       {
         id: 'armrests',
         name: 'Reposabrazos 4D',
         description: 'Ajustables en altura, anchura, profundidad y ángulo para un soporte óptimo.',
         position: { top: '40%', left: '20%' }
       },
       {
         id: 'seat',
         name: 'Asiento de Alta Densidad',
         description: 'Espuma de alta densidad con diseño de cascada para reducir la presión en las piernas.',
         position: { top: '50%', left: '50%' }
       },
       {
         id: 'mechanism',
         name: 'Mecanismo Sincronizado',
         description: 'Permite reclinar el respaldo manteniendo el ángulo óptimo con el asiento.',
         position: { top: '60%', left: '50%' }
       },
       {
         id: 'base',
         name: 'Base de Aluminio',
         description: 'Base de aluminio reforzado con 5 ruedas para mayor estabilidad y durabilidad.',
         position: { top: '80%', left: '50%' }
       }
     ];
     
     const handleMarkerClick = (featureId) => {
       setActiveFeature(activeFeature === featureId ? null : featureId);
     };
     
     const handleFeatureCardClick = (featureId) => {
       setActiveFeature(activeFeature === featureId ? null : featureId);
     };
     
     return (
       <section className="product-section chair-features-section" id="chair-features">
         <div className="section-header">
           <h2 className="section-title">Características Ergonómicas</h2>
         </div>
         
         <div className="section-content">
           <div className="chair-features-container">
             <div className="chair-image-container">
               <img 
                 src="/public/images/chair-features.png" 
                 alt="Características de la silla" 
                 className="chair-features-image"
               />
               
               {features.map(feature => (
                 <div
                   key={feature.id}
                   className={`feature-marker ${activeFeature === feature.id ? 'active' : ''}`}
                   style={feature.position}
                   onClick={() => handleMarkerClick(feature.id)}
                 >
                   <div className="marker-dot"></div>
                   <div className="marker-pulse"></div>
                   
                   {activeFeature === feature.id && (
                     <div className="feature-tooltip">
                       <h4>{feature.name}</h4>
                       <p>{feature.description}</p>
                     </div>
                   )}
                 </div>
               ))}
             </div>
             
             <div className="feature-cards">
               {features.map(feature => (
                 <div
                   key={feature.id}
                   className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
                   onClick={() => handleFeatureCardClick(feature.id)}
                 >
                   <h3 className="feature-title">{feature.name}</h3>
                   <p className="feature-description">{feature.description}</p>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </section>
     );
   };
   
   export default ChairFeaturesComponent;
   ```

4. Implement ProductSpecifications component with organized tables
   ```jsx
   // src/components/product/ProductSpecifications.jsx
   import React from 'react';
   
   const ProductSpecifications = ({ product }) => {
     // Extract specifications from product metafields or attributes
     const specifications = {
       dimensions: {
         title: 'Dimensiones',
         specs: [
           { label: 'Altura total', value: '115-120 cm' },
           { label: 'Ancho del asiento', value: '50 cm' },
           { label: 'Profundidad del asiento', value: '48-52 cm (ajustable)' },
           { label: 'Altura del respaldo', value: '70 cm' },
         ]
       },
       technical: {
         title: 'Detalles Técnicos',
         specs: [
           { label: 'Peso máximo soportado', value: '120 kg' },
           { label: 'Altura ajustable', value: '45-55 cm' },
           { label: 'Material del asiento', value: 'Espuma de alta densidad' },
           { label: 'Material de la estructura', value: 'Aluminio reforzado' },
         ]
       },
       adjustments: {
         title: 'Ajustes',
         specs: [
           { label: 'Reposacabezas', value: 'Ajustable en altura e inclinación' },
           { label: 'Reposabrazos', value: 'Ajustables 4D (altura, anchura, profundidad, ángulo)' },
           { label: 'Respaldo', value: 'Reclinable con tensión ajustable' },
           { label: 'Soporte lumbar', value: 'Ajustable en altura' },
         ]
       },
       materials: {
         title: 'Materiales',
         specs: [
           { label: 'Tapizado', value: 'Malla transpirable / Tela premium' },
           { label: 'Base', value: 'Aluminio pulido' },
           { label: 'Ruedas', value: 'Nylon reforzado con poliuretano' },
           { label: 'Estructura', value: 'Aluminio y plástico de alta resistencia' },
         ]
       }
     };
     
     return (
       <section className="product-section specifications-section" id="specifications">
         <div className="section-header">
           <h2 className="section-title">Especificaciones</h2>
         </div>
         
         <div className="section-content">
           <div className="specs-container">
             {Object.entries(specifications).map(([key, category]) => (
               <div key={key} className="specs-column">
                 <h3 className="specs-subtitle">{category.title}</h3>
                 <table className="specs-table">
                   <tbody>
                     {category.specs.map((spec, index) => (
                       <tr key={index}>
                         <td className="spec-label">{spec.label}</td>
                         <td className="spec-value">{spec.value}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
   };
   
   export default ProductSpecifications;
   ```

5. Create ProductFeatures component with card-based layout
   ```jsx
   // src/components/product/ProductFeatures.jsx
   import React from 'react';
   
   const ProductFeatures = ({ product }) => {
     // Define product features
     const features = [
       {
         id: 'posture',
         title: 'Mejora tu Postura',
         description: 'El diseño ergonómico ayuda a mantener una postura correcta durante largas horas de trabajo, reduciendo la fatiga y el dolor.',
         icon: '/public/images/icons/posture.svg',
       },
       {
         id: 'productivity',
         title: 'Aumenta tu Productividad',
         description: 'Mayor comodidad significa menos distracciones y más concentración en tus tareas diarias.',
         icon: '/public/images/icons/productivity.svg',
       },
       {
         id: 'health',
         title: 'Cuida tu Salud',
         description: 'Previene problemas de espalda y cuello asociados con largas jornadas sentado frente al ordenador.',
         icon: '/public/images/icons/health.svg',
       },
       {
         id: 'comfort',
         title: 'Confort Premium',
         description: 'Materiales de alta calidad que proporcionan una experiencia de sentado superior y duradera.',
         icon: '/public/images/icons/comfort.svg',
       },
     ];
     
     return (
       <section className="product-section features-section" id="features">
         <div className="section-header">
           <h2 className="section-title">Beneficios</h2>
         </div>
         
         <div className="section-content">
           <div className="features-grid">
             {features.map(feature => (
               <div key={feature.id} className="feature-card">
                 <div className="feature-icon">
                   <img 
                     src={feature.icon} 
                     alt={feature.title}
                     onError={(e) => {
                       e.target.src = '/public/images/icons/default.svg';
                     }}
                   />
                 </div>
                 <h3 className="feature-title">{feature.title}</h3>
                 <p className="feature-description">{feature.description}</p>
               </div>
             ))}
           </div>
           
           <div className="feature-highlight">
             <p><strong>Inversión en tu bienestar:</strong> Una silla ergonómica de calidad no es un gasto, es una inversión en tu salud y productividad diaria.</p>
           </div>
         </div>
       </section>
     );
   };
   
   export default ProductFeatures;
   ```

6. Implement VidaBenefits component with highlight sections
   ```jsx
   // src/components/product/VidaBenefits.jsx
   import React from 'react';
   
   const VidaBenefits = ({ product }) => {
     // Define Vida benefits
     const benefits = [
       {
         id: 'wellness',
         title: 'Bienestar Integral',
         description: 'Nuestras sillas están diseñadas pensando en tu bienestar físico y mental, proporcionando el soporte adecuado para mantener una postura saludable durante todo el día.',
         image: '/public/images/benefits/wellness.jpg',
       },
       {
         id: 'productivity',
         title: 'Productividad Sostenible',
         description: 'El confort adecuado te permite mantener la concentración y productividad durante largas jornadas de trabajo, sin las distracciones causadas por la incomodidad.',
         image: '/public/images/benefits/productivity.jpg',
       },
       {
         id: 'durability',
         title: 'Durabilidad Excepcional',
         description: 'Utilizamos materiales de la más alta calidad y procesos de fabricación rigurosos para garantizar que tu silla SillaVida te acompañe durante muchos años.',
         image: '/public/images/benefits/durability.jpg',
       },
     ];
     
     return (
       <section className="product-section vida-benefits-section" id="vida-benefits">
         <div className="section-header">
           <h2 className="section-title">La Experiencia Vida</h2>
         </div>
         
         <div className="section-content">
           <div className="vida-intro">
             <p>En SillaVida, creemos que una silla es mucho más que un mueble. Es el compañero que te sostiene durante gran parte de tu día, influyendo directamente en tu bienestar, productividad y calidad de vida.</p>
           </div>
           
           <div className="benefits-container">
             {benefits.map((benefit, index) => (
               <div key={benefit.id} className={`benefit-item ${index % 2 === 1 ? 'reverse' : ''}`}>
                 <div className="benefit-image">
                   <img src={benefit.image} alt={benefit.title} />
                 </div>
                 <div className="benefit-content">
                   <h3 className="benefit-title">{benefit.title}</h3>
                   <p className="benefit-description">{benefit.description}</p>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="vida-conclusion">
             <p>Al elegir una SillaVida, no solo estás adquiriendo una silla ergonómica de alta calidad, estás invirtiendo en tu bienestar diario y en una mejor calidad de vida.</p>
           </div>
         </div>
       </section>
     );
   };
   
   export default VidaBenefits;
   ```

7. Create RelatedProducts component with consistent styling
   ```jsx
   // src/components/product/RelatedProducts.jsx
   import React, { useEffect, useState } from 'react';
   import { Link } from 'react-router-dom';
   import { useShopify } from '../../hooks/useShopify';
   
   const RelatedProducts = ({ product }) => {
     const [relatedProducts, setRelatedProducts] = useState([]);
     const [loading, setLoading] = useState(true);
     const { getRelatedProducts } = useShopify();
     
     useEffect(() => {
       const fetchRelatedProducts = async () => {
         setLoading(true);
         try {
           // Get related products based on product type or collection
           const related = await getRelatedProducts(product.id, product.productType);
           setRelatedProducts(related.slice(0, 4)); // Limit to 4 products
         } catch (error) {
           console.error('Error fetching related products:', error);
         } finally {
           setLoading(false);
         }
       };
       
       fetchRelatedProducts();
     }, [product.id, product.productType, getRelatedProducts]);
     
     if (loading || relatedProducts.length === 0) {
       return null; // Don't show section if no related products
     }
     
     return (
       <section className="product-section related-products-section" id="related-products">
         <div className="section-header">
           <h2 className="section-title">Productos Relacionados</h2>
         </div>
         
         <div className="section-content">
           <div className="related-products-grid">
             {relatedProducts.map(relatedProduct => (
               <div key={relatedProduct.id} className="product-card">
                 <Link to={`/products/${relatedProduct.handle}`}>
                   <img 
                     src={relatedProduct.featuredImage?.url || '/public/images/placeholder.jpg'} 
                     alt={relatedProduct.title} 
                     className="product-card-image"
                   />
                   <div className="product-card-content">
                     <h3 className="product-card-title">{relatedProduct.title}</h3>
                     <p className="product-card-price">${relatedProduct.priceRange.minVariantPrice.amount}</p>
                   </div>
                 </Link>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
   };
   
   export default RelatedProducts;
   ```

8. Implement CSS for the vertical layout and components
   ```css
   /* src/styles/product-page.css */
   
   /* Product Page Layout */
   .product-page {
     max-width: 1200px;
     margin: 0 auto;
     padding: 2rem 1rem;
   }
   
   /* Product Hero Section */
   .product-hero {
     display: grid;
     grid-template-columns: 1fr;
     gap: 2rem;
     margin-bottom: 3rem;
   }
   
   @media (min-width: 768px) {
     .product-hero {
       grid-template-columns: 1fr 1fr;
     }
   }
   
   /* Product Gallery */
   .product-gallery {
     position: relative;
   }
   
   .main-image {
     width: 100%;
     margin-bottom: 1rem;
     border-radius: 0.5rem;
     overflow: hidden;
   }
   
   .product-image {
     width: 100%;
     height: auto;
     object-fit: contain;
   }
   
   .thumbnail-gallery {
     display: flex;
     gap: 0.5rem;
     overflow-x: auto;
   }
   
   .thumbnail {
     width: 80px;
     height: 80px;
     object-fit: cover;
     border-radius: 0.25rem;
     cursor: pointer;
     border: 2px solid transparent;
   }
   
   .thumbnail:hover {
     border-color: var(--color-teal);
   }
   
   /* Product Info */
   .product-title {
     font-size: 2rem;
     margin-bottom: 0.5rem;
     color: var(--color-teal);
   }
   
   .product-subtitle {
     font-size: 1.1rem;
     color: var(--color-text-secondary);
     margin-bottom: 1.5rem;
   }
   
   .product-price {
     display: flex;
     align-items: center;
     gap: 1rem;
     margin-bottom: 1.5rem;
   }
   
   .price {
     font-size: 1.5rem;
     font-weight: bold;
     color: var(--color-terracotta);
   }
   
   .original-price {
     font-size: 1.2rem;
     text-decoration: line-through;
     color: var(--color-text-secondary);
   }
   
   .stock-status {
     font-size: 0.9rem;
     padding: 0.25rem 0.5rem;
     border-radius: 0.25rem;
     background-color: var(--color-sage-light);
     color: var(--color-text-light);
   }
   
   /* Variant Selector */
   .variant-selector {
     margin-bottom: 1.5rem;
   }
   
   .variant-selector select {
     width: 100%;
     padding: 0.5rem;
     border: 1px solid var(--color-border-light);
     border-radius: 0.25rem;
     font-size: 1rem;
   }
   
   /* Quantity Selector */
   .quantity-selector {
     display: flex;
     align-items: center;
     margin-bottom: 1.5rem;
     width: 120px;
   }
   
   .quantity-btn {
     width: 36px;
     height: 36px;
     display: flex;
     align-items: center;
     justify-content: center;
     background-color: var(--color-beige-light);
     border: none;
     font-size: 1.2rem;
     cursor: pointer;
   }
   
   .quantity-input {
     flex: 1;
     height: 36px;
     text-align: center;
     border: 1px solid var(--color-border-light);
     border-left: none;
     border-right: none;
   }
   
   /* Product Actions */
   .product-actions {
     display: flex;
     gap: 1rem;
     margin-bottom: 1.5rem;
   }
   
   .add-to-cart-button {
     flex: 1;
     padding: 0.75rem 1.5rem;
     background-color: var(--color-teal);
     color: white;
     border: none;
     border-radius: 0.25rem;
     font-weight: 600;
     cursor: pointer;
     transition: background-color 0.2s;
   }
   
   .add-to-cart-button:hover {
     background-color: var(--color-teal-light);
   }
   
   .add-to-cart-button:disabled {
     background-color: var(--color-text-secondary);
     cursor: not-allowed;
   }
   
   .secondary-button {
     padding: 0.75rem 1.5rem;
     background-color: white;
     color: var(--color-teal);
     border: 1px solid var(--color-teal);
     border-radius: 0.25rem;
     font-weight: 600;
     cursor: pointer;
     transition: all 0.2s;
   }
   
   .secondary-button:hover {
     background-color: var(--color-beige-light);
   }
   
   /* Product Description */
   .product-description {
     margin-bottom: 1.5rem;
     line-height: 1.6;
   }
   
   /* Section Styling */
   .product-section {
     margin-bottom: 3rem;
   }
   
   .section-header {
     background-color: var(--color-teal);
     padding: 1rem;
     border-radius: 0.5rem 0.5rem 0 0;
     margin-bottom: 0;
   }
   
   .section-title {
     color: white;
     margin: 0;
     font-size: 1.5rem;
   }
   
   .section-content {
     padding: 2rem;
     background-color: white;
     border: 1px solid var(--color-border-light);
     border-top: none;
     border-radius: 0 0 0.5rem 0.5rem;
   }
   
   /* Chair Features Component */
   .chair-features-container {
     display: grid;
     grid-template-columns: 1fr;
     gap: 2rem;
   }
   
   @media (min-width: 768px) {
     .chair-features-container {
       grid-template-columns: 1fr 1fr;
     }
   }
   
   .chair-image-container {
     position: relative;
   }
   
   .chair-features-image {
     width: 100%;
     height: auto;
   }
   
   .feature-marker {
     position: absolute;
     transform: translate(-50%, -50%);
     cursor: pointer;
   }
   
   .marker-dot {
     width: 16px;
     height: 16px;
     background-color: var(--color-terracotta);
     border-radius: 50%;
     border: 2px solid white;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
   }
   
   .marker-pulse {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     width: 40px;
     height: 40px;
     border-radius: 50%;
     background-color: rgba(200, 125, 85, 0.3);
     animation: pulse 2s infinite;
   }
   
   @keyframes pulse {
     0% {
       transform: translate(-50%, -50%) scale(0.5);
       opacity: 0.8;
     }
     70% {
       transform: translate(-50%, -50%) scale(1);
       opacity: 0;
     }
     100% {
       transform: translate(-50%, -50%) scale(0.5);
       opacity: 0;
     }
   }
   
   .feature-tooltip {
     position: absolute;
     top: calc(100% + 10px);
     left: 50%;
     transform: translateX(-50%);
     background-color: white;
     padding: 1rem;
     border-radius: 0.5rem;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
     width: 200px;
     z-index: 10;
   }
   
   .feature-tooltip h4 {
     margin-top: 0;
     margin-bottom: 0.5rem;
     color: var(--color-teal);
   }
   
   .feature-tooltip p {
     margin: 0;
     font-size: 0.9rem;
   }
   
   .feature-cards {
     display: flex;
     flex-direction: column;
     gap: 1rem;
   }
   
   .feature-card {
     padding: 1rem;
     border: 1px solid var(--color-border-light);
     border-radius: 0.5rem;
     cursor: pointer;
     transition: all 0.2s;
   }
   
   .feature-card:hover, .feature-card.active {
     border-color: var(--color-teal);
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   }
   
   .feature-card.active {
     background-color: var(--color-beige-light);
   }
   
   .feature-title {
     margin-top: 0;
     margin-bottom: 0.5rem;
     color: var(--color-teal);
   }
   
   .feature-description {
     margin: 0;
     font-size: 0.9rem;
   }
   
   /* Specifications Table */
   .specs-container {
     display: grid;
     grid-template-columns: 1fr;
     gap: 2rem;
   }
   
   @media (min-width: 768px) {
     .specs-container {
       grid-template-columns: 1fr 1fr;
     }
   }
   
   .specs-subtitle {
     margin-top: 0;
     margin-bottom: 1rem;
     color: var(--color-teal);
     font-size: 1.2rem;
   }
   
   .specs-table {
     width: 100%;
     border-collapse: collapse;
   }
   
   .specs-table tr:nth-child(odd) {
     background-color: var(--color-beige-light);
   }
   
   .specs-table td {
     padding: 0.75rem;
     border-bottom: 1px solid var(--color-border-light);
   }
   
   .spec-label {
     font-weight: 600;
     color: var(--color-teal);
   }
   
   /* Features Grid */
   .features-grid {
     display: grid;
     grid-template-columns: 1fr;
     gap: 1.5rem;
   }
   
   @media (min-width: 576px) {
     .features-grid {
       grid-template-columns: 1fr 1fr;
     }
   }
   
   @media (min-width: 992px) {
     .features-grid {
       grid-template-columns: 1fr 1fr 1fr 1fr;
     }
   }
   
   .feature-icon {
     width: 60px;
     height: 60px;
     margin-bottom: 1rem;
   }
   
   .feature-icon img {
     width: 100%;
     height: 100%;
     object-fit: contain;
   }
   
   .feature-highlight {
     margin-top: 2rem;
     padding: 1.5rem;
     background-color: var(--color-beige-light);
     border-radius: 0.5rem;
     text-align: center;
   }
   
   /* Vida Benefits */
   .vida-intro, .vida-conclusion {
     margin-bottom: 2rem;
     text-align: center;
     max-width: 800px;
     margin-left: auto;
     margin-right: auto;
   }
   
   .benefits-container {
     display: flex;
     flex-direction: column;
     gap: 3rem;
     margin-bottom: 2rem;
   }
   
   .benefit-item {
     display: grid;
     grid-template-columns: 1fr;
     gap: 2rem;
     align-items: center;
   }
   
   @media (min-width: 768px) {
     .benefit-item {
       grid-template-columns: 1fr 1fr;
     }
     
     .benefit-item.reverse {
       grid-template-columns: 1fr 1fr;
     }
     
     .benefit-item.reverse .benefit-image {
       order: 2;
     }
     
     .benefit-item.reverse .benefit-content {
       order: 1;
     }
   }
   
   .benefit-image img {
     width: 100%;
     height: auto;
     border-radius: 0.5rem;
   }
   
   .benefit-title {
     margin-top: 0;
     margin-bottom: 1rem;
     color: var(--color-teal);
     font-size: 1.5rem;
   }
   
   /* Related Products */
   .related-products-grid {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 1.5rem;
   }
   
   @media (min-width: 768px) {
     .related-products-grid {
       grid-template-columns: 1fr 1fr 1fr 1fr;
     }
   }
   
   .product-card {
     border: 1px solid var(--color-border-light);
     border-radius: 0.5rem;
     overflow: hidden;
     transition: all 0.2s;
   }
   
   .product-card:hover {
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
     transform: translateY(-4px);
   }
   
   .product-card-image {
     width: 100%;
     height: 200px;
     object-fit: cover;
   }
   
   .product-card-content {
     padding: 1rem;
   }
   
   .product-card-title {
     margin-top: 0;
     margin-bottom: 0.5rem;
     font-size: 1rem;
     color: var(--color-text-primary);
   }
   
   .product-card-price {
     margin: 0;
     font-weight: bold;
     color: var(--color-terracotta);
   }
   ```

9. Update routes to include the new product page
   ```jsx
   // src/App.jsx
   import React from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import Header from './components/layout/Header';
   import Footer from './components/layout/Footer';
   import HomePage from './pages/HomePage';
   import ProductPage from './components/product/ProductPage';
   import CollectionPage from './pages/CollectionPage';
   import CartPage from './pages/CartPage';
   import './styles/product-page.css';
   
   const App = () => {
     return (
       <Router>
         <Header />
         <main>
           <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/products/:handle" element={<ProductPage />} />
             <Route path="/collections/:handle" element={<CollectionPage />} />
             <Route path="/cart" element={<CartPage />} />
           </Routes>
         </main>
         <Footer />
       </Router>
     );
   };
   
   export default App;
   ```

10. Test the implementation with Shopify data
    - Verify product data is correctly displayed
    - Test responsive design on different screen sizes
    - Ensure chair features component works correctly
    - Verify all sections are displayed in the correct order
    - Test add to cart functionality

## Progress
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
- [ ] Step 4
- [ ] Step 5
- [ ] Step 6
- [ ] Step 7
- [ ] Step 8
- [ ] Step 9
- [ ] Step 10

## Dependencies
- TASK-040: Implement SillaVida Color Palette
- TASK-041: Implement Typography System
- TASK-042: Create Component Library

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- The implementation should follow a vertical layout style similar to HBADA
- The existing Shopify integration for product information must be preserved
- The tabbed interface (Bienestar, Productividad, Durabilidad, Especificaciones) should be removed
- The "Historias de vida" slider should be removed
- The chair features component should use the placeholder image at /public/images/chair-features.png
- All components should be responsive and work well on mobile devices
- The implementation should maintain visual consistency with the SillaVida brand guidelines
- Consider adding smooth scroll behavior for section navigation
- Ensure all interactive elements are accessible
- The product gallery should support multiple images and thumbnails
- The variant selector should only appear when a product has multiple variants

## Next Steps
- Create base component structure for ProductPage
- Implement ProductHeroShowcase component with Shopify data integration
- Create ChairFeaturesComponent with interactive markers
- Implement remaining product page sections
- Style components according to SillaVida brand guidelines
