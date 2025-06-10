/**
 * Enhanced Reviews Data Structure
 * Real customer review data from Judge.me CSV export with enhanced structure
 * for trust indicators, verification, and customer diversity
 */

import { Star, ShoppingBag, Calendar, User, Briefcase, Gamepad2, GraduationCap } from 'lucide-react';

// Customer profile types based on review content analysis
export type CustomerProfile = 'executive' | 'gamer' | 'student' | 'remote-worker' | 'creative' | 'healthcare';

// Chair models from the CSV data
export type ChairModel = 'empirea' | 'serafin' | 'aura' | 'livina' | 'calma' | 'serenidad' | 'terra' | 'celeste';

// Enhanced review interface with all verification and trust elements
export interface EnhancedReview {
  id: string;
  // Customer Information
  customerName: string;
  customerEmail: string; // For verification but not displayed
  customerProfile: CustomerProfile;
  avatar?: string; // Customer photo URL or generated avatar
  
  // Review Content
  title: string;
  body: string;
  rating: number; // 1-5 stars
  
  // Product Information
  productId: string;
  productHandle: ChairModel;
  productDisplayName: string;
  
  // Verification & Trust
  verified: boolean;
  reviewDate: string; // ISO date string
  purchaseDate?: string; // Estimated purchase date
  usageDuration?: string; // "Usando desde X meses"
  
  // Additional Trust Elements
  hasPhoto: boolean;
  companyReply?: {
    message: string;
    replyDate: string;
  };
  
  // Authenticity elements (minor issues for credibility)
  mentionsIssue?: {
    issue: string;
    resolution: string;
  };
  
  // Metadata
  location?: string;
  source: 'judge-me';
  curated: boolean;
}

// Trust indicators calculated from real data
export interface TrustMetrics {
  totalReviews: number;
  averageRating: number;
  starDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verificationRate: number; // Percentage of verified reviews
  responseRate: number; // Percentage of reviews with company responses
}

// Customer profile categorization helpers
export const getProfileIcon = (profile: CustomerProfile) => {
  switch (profile) {
    case 'executive':
      return Briefcase;
    case 'gamer':
      return Gamepad2;
    case 'student':
      return GraduationCap;
    case 'remote-worker':
      return User;
    case 'creative':
      return Star;
    case 'healthcare':
      return User;
    default:
      return User;
  }
};

export const getProfileLabel = (profile: CustomerProfile): string => {
  switch (profile) {
    case 'executive':
      return 'Ejecutivo/a';
    case 'gamer':
      return 'Gamer';
    case 'student':
      return 'Estudiante';
    case 'remote-worker':
      return 'Trabajo Remoto';
    case 'creative':
      return 'Creativo/a';
    case 'healthcare':
      return 'Salud';
    default:
      return 'Usuario';
  }
};

// Chair model display names
export const getChairDisplayName = (handle: ChairModel): string => {
  switch (handle) {
    case 'empirea':
      return 'Silla Empirea';
    case 'serafin':
      return 'Silla Serafín';
    case 'aura':
      return 'Silla Aura';
    case 'livina':
      return 'Silla Livina';
    case 'calma':
      return 'Silla Calma';
    case 'serenidad':
      return 'Silla Serenidad';
    case 'terra':
      return 'Silla Terra';
    case 'celeste':
      return 'Silla Celeste';
    default:
      return 'Silla SillaVida';
  }
};

// Generate avatar URL based on customer name (placeholder system)
export const generateCustomerAvatar = (name: string, hasRealPhoto: boolean): string => {
  if (hasRealPhoto) {
    // Return actual photo URL when available - use placeholder for now
    // Real customer photos would need proper AWS S3 URLs with correct domain
    return `https://images.unsplash.com/photo-1494790108755-2616b72a1e7a?w=120&h=120&fit=crop&crop=face&auto=format&q=80`;
  }
  
  // Generate avatar based on name initials with monochromatic design
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=333333&color=ffffff&size=120&font-size=0.5&rounded=true`;
};

// Calculate usage duration from review date
export const calculateUsageDuration = (reviewDate: string): string => {
  const review = new Date(reviewDate);
  const now = new Date();
  const monthsDiff = Math.floor((now.getTime() - review.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  if (monthsDiff < 1) return 'Hace menos de 1 mes';
  if (monthsDiff === 1) return 'Hace 1 mes';
  if (monthsDiff < 12) return `Hace ${monthsDiff} meses`;
  
  const years = Math.floor(monthsDiff / 12);
  const remainingMonths = monthsDiff % 12;
  
  if (years === 1 && remainingMonths === 0) return 'Hace 1 año';
  if (years === 1) return `Hace 1 año y ${remainingMonths} meses`;
  
  return `Hace ${years} años`;
};

// Categorize customer profile based on review content
const categorizeCustomerProfile = (name: string, title: string, body: string): CustomerProfile => {
  const content = (title + ' ' + body).toLowerCase();
  
  if (content.includes('gaming') || content.includes('gamer') || content.includes('sesiones largas')) {
    return 'gamer';
  }
  if (content.includes('estudiante') || content.includes('estudiar') || content.includes('universidad')) {
    return 'student';
  }
  if (content.includes('ejecutivo') || content.includes('oficina') || content.includes('empresa') || content.includes('trabajo')) {
    return 'executive';
  }
  if (content.includes('casa') || content.includes('remoto') || content.includes('home office')) {
    return 'remote-worker';
  }
  if (content.includes('creativo') || content.includes('diseño') || content.includes('arte')) {
    return 'creative';
  }
  if (content.includes('salud') || content.includes('dolor') || content.includes('espalda')) {
    return 'healthcare';
  }
  
  return 'executive'; // Default fallback
};

// Real customer reviews from CSV data with enhanced structure
export const enhancedReviews: EnhancedReview[] = [
  {
    id: 'review-3050e42d-6949-40d6-827a-78633a2cb945',
    customerName: 'Ximena Martinez',
    customerEmail: 'ximena.martinez_@icloud.com',
    customerProfile: 'remote-worker',
    title: 'Calidad y confort insuperables en la Empirea',
    body: 'Mi experiencia con la Empirea ha sido excepcional. Es sólida y bien construida y muy estilizada. Ideal para trabajar desde casa. La atención al cliente también fue muy buena cuando pregunté por el envío.',
    rating: 5,
    productId: '7605683323089',
    productHandle: 'empirea',
    productDisplayName: 'Silla Empirea',
    verified: true,
    reviewDate: '2025-05-09T21:52:32Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Ximena Martinez', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-4a6e0a3d-e4d1-436e-99a3-b358991f5d57',
    customerName: 'Paula Perez',
    customerEmail: 'paula.perez945@live.com.mx',
    customerProfile: 'healthcare',
    title: 'Muy recomendable esta Empirea',
    body: 'Estaba buscando una silla ergonómica de calidad y la Empirea ha superado todas mis expectativas. Es robusta, los acabados son impecables y, lo más importante, es increíblemente cómoda. Una excelente compra para mi salud postural.',
    rating: 5,
    productId: '7605683323089',
    productHandle: 'empirea',
    productDisplayName: 'Silla Empirea',
    verified: true,
    reviewDate: '2025-01-05T00:00:00Z',
    usageDuration: 'Hace 11 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Paula Perez', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-1ab513ae-6f21-4429-9e17-7fdd00b46488',
    customerName: 'Sebastian Ortega',
    customerEmail: 'sebastian.ortega939@live.com.mx',
    customerProfile: 'healthcare',
    title: 'Un cambio total para mi espalda',
    body: 'Si pasas mucho tiempo sentado, esta silla Empirea es para ti. Me ha ayudado a mejorar mi postura y a reducir la fatiga considerablemente. El diseño es moderno y combina genial con mi escritorio. ¡Cinco estrellas sin dudarlo!',
    rating: 4,
    productId: '7605683323089',
    productHandle: 'empirea',
    productDisplayName: 'Silla Empirea',
    verified: true,
    reviewDate: '2025-05-09T21:52:32Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Sebastian Ortega', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-e6a0457b-630d-485f-a4fc-c1c90b5fd507',
    customerName: 'Carlos Moreno',
    customerEmail: 'carlos.moreno933@empresa.com.mx',
    customerProfile: 'student',
    title: 'Feliz con mi compra',
    body: 'Mi experiencia con la Serafin ha sido excepcional. Es bastante ergonómica y fácil de ajustar. Ideal para estudiar por largas horas. La atención al cliente también fue muy buena cuando pregunté por el envío.',
    rating: 5,
    productId: '7605682864337',
    productHandle: 'serafin',
    productDisplayName: 'Silla Serafín',
    verified: true,
    reviewDate: '2025-05-09T21:52:32Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Carlos Moreno', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-094d8b54-6d18-4a38-8cb3-a96a51c92cec',
    customerName: 'Juliana Herrera',
    customerEmail: 'juliana.herrera58@gmail.com',
    customerProfile: 'creative',
    title: 'No puedo pedir más',
    body: 'Estoy fascinado/a con la Serafin. El ensamblaje fue mejor con ayuda de otra persona y desde el primer momento sentí el confort. Los materiales son premium y el color azul es muy bonito es precioso. ¡Una gran adquisición!',
    rating: 5,
    productId: '7605682864337',
    productHandle: 'serafin',
    productDisplayName: 'Silla Serafín',
    verified: true,
    reviewDate: '2025-05-04T00:00:00Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Juliana Herrera', false),
    mentionsIssue: {
      issue: 'El ensamblaje fue mejor con ayuda de otra persona',
      resolution: 'Con ayuda fue sencillo y desde el primer momento sentí el confort'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-6d3b9307-64e9-46c8-a8ca-7f1c2f384b22',
    customerName: 'David Jimenez',
    customerEmail: 'david.jimenez840@gmail.com',
    customerProfile: 'healthcare',
    title: '¡Adiós dolor de espalda con la Serafin!',
    body: 'Estoy fascinado/a con la Serafin. El ensamblaje fue mejor con ayuda de otra persona y desde el primer momento sentí el confort. Los materiales son premium y el color negro con azul es muy elegante es precioso. ¡Una gran adquisición!',
    rating: 4,
    productId: '7605682864337',
    productHandle: 'serafin',
    productDisplayName: 'Silla Serafín',
    verified: true,
    reviewDate: '2024-10-10T00:00:00Z',
    usageDuration: 'Hace 1 año y 3 meses',
    hasPhoto: true,
    avatar: generateCustomerAvatar('David Jimenez', true),
    companyReply: {
      message: '¡Hola! Estamos encantados de saber que la Serafín ha sido de gran ayuda para tu dolor de espalda. Nos esforzamos por ofrecer productos de alta calidad y nos alegra que hayas notado la diferencia desde el primer momento. ¡Disfruta de tu elegante y preciosa Serafín y gracias por tu excelente reseña!',
      replyDate: '2025-05-09T22:01:23Z'
    },
    mentionsIssue: {
      issue: 'El ensamblaje fue mejor con ayuda de otra persona',
      resolution: 'Con ayuda fue sencillo, resultados inmediatos'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-154a4179-08b4-4a98-b38e-d27f7dfea63a',
    customerName: 'Jorge Torres',
    customerEmail: 'jorge.torres796@outlook.com',
    customerProfile: 'gamer',
    title: 'Estilo y funcionalidad en una silla',
    body: 'Compré la Calma para mi setup gaming y estoy encantado. Es súper cómoda para sesiones largas y el diseño es espectacular. Mis amigos ya me preguntaron dónde la conseguí. ¡Un 10 rotundo!',
    rating: 4,
    productId: '7599476244689',
    productHandle: 'calma',
    productDisplayName: 'Silla Calma',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Jorge Torres', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-48ce26fe-c3ea-4b8c-8eeb-c573a0a33bbf',
    customerName: 'Monica Moreno',
    customerEmail: 'monica.moreno330@outlook.com',
    customerProfile: 'executive',
    title: 'Casi perfecta la Aura',
    body: 'En general, la Aura es una buena silla ergonómica. El montaje fue relativamente fácil, aunque una pieza costó un poco y ofrece buen soporte. Los materiales se sienten de muy buena calidad y duraderos, aunque los reposabrazos, aunque cómodos, podrían tener más opciones de ajuste. Creo que por el precio está bien.',
    rating: 3,
    productId: '7599476342993',
    productHandle: 'aura',
    productDisplayName: 'Silla Aura',
    verified: true,
    reviewDate: '2025-01-04T00:00:00Z',
    usageDuration: 'Hace 11 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Monica Moreno', false),
    mentionsIssue: {
      issue: 'Una pieza del montaje costó un poco y los reposabrazos podrían tener más opciones de ajuste',
      resolution: 'El montaje fue relativamente fácil y por el precio está bien'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-5c6d65ca-003e-4b82-a4b1-5c08ba08c209',
    customerName: 'Valeria Moreno',
    customerEmail: 'valeria.moreno141@aol.com',
    customerProfile: 'healthcare',
    title: 'Simplemente perfecta',
    body: 'Estaba buscando una silla ergonómica de calidad y la Livina ha superado todas mis expectativas. Es robusta, los acabados son impecables y, lo más importante, es increíblemente cómoda. Una excelente compra para mi salud postural.',
    rating: 5,
    productId: '7605681881297',
    productHandle: 'livina',
    productDisplayName: 'Silla Livina',
    verified: true,
    reviewDate: '2025-02-05T00:00:00Z',
    usageDuration: 'Hace 10 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Valeria Moreno', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-a18126ef-c4a9-48b4-b4b5-fa5f5dc0ebd9',
    customerName: 'Ricardo Diaz',
    customerEmail: 'ricardo.diaz1990@empresa.com.mx',
    customerProfile: 'remote-worker',
    title: 'Mi oficina en casa ahora es un placer gracias a la Livina',
    body: 'Estoy fascinado/a con la Livina. El ensamblaje fue relativamente fácil, aunque una pieza costó un poco y desde el primer momento sentí el confort. Los materiales son premium y el color negro es muy elegante es precioso. ¡Una gran adquisición!',
    rating: 4,
    productId: '7605681881297',
    productHandle: 'livina',
    productDisplayName: 'Silla Livina',
    verified: true,
    reviewDate: '2024-02-14T00:00:00Z',
    usageDuration: 'Hace 1 año y 9 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Ricardo Diaz', false),
    mentionsIssue: {
      issue: 'Una pieza del ensamblaje costó un poco',
      resolution: 'Fue relativamente fácil y desde el primer momento sentí el confort'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-46dad4d8-a5db-44cd-9793-8321bacbad69',
    customerName: 'Ximena Suarez',
    customerEmail: 'ximena.suarez42@outlook.com',
    customerProfile: 'student',
    title: 'La recomiendo al 100%',
    body: 'Mi experiencia con la Aura ha sido excepcional. Es bastante ergonómica y un gran alivio para mi espalda. Ideal para estudiar por largas horas. La atención al cliente también fue muy buena cuando pregunté por el envío.',
    rating: 5,
    productId: '7599476342993',
    productHandle: 'aura',
    productDisplayName: 'Silla Aura',
    verified: true,
    reviewDate: '2024-05-31T00:00:00Z',
    usageDuration: 'Hace 1 año y 6 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Ximena Suarez', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-ec14dddf-8ad7-4234-8e1e-c961a6d0fe23',
    customerName: 'Alejandro Aguilar',
    customerEmail: 'alejandro.aguilar862@icloud.com',
    customerProfile: 'creative',
    title: '¡Increíblemente cómoda la Livina!',
    body: 'La Livina es una auténtica maravilla. Se nota que está pensada para el bienestar del usuario. El respaldo se amolda a la espalda y el asiento es muy confortable. La recomiendo sin dudarlo a cualquiera que busque calidad.',
    rating: 5,
    productId: '7605681881297',
    productHandle: 'livina',
    productDisplayName: 'Silla Livina',
    verified: true,
    reviewDate: '2025-03-05T00:00:00Z',
    usageDuration: 'Hace 9 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Alejandro Aguilar', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-f3a9ba3f-6409-4098-a02a-3bfaca36d26d',
    customerName: 'Andres Cruz',
    customerEmail: 'andres.cruz.@outlook.com',
    customerProfile: 'healthcare',
    title: '¡Asombrosa la Calma!',
    body: 'Si pasas mucho tiempo sentado, esta silla Calma es para ti. Me ha ayudado a mejorar mi postura y a reducir la fatiga considerablemente. El diseño es moderno y combina genial con mi escritorio. ¡Cinco estrellas sin dudarlo!',
    rating: 5,
    productId: '7599476244689',
    productHandle: 'calma',
    productDisplayName: 'Silla Calma',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Andres Cruz', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-8b3de633-9f07-47d0-8633-07507251b197',
    customerName: 'Luis Gutierrez',
    customerEmail: 'luis.gutierrez467@live.com.mx',
    customerProfile: 'executive',
    title: 'Perfecta para largas jornadas de trabajo',
    body: 'Estaba buscando una silla ergonómica de calidad y la Calma ha superado todas mis expectativas. Es robusta, los acabados son impecables y, lo más importante, es increíblemente cómoda. Una excelente compra para mi salud postural.',
    rating: 5,
    productId: '7599476244689',
    productHandle: 'calma',
    productDisplayName: 'Silla Calma',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Luis Gutierrez', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-0da479ee-fd5c-473d-a70f-0b128877d397',
    customerName: 'Santiago Medina',
    customerEmail: 'santiago.medina266@protonmail.com',
    customerProfile: 'executive',
    title: 'Excelente inversión en mi Celeste',
    body: 'Si pasas mucho tiempo sentado, esta silla Celeste es para ti. Me ha ayudado a mejorar mi postura y a reducir la fatiga considerablemente. El diseño es moderno y combina genial con mi escritorio. ¡Cinco estrellas sin dudarlo!',
    rating: 5,
    productId: '7599426732241',
    productHandle: 'celeste',
    productDisplayName: 'Silla Celeste',
    verified: true,
    reviewDate: '2025-05-09T21:52:55Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Santiago Medina', false),
    companyReply: {
      message: '¡Hola! ¡Muchas gracias por tu comentario sobre nuestra silla Celeste! Nos alegra saber que ha sido una excelente inversión para ti y que te ha ayudado a mejorar tu postura y reducir la fatiga. Nos enorgullece que el diseño moderno de la silla combine perfectamente con tu escritorio. ¡Nos esforzamos por brindar productos de alta calidad a nuestros clientes! ¡Gracias por elegir SillaVida! ¡Saludos!',
      replyDate: '2025-05-09T22:00:58Z'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-8a6f612a-1059-464c-9cb1-a4523d9a2218',
    customerName: 'Valentina Reyes',
    customerEmail: 'valentina.reyes1982@live.com.mx',
    customerProfile: 'creative',
    title: 'Montaje sencillo, comodidad instantánea con la Celeste',
    body: 'Al principio dudaba por el precio, pero la Celeste vale cada centavo. La calidad de los materiales se siente al tacto y el confort es inigualable. Fácil de armar y con ajustes muy intuitivos. ¡La amo y mi espalda también!',
    rating: 5,
    productId: '7599426732241',
    productHandle: 'celeste',
    productDisplayName: 'Silla Celeste',
    verified: true,
    reviewDate: '2025-05-09T21:52:55Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Valentina Reyes', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-17aaf216-d3ee-4637-b03b-288e7f30d880',
    customerName: 'David Hernandez',
    customerEmail: 'david.hernandez758@empresa.com.mx',
    customerProfile: 'executive',
    title: 'Muy recomendable esta Aura',
    body: 'Mi experiencia con la Aura ha sido excepcional. Es sólida y bien construida y fácil de ajustar. Ideal para relajarme leyendo. La atención al cliente también fue muy buena cuando pregunté por el envío.',
    rating: 4,
    productId: '7599476342993',
    productHandle: 'aura',
    productDisplayName: 'Silla Aura',
    verified: true,
    reviewDate: '2025-05-09T21:52:53Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('David Hernandez', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-dc953136-25fd-4a20-9916-c8d2152ff394',
    customerName: 'Valentina Gomez',
    customerEmail: 'valentina.gomez.@empresa.com.mx',
    customerProfile: 'executive',
    title: 'Excelente inversión en mi Serenidad',
    body: 'Si pasas mucho tiempo sentado, esta silla Serenidad es para ti. Me ha ayudado a mejorar mi postura y a reducir la fatiga considerablemente. El diseño es moderno y combina genial con mi escritorio. ¡Cinco estrellas sin dudarlo!',
    rating: 5,
    productId: '7599476211921',
    productHandle: 'serenidad',
    productDisplayName: 'Silla Serenidad',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Valentina Gomez', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-e31e6813-f488-4e08-9cfe-9ad0432e0df1',
    customerName: 'Adriana Silva',
    customerEmail: 'adriana.silva517@aol.com',
    customerProfile: 'gamer',
    title: '¡Adiós dolor de espalda con la Terra!',
    body: 'Mi experiencia con la Terra ha sido excepcional. Es bastante ergonómica y fácil de ajustar. Ideal para mis sesiones de gaming. La atención al cliente también fue muy buena cuando pregunté por el envío.',
    rating: 5,
    productId: '7599428436177',
    productHandle: 'terra',
    productDisplayName: 'Silla Terra',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Adriana Silva', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-3a8517b3-3cf7-4545-b39d-3fd49c026ee8',
    customerName: 'Valentina Moreno',
    customerEmail: 'valentina.moreno_@aol.com',
    customerProfile: 'remote-worker',
    title: 'Calidad y confort insuperables en la Serenidad',
    body: 'Desde que compré la Serenidad, mis jornadas de trabajo son mucho más placenteras. El soporte lumbar es fantástico y se ajusta perfectamente a mi cuerpo. Además, el envío fue rapidísimo. Una maravilla de silla.',
    rating: 5,
    productId: '7599476211921',
    productHandle: 'serenidad',
    productDisplayName: 'Silla Serenidad',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Valentina Moreno', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-79fd1236-82a9-4e81-9f14-702707e8480d',
    customerName: 'Javier Moreno',
    customerEmail: 'javier.moreno856@icloud.com',
    customerProfile: 'creative',
    title: 'La Serenidad superó mis expectativas',
    body: 'Estoy fascinado/a con la Serenidad. El ensamblaje fue relativamente fácil, aunque una pieza costó un poco y desde el primer momento sentí el confort. Los materiales son premium y el color negro es muy elegante es precioso. ¡Una gran adquisición!',
    rating: 4,
    productId: '7599476211921',
    productHandle: 'serenidad',
    productDisplayName: 'Silla Serenidad',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Javier Moreno', false),
    mentionsIssue: {
      issue: 'Una pieza del ensamblaje costó un poco',
      resolution: 'Fue relativamente fácil y desde el primer momento sentí el confort'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-392bea7a-1275-4ce2-a545-41ee53bd133e',
    customerName: 'Santiago Vargas',
    customerEmail: 'santiago.vargas70@empresa.com.mx',
    customerProfile: 'executive',
    title: 'Comodidad garantizada',
    body: 'Estoy fascinado/a con la Terra. El ensamblaje fue relativamente fácil, aunque una pieza costó un poco y desde el primer momento sentí el confort. Los materiales son premium y el color azul es muy bonito es precioso. ¡Una gran adquisición!',
    rating: 4,
    productId: '7599428436177',
    productHandle: 'terra',
    productDisplayName: 'Silla Terra',
    verified: true,
    reviewDate: '2025-05-09T21:52:54Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Santiago Vargas', false),
    mentionsIssue: {
      issue: 'Una pieza del ensamblaje costó un poco',
      resolution: 'Fue relativamente fácil y desde el primer momento sentí el confort'
    },
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-7c4b7036-d919-4bc4-a11f-10e40e25104d',
    customerName: 'Manuel Herrera',
    customerEmail: 'manuel.herrera.@yahoo.com.mx',
    customerProfile: 'healthcare',
    title: 'Muy recomendable esta Terra',
    body: 'Estaba buscando una silla ergonómica de calidad y la Terra ha superado todas mis expectativas. Es robusta, los acabados son impecables y, lo más importante, es increíblemente cómoda. Una excelente compra para mi salud postural.',
    rating: 5,
    productId: '7599428436177',
    productHandle: 'terra',
    productDisplayName: 'Silla Terra',
    verified: true,
    reviewDate: '2025-05-09T21:52:55Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Manuel Herrera', false),
    source: 'judge-me',
    curated: true
  },
  {
    id: 'review-82f78852-fb5f-49e6-9d03-cd6adeac8b16',
    customerName: 'Joaquin Reyes',
    customerEmail: 'joaquin.reyes368@outlook.com',
    customerProfile: 'remote-worker',
    title: 'Mi oficina en casa ahora es un placer gracias a la Celeste',
    body: 'La Celeste es una auténtica maravilla. Se nota que está pensada para el bienestar del usuario. El respaldo se amolda a la espalda y el asiento es muy confortable. La recomiendo sin dudarlo a cualquiera que busque calidad.',
    rating: 4,
    productId: '7599426732241',
    productHandle: 'celeste',
    productDisplayName: 'Silla Celeste',
    verified: true,
    reviewDate: '2025-05-09T21:52:55Z',
    usageDuration: 'Hace 8 meses',
    hasPhoto: false,
    avatar: generateCustomerAvatar('Joaquin Reyes', false),
    source: 'judge-me',
    curated: true
  }
];

// Calculate trust metrics from real data
export const calculateTrustMetrics = (reviews: EnhancedReview[]): TrustMetrics => {
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;
  
  const starDistribution = reviews.reduce((dist, review) => {
    dist[review.rating as keyof typeof dist]++;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  
  const verifiedCount = reviews.filter(review => review.verified).length;
  const verificationRate = (verifiedCount / totalReviews) * 100;
  
  const responseCount = reviews.filter(review => review.companyReply).length;
  const responseRate = (responseCount / totalReviews) * 100;
  
  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    starDistribution,
    verificationRate: Math.round(verificationRate),
    responseRate: Math.round(responseRate)
  };
};

// Get reviews by customer profile
export const getReviewsByProfile = (profile: CustomerProfile): EnhancedReview[] => {
  return enhancedReviews.filter(review => review.customerProfile === profile);
};

// Get reviews by chair model
export const getReviewsByChair = (chairHandle: ChairModel): EnhancedReview[] => {
  return enhancedReviews.filter(review => review.productHandle === chairHandle);
};

// Get featured reviews (mix of different profiles and ratings)
export const getFeaturedReviews = (limit: number = 8): EnhancedReview[] => {
  // Ensure diversity in featured reviews
  const profileGroups = {
    executive: getReviewsByProfile('executive'),
    gamer: getReviewsByProfile('gamer'),
    student: getReviewsByProfile('student'),
    'remote-worker': getReviewsByProfile('remote-worker'),
    creative: getReviewsByProfile('creative'),
    healthcare: getReviewsByProfile('healthcare')
  };
  
  const featured: EnhancedReview[] = [];
  const profiles = Object.keys(profileGroups) as CustomerProfile[];
  
  // Take one from each profile type first
  profiles.forEach(profile => {
    const profileReviews = profileGroups[profile];
    if (profileReviews.length > 0 && featured.length < limit) {
      featured.push(profileReviews[0]);
    }
  });
  
  // Fill remaining slots with highest rated reviews
  const remaining = enhancedReviews
    .filter(review => !featured.includes(review))
    .sort((a, b) => b.rating - a.rating);
  
  while (featured.length < limit && remaining.length > 0) {
    featured.push(remaining.shift()!);
  }
  
  return featured;
};

// Trust metrics for the current dataset
export const currentTrustMetrics = calculateTrustMetrics(enhancedReviews);