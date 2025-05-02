import { useState, useEffect } from 'react';
import { getProducts } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';

interface RandomProductImageProps {
  className?: string;
  alt?: string;
  interval?: number; // Time in milliseconds between image changes
}

const RandomProductImage: React.FC<RandomProductImageProps> = ({ 
  className = '', 
  alt = 'Producto destacado', 
  interval = 5000 
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch product images from Shopify
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        setLoading(true);
        const { products } = await getProducts(20); // Fetch up to 20 products
        
        // Extract image URLs from products
        const productImages = products
          .filter((product: ShopifyProduct) => 
            product.images && 
            product.images.edges && 
            product.images.edges.length > 0
          )
          .map((product: ShopifyProduct) => product.images.edges[0].node.url);
        
        if (productImages.length > 0) {
          setImages(productImages);
          // Start with a random image
          setCurrentImageIndex(Math.floor(Math.random() * productImages.length));
        }
      } catch (error) {
        console.error('Error fetching product images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductImages();
  }, []);

  // Rotate through images at the specified interval
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 animate-pulse`}>
        <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (images.length === 0) {
    // Fallback to the original image if no product images are available
    return (
      <img 
        src="/images/ergonomica.png" 
        alt={alt} 
        className={className}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Add teal gradient overlay similar to HomePage */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent z-10"></div>
      
      {images.map((imageUrl, index) => (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={`${alt} ${index + 1}`}
          className={`${className} absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default RandomProductImage;
