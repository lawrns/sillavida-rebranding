/**
 * UGC (User Generated Content) Data Structure
 * Using existing review data as placeholders for photos/videos
 */

export interface UGCContent {
  id: string;
  type: 'photo' | 'video' | 'social';
  title: string;
  description: string;
  customerName: string;
  customerAvatar: string;
  customerProfile: 'executive' | 'gamer' | 'student' | 'remote-worker' | 'creative' | 'healthcare';
  productAssociated: string; // Chair model
  mediaUrl: string; // Placeholder image/video URL
  thumbnailUrl: string;
  socialPlatform?: 'instagram' | 'facebook' | 'twitter';
  hashtags?: string[];
  likes?: number;
  isVerified: boolean;
  datePosted: string;
  location?: string;
}

// Real UGC content using actual media files from public/UGC - Each card uses media from its corresponding product folder
export const ugcContent: UGCContent[] = [
  // Video Content - Using the 3 available videos (Serafin, Empirea, Livina)
  {
    id: 'ugc-video-serafin',
    type: 'video',
    title: 'Tour de mi home office con Serafín',
    description: 'Les muestro cómo he organizado mi espacio de trabajo con mi silla Serafín. La ergonomía marca la diferencia.',
    customerName: 'Ana García',
    customerAvatar: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=000&color=fff&size=64',
    customerProfile: 'remote-worker',
    productAssociated: 'serafin',
    mediaUrl: '/UGC/Serafin/Video_Ready_Serafín_Chair.mp4',
    thumbnailUrl: '/UGC/Serafin/image_2025-04-29_212005417.png',
    hashtags: ['#MiSillaVida', '#HomeTour', '#Productividad'],
    likes: 67,
    isVerified: true,
    datePosted: '2025-05-12',
    location: 'Ciudad de México'
  },
  {
    id: 'ugc-video-empirea',
    type: 'video',
    title: 'Gaming setup con Empírea',
    description: 'Mi setup gamer perfecto con la Empírea. Comodidad total durante largas sesiones de juego.',
    customerName: 'Miguel Santos',
    customerAvatar: 'https://ui-avatars.com/api/?name=Miguel+Santos&background=333&color=fff&size=64',
    customerProfile: 'gamer',
    productAssociated: 'empirea',
    mediaUrl: '/UGC/Empirea/Empirea_Chair_Video_Ready_.mp4',
    thumbnailUrl: '/UGC/Empirea/image_2025-04-29_213131332.png',
    hashtags: ['#MiSillaVida', '#Gaming', '#Setup'],
    likes: 89,
    isVerified: true,
    datePosted: '2025-05-10',
    location: 'Guadalajara'
  },
  {
    id: 'ugc-video-livina',
    type: 'video',
    title: 'Oficina moderna con Livina',
    description: 'Mi nueva oficina en casa con la Livina. Perfecta para mantener la postura durante el trabajo.',
    customerName: 'Carolina López',
    customerAvatar: 'https://ui-avatars.com/api/?name=Carolina+Lopez&background=666&color=fff&size=64',
    customerProfile: 'executive',
    productAssociated: 'livina',
    mediaUrl: '/UGC/Livina/Chair_Video_Ready_and_Polished.mp4',
    thumbnailUrl: '/UGC/Livina/image_2025-04-29_204800108.png',
    hashtags: ['#MiSillaVida', '#OficinaEnCasa', '#Ergonomia'],
    likes: 42,
    isVerified: true,
    datePosted: '2025-05-08',
    location: 'Monterrey'
  },

  // Photo Content - Each using images ONLY from their corresponding product folder
  {
    id: 'ugc-photo-aura',
    type: 'photo',
    title: 'Workspace minimalista con Aura',
    description: 'Mi rincón de trabajo perfecto con la silla Aura. Elegante y súper cómoda para largas jornadas.',
    customerName: 'Roberto Silva',
    customerAvatar: 'https://ui-avatars.com/api/?name=Roberto+Silva&background=999&color=fff&size=64',
    customerProfile: 'creative',
    productAssociated: 'aura',
    mediaUrl: '/UGC/Aura/image_2025-04-29_173728134.png',
    thumbnailUrl: '/UGC/Aura/image_2025-04-29_173728134.png',
    hashtags: ['#MiSillaVida', '#Minimalista', '#Workspace'],
    likes: 35,
    isVerified: true,
    datePosted: '2025-05-15',
    location: 'Puebla'
  },
  {
    id: 'ugc-photo-calma',
    type: 'photo',
    title: 'Setup ejecutivo con Calma',
    description: 'Mi oficina ejecutiva equipada con la Calma. La tranquilidad que necesito para tomar decisiones importantes.',
    customerName: 'Ximena Martínez',
    customerAvatar: 'https://ui-avatars.com/api/?name=Ximena+Martinez&background=333&color=fff&size=64',
    customerProfile: 'executive',
    productAssociated: 'calma',
    mediaUrl: '/UGC/Calma/image_2025-04-29_174833213.png',
    thumbnailUrl: '/UGC/Calma/image_2025-04-29_174833213.png',
    hashtags: ['#MiSillaVida', '#OficinaEjecutiva', '#Liderazgo'],
    likes: 58,
    isVerified: true,
    datePosted: '2025-05-13',
    location: 'Tijuana'
  },
  {
    id: 'ugc-photo-celeste',
    type: 'photo',
    title: 'Estudio profesional con Celeste',
    description: 'Mi estudio de diseño con la silla Celeste. La comodidad que necesito para crear sin límites.',
    customerName: 'Carlos Moreno',
    customerAvatar: 'https://ui-avatars.com/api/?name=Carlos+Moreno&background=000&color=fff&size=64',
    customerProfile: 'student',
    productAssociated: 'celeste',
    mediaUrl: '/UGC/Celeste/image_2025-04-29_203925076.png',
    thumbnailUrl: '/UGC/Celeste/image_2025-04-29_203925076.png',
    hashtags: ['#MiSillaVida', '#Creatividad', '#Diseño'],
    likes: 24,
    isVerified: true,
    datePosted: '2025-05-11',
    location: 'Querétaro'
  },
  {
    id: 'ugc-photo-serenidad',
    type: 'photo',
    title: 'Home office con Serenidad',
    description: 'Trabajando desde casa con mi Serenidad. La paz mental que da una silla realmente ergonómica.',
    customerName: 'Juliana Herrera',
    customerAvatar: 'https://ui-avatars.com/api/?name=Juliana+Herrera&background=e1306c&color=fff&size=64',
    customerProfile: 'remote-worker',
    productAssociated: 'serenidad',
    mediaUrl: '/UGC/Serenidad/image_2025-04-29_200729857.png',
    thumbnailUrl: '/UGC/Serenidad/image_2025-04-29_200729857.png',
    hashtags: ['#MiSillaVida', '#TrabajoEnCasa', '#Bienestar'],
    likes: 73,
    isVerified: true,
    datePosted: '2025-05-09',
    location: 'Mérida'
  },
  {
    id: 'ugc-photo-terra',
    type: 'photo',
    title: 'Oficina médica con Terra',
    description: 'En mi consulta médica con la Terra. Comodidad para atender pacientes durante todo el día.',
    customerName: 'Dr. Eduardo Ramírez',
    customerAvatar: 'https://ui-avatars.com/api/?name=Eduardo+Ramirez&background=1877f2&color=fff&size=64',
    customerProfile: 'healthcare',
    productAssociated: 'terra',
    mediaUrl: '/UGC/Terra/image_2025-04-29_202534154.png',
    thumbnailUrl: '/UGC/Terra/image_2025-04-29_202534154.png',
    hashtags: ['#MiSillaVida', '#Salud', '#Medicina'],
    likes: 45,
    isVerified: true,
    datePosted: '2025-05-07',
    location: 'León'
  },

  // Additional photos using other available images from folders with multiple images
  {
    id: 'ugc-photo-aura-2',
    type: 'photo',
    title: 'Setup nocturno con Aura',
    description: 'Trabajando hasta tarde con mi Aura. La iluminación perfecta para largas sesiones de diseño.',
    customerName: 'Andrea Vega',
    customerAvatar: 'https://ui-avatars.com/api/?name=Andrea+Vega&background=8B5CF6&color=fff&size=64',
    customerProfile: 'creative',
    productAssociated: 'aura',
    mediaUrl: '/UGC/Aura/image_2025-04-29_173757220.png',
    thumbnailUrl: '/UGC/Aura/image_2025-04-29_173757220.png',
    hashtags: ['#MiSillaVida', '#NightWork', '#Diseño'],
    likes: 29,
    isVerified: true,
    datePosted: '2025-05-06',
    location: 'Cancún'
  },
  {
    id: 'ugc-photo-calma-2',
    type: 'photo',
    title: 'Reuniones virtuales con Calma',
    description: 'La Calma me da la confianza perfecta para todas mis videoconferencias ejecutivas.',
    customerName: 'Fernando Ruiz',
    customerAvatar: 'https://ui-avatars.com/api/?name=Fernando+Ruiz&background=059669&color=fff&size=64',
    customerProfile: 'executive',
    productAssociated: 'calma',
    mediaUrl: '/UGC/Calma/image_2025-04-29_194218288.png',
    thumbnailUrl: '/UGC/Calma/image_2025-04-29_194218288.png',
    hashtags: ['#MiSillaVida', '#VideoConferencias', '#Ejecutivo'],
    likes: 51,
    isVerified: true,
    datePosted: '2025-05-04',
    location: 'Toluca'
  },
  {
    id: 'ugc-photo-empirea-2',
    type: 'photo',
    title: 'Gaming setup profesional con Empírea',
    description: 'Mi estación de gaming con la Empírea. Perfecta para streams y competencias.',
    customerName: 'GamePro_Alex',
    customerAvatar: 'https://ui-avatars.com/api/?name=Alex+Gamer&background=DC2626&color=fff&size=64',
    customerProfile: 'gamer',
    productAssociated: 'empirea',
    mediaUrl: '/UGC/Empirea/image_2025-04-29_213139488.png',
    thumbnailUrl: '/UGC/Empirea/image_2025-04-29_213139488.png',
    hashtags: ['#MiSillaVida', '#Gaming', '#Streaming'],
    likes: 128,
    isVerified: false,
    datePosted: '2025-05-03',
    location: 'Guadalajara'
  },
  {
    id: 'ugc-photo-serafin-2',
    type: 'photo',
    title: 'Workspace productivo con Serafín',
    description: 'Mi oficina en casa con la Serafín. La ergonomía que necesito para ser más productivo.',
    customerName: 'Patricia Morales',
    customerAvatar: 'https://ui-avatars.com/api/?name=Patricia+Morales&background=F59E0B&color=fff&size=64',
    customerProfile: 'remote-worker',
    productAssociated: 'serafin',
    mediaUrl: '/UGC/Serafin/image_2025-04-29_212013453.png',
    thumbnailUrl: '/UGC/Serafin/image_2025-04-29_212013453.png',
    hashtags: ['#MiSillaVida', '#Productividad', '#HomeOffice'],
    likes: 37,
    isVerified: true,
    datePosted: '2025-05-02',
    location: 'Puebla'
  },

  // Social Media Posts
  {
    id: 'ugc-social-001',
    type: 'social',
    title: 'Publicación de Instagram',
    description: '¡Increíble mi nueva Livina! Por fin una silla que me da el soporte que necesito para mis largas jornadas. Ya no tengo dolor de espalda 💪 #MiSillaVida',
    customerName: '@maria_ejecutiva',
    customerAvatar: 'https://ui-avatars.com/api/?name=Maria+Fernandez&background=e1306c&color=fff&size=64',
    customerProfile: 'executive',
    productAssociated: 'livina',
    mediaUrl: '/UGC/Livina/image_2025-04-29_204932229.png',
    thumbnailUrl: '/UGC/Livina/image_2025-04-29_204932229.png',
    socialPlatform: 'instagram',
    hashtags: ['#MiSillaVida', '#OficinaEnCasa', '#Ejecutiva'],
    likes: 143,
    isVerified: false,
    datePosted: '2025-05-14',
    location: 'Guadalajara'
  },
  {
    id: 'ugc-social-002',
    type: 'social',
    title: 'Publicación de Facebook',
    description: 'Después de 3 meses con mi silla Serenidad puedo decir que es la mejor inversión que he hecho para mi oficina. Trabajo 8 horas diarias y ya no siento fatiga. 100% recomendada!',
    customerName: 'Dr. Carlos Mendoza',
    customerAvatar: 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=1877f2&color=fff&size=64',
    customerProfile: 'healthcare',
    productAssociated: 'serenidad',
    mediaUrl: '/UGC/Serenidad/image_2025-04-29_200745477.png',
    thumbnailUrl: '/UGC/Serenidad/image_2025-04-29_200745477.png',
    socialPlatform: 'facebook',
    hashtags: ['#MiSillaVida', '#Recomendacion', '#Salud'],
    likes: 67,
    isVerified: true,
    datePosted: '2025-05-11',
    location: 'Ciudad de México'
  }
];

// Filter functions
export const getUGCByType = (type: 'photo' | 'video' | 'social' | 'all'): UGCContent[] => {
  if (type === 'all') return ugcContent;
  return ugcContent.filter(content => content.type === type);
};

export const getUGCByProduct = (product: string): UGCContent[] => {
  return ugcContent.filter(content => content.productAssociated === product);
};

export const getFeaturedUGC = (limit: number = 8): UGCContent[] => {
  return ugcContent
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, limit);
};

// UGC Statistics
export const ugcStats = {
  totalContent: ugcContent.length,
  totalPhotos: ugcContent.filter(c => c.type === 'photo').length,
  totalVideos: ugcContent.filter(c => c.type === 'video').length,
  totalSocialPosts: ugcContent.filter(c => c.type === 'social').length,
  totalLikes: ugcContent.reduce((acc, content) => acc + (content.likes || 0), 0),
  verifiedContent: ugcContent.filter(c => c.isVerified).length
};