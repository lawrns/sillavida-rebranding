import { User, BadgeCheck, Activity, Heart } from 'lucide-react';

export type TestimonialCategory = 'health' | 'productivity' | 'comfort';

export interface Testimonial {
  id: string;
  name: string;
  age?: number;
  profession: string;
  location: string;
  chairModel: string;
  photo: string;
  quote: string;
  context: string;
  transformation: string;
  conclusion: string;
  category: TestimonialCategory;
  verified: boolean;
  timeUsing: string;
  featured?: boolean;
}

// Helper function to get category icon
export const getCategoryIcon = (category: TestimonialCategory) => {
  switch (category) {
    case 'health':
      return Heart;
    case 'productivity':
      return Activity;
    case 'comfort':
      return User;
    default:
      return User;
  }
};

// Helper function to get category label
export const getCategoryLabel = (category: TestimonialCategory) => {
  switch (category) {
    case 'health':
      return 'Salud';
    case 'productivity':
      return 'Productividad';
    case 'comfort':
      return 'Bienestar';
    default:
      return 'Bienestar';
  }
};

// Sample testimonials data based on the template
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'María L.',
    age: 34,
    profession: 'Diseñadora Gráfica',
    location: 'Ciudad de México',
    chairModel: 'Silla Ergonómica Pro X',
    photo: '/images/ergonomica.png',
    quote: 'Después de años de dolor, finalmente puedo trabajar sin pensar en mi espalda.',
    context: 'Pasaba más de 10 horas diarias frente a la computadora, sufriendo dolores constantes en la zona lumbar que empeoraban con el tiempo. Había probado varios tratamientos y sillas "ergonómicas" de tiendas departamentales, pero el alivio era siempre temporal.',
    transformation: 'Después de investigar opciones de calidad, invertí en la Silla Ergonómica Pro X de SillaVida. En menos de dos semanas, noté una reducción del 70% en mi dolor lumbar y una mejora significativa en mi postura. Ahora puedo concentrarme completamente en mi trabajo creativo sin la distracción constante del dolor.',
    conclusion: 'Esta silla ha sido una de las mejores inversiones para mi salud que he hecho. La recomendaría a cualquier profesional que valore su bienestar a largo plazo.',
    category: 'health',
    verified: true,
    timeUsing: '8 meses',
    featured: true
  },
  {
    id: 'testimonial-2',
    name: 'Carlos R.',
    age: 42,
    profession: 'Desarrollador de Software',
    location: 'Guadalajara',
    chairModel: 'Silla Ejecutiva Elite',
    photo: '/images/ejecutiva.png',
    quote: 'Mi productividad aumentó notablemente desde que tengo una silla que se adapta a mí.',
    context: 'Como desarrollador independiente, mi ingreso depende directamente de mi capacidad para mantener la concentración durante largas sesiones de programación. Solía tomar descansos cada 30-45 minutos debido a la incomodidad, interrumpiendo mi flujo de trabajo.',
    transformation: 'Decidí invertir en la Silla Ejecutiva Elite después de calcular cuánto tiempo productivo estaba perdiendo. Ahora puedo trabajar cómodamente durante 2-3 horas seguidas, lo que ha aumentado mi productividad en aproximadamente un 40%. Los ajustes personalizables me permiten cambiar de posición a lo largo del día, manteniendo mi energía y creatividad.',
    conclusion: 'Esta silla ha transformado mi rutina de trabajo y ha tenido un impacto directo en mis ingresos. La recomiendo especialmente a otros profesionales independientes que dependen de su concentración y productividad.',
    category: 'productivity',
    verified: true,
    timeUsing: '1 año y 2 meses',
    featured: true
  },
  {
    id: 'testimonial-3',
    name: 'Ana P.',
    age: 29,
    profession: 'Profesora Universitaria',
    location: 'Monterrey',
    chairModel: 'Silla Gamer Pro',
    photo: '/images/gamer.png',
    quote: 'No sabía que una silla podía mejorar tanto mi calidad de vida en casa.',
    context: 'Con las clases virtuales, mi apartamento se convirtió en mi salón de clases y oficina. Usaba una silla básica que parecía adecuada, pero al final del día terminaba físicamente agotada y de mal humor, lo que afectaba mi vida personal.',
    transformation: 'Aunque dudé por el precio, decidí probar la Silla Gamer Pro por sus características de confort. La diferencia fue inmediata: terminaba mis jornadas de enseñanza con energía para disfrutar de mi tiempo libre. El soporte lumbar y los apoyabrazos ajustables me permiten mantener una postura cómoda durante mis videoconferencias, y la calidad de los materiales hace que se sienta como un pequeño lujo diario.',
    conclusion: 'Invertir en esta silla ha mejorado significativamente mi equilibrio entre trabajo y vida personal. La recomendaría a cualquiera que trabaje desde casa y quiera crear un espacio que apoye tanto su bienestar físico como emocional.',
    category: 'comfort',
    verified: true,
    timeUsing: '6 meses',
    featured: true
  },
  {
    id: 'testimonial-4',
    name: 'Roberto M.',
    age: 38,
    profession: 'Contador',
    location: 'Puebla',
    chairModel: 'Silla Ergonómica Comfort Plus',
    photo: '/images/secretariales.png',
    quote: 'Mi médico notó la mejora en mi postura después de usar esta silla.',
    context: 'Durante años sufrí de tensión cervical y dolores de cabeza frecuentes debido a las largas horas revisando documentos financieros. Mi médico me había recomendado mejorar mi estación de trabajo, pero siempre lo postergaba.',
    transformation: 'Finalmente, después de un episodio particularmente doloroso, decidí invertir en la Silla Ergonómica Comfort Plus. El soporte cervical y la posibilidad de ajustar la inclinación han sido fundamentales para corregir mi postura. En mi última revisión médica, mi doctor comentó sobre la notable mejora en mi alineación vertebral y la reducción de la tensión muscular.',
    conclusion: 'Lo que comenzó como una compra por necesidad se ha convertido en una inversión en mi salud a largo plazo. Recomendaría esta silla a cualquiera que sufra de problemas cervicales o de espalda alta.',
    category: 'health',
    verified: true,
    timeUsing: '10 meses'
  },
  {
    id: 'testimonial-5',
    name: 'Laura S.',
    age: 31,
    profession: 'Arquitecta',
    location: 'Querétaro',
    chairModel: 'Silla Ejecutiva Premium',
    photo: '/images/silgamer.png',
    quote: 'Mis proyectos de diseño mejoraron cuando pude sentarme cómodamente durante horas.',
    context: 'Como arquitecta, paso muchas horas trabajando en diseños detallados que requieren precisión y concentración. Mi antigua silla me obligaba a cambiar constantemente de posición, lo que afectaba mi enfoque y la calidad de mi trabajo.',
    transformation: 'La Silla Ejecutiva Premium ha transformado mi proceso creativo. Su sistema de soporte adaptable me permite mantener una posición cómoda durante las largas sesiones de diseño. He notado que mis proyectos tienen menos errores y mis clientes han comentado sobre la mejora en la atención al detalle. Estimo que mi eficiencia ha aumentado al menos un 25%.',
    conclusion: 'Esta silla ha sido una inversión en mi carrera profesional. La recomendaría a cualquier persona cuyo trabajo requiera concentración sostenida y precisión.',
    category: 'productivity',
    verified: true,
    timeUsing: '9 meses'
  },
  {
    id: 'testimonial-6',
    name: 'Javier G.',
    age: 45,
    profession: 'Gerente de Ventas',
    location: 'León',
    chairModel: 'Silla Ejecutiva Deluxe',
    photo: '/images/visita.png',
    quote: 'Mi oficina en casa ahora refleja el profesionalismo que quiero proyectar.',
    context: 'Con el cambio al trabajo remoto, mis videoconferencias con clientes se volvieron la norma. Mi espacio de trabajo improvisado con una silla de comedor no transmitía la imagen profesional que necesitaba, además de ser incómodo durante llamadas largas.',
    transformation: 'La Silla Ejecutiva Deluxe no solo mejoró mi comodidad, sino que elevó la apariencia de mi oficina en casa. Los clientes han notado el cambio en mi entorno de trabajo, y me siento más seguro durante las presentaciones virtuales. La comodidad durante largas llamadas me permite mantener mi energía y entusiasmo hasta el final de cada reunión.',
    conclusion: 'Esta silla ha mejorado tanto mi bienestar físico como mi imagen profesional. La recomendaría a cualquier profesional que quiera crear un espacio de trabajo remoto que impresione a sus clientes y cuide su cuerpo.',
    category: 'comfort',
    verified: true,
    timeUsing: '7 meses'
  },
  {
    id: 'testimonial-7',
    name: 'Elena T.',
    age: 36,
    profession: 'Editora de Video',
    location: 'Tijuana',
    chairModel: 'Silla Ergonómica Pro X',
    photo: '/images/gamer2.png',
    quote: 'Mis sesiones de edición ya no terminan con dolor en la espalda baja.',
    context: 'Mi trabajo implica estar sentada durante 8-10 horas diarias editando videos. Solía terminar cada jornada con un dolor intenso en la zona lumbar que me impedía disfrutar de mis actividades personales después del trabajo.',
    transformation: 'Desde que comencé a usar la Silla Ergonómica Pro X, el cambio ha sido notable. El soporte lumbar ajustable y la distribución de peso han eliminado casi por completo el dolor al final del día. Ahora puedo dedicarme a mis hobbies y pasar tiempo de calidad con mi familia después del trabajo, sin estar limitada por el dolor o la fatiga.',
    conclusion: 'Esta silla ha mejorado significativamente mi calidad de vida más allá del trabajo. La recomendaría especialmente a otros profesionales creativos que pasan largas horas frente a la computadora.',
    category: 'health',
    verified: true,
    timeUsing: '1 año'
  },
  {
    id: 'testimonial-8',
    name: 'Miguel A.',
    age: 33,
    profession: 'Analista Financiero',
    location: 'Ciudad de México',
    chairModel: 'Silla Ejecutiva Elite',
    photo: '/images/ejecutiva.png',
    quote: 'Mi capacidad para analizar datos complejos mejoró con el confort adecuado.',
    context: 'Mi trabajo requiere analizar grandes cantidades de datos y mantener la concentración durante horas. Con mi silla anterior, me distraía constantemente ajustando mi posición, lo que interrumpía mi flujo de pensamiento en momentos críticos.',
    transformation: 'La Silla Ejecutiva Elite ha eliminado esas distracciones. Su diseño ergonómico me permite mantener una postura cómoda y estable durante todo el día. He notado que puedo mantener mi concentración en análisis complejos durante períodos más largos, lo que ha resultado en informes más precisos y detallados. Mi supervisor ha notado la mejora en la calidad de mi trabajo.',
    conclusion: 'Esta silla ha sido una inversión en mi rendimiento profesional. La recomendaría a cualquier persona cuyo trabajo requiera concentración mental intensa y sostenida.',
    category: 'productivity',
    verified: true,
    timeUsing: '11 meses'
  },
  {
    id: 'testimonial-9',
    name: 'Sofía R.',
    age: 27,
    profession: 'Escritora',
    location: 'Mérida',
    chairModel: 'Silla Gamer Pro',
    photo: '/images/ergonomica.png',
    quote: 'Encontré mi espacio de creatividad en una silla que no esperaba.',
    context: 'Como escritora freelance, paso muchas horas en mi escritorio. Nunca consideré una silla gamer porque pensaba que eran solo para videojuegos, pero estaba desesperada por encontrar algo cómodo para mis largas sesiones de escritura.',
    transformation: 'La Silla Gamer Pro ha transformado mi espacio de trabajo en un refugio creativo. Los múltiples ajustes me permiten cambiar de posición a lo largo del día, manteniendo mi cuerpo cómodo y mi mente activa. La calidad de los materiales y el diseño envolvente crean una sensación de "espacio personal" que me ayuda a sumergirme en mi escritura. He notado que mis sesiones creativas son más largas y productivas.',
    conclusion: 'Esta silla ha creado un ambiente que nutre mi proceso creativo. La recomendaría a otros creativos que buscan un espacio de trabajo que combine comodidad y concentración.',
    category: 'comfort',
    verified: true,
    timeUsing: '8 meses'
  }
];

// Helper function to get testimonials by category
export const getTestimonialsByCategory = (category: TestimonialCategory) => {
  return testimonials.filter(testimonial => testimonial.category === category);
};

// Helper function to get featured testimonials
export const getFeaturedTestimonials = () => {
  return testimonials.filter(testimonial => testimonial.featured);
};
