import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ReviewStars } from '../judgeMe';
import { handleProductError } from '../../utils/errorHandler';
import { transformShopifyProduct, getDefaultVariant, getAvailableVariants } from '../../utils/business/productTransformer';
import { getProductPriceDisplay } from '../../utils/business/priceFormatter';
import { useAddToCart } from '../../hooks/useMinimalCart';

interface ProductHeroShowcaseProps {
  product: any;
}

const ProductHeroShowcase: React.FC<ProductHeroShowcaseProps> = ({ product }) => {
  // Transform product using centralized utility
  const standardProduct = transformShopifyProduct(product);
  const defaultVariant = getDefaultVariant(standardProduct);
  const availableVariants = getAvailableVariants(standardProduct);

  // Initialize state with the default variant
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Use standardized cart interface - no prop dependency
  const { addToCart, isLoading: cartLoading } = useAddToCart();
  
  // Combine local and cart loading states
  const isLoading = addingToCart || cartLoading;

  // Set initial main image when product loads
  useEffect(() => {
    if (standardProduct.images.length > 0) {
      setMainImage(standardProduct.images[0].url);
    }
  }, [standardProduct]);

  // Ensure selectedVariant is updated if product changes
  useEffect(() => {
    if (!selectedVariant && defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [standardProduct, selectedVariant, defaultVariant]);

  const handleVariantChange = (variantId: string) => {
    const variant = standardProduct.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, parseInt(value.toString()) || 1);
    setQuantity(newQuantity);
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const handleAddToCart = async () => {
    if (selectedVariant && selectedVariant.isAvailable) {
      setAddingToCart(true);
      try {
        await addToCart(selectedVariant.id, quantity);
        setCartSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setCartSuccess(false);
        }, 3000);
      } catch (error) {
        await handleProductError('Error adding product to cart', { component: 'ProductHeroShowcase', action: 'addToCart' });
      } finally {
        setAddingToCart(false);
      }
    } else {
      console.warn('Attempted to add unavailable variant to cart');
      await handleProductError('Product or variant is not currently available', { component: 'ProductHeroShowcase', action: 'addToCart' });
    }
  };

  // Filter images for the thumbnail gallery, excluding feature/spec images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';
  const galleryImages = standardProduct.images.filter((image) => {
    const altText = image.altText || '';
    return !altText.startsWith(featurePrefix) && !altText.startsWith(specPrefix);
  });

  // Use centralized price formatting
  const priceDisplay = selectedVariant
    ? getProductPriceDisplay(selectedVariant.price, selectedVariant.compareAtPrice)
    : getProductPriceDisplay(standardProduct.price, standardProduct.compareAtPrice);

  const isAvailable = selectedVariant?.isAvailable || false;

  // If no main image is set yet, use a placeholder
  const displayMainImage = mainImage || '/images/placeholder.jpg';

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-10 p-5 max-w-7xl mx-auto bg-white">
      <div className="w-full">
        <div className="mb-4 border border-neutral-200 rounded overflow-hidden relative bg-white max-h-[500px] flex items-center justify-center">
          {displayMainImage && (
            <img
              src={displayMainImage}
              alt={product.title}
              className="w-full h-auto max-h-[480px] block object-contain p-2.5"
            />
          )}
          {priceDisplay.discount > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-accent text-white py-1.5 px-2.5 rounded font-bold text-sm">
              -{priceDisplay.discount}%
            </div>
          )}
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {galleryImages.map((image, index: number) => (
            <div
              key={index}
              className={`w-20 h-20 cursor-pointer border ${mainImage === image.url ? 'border-2 border-accent opacity-100' : 'border-neutral-200 opacity-70'} rounded overflow-hidden p-1 transition-all hover:opacity-100`}
              onClick={() => handleThumbnailClick(image.url)}
            >
              <img
                src={image.url}
                alt={image.altText || `${standardProduct.title} - Vista ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 basis-2/5 min-w-[300px]">
        <h1 className="text-3xl m-0 mb-2.5 font-semibold text-black font-heading leading-tight">{product.title}</h1>

        {/* Display Judge.me star ratings */}
        <div className="mb-4">
          <ReviewStars
            productId={product.id}
            containerClassName="flex items-center"
            showLoadingState={false}
          />
        </div>

        {/* Price section using centralized formatting */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-black font-heading">{priceDisplay.current}</span>
            {priceDisplay.original && (
              <span className="text-base line-through text-neutral-500">{priceDisplay.original}</span>
            )}
            {priceDisplay.discount > 0 && (
              <span className="text-sm font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded">Ahorra {priceDisplay.savings}</span>
            )}
          </div>

          {/* Payment information removed as requested */}

          <div className="mb-1">
            <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-accent'}`}>
              {isAvailable ? '✓ En stock' : 'Agotado'}
            </span>
          </div>
        </div>

        {standardProduct.variants.length > 1 && (
          <div className="mb-5">
            <div className="mb-2">
              <span className="block text-sm text-neutral-600 mb-1">Color: {selectedVariant?.title}</span>
            </div>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {standardProduct.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`relative py-2 px-3 min-w-[70px] border ${selectedVariant?.id === variant.id
                    ? 'border-black'
                    : 'border-neutral-300 bg-white'}
                    rounded-full transition-all font-body ${!variant.isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}`}
                  onClick={() => handleVariantChange(variant.id)}
                  disabled={!variant.isAvailable}
                >
                  {variant.title}
                  {selectedVariant?.id === variant.id && (
                    <span className="absolute inset-0 border-2 border-black rounded-full pointer-events-none"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-start w-full mb-8">
          <div className="w-full mb-5">
            <span className="block text-sm text-neutral-600 mb-1">Cantidad:</span>
            <div className="flex items-center rounded border border-neutral-300 w-32">
              <button
                className="flex items-center justify-center w-10 h-10 bg-white text-neutral-800 text-xl font-medium cursor-pointer transition-colors hover:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="w-12 h-10 text-center border-x border-neutral-300 m-0 p-0 text-sm appearance-none bg-white text-black focus:outline-none"
                aria-label="Cantidad"
              />
              <button
                className="flex items-center justify-center w-10 h-10 bg-white text-neutral-800 text-xl font-medium cursor-pointer transition-colors hover:bg-neutral-100"
                onClick={() => handleQuantityChange(quantity + 1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-6 w-full">
            <button
              className={`py-3 px-6 text-base font-medium bg-black text-white border-none rounded cursor-pointer transition-all w-full
                ${!isAvailable || isLoading ? 'bg-neutral-300 cursor-not-allowed' : 'hover:bg-gray-800'}`}
              onClick={handleAddToCart}
              disabled={!isAvailable || isLoading}
            >
              {isLoading ? 'Agregando...' : cartSuccess ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          </div>

          {/* Payment methods */}
          <div className="w-full mb-6 flex justify-center">
            <div className="flex flex-wrap gap-3 justify-center text-xs text-neutral-500">
              <span className="px-2 py-1 border border-neutral-200 rounded">PayPal</span>
              <span className="px-2 py-1 border border-neutral-200 rounded">Visa</span>
              <span className="px-2 py-1 border border-neutral-200 rounded">Mastercard</span>
              <span className="px-2 py-1 border border-neutral-200 rounded">American Express</span>
            </div>
          </div>
        </div>

        {/* Shipping & Returns section */}
        <div className="border-t border-neutral-200 pt-4 mb-6">
          <h3 className="flex items-center text-base font-medium mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Envío, Devoluciones y Garantía
          </h3>
          <ul className="pl-5 list-disc text-sm space-y-1 text-neutral-700">
            <li>Envío gratuito y entrega en 2 días hábiles</li>
            <li>Devolución de 30 días para problemas no relacionados con el cliente</li>
            <li>Garantía de 3 años (solo reemplazo de piezas, no reparaciones)</li>
          </ul>
        </div>

        {cartSuccess && (
          <motion.div
            className="flex items-center gap-2 mb-5 py-2.5 px-4 bg-gray-100 border border-gray-300 rounded text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Check size={20} />
            <span>¡Producto agregado al carrito!</span>
          </motion.div>
        )}

        <div className="text-neutral-700 text-base leading-relaxed mb-8 font-body"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }}
        />
      </div>
    </div>
  );
};

export default ProductHeroShowcase;
