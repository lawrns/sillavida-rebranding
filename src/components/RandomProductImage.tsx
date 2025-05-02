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
        console.log('Fetching Shopify product images...');
        
        // Get all products with images
        const { products } = await getProducts(15);
        
        // Extract and filter image URLs from products
        const productImages = products
          .filter((product: ShopifyProduct) => 
            product.images?.edges?.[0]?.node?.url &&
            product.images.edges[0].node.url.includes('cdn.shopify.com')
          )
          .map((product: ShopifyProduct) => product.images.edges[0].node.url);
        
        console.log(`Found ${productImages.length} product images from Shopify`);
        
        if (productImages.length > 0) {
          // Shuffle the array to randomize the order
          const shuffledImages = [...productImages].sort(() => Math.random() - 0.5);
          setImages(shuffledImages);
          setCurrentImageIndex(0); // Start with the first image
        } else {
          console.error('No valid product images found from Shopify');
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

  if (loading || images.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 animate-pulse`}>
        <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image container with full width/height */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((imageUrl, index) => (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`${alt} ${index + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: 'center' }}
          />
        ))}
      </div>
      
      {/* Gradient overlay that covers the entire image */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-teal-dark/80 to-transparent z-10"></div>
    </div>
  );
};

export default RandomProductImage;
