/**
 * Judge.me Reviews Configuration
 * 
 * This file contains configuration settings for the Judge.me reviews integration.
 * Update these values based on your Shopify store and Judge.me settings.
 */

export const JudgeMeConfig = {
  // Shopify store domain (required for Judge.me integration)
  shopDomain: 'sbz5wk-e9.myshopify.com',
  
  // Judge.me CDN URL
  cdnUrl: 'https://cdn.judge.me',
  
  // Widget settings
  widgets: {
    // Reviews widget settings
    reviews: {
      perPage: 5,
      autoInstall: false,
      ratingText: 'Valoración: {rating} de 5',
      noReviewsText: 'Aún no hay experiencias. ¡Sé el primero en compartir tu experiencia Vida!',
      writeReviewText: 'Comparte tu experiencia Vida',
      verifiedBuyerText: 'Cliente verificado'
    },
    
    // Review form settings
    reviewForm: {
      autoInstall: false,
      formTitle: 'Comparte tu experiencia Vida',
      submitText: 'Enviar experiencia',
      nameText: 'Nombre',
      emailText: 'Email',
      titleText: 'Título de tu experiencia',
      bodyText: 'Cuéntanos cómo SillaVida ha mejorado tu vida diaria'
    }
  },
  
  // Translation settings (for multilingual support)
  translations: {
    es: {
      reviewsTitle: 'Experiencias Vida',
      reviewsSubtitle: 'Descubre lo que nuestros clientes dicen sobre cómo SillaVida ha transformado su bienestar y productividad.'
    },
    en: {
      reviewsTitle: 'Vida Experiences',
      reviewsSubtitle: 'Discover what our customers are saying about how SillaVida has transformed their wellbeing and productivity.'
    }
  }
};

export default JudgeMeConfig;
