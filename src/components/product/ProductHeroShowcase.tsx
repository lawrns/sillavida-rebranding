import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProductHeroShowcaseProps {
  product: any;
  useCart: any;
}

const ProductHeroShowcase: React.FC<ProductHeroShowcaseProps> = ({ product, useCart }) => {
  // Initialize state with the first variant if available
  const initialVariant = product.variants?.edges && product.variants.edges.length > 0 
    ? product.variants.edges[0].node 
    : null;
  
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Get the addItem function from the passed useCart object
  const { addItem } = useCart;

  // Set initial main image when product loads
  useEffect(() => {
    if (product.images?.edges && product.images.edges.length > 0) {
      setMainImage(product.images.edges[0].node.url);
    }
  }, [product]);

  // Ensure selectedVariant is updated if product changes
  useEffect(() => {
    if (!selectedVariant && product.variants?.edges && product.variants.edges.length > 0) {
      setSelectedVariant(product.variants.edges[0].node);
    }
  }, [product, selectedVariant]);

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.edges.find((v: any) => v.node.id === variantId)?.node;
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
    if (selectedVariant && selectedVariant.availableForSale) {
      setAddingToCart(true);
      try {
        console.log('Adding to cart:', selectedVariant.id, quantity);
        await addItem(selectedVariant.id, quantity);
        setCartSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setCartSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Hubo un error al agregar el producto al carrito. Por favor, inténtalo de nuevo.');
      } finally {
        setAddingToCart(false);
      }
    } else {
      console.warn('Attempted to add unavailable variant to cart');
      alert('Este producto o variante no está disponible actualmente.');
    }
  };

  // Filter images for the thumbnail gallery, excluding feature/spec images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';
  const galleryImages = (product.images?.edges || []).filter((image: any) => {
    const altText = image.node.altText || '';
    return !altText.startsWith(featurePrefix) && !altText.startsWith(specPrefix);
  });

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate price from the selected variant
  let price = 0;
  if (selectedVariant && selectedVariant.price && selectedVariant.price.amount) {
    price = parseFloat(selectedVariant.price.amount);
  } else if (product.priceRange?.minVariantPrice?.amount) {
    price = parseFloat(product.priceRange.minVariantPrice.amount);
  }
  
  // Calculate compare at price
  let compareAtPrice;
  if (selectedVariant && selectedVariant.compareAtPrice && selectedVariant.compareAtPrice.amount) {
    compareAtPrice = parseFloat(selectedVariant.compareAtPrice.amount);
  } else if (product.compareAtPriceRange?.minVariantPrice?.amount) {
    compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  }

  const discount = compareAtPrice && compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const isAvailable = selectedVariant?.availableForSale || false;

  // If no main image is set yet, use a placeholder
  const displayMainImage = mainImage || '/images/placeholder.jpg';

  return (
    <div className="flex flex-wrap gap-10 mb-10 p-5 max-w-7xl mx-auto bg-white">
      <div className="flex-1 basis-3/5 min-w-[300px]">
        <div className="mb-4 border border-neutral-200 rounded overflow-hidden relative bg-white max-h-[500px] flex items-center justify-center">
          {displayMainImage && (
            <img 
              src={displayMainImage} 
              alt={product.title} 
              className="w-full h-auto max-h-[480px] block object-contain p-2.5"
            />
          )}
          {discount > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-accent text-white py-1.5 px-2.5 rounded font-bold text-sm">
              -{discount}%
            </div>
          )}
        </div>
        
        <div className="flex gap-2.5 flex-wrap">
          {galleryImages.map((image: any, index: number) => (
            <div 
              key={index}
              className={`w-20 h-20 cursor-pointer border ${mainImage === image.node.url ? 'border-2 border-accent opacity-100' : 'border-neutral-200 opacity-70'} rounded overflow-hidden p-1 transition-all hover:opacity-100`}
              onClick={() => handleThumbnailClick(image.node.url)}
            >
              <img 
                src={image.node.url} 
                alt={image.node.altText || `${product.title} - Vista ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 basis-2/5 min-w-[300px]">
        <h1 className="text-3xl m-0 mb-2.5 font-semibold text-black font-heading leading-tight">{product.title}</h1>
        
        <div className="text-lg mb-5 text-neutral-700 font-body">
          {product.description?.split('.')[0] || 'Invierte en tu bienestar'}
        </div>
        
        <div className="text-2xl mb-5 text-accent font-bold flex items-center flex-wrap font-heading">
          {formatPrice(price)}
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-sm line-through text-neutral-500 ml-2.5">{formatPrice(compareAtPrice)}</span>
          )}
          <span className={`text-sm ml-4 font-medium font-body ${isAvailable ? 'text-green-600' : 'text-accent'}`}>
            {isAvailable ? 'En stock' : 'Agotado'}
          </span>
        </div>
        
        {product.variants?.edges.length > 1 && (
          <div className="mb-5">
            <label className="block mb-2 font-medium text-black font-heading">Variante:</label>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.edges.map((variant: any) => (
                <button
                  key={variant.node.id}
                  className={`py-2 px-4 border ${selectedVariant?.id === variant.node.id 
                    ? 'border-accent bg-accent/10 text-accent' 
                    : 'border-neutral-200 bg-white text-neutral-800'} 
                    rounded transition-all font-body ${!variant.node.availableForSale ? 'opacity-50 cursor-not-allowed line-through' : 'hover:border-accent'}`}
                  onClick={() => handleVariantChange(variant.node.id)}
                  disabled={!variant.node.availableForSale}
                >
                  {variant.node.title}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-start w-full mb-6">
          <div className="flex items-center mb-4">
            <label className="mr-2.5 font-medium text-black font-heading">Cantidad:</label>
            <div className="flex items-center rounded">
              <button 
                className="flex items-center justify-center w-8 h-8 bg-white border border-neutral-200 text-accent text-xl font-medium cursor-pointer transition-colors hover:bg-accent/10 disabled:text-neutral-300 disabled:cursor-not-allowed"
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
                className="w-8 h-8 text-center border-y border-neutral-200 m-0 p-0 text-sm appearance-none bg-white text-black focus:outline-none"
                aria-label="Cantidad"
              />
              <button 
                className="flex items-center justify-center w-8 h-8 bg-white border border-neutral-200 text-accent text-xl font-medium cursor-pointer transition-colors hover:bg-accent/10"
                onClick={() => handleQuantityChange(quantity + 1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6 w-full">
            <button
              className={`py-3 px-6 text-lg font-bold bg-accent text-white border-none rounded cursor-pointer transition-all uppercase tracking-wider w-full font-heading
                ${!isAvailable || addingToCart ? 'bg-neutral-300 cursor-not-allowed' : 'hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0'}`}
              onClick={handleAddToCart}
              disabled={!isAvailable || addingToCart}
            >
              {addingToCart ? 'Agregando...' : cartSuccess ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
        
        {cartSuccess && (
          <motion.div 
            className="flex items-center gap-2 mb-5 py-2.5 px-4 bg-green-50 border border-green-200 rounded text-green-600"
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
