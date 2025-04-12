export interface Chair {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'office' | 'gaming';
  features: string[];
  rating: number;
}

export const chairs: Chair[] = [
  {
    id: 'ergopro-elite',
    name: 'Silla ErgoPro Elite',
    description: 'Máximo confort y ergonomía para largas jornadas',
    price: 4999.90,
    image: '/images/chairs/ergopro-elite.jpg',
    category: 'office',
    features: ['Malla transpirable', 'Soporte lumbar ajustable', 'Reposabrazos 4D'],
    rating: 5
  },
  {
    id: 'xgamer-pro',
    name: 'X-Gamer Pro',
    description: 'Diseñada para sesiones intensas de gaming',
    price: 5999.90,
    image: '/images/chairs/xgamer-pro.jpg',
    category: 'gaming',
    features: ['Reclinable 180°', 'Cojín lumbar', 'Reposabrazos ajustables'],
    rating: 4.8
  },
  {
    id: 'ergo-mesh',
    name: 'Ergo Mesh Plus',
    description: 'Comodidad y frescura todo el día',
    price: 3499.90,
    image: '/images/chairs/ergo-mesh.jpg',
    category: 'office',
    features: ['Malla premium', 'Ajuste de altura', 'Base giratoria'],
    rating: 4.9
  },
  {
    id: 'gamer-elite',
    name: 'Gamer Elite RGB',
    description: 'La experiencia gaming definitiva',
    price: 6999.90,
    image: '/images/chairs/gamer-elite.jpg',
    category: 'gaming',
    features: ['Iluminación RGB', 'Reclinable 165°', 'Memory foam'],
    rating: 4.7
  },
  {
    id: 'oficina-x',
    name: 'Silla Oficina X',
    description: 'Silla ergonómica para oficina con diseño moderno',
    price: 3999.90,
    image: '/images/chairs/oficina-x.jpg',
    category: 'office',
    features: ['Soporte lumbar', 'Reposacabezas ajustable', 'Asiento acolchado'],
    rating: 4.6
  }
];
