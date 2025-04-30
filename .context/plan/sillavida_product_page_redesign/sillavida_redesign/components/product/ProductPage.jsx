import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Assuming useShopify hook is available in the project context
// import { useShopify } from '../../hooks/useShopify'; 

import ProductHeroShowcase from './ProductHeroShowcase';
import ProductDetailSections from './ProductDetailSections'; // Import the new component
import RelatedProducts from './RelatedProducts'; // Assuming this component exists

// Mock useShopify hook for standalone development/testing
const useShopify = () => ({
  getProductByHandle: async (handle) => {
    console.log(`Fetching product with handle: ${handle}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock product data structure similar to Shopify's
    return {
      id: 'gid://shopify/Product/12345',
      handle: handle,
      title: 'Silla Aura Ergonómica',
      descriptionHtml: '<p>Experimenta comodidad y soporte todo el día con la silla Aura. Diseñada ergonómicamente para tu bienestar.</p>',
      featuredImage: {
        url: '/images/mock-chair-main.jpg', // Placeholder path
        altText: 'Silla Aura Ergonómica'
      },
      images: [
        { url: '/images/mock-chair-thumb1.jpg', altText: 'Vista frontal' },
        { url: '/images/mock-chair-thumb2.jpg', altText: 'Vista lateral' },
        { url: '/images/mock-chair-thumb3.jpg', altText: 'Detalle respaldo' },
        // Add mock images for features/specs with appropriate Alt Text
        { url: '/images/mock-feature-headrest.jpg', altText: 'feature-Reposacabezas Ajustable:Soporte adaptable para cuello y cabeza.' },
        { url: '/images/mock-feature-lumbar.jpg', altText: 'feature-Soporte Lumbar Dinámico:Promueve una postura saludable.' },
        { url: '/images/mock-spec-dimensions.jpg', altText: 'spec-Dimensiones Generales:Altura: 115-125cm, Ancho: 52cm...' },
      ],
      variants: [
        {
          id: 'gid://shopify/ProductVariant/111',
          title: 'Negro',
          price: '1000.00',
          compareAtPrice: '1250.00',
          available: true,
        },
        {
          id: 'gid://shopify/ProductVariant/222',
          title: 'Blanco',
          price: '1050.00',
          compareAtPrice: null,
          available: true,
        },
      ],
      // Metafields might still be used for other data, but not primarily for features/specs images now
      metafields: {}
    };
  }
});

// Mock useCart hook
const useCart = () => ({
    addItem: (variantId, quantity) => {
        console.log(`Adding item to cart: Variant ${variantId}, Quantity ${quantity}`);
        alert(`Producto añadido al carrito (simulado): Variante ${variantId}, Cantidad ${quantity}`);
    }
});

const ProductPage = () => {
  const { handle } = useParams() || { handle: 'default-product' }; // Provide default handle for testing
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
    // Basic loading state, can be replaced with a spinner component
    return <div className="product-loading" style={{ padding: '40px', textAlign: 'center', fontSize: '1.2em' }}>Cargando detalles del producto...</div>;
  }

  if (!product) {
    return <div className="product-error" style={{ padding: '40px', textAlign: 'center', color: 'red', fontSize: '1.2em' }}>Producto no encontrado</div>;
  }

  // Apply a wrapper for styling the overall page layout
  return (
    <div className="sillavida-product-page" style={{ fontFamily: 'Arial, sans-serif' }}> {/* Base font, replace later */}
      <ProductHeroShowcase product={product} useCart={useCart} />

      {/* Vertical sections - Now using ProductDetailSections */}
      <div className="product-sections-vertical" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <ProductDetailSections product={product} />
        {/* <RelatedProducts product={product} /> */}
        {/* RelatedProducts component can be added here later */}
      </div>
    </div>
  );
};

// Mock useParams if running standalone or in an environment without react-router
// const useParams = () => ({ handle: 'aura-ergonomic-chair' });

export default ProductPage;

