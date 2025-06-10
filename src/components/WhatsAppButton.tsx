import { useMinimalCart } from '../hooks/useMinimalCart';
import WhatsAppColorIcon from './icons/WhatsAppColorIcon';

const WhatsAppButton = () => {
  const { isCartOpen } = useMinimalCart();
  const phoneNumber = "+526144792338";
  const message = "¡Hola! Me gustaría obtener más información sobre sus sillas.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Hide the WhatsApp button when cart is open
  if (isCartOpen) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-50 group"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <WhatsAppColorIcon className="h-12 w-12 group-hover:scale-110 transition-transform duration-200 drop-shadow-lg" />
    </a>
  );
};

export default WhatsAppButton;