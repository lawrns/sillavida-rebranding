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
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=600&q=80',
    category: 'office',
    features: ['Malla transpirable', 'Soporte lumbar ajustable', 'Reposabrazos 4D'],
    rating: 5
  },
  {
    id: 'xgamer-pro',
    name: 'X-Gamer Pro',
    description: 'Diseñada para sesiones intensas de gaming',
    price: 5999.90,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    category: 'gaming',
    features: ['Reclinable 180°', 'Cojín lumbar', 'Reposabrazos ajustables'],
    rating: 4.8
  },
  {
    id: 'ergo-mesh',
    name: 'Ergo Mesh Plus',
    description: 'Comodidad y frescura todo el día',
    price: 3499.90,
    image: 'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?auto=format&fit=crop&w=600&q=80',
    category: 'office',
    features: ['Malla premium', 'Ajuste de altura', 'Base giratoria'],
    rating: 4.9
  },
  {
    id: 'gamer-elite',
    name: 'Gamer Elite RGB',
    description: 'La experiencia gaming definitiva',
    price: 6999.90,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    category: 'gaming',
    features: ['Iluminación RGB', 'Reclinable 165°', 'Memory foam'],
    rating: 4.7
  }
];