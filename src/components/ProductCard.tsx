import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { Chair } from '../data/chairs';
import { useCart } from '../context/CartContext';

// Generate a stable Shopify-compatible mock variant ID from the chair ID
// For demonstration purposes - generates a consistent test ID
const generateVariantId = (chairId: string): string => {
  // For testing purposes, generate a predictable ID based on the chair ID
  // In a real implementation, this would be the actual Shopify variant ID
  
  // Use a fixed numeric ID based on the number of chairs we have
  // This avoids errors with trying to reference non-existent Shopify variants
  let mockId = "";
  
  // Map known chair IDs to fixed test variant IDs
  // In a real implementation, this would come from the actual Shopify data
  if (chairId === "ergonomic") mockId = "123456789";
  else if (chairId === "executive") mockId = "234567890";
  else if (chairId === "gamer") mockId = "345678901";
  else if (chairId === "visitor") mockId = "456789012";
  else if (chairId === "secretarial") mockId = "567890123";
  else if (chairId === "gamer2") mockId = "678901234";
  else if (chairId === "accessory") mockId = "789012345";
  else {
    // Generate a deterministic but consistent ID for any other chairs
    mockId = chairId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString();
  }
  
  return `mock-variant-${mockId}`;
};

interface ProductCardProps {
  chair: Chair;
}

const ProductCard: React.FC<ProductCardProps> = ({ chair }) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    setIsLoading(true);
    try {
      // Generate a Shopify variant ID from the chair ID
      const variantId = generateVariantId(chair.id);
      
      console.log(`[Cart] Adding item to cart: ${chair.name} (${chair.id})`);
      console.log(`[Cart] Using mock variant ID: ${variantId}`);
      
      // Add the item to the cart with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          await addItem(variantId, 1);
          console.log(`[Cart] Successfully added item to cart: ${chair.name}`);
          break; // Success, exit the retry loop
        } catch (retryError) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw retryError; // Rethrow the error after max retries
          }
          console.warn(`[Cart] Retry ${retryCount}/${maxRetries} adding to cart: ${chair.name}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Show error message to user
      alert(`Failed to add ${chair.name} to cart. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Wrap the Link with motion.div for animation
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible" // Animate directly on mount for simplicity
      transition={{ duration: 0.5, ease: "easeOut" }} 
      className="block" // Apply block display to the motion div
    >
      <Link to={`/product/${chair.id}`} className="block"> {/* Link remains block inside motion div */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"> {/* Added h-full and flex flex-col */}
          <img
            src={chair.image}
          alt={chair.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(chair.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{chair.rating}</span>
          </div>
          <h3 className="font-semibold mb-2">{chair.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2 flex-grow">{chair.description}</p> {/* Added flex-grow */}
          <div className="mt-auto pt-2"> {/* Push button to bottom, added padding top */}
            <p className="text-xl font-bold text-teal">
              ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </p>
            <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`w-full mt-4 py-2 rounded transition-colors ${
              success 
                ? 'bg-sage hover:bg-sage-light text-white' 
                : 'bg-teal hover:bg-teal-light text-white'
              }`}
            >
              {isLoading ? 'Agregando...' : success ? '¡Agregado!' : 'Agregar al Carrito'}
            </button>
          </div>
        </div> {/* This is the closing div for p-4 */}
      </div> {/* This is the closing div for bg-white */}
    </Link>
    </motion.div>
  );
};

export default ProductCard;
