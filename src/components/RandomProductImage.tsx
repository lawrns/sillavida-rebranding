import { useState, useEffect } from 'react';
import { getProducts } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';

/**
 * RandomProductImage Component
 *
 * A flexible image carousel that displays product images with the following features:
 * - Primary data source: Shopify API product images
 * - Fallback data source: Local ergonomic chair images from /images/Ergonomia/
 * - Automatic image validation and error handling
 * - Smooth transitions with loading states
 * - Configurable rotation interval
 * - Support for custom fallback images
 *
 * Usage:
 * <RandomProductImage
 *   className="w-full h-96"
 *   alt="Silla ergonómica"
 *   interval={7000}
 *   useShopifyImages={true}
 * />
 */

interface RandomProductImageProps {
  className?: string;
  alt?: string;
  interval?: number; // Time in milliseconds between image changes
  useShopifyImages?: boolean; // Allow disabling Shopify integration for testing
  customFallbackImages?: string[]; // Allow custom fallback images
}

// Fallback images to ensure carousel always has content
// Using new ergonomic chair images from public/images/Ergonomia directory
// These images showcase different ergonomic benefits and features
const fallbackImages = [
  '/images/Ergonomia/Adaptabilidad%20y%20Personalización.png',
  '/images/Ergonomia/Altura%20y%20Profundidad%20del%20Asiento.png',
  '/images/Ergonomia/Circulación%20y%20Movimiento.png',
  '/images/Ergonomia/Conexión%20entre%20Comodidad%20y%20Concentración.png',
  '/images/Ergonomia/Conservación%20de%20Energía.png',
  '/images/Ergonomia/Durabilidad%20y%20Calidad.png',
  '/images/Ergonomia/Inversión%20en%20Salud.png',
  '/images/Ergonomia/Mejora%20de%20la%20Postura.png',
  '/images/Ergonomia/Prevención%20y%20Alivio%20del%20Dolor.png',
  '/images/Ergonomia/Reclinación%20del%20Respaldo.png',
  '/images/Ergonomia/Reducción%20de%20Distracciones.png',
  '/images/Ergonomia/Reposabrazos%20Ajustables.png',
  '/images/Ergonomia/Soporte%20Lumbar.png'
];

// Generate descriptive alt text for ergonomic images
const getErgonomicImageAlt = (imagePath: string): string => {
  const filename = imagePath.split('/').pop()?.replace('.png', '').replace(/%20/g, ' ') || '';
  return `Beneficio ergonómico: ${filename}`;
};

/**
 * Validates if an image path exists by attempting to load it
 * @param imagePath - The path to validate
 * @returns Promise<boolean> - True if image loads successfully
 */
const validateImagePath = (imagePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

const RandomProductImage: React.FC<RandomProductImageProps> = ({
  className = '',
  alt = 'Producto destacado',
  interval = 5000,
  useShopifyImages = true,
  customFallbackImages
}) => {
  // Use custom fallback images if provided, otherwise use default
  const activeFallbackImages = customFallbackImages || fallbackImages;

  const [images, setImages] = useState<string[]>(activeFallbackImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [validatedImages, setValidatedImages] = useState<string[]>([]);

  // Validate fallback images and fetch Shopify images
  useEffect(() => {
    const initializeImages = async () => {
      try {
        // First, validate fallback images
        console.log('Validating fallback images...');
        const validationPromises = activeFallbackImages.map(async (imagePath) => {
          const isValid = await validateImagePath(imagePath);
          if (!isValid) {
            console.warn(`Fallback image not found: ${imagePath}`);
          }
          return isValid ? imagePath : null;
        });

        const validatedFallbacks = (await Promise.all(validationPromises))
          .filter((path): path is string => path !== null);

        console.log(`Validated ${validatedFallbacks.length}/${activeFallbackImages.length} fallback images`);
        setValidatedImages(validatedFallbacks);

        // If Shopify integration is enabled, fetch product images
        if (useShopifyImages) {
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
            // Combine Shopify images with validated fallback images for variety
            const combinedImages = [...shuffledImages, ...validatedFallbacks];
            setImages(combinedImages);
            setCurrentImageIndex(0); // Start with the first image
            console.log(`Using ${combinedImages.length} total images (${productImages.length} from Shopify + ${validatedFallbacks.length} fallback)`);
          } else {
            console.log('No Shopify images found, using validated fallback images only');
            setImages(validatedFallbacks);
          }
        } else {
          console.log('Shopify integration disabled, using validated fallback images only');
          setImages(validatedFallbacks);
        }
      } catch (error) {
        console.error('Error initializing images:', error);
        console.log('Using validated fallback images due to error');
        // Use validated fallback images as last resort
        if (validatedImages.length > 0) {
          setImages(validatedImages);
        } else {
          // If no validated images, use original fallbacks and let error handling deal with failures
          setImages(activeFallbackImages);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeImages();
  }, [useShopifyImages, activeFallbackImages]);

  // Rotate through images at the specified interval
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => {
        let nextIndex = (prevIndex + 1) % images.length;
        // Skip images that failed to load
        let attempts = 0;
        while (imageLoadErrors.has(nextIndex) && attempts < images.length) {
          nextIndex = (nextIndex + 1) % images.length;
          attempts++;
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, imageLoadErrors]);

  // Handle image load errors
  const handleImageError = (index: number) => {
    console.warn(`Failed to load image at index ${index}: ${images[index]}`);
    setImageLoadErrors(prev => new Set([...prev, index]));
  };

  // Handle successful image loads
  const handleImageLoad = (index: number) => {
    setImageLoadErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 animate-pulse`}>
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image container with full width/height */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((imageUrl, index) => {
          // Use descriptive alt text for ergonomic images, fallback to generic alt
          const imageAlt = imageUrl.includes('/Ergonomia/')
            ? getErgonomicImageAlt(imageUrl)
            : `${alt} ${index + 1}`;

          return (
            <img
              key={`${imageUrl}-${index}`}
              src={imageUrl}
              alt={imageAlt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                index === currentImageIndex && !imageLoadErrors.has(index) ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ objectPosition: 'center' }}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
              loading="lazy"
            />
          );
        })}
      </div>

      {/* Subtle gradient overlay for better text readability if needed */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent z-10"></div>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex && !imageLoadErrors.has(index)
                ? 'bg-white scale-125'
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RandomProductImage;
