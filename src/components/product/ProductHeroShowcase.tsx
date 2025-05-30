import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  // Use standardized cart interface - no prop dependency
  const { addToCart, isLoading: cartLoading } = useAddToCart();
  
  // Combine local and cart loading states
  const isLoading = addingToCart || cartLoading;

  // Filter images for the thumbnail gallery, excluding feature/spec images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';
  const galleryImages = standardProduct.images.filter((image) => {
    const altText = image.altText || '';
    return !altText.startsWith(featurePrefix) && !altText.startsWith(specPrefix);
  });

  // Define product benefits (these would ideally come from product metafields)
  const productBenefits = [
    'Ergonomía certificada para largas jornadas',
    'Soporte lumbar ajustable personalizado',
    'Materiales premium transpirables',
    'Garantía extendida de 3 años'
  ];

  // Set initial image index when product loads
  useEffect(() => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [galleryImages.length]);

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

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  // Use centralized price formatting
  const priceDisplay = selectedVariant
    ? getProductPriceDisplay(selectedVariant.price, selectedVariant.compareAtPrice)
    : getProductPriceDisplay(standardProduct.price, standardProduct.compareAtPrice);

  const isAvailable = selectedVariant?.isAvailable || false;

  // Get current image from gallery
  const currentImage = galleryImages[currentImageIndex] || { url: '/images/placeholder.jpg', altText: product.title };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          {/* Main Image with Navigation */}
          <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <div className="aspect-square flex items-center justify-center p-4">
              <img
                src={currentImage.url}
                alt={currentImage.altText || product.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 justify-center">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-16 h-16 border rounded-lg overflow-hidden transition-all ${
                  index === currentImageIndex
                    ? 'border-black border-2'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText || `${product.title} - Vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          {/* Star Reviews - Right below image gallery */}
          <div className="flex items-center gap-2">
            {/* Mock stars for now - replace with ReviewStars when working */}
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 ml-1">4.8</span>
            </div>
            <span className="text-sm text-gray-600">(1,600+ Total Reviews)</span>
          </div>

          {/* Headline with Benefits */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 leading-tight">
              {product.title.toUpperCase()}
            </h1>
            <p className="text-lg text-gray-700 font-semibold leading-relaxed">
              Confort superior, diseño ergonómico y soporte profesional para tu bienestar.
            </p>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-black">{priceDisplay.price}</span>
              {priceDisplay.originalPrice && (
                <span className="text-xl line-through text-gray-400">{priceDisplay.originalPrice}</span>
              )}
              {/* Fallback for demo - remove when real pricing works */}
              {!priceDisplay.originalPrice && (
                <span className="text-xl line-through text-gray-400">$4,200</span>
              )}
            </div>
          </div>

          {/* Benefits List with Checkmarks */}
          <div className="space-y-3">
            {productBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-800">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Color & Size Selection */}
          {standardProduct.variants.length > 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Color: <span className="font-normal">{selectedVariant?.title}</span>
                </p>
                <div className="flex gap-2">
                  {standardProduct.variants.slice(0, 6).map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant.id)}
                      className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                        selectedVariant?.id === variant.id
                          ? 'border-black'
                          : 'border-gray-200 hover:border-gray-400'
                      } ${!variant.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!variant.isAvailable}
                      title={variant.title}
                    >
                      {/* Mock color/product images - would use variant images in real implementation */}
                      <img
                        src={galleryImages[index % galleryImages.length]?.url || '/images/placeholder.jpg'}
                        alt={variant.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Choose your size:</p>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 border border-gray-300 rounded hover:border-black transition-colors text-sm font-medium"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || isLoading}
              className={`w-full py-4 px-6 text-white font-semibold rounded-lg transition-all ${
                !isAvailable || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'AGREGANDO...' : cartSuccess ? '¡AGREGADO!' : 'AGREGAR AL CARRITO'}
            </button>
            
            <p className="text-center text-sm text-gray-600">
              ¡Pruébalo sin riesgo durante 2 años o recupera tu dinero inmediatamente!
            </p>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-1 border-t border-gray-200 pt-6">
            {[
              {
                title: 'Shipping & Return',
                content: 'Envío gratuito en todos los pedidos. Devoluciones fáciles en 30 días.'
              },
              {
                title: 'Comfort Guarantee',
                content: 'Garantía de comodidad de 2 años. Si no estás satisfecho, te devolvemos el dinero.'
              },
              {
                title: 'Why SillaVida',
                content: 'Ergonomicamente diseñadas por expertos para brindar el máximo confort y soporte.'
              }
            ].map((section, index) => (
              <div key={index} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-black transition-colors"
                >
                  {section.title}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections[section.title] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections[section.title] && (
                  <div className="pb-4 text-sm text-gray-600">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Success Message */}
          {cartSuccess && (
            <motion.div
              className="flex items-center gap-2 py-3 px-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Check size={20} />
              <span>¡Producto agregado al carrito!</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHeroShowcase;
