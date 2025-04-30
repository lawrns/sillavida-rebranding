import { VidaIconType } from '../components/VidaIcons';

/**
 * Interface for a life-aspect category
 */
export interface VidaCategory {
  type: VidaIconType;
  label: string;
  path: string;
  description: string;
  primaryMessage: string;
}

/**
 * Interface for a secondary navigation item
 */
export interface SecondaryNavItem {
  label: string;
  path: string;
}

/**
 * All life-aspect categories
 */
export const vidaCategories: VidaCategory[] = [
  {
    type: 'profesional',
    label: 'Vida Profesional',
    path: '/vida/profesional',
    description: 'Sillas para entornos profesionales y ejecutivos',
    primaryMessage: 'Eleva tu espacio profesional'
  },
  {
    type: 'activa',
    label: 'Vida Activa',
    path: '/vida/activa',
    description: 'Sillas para actividades dinámicas y gaming',
    primaryMessage: 'Potencia tu rendimiento'
  },
  {
    type: 'saludable',
    label: 'Vida Saludable',
    path: '/vida/saludable',
    description: 'Sillas ergonómicas para tu bienestar físico',
    primaryMessage: 'Invierte en tu bienestar'
  },
  {
    type: 'productiva',
    label: 'Vida Productiva',
    path: '/vida/productiva',
    description: 'Sillas para optimizar tu eficiencia y concentración',
    primaryMessage: 'Maximiza tu eficiencia'
  },
  {
    type: 'social',
    label: 'Vida Social',
    path: '/vida/social',
    description: 'Sillas para espacios colaborativos y de reunión',
    primaryMessage: 'Crea espacios de conexión'
  },
  {
    type: 'complementos',
    label: 'Complementos',
    path: '/vida/complementos',
    description: 'Accesorios para mejorar tu experiencia',
    primaryMessage: 'Personaliza tu experiencia'
  }
];

/**
 * Secondary navigation items
 */
export const secondaryNavItems: SecondaryNavItem[] = [
  {
    label: 'Promociones',
    path: '/promociones'
  },
  {
    label: 'Más Vendidos',
    path: '/category/mas-vendidos'
  },
  {
    label: 'Ergonomía',
    path: '/educacion/por-que-invertir-en-silla-ergonomica'
  }
];

/**
 * Get primary life-aspect categories for desktop navigation
 * These are the categories that will always be visible in the desktop navigation
 */
export const getPrimaryVidaCategories = (): VidaCategory[] => {
  // Return the first 3 categories for desktop navigation
  return vidaCategories.slice(0, 3);
};

/**
 * Get secondary life-aspect categories for the "More" dropdown
 * These are the categories that will be in the "More" dropdown in the desktop navigation
 */
export const getSecondaryVidaCategories = (): VidaCategory[] => {
  // Return the remaining categories for the "More" dropdown
  return vidaCategories.slice(3);
};

/**
 * Get all life-aspect categories
 * Used for mobile navigation and other places where all categories are needed
 */
export const getAllVidaCategories = (): VidaCategory[] => {
  return vidaCategories;
};

/**
 * Map old category URLs to new life-aspect URLs
 */
export const categoryToVidaMap: Record<string, string> = {
  '/category/sillas-ejecutivas': '/vida/profesional',
  '/category/sillas-ergonomicas': '/vida/saludable',
  '/category/sillas-gamer': '/vida/activa',
  '/category/sillas-secretariales': '/vida/productiva',
  '/category/sillas-de-visita': '/vida/social',
  '/category/accesorios': '/vida/complementos'
};

/**
 * Check if a path is a life-aspect path
 */
export const isVidaPath = (path: string): boolean => {
  return path.startsWith('/vida/');
};

/**
 * Get the life-aspect category for a path
 */
export const getVidaCategoryForPath = (path: string): VidaCategory | undefined => {
  // Check if it's a direct match
  const directMatch = vidaCategories.find(category => category.path === path);
  if (directMatch) return directMatch;
  
  // Check if it's an old category path that maps to a vida path
  const mappedPath = categoryToVidaMap[path];
  if (mappedPath) {
    return vidaCategories.find(category => category.path === mappedPath);
  }
  
  return undefined;
};

/**
 * Get the active vida category based on the current path
 */
export const getActiveVidaCategory = (currentPath: string): VidaCategory | undefined => {
  return getVidaCategoryForPath(currentPath);
};
