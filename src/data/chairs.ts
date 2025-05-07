export interface Chair {
  id: string;
  name: string;
  description: string;
  extendedDescription?: string;
  price: number;
  compareAtPrice?: number; // Optional original price for showing discounts
  image: string;
  category: 'office' | 'gaming';
  lifeCategory: 'Vida Profesional' | 'Vida Activa' | 'Vida Saludable' | 'Vida Productiva' | 'Vida Social' | 'Complementos para tu Vida';
  primaryBenefit: string;
  features: string[];
  benefitCategories?: {
    comfort?: string[];
    health?: string[];
    productivity?: string[];
    longevity?: string[];
  };
  rating: number;
}

export const chairs: Chair[] = [
  {
    id: 'ergopro-elite',
    name: 'Silla ErgoPro Elite',
    description: 'Máximo confort y ergonomía para largas jornadas',
    extendedDescription: 'La Silla ErgoPro Elite transforma tu experiencia diaria, ofreciendo una inversión en tu bienestar que mejora tu salud postural a largo plazo. Su diseño ergonómico avanzado proporciona el soporte necesario para mantener una postura saludable durante largas jornadas de trabajo.',
    price: 4999.90,
    image: '/images/chairs/ergopro-elite.jpg',
    category: 'office',
    lifeCategory: 'Vida Profesional',
    primaryBenefit: 'Más bienestar para tu vida',
    features: ['Malla transpirable', 'Soporte lumbar ajustable', 'Reposabrazos 4D'],
    benefitCategories: {
      comfort: [
        'Malla transpirable que mantiene una temperatura agradable durante largas jornadas',
        'Asiento con espuma de alta densidad que distribuye la presión uniformemente'
      ],
      health: [
        'Soporte lumbar ajustable que mantiene la curva natural de tu espalda, reduciendo la fatiga',
        'Reposabrazos 4D que reducen la tensión en hombros y cuello'
      ],
      productivity: [
        'Diseño que te permite mantener la concentración durante más tiempo',
        'Ajustes intuitivos que se adaptan a tus movimientos naturales'
      ],
      longevity: [
        'Materiales de alta calidad que garantizan años de uso confiable',
        'Estructura robusta que soporta el uso diario intensivo'
      ]
    },
    rating: 5
  },
  {
    id: 'xgamer-pro',
    name: 'X-Gamer Pro',
    description: 'Diseñada para sesiones intensas de gaming',
    extendedDescription: 'La X-Gamer Pro va más allá del gaming, ofreciendo una inversión en tu bienestar que mejora tu experiencia y salud durante largas sesiones. Su diseño ergonómico proporciona el soporte necesario para mantener una postura saludable incluso en los momentos más intensos.',
    price: 5999.90,
    image: '/images/chairs/xgamer-pro.jpg',
    category: 'gaming',
    lifeCategory: 'Vida Activa',
    primaryBenefit: 'Más energía para tu vida',
    features: ['Reclinable 180°', 'Cojín lumbar', 'Reposabrazos ajustables'],
    benefitCategories: {
      comfort: [
        'Reclinable 180° que te permite cambiar de posición y reducir la fatiga',
        'Acolchado premium que mantiene su forma incluso después de largas sesiones'
      ],
      health: [
        'Cojín lumbar que mantiene la curva natural de tu espalda, previniendo dolores',
        'Diseño que promueve una postura saludable durante actividades intensas'
      ],
      productivity: [
        'Soporte completo que te permite mantener el rendimiento durante más tiempo',
        'Estabilidad que te mantiene enfocado en los momentos críticos'
      ],
      longevity: [
        'Estructura reforzada diseñada para soportar movimientos dinámicos',
        'Materiales de alta resistencia que mantienen su apariencia y funcionalidad'
      ]
    },
    rating: 4.8
  },
  {
    id: 'ergo-mesh',
    name: 'Ergo Mesh Plus',
    description: 'Comodidad y frescura todo el día',
    extendedDescription: 'La Ergo Mesh Plus transforma tu espacio de trabajo en un entorno de productividad y bienestar. Su innovador diseño de malla premium permite una circulación de aire óptima, manteniendo la frescura y comodidad durante toda tu jornada laboral.',
    price: 3499.90,
    image: '/images/chairs/ergo-mesh.jpg',
    category: 'office',
    lifeCategory: 'Vida Productiva',
    primaryBenefit: 'Más productividad para tu vida',
    features: ['Malla premium', 'Ajuste de altura', 'Base giratoria'],
    benefitCategories: {
      comfort: [
        'Malla premium que permite la circulación del aire, manteniendo una temperatura agradable',
        'Diseño ergonómico que se adapta a la forma natural de tu cuerpo'
      ],
      health: [
        'Soporte que promueve una postura correcta durante largas horas de trabajo',
        'Distribución de peso que reduce la presión en puntos específicos'
      ],
      productivity: [
        'Ajuste de altura que permite alinear perfectamente con tu escritorio',
        'Base giratoria que facilita el movimiento y acceso a diferentes áreas de trabajo'
      ],
      longevity: [
        'Malla de alta resistencia que mantiene su tensión y soporte con el tiempo',
        'Componentes de calidad que aseguran un funcionamiento suave y silencioso'
      ]
    },
    rating: 4.9
  },
  {
    id: 'gamer-elite',
    name: 'Gamer Elite RGB',
    description: 'La experiencia gaming definitiva',
    extendedDescription: 'La Gamer Elite RGB eleva tu experiencia más allá del gaming, creando un ambiente que potencia tu rendimiento mientras cuida de tu bienestar. Su diseño ergonómico combinado con la tecnología de iluminación RGB crea un espacio que inspira y protege tu salud durante largas sesiones.',
    price: 6999.90,
    image: '/images/chairs/gamer-elite.jpg',
    category: 'gaming',
    lifeCategory: 'Vida Activa',
    primaryBenefit: 'Más concentración para tu vida',
    features: ['Iluminación RGB', 'Reclinable 165°', 'Memory foam'],
    benefitCategories: {
      comfort: [
        'Memory foam que se adapta a tu cuerpo, distribuyendo la presión uniformemente',
        'Reclinable 165° que permite encontrar la posición perfecta para cada actividad'
      ],
      health: [
        'Diseño ergonómico que reduce la fatiga durante sesiones prolongadas',
        'Soporte que mantiene una postura saludable incluso en momentos de alta intensidad'
      ],
      productivity: [
        'Iluminación RGB que crea un ambiente estimulante para mejorar el rendimiento',
        'Estabilidad que te mantiene enfocado en los momentos decisivos'
      ],
      longevity: [
        'Materiales premium seleccionados por su durabilidad y resistencia',
        'Construcción robusta que soporta el uso intensivo diario'
      ]
    },
    rating: 4.7
  },
  {
    id: 'oficina-x',
    name: 'Silla Oficina X',
    description: 'Silla ergonómica para oficina con diseño moderno',
    extendedDescription: 'La Silla Oficina X combina diseño moderno con beneficios para tu salud, creando un espacio de trabajo que cuida de tu bienestar mientras complementa la estética de tu oficina. Su enfoque ergonómico prioriza tu salud postural durante largas jornadas laborales.',
    price: 3999.90,
    image: '/images/chairs/oficina-x.jpg',
    category: 'office',
    lifeCategory: 'Vida Saludable',
    primaryBenefit: 'Más salud para tu vida',
    features: ['Soporte lumbar', 'Reposacabezas ajustable', 'Asiento acolchado'],
    benefitCategories: {
      comfort: [
        'Asiento acolchado que proporciona comodidad durante toda la jornada laboral',
        'Diseño que distribuye el peso uniformemente, eliminando puntos de presión'
      ],
      health: [
        'Soporte lumbar que mantiene la curva natural de tu espalda, previniendo dolores',
        'Reposacabezas ajustable que reduce la tensión en el cuello y previene dolores de cabeza'
      ],
      productivity: [
        'Ergonomía que te permite mantener el enfoque en tus tareas sin distracciones por incomodidad',
        'Ajustes que se adaptan a diferentes actividades durante tu día de trabajo'
      ],
      longevity: [
        'Diseño moderno y atemporal que mantiene su relevancia estética',
        'Materiales de calidad que resisten el desgaste diario'
      ]
    },
    rating: 4.6
  }
];
