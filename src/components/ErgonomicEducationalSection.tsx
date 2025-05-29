import React from 'react';
import './ErgonomicEducationalSection.css';
import { Activity, Brain, Briefcase, Clock, DollarSign, HeartPulse, Lightbulb, Shield, Sparkles, Target } from 'lucide-react';

// Types for component props
interface ErgonomicEducationalSectionProps {
  className?: string;
  id?: string;
  backgroundColor?: string;
  padding?: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  titleSize?: 'small' | 'medium' | 'large';
  subtitleSize?: 'small' | 'medium' | 'large';
  titleColor?: string;
  subtitleColor?: string;
}

interface IntroductionProps {
  content: string | React.ReactNode;
  visualElement?: VisualElementProps;
  visualElementPosition?: 'left' | 'right' | 'top' | 'bottom';
  textColor?: string;
}

interface ContentSectionProps {
  title: string;
  contentBlocks: ContentBlockProps[];
  backgroundColor?: string;
  textColor?: string;
  layout?: 'grid' | 'list';
}

interface ContentBlockProps {
  title: string;
  visualElement?: VisualElementProps;
  content: string | React.ReactNode;
  statistic?: StatisticProps;
  backgroundColor?: string;
  textColor?: string;
  visualElementPosition?: 'left' | 'right' | 'top' | 'bottom';
}

interface StatisticProps {
  value: string;
  label: string;
  valueColor?: string;
  labelColor?: string;
  valueSize?: 'small' | 'medium' | 'large';
  labelSize?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
}

interface VisualElementProps {
  type: 'image' | 'icon' | 'chart' | 'diagram';
  source?: string;
  icon?: React.ReactNode;
  caption?: string;
  altText?: string;
  width?: string;
  height?: string;
  captionColor?: string;
  iconSize?: number;
  iconColor?: string;
}

interface CallToActionProps {
  content: string | React.ReactNode;
  buttonText: string;
  buttonLink: string;
  buttonVariant?: 'primary' | 'secondary' | 'tertiary';
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
}

// Component implementations
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  alignment = 'left',
  titleSize = 'large',
  subtitleSize = 'medium',
  titleColor,
  subtitleColor,
}) => {
  return (
    <header className={`section-header text-${alignment}`}>
      <h2 className={`section-title ${titleSize}`} style={{ color: titleColor }}>
        {title}
      </h2>
      {subtitle && (
        <h3 className={`section-subtitle ${subtitleSize}`} style={{ color: subtitleColor }}>
          {subtitle}
        </h3>
      )}
    </header>
  );
};

const Introduction: React.FC<IntroductionProps> = ({
  content,
  visualElement,
  visualElementPosition = 'right',
  textColor,
}) => {
  return (
    <div className={`introduction ${visualElement ? `with-visual-${visualElementPosition}` : ''}`}>
      <div className="introduction-text" style={{ color: textColor }}>
        {content}
      </div>
      {visualElement && <VisualElement {...visualElement} />}
    </div>
  );
};

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  contentBlocks,
  backgroundColor,
  textColor,
  layout = 'grid',
}) => {
  return (
    <div className={`content-section ${layout}`} style={{ backgroundColor }}>
      <h3 className="content-section-title" style={{ color: textColor }}>
        {title}
      </h3>
      <div className={`content-blocks ${layout}`}>
        {contentBlocks.map((block, index) => (
          <ContentBlock key={index} {...block} />
        ))}
      </div>
    </div>
  );
};

const ContentBlock: React.FC<ContentBlockProps> = ({
  title,
  visualElement,
  content,
  statistic,
  backgroundColor,
  textColor,
  visualElementPosition = 'top',
}) => {
  return (
    <div className={`content-block ${visualElementPosition}`} style={{ backgroundColor }}>
      <h4 className="content-block-title" style={{ color: textColor }}>
        {title}
      </h4>
      {visualElement && <VisualElement {...visualElement} />}
      <div className="content-block-text" style={{ color: textColor }}>
        {content}
      </div>
      {statistic && <Statistic {...statistic} />}
    </div>
  );
};

const Statistic: React.FC<StatisticProps> = ({
  value,
  label,
  valueColor,
  labelColor,
  valueSize = 'large',
  labelSize = 'medium',
  alignment = 'center',
}) => {
  return (
    <div className={`statistic text-${alignment}`}>
      <div className={`statistic-value ${valueSize}`} style={{ color: valueColor }}>
        {value}
      </div>
      <div className={`statistic-label ${labelSize}`} style={{ color: labelColor }}>
        {label}
      </div>
    </div>
  );
};

const VisualElement: React.FC<VisualElementProps> = ({
  type,
  source,
  icon,
  caption,
  altText,
  width,
  height,
  captionColor,
  iconSize = 64,
  iconColor = '#000000',
}) => {
  return (
    <div className={`visual-element ${type}`}>
      {type === 'image' && source && (
        <img src={source} alt={altText || ''} width={width} height={height} />
      )}
      {type === 'icon' && icon && (
        <div className="icon" style={{ color: iconColor, width: iconSize, height: iconSize }}>
          {icon}
        </div>
      )}
      {type === 'chart' && source && (
        <div className="chart" dangerouslySetInnerHTML={{ __html: source }} />
      )}
      {type === 'diagram' && source && (
        <div className="diagram" dangerouslySetInnerHTML={{ __html: source }} />
      )}
      {caption && (
        <div className="visual-caption" style={{ color: captionColor }}>
          {caption}
        </div>
      )}
    </div>
  );
};

const CallToAction: React.FC<CallToActionProps> = ({
  content,
  buttonText,
  buttonLink,
  buttonVariant = 'primary',
  backgroundColor,
  textColor,
  buttonColor,
}) => {
  return (
    <div className="call-to-action" style={{ backgroundColor }}>
      <div className="call-to-action-text" style={{ color: textColor }}>
        {content}
      </div>
      <a
        href={buttonLink}
        className={`button ${buttonVariant}`}
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </a>
    </div>
  );
};

// Main component
const ErgonomicEducationalSection: React.FC<ErgonomicEducationalSectionProps> = ({
  className = '',
  id,
  backgroundColor,
  padding = { desktop: '4rem 2rem', tablet: '3rem 1.5rem', mobile: '2rem 1rem' },
}) => {
  // Content for the educational section
  const healthBenefitsBlocks: ContentBlockProps[] = [
    {
      title: 'Mejora de la Postura',
      visualElement: {
        type: 'icon',
        icon: <Activity size={64} strokeWidth={1.5} />,
        caption: 'Una postura correcta reduce la presión en los discos lumbares hasta en un 30%',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Una postura incorrecta no solo afecta tu apariencia, sino que puede causar problemas de salud a largo plazo. Las sillas ergonómicas están diseñadas para mantener tu columna vertebral en su alineación natural en forma de "S".
          </p>
          <p>
            <strong>¿Sabías que?</strong> El 80% de los adultos experimentan dolor de espalda en algún momento de sus vidas, y una mala postura al sentarse es uno de los principales factores contribuyentes.
          </p>
          <ul>
            <li>Proporciona soporte lumbar ajustable que mantiene la curva natural de tu columna</li>
            <li>Reduce la presión en los discos lumbares hasta en un 30%</li>
            <li>Previene el aplanamiento de la curva lumbar, que puede llevar a hernias discales</li>
            <li>Distribuye tu peso corporal de manera uniforme, reduciendo los puntos de presión</li>
          </ul>
        </>
      ),
      statistic: {
        value: '80%',
        label: 'de los adultos experimentan dolor de espalda',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
    {
      title: 'Prevención y Alivio del Dolor',
      visualElement: {
        type: 'icon',
        icon: <HeartPulse size={64} strokeWidth={1.5} />,
        caption: 'El soporte lumbar adecuado puede reducir el dolor lumbar hasta en un 34%',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            El dolor no es un compañero de trabajo inevitable. Las investigaciones muestran que las sillas ergonómicas pueden reducir significativamente el dolor relacionado con estar sentado.
          </p>
          <p>
            <strong>¿Sabías que?</strong> El soporte lumbar adecuado puede reducir el dolor lumbar hasta en un 34% en trabajadores de oficina.
          </p>
          <ul>
            <li>Reduce la presión en puntos críticos como la parte baja de la espalda, el cuello y los hombros</li>
            <li>Proporciona características específicas que abordan áreas comunes de dolor</li>
            <li>Distribuye la presión de manera uniforme para evitar la fatiga muscular</li>
            <li>Permite ajustes personalizados para adaptarse a tu cuerpo único</li>
          </ul>
        </>
      ),
      statistic: {
        value: '34%',
        label: 'reducción del dolor lumbar con soporte adecuado',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
    {
      title: 'Circulación y Movimiento',
      visualElement: {
        type: 'icon',
        icon: <Activity size={64} strokeWidth={1.5} />,
        caption: 'Los cambios de posición frecuentes mejoran la circulación hasta en un 20%',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Tu cuerpo está diseñado para moverse, incluso cuando estás sentado. Una silla ergonómica facilita el movimiento natural y promueve una mejor circulación sanguínea.
          </p>
          <p>
            <strong>¿Sabías que?</strong> Sentarse por más de 8 horas al día aumenta el riesgo de enfermedades cardiovasculares en un 125%.
          </p>
          <ul>
            <li>Permite cambios de posición frecuentes que mejoran la circulación hasta en un 20%</li>
            <li>Reduce la presión en los muslos con ajustes adecuados de altura del asiento</li>
            <li>Incluye características como la reclinación dinámica que facilita el movimiento</li>
            <li>Promueve lo que los expertos llaman "sentarse dinámicamente" - pequeños movimientos constantes que son cruciales para la salud</li>
          </ul>
        </>
      ),
      statistic: {
        value: '20%',
        label: 'mejora en la circulación con cambios de posición frecuentes',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
  ];

  const productivityBlocks: ContentBlockProps[] = [
    {
      title: 'Conexión entre Comodidad y Concentración',
      visualElement: {
        type: 'icon',
        icon: <Brain size={64} strokeWidth={1.5} />,
        caption: 'La incomodidad física causa una disminución del 15% en la concentración',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            La incomodidad física es una distracción constante que reduce tu capacidad para concentrarte en tareas importantes. Cuando estás cómodo, tu mente es libre para enfocarse en lo que realmente importa.
          </p>
          <p>
            <strong>¿Sabías que?</strong> La incomodidad física causa una disminución del 15% en la concentración y los trabajadores reportan un promedio de 6 distracciones por hora debido a la incomodidad en sillas no ergonómicas.
          </p>
          <ul>
            <li>Elimina distracciones físicas que interrumpen tu flujo de trabajo</li>
            <li>Te permite mantener posiciones cómodas durante períodos más largos</li>
            <li>Reduce la necesidad de ajustes constantes de postura</li>
            <li>Crea un entorno físico que apoya el trabajo mental intenso</li>
          </ul>
        </>
      ),
      statistic: {
        value: '25%',
        label: 'mayor concentración con estaciones de trabajo ergonómicas',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
    {
      title: 'Conservación de Energía',
      visualElement: {
        type: 'image',
        source: '/images/ergonomic-energy.svg',
        altText: 'Ilustración de conservación de energía',
        caption: 'El soporte ergonómico reduce el gasto de energía en un 23%',
      },
      content: (
        <>
          <p>
            Tu cuerpo gasta energía constantemente para mantener una postura adecuada en una silla inadecuada. Esa es energía que podrías estar usando para tu trabajo creativo o analítico.
          </p>
          <p>
            <strong>¿Sabías que?</strong> El soporte ergonómico adecuado reduce el gasto de energía en el mantenimiento de la postura en un 23%.
          </p>
          <ul>
            <li>Reduce la fatiga física al final del día laboral hasta en un 32%</li>
            <li>Disminuye la tensión muscular que drena tu energía mental</li>
            <li>Permite que tu cuerpo descanse adecuadamente mientras trabajas</li>
            <li>Acumula beneficios a lo largo del día que resultan en mayor productividad</li>
          </ul>
        </>
      ),
      statistic: {
        value: '32%',
        label: 'reducción de la fatiga física al final del día',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
    {
      title: 'Reducción de Distracciones',
      visualElement: {
        type: 'icon',
        icon: <Target size={64} strokeWidth={1.5} />,
        caption: 'Los empleados con sillas ergonómicas toman 17% menos descansos debido a la incomodidad',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Cada vez que te mueves para aliviar la incomodidad, pierdes concentración. Estas micro-interrupciones se suman a lo largo del día, fragmentando tu atención y reduciendo tu productividad.
          </p>
          <p>
            <strong>¿Sabías que?</strong> Los empleados con sillas ergonómicas toman 17% menos descansos debido a la incomodidad.
          </p>
          <ul>
            <li>Minimiza la necesidad de ajustes frecuentes de postura</li>
            <li>Elimina el dolor que desvía tu atención de las tareas importantes</li>
            <li>Proporciona una base estable para tu trabajo concentrado</li>
            <li>Crea un entorno físico que apoya períodos prolongados de enfoque</li>
          </ul>
        </>
      ),
      statistic: {
        value: '17%',
        label: 'menos descansos debido a la incomodidad',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
  ];

  const valueBlocks: ContentBlockProps[] = [
    {
      title: 'Inversión en Salud',
      visualElement: {
        type: 'icon',
        icon: <DollarSign size={64} strokeWidth={1.5} />,
        caption: 'La prevención a través de muebles ergonómicos cuesta 8-10 veces menos que el tratamiento',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Cuando consideras el costo de una silla ergonómica, es importante verlo en el contexto adecuado: no es un gasto, sino una inversión en tu salud a largo plazo.
          </p>
          <p>
            <strong>¿Sabías que?</strong> El costo promedio directo de una lesión de espalda relacionada con el trabajo es de $40,000-$80,000, y los empleadores gastan aproximadamente $20 mil millones anualmente en costos directos por trastornos musculoesqueléticos en el lugar de trabajo.
          </p>
          <ul>
            <li>La prevención a través de muebles ergonómicos cuesta 8-10 veces menos que el tratamiento de trastornos musculoesqueléticos</li>
            <li>El retorno de inversión para muebles ergonómicos promedia 3:1 durante un período de 5 años</li>
            <li>Los beneficios para la salud se acumulan con el tiempo, creando un efecto compuesto</li>
            <li>El valor preventivo supera con creces el costo inicial</li>
          </ul>
          <p>
            Como dice el Dr. Alan Hedge, profesor de Ergonomía de la Universidad de Cornell: "La ciencia es clara: invertir en una silla ergonómica adecuadamente diseñada es una de las formas más efectivas de prevenir problemas musculoesqueléticos y mejorar el bienestar en el lugar de trabajo. El costo inicial se compensa rápidamente con mejoras en la salud, la comodidad y la productividad."
          </p>
        </>
      ),
      statistic: {
        value: '3:1',
        label: 'retorno de inversión durante un período de 5 años',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
    {
      title: 'Durabilidad y Calidad',
      visualElement: {
        type: 'icon',
        icon: <Shield size={64} strokeWidth={1.5} />,
        caption: 'Las sillas ergonómicas de calidad tienen una vida útil promedio de 7-10 años',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Las sillas ergonómicas de calidad están construidas para durar, lo que las convierte en una inversión más inteligente a largo plazo que las alternativas más baratas que necesitan ser reemplazadas frecuentemente.
          </p>
          <p>
            <strong>¿Sabías que?</strong> Las sillas ergonómicas de calidad tienen una vida útil promedio de 7-10 años, en comparación con 1-3 años para las sillas de oficina estándar.
          </p>
          <ul>
            <li>El período de garantía promedio para sillas ergonómicas premium es de 12 años, en comparación con 1-2 años para sillas estándar</li>
            <li>Las sillas ergonómicas de alta calidad conservan el 85% de su funcionalidad después de 5 años de uso regular</li>
            <li>El costo anual de propiedad para una silla ergonómica de calidad es 40-60% menor que para sillas de oficina estándar cuando se calcula sobre la vida útil completa</li>
            <li>Los materiales y la construcción de mayor calidad resisten el desgaste diario</li>
          </ul>
        </>
      ),
      statistic: {
        value: '7-10',
        label: 'años de vida útil promedio para sillas ergonómicas de calidad',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
    {
      title: 'Adaptabilidad y Personalización',
      visualElement: {
        type: 'icon',
        icon: <Sparkles size={64} strokeWidth={1.5} />,
        caption: 'El soporte lumbar ajustable se adapta al 95% de los tipos de cuerpo',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Tu cuerpo es único, y tus necesidades cambiarán con el tiempo. Una silla ergonómica de calidad se adapta a ti, no al revés.
          </p>
          <p>
            <strong>¿Sabías que?</strong> El soporte lumbar ajustable se adapta al 95% de los tipos de cuerpo, y la profundidad de asiento ajustable se adapta al 90% de las longitudes de piernas.
          </p>
          <ul>
            <li>Las características ajustables aseguran que la silla crece con tus necesidades</li>
            <li>La personalización permite una ergonomía óptima para tu cuerpo específico</li>
            <li>La adaptabilidad extiende la vida útil de la silla a medida que tus necesidades cambian</li>
            <li>El valor de una silla que puede ajustarse a diferentes usuarios o entornos</li>
          </ul>
          <p>
            Como señala el Dr. Mark Benden, Director del Centro de Ergonomía de la Universidad de Texas A&M: "Cuando miramos los datos, vemos que los asientos ergonómicos no son un lujo, son una necesidad para cualquiera que se sienta por períodos prolongados. El cuerpo humano simplemente no está diseñado para sentarse estáticamente, y una silla ergonómica que apoya el movimiento y la postura adecuada es esencial para la salud a largo plazo."
          </p>
        </>
      ),
      statistic: {
        value: '95%',
        label: 'de los tipos de cuerpo se adaptan al soporte lumbar ajustable',
        valueColor: 'var(--color-primary)',
        labelColor: 'var(--color-text)',
      },
    },
  ];

  const featuresBlocks: ContentBlockProps[] = [
    {
      title: 'Soporte Lumbar',
      visualElement: {
        type: 'icon',
        icon: <Activity size={64} strokeWidth={1.5} />,
        caption: 'El soporte lumbar reduce la presión en los discos lumbares hasta en un 30%',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            El soporte lumbar es quizás la característica más importante de una silla ergonómica, ya que mantiene la curva natural de tu columna lumbar.
          </p>
          <ul>
            <li>Reduce la presión en los discos lumbares hasta en un 30%</li>
            <li>Mantiene la curva natural en S de la columna, reduciendo la tensión en los músculos de la espalda</li>
            <li>Previene el aplanamiento de la curva lumbar, que puede llevar a hernias discales</li>
            <li>Se adapta a tu espalda específica para un soporte personalizado</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Reposabrazos Ajustables',
      visualElement: {
        type: 'icon',
        icon: <Briefcase size={64} strokeWidth={1.5} />,
        caption: 'Los reposabrazos adecuados disminuyen la tensión del cuello en un 21%',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            Los reposabrazos adecuados hacen mucho más que apoyar tus brazos; reducen la tensión en todo tu cuerpo.
          </p>
          <ul>
            <li>Reducen la tensión en los hombros al soportar el peso de los brazos (aproximadamente el 10% del peso corporal)</li>
            <li>Disminuyen la tensión del cuello en un 21% cuando se ajustan correctamente</li>
            <li>Previenen trastornos de muñeca al permitir un posicionamiento adecuado del teclado y el ratón</li>
            <li>Reducen la presión en la columna al soportar el peso de la parte superior del cuerpo</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Altura y Profundidad del Asiento',
      visualElement: {
        type: 'icon',
        icon: <Lightbulb size={64} strokeWidth={1.5} />,
        caption: 'La altura adecuada del asiento mejora la circulación hasta en un 45%',
        iconColor: '#4a7098',
      },
      content: (
        <>
          <p>
            La altura y profundidad adecuadas del asiento son fundamentales para una buena circulación y distribución del peso.
          </p>
          <ul>
            <li>La altura adecuada del asiento reduce la presión en los muslos y mejora la circulación</li>
            <li>La profundidad correcta del asiento distribuye el peso corporal uniformemente en la superficie del asiento</li>
            <li>La profundidad ajustable del asiento se adapta a diferentes longitudes de piernas</li>
            <li>El ajuste adecuado reduce la flexión de la cadera y la tensión lumbar asociada</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Reclinación del Respaldo',
      visualElement: {
        type: 'icon',
        icon: <Clock size={64} strokeWidth={1.5} />,
        caption: 'Reclinarse a 110-130 grados reduce la presión espinal hasta en un 40%',
        iconColor: '#000000',
      },
      content: (
        <>
          <p>
            La capacidad de reclinarse no es un lujo, sino una necesidad ergonómica que permite el movimiento natural.
          </p>
          <ul>
            <li>Reclinarse a 110-130 grados reduce la presión espinal hasta en un 40% en comparación con sentarse erguido</li>
            <li>La reclinación dinámica fomenta el movimiento y mejora la nutrición de los discos</li>
            <li>Apoya los patrones de movimiento naturales de la columna durante diferentes tareas</li>
            <li>Reduce la carga muscular estática en un 15-20% en comparación con posturas erguidas fijas</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <section
      id={id}
      className={`ergonomic-educational-section ${className}`}
      style={{ backgroundColor }}
    >
      <div className="ergonomic-educational-container">
        {/* SectionHeader removed to avoid duplication with ErgonomicEducationPage */}

        <Introduction
          content={
            <>
              <p>
                En SillaVida, creemos que una silla no es solo un mueble, sino una inversión en tu bienestar. Cuando pasamos más de 6 horas diarias sentados, la calidad de nuestro asiento se convierte en un factor determinante para nuestra salud, productividad y calidad de vida.
              </p>
              <p>
                Una silla ergonómica está diseñada científicamente para adaptarse a tu cuerpo, apoyar tus movimientos naturales y prevenir los problemas asociados con estar sentado durante largos períodos. No es un gasto, sino una inversión en ti mismo que se amortiza día tras día.
              </p>
              <p>
                Descubre por qué invertir en una silla ergonómica es una de las decisiones más inteligentes que puedes tomar para tu bienestar.
              </p>
            </>
          }
          visualElement={{
            type: 'image',
            source: '/images/ergonomic-chair-intro.svg',
            altText: 'Ilustración de una silla ergonómica con beneficios',
            caption: 'Una silla ergonómica se adapta a tu cuerpo, no al revés',
          }}
          textColor="var(--color-text)"
        />

        <ContentSection
          title="Beneficios para la Salud"
          contentBlocks={healthBenefitsBlocks}
          backgroundColor="var(--color-background-alt)"
          textColor="var(--color-text)"
          layout="grid"
        />

        <ContentSection
          title="Productividad y Concentración"
          contentBlocks={productivityBlocks}
          backgroundColor="var(--color-background)"
          textColor="var(--color-text)"
          layout="grid"
        />

        <ContentSection
          title="Valor a Largo Plazo"
          contentBlocks={valueBlocks}
          backgroundColor="var(--color-background-alt)"
          textColor="var(--color-text)"
          layout="grid"
        />

        <ContentSection
          title="Características Ergonómicas Clave"
          contentBlocks={featuresBlocks}
          backgroundColor="var(--color-background)"
          textColor="var(--color-text)"
          layout="grid"
        />

        <CallToAction
          content={
            <>
              <p>
                Una silla ergonómica no es un gasto, es una inversión en tu salud, productividad y bienestar general. Con beneficios que se extienden mucho más allá del lugar de trabajo, una silla ergonómica de calidad es una de las mejores inversiones que puedes hacer para tu cuerpo y mente.
              </p>
              <p>
                En SillaVida, estamos comprometidos a ayudarte a encontrar la silla ergonómica perfecta para tus necesidades específicas. Nuestro equipo de expertos está listo para guiarte a través de las opciones y características para asegurar que obtengas el máximo valor de tu inversión.
              </p>
            </>
          }
          buttonText="Explorar Sillas Ergonómicas"
          buttonLink="/category/tienda"
          buttonVariant="primary"
          backgroundColor="#000000"
          textColor="white"
          buttonColor="#666666"
        />
      </div>
    </section>
  );
};

export default ErgonomicEducationalSection;
