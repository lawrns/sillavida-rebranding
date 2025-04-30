# Product to Life-Aspect Mapping

This document provides a detailed mapping of existing product categories to the new life-aspect categories. This mapping will guide the implementation of the new navigation structure.

## Life-Aspect Categories Overview

1. **Vida Profesional** (Professional Life)
   - Focus: Status, professionalism, executive presence
   - Primary benefit: "Eleva tu espacio profesional"
   - Color: Deep blue or teal (#1E5959)
   - Icon: Briefcase

2. **Vida Activa** (Active Life)
   - Focus: Energy, movement, dynamic activities
   - Primary benefit: "Potencia tu rendimiento"
   - Color: Vibrant orange or red (#C87D55)
   - Icon: Lightning bolt or movement symbol

3. **Vida Saludable** (Healthy Life)
   - Focus: Wellness, posture, physical health
   - Primary benefit: "Invierte en tu bienestar"
   - Color: Healing green (#7D9D8C)
   - Icon: Heart or leaf

4. **Vida Productiva** (Productive Life)
   - Focus: Efficiency, focus, work output
   - Primary benefit: "Maximiza tu eficiencia"
   - Color: Focused purple or blue (#4A6FA5)
   - Icon: Checkmark or efficiency symbol

5. **Vida Social** (Social Life)
   - Focus: Collaboration, meetings, shared spaces
   - Primary benefit: "Crea espacios de conexión"
   - Color: Warm yellow or gold (#E8DED1)
   - Icon: People or connection symbol

6. **Complementos para tu Vida** (Complements for your Life)
   - Focus: Enhancement, personalization, accessories
   - Primary benefit: "Personaliza tu experiencia"
   - Color: Versatile gray or silver (#6B7280)
   - Icon: Puzzle piece or plus symbol

## Detailed Product Category Mapping

### 1. Sillas Ejecutivas (Executive Chairs)

**Primary Life-Aspect Category: Vida Profesional**

| Product Example | Features | Life-Aspect Justification |
|-----------------|----------|---------------------------|
| ErgoPro Elite | Premium materials, professional appearance | Projects status and executive presence |
| Director's Chair | High back, leather upholstery | Emphasizes professional authority |
| Conference Executive | Elegant design, comfort for long meetings | Supports professional image in collaborative settings |

**Secondary Life-Aspect Category: Vida Productiva**

- Justification: Executive chairs often include features that enhance productivity during long work sessions

### 2. Sillas Ergonómicas (Ergonomic Chairs)

**Primary Life-Aspect Category: Vida Saludable**

| Product Example | Features | Life-Aspect Justification |
|-----------------|----------|---------------------------|
| Silla Oficina X | Advanced lumbar support, adjustable features | Focuses on physical well-being and posture |
| Ergo Health Pro | Medical-grade ergonomics, pressure distribution | Specifically designed for health benefits |
| Posture Perfect | Specialized support for spine alignment | Directly addresses health concerns |

**Secondary Life-Aspect Category: Vida Productiva**

- Justification: Ergonomic features reduce fatigue and discomfort, indirectly enhancing productivity

### 3. Sillas Gamer (Gaming Chairs)

**Primary Life-Aspect Category: Vida Activa**

| Product Example | Features | Life-Aspect Justification |
|-----------------|----------|---------------------------|
| X-Gamer Pro | Dynamic support, recline features | Supports active engagement and movement |
| Gamer Elite RGB | Energetic design, adaptability | Enhances the dynamic gaming experience |
| Racing Style Gamer | Sporty design, movement support | Reflects active lifestyle aesthetics |

**Secondary Life-Aspect Category: Vida Productiva**

- Justification: Gaming chairs often include features that support long sessions of focused activity

### 4. Sillas Secretariales (Secretarial Chairs)

**Primary Life-Aspect Category: Vida Productiva**

| Product Example | Features | Life-Aspect Justification |
|-----------------|----------|---------------------------|
| Ergo Mesh Plus | Practical design, task-oriented features | Optimized for daily work efficiency |
| Task Master | Simplified adjustments, functional design | Focuses on supporting productive work |
| Office Essential | Basic ergonomics, practical functionality | Designed for everyday productivity |

**Secondary Life-Aspect Category: Vida Saludable**

- Justification: Basic ergonomic features support health during daily work tasks

### 5. Sillas de Visita (Visitor Chairs)

**Primary Life-Aspect Category: Vida Social**

| Product Example | Features | Life-Aspect Justification |
|-----------------|----------|---------------------------|
| Guest Comfort | Welcoming design, stackable | Designed for social spaces and visitors |
| Conference Visitor | Clean aesthetic, space-efficient | Supports collaborative environments |
| Reception Chair | Professional appearance, comfort for waiting | Creates positive impression in social contexts |

**Secondary Life-Aspect Category: Vida Profesional**

- Justification: Visitor chairs contribute to the professional appearance of an office or meeting space

### 6. Accesorios (Accessories)

**Primary Life-Aspect Category: Complementos para tu Vida**

| Product Example | Features | Life-Aspect Justification |
|-----------------|----------|---------------------------|
| Lumbar Support Cushion | Targeted support, universal fit | Enhances existing seating with health benefits |
| Footrest | Ergonomic positioning, comfort | Complements chair with additional support |
| Chair Mat | Floor protection, improved mobility | Enhances the chair's functionality |

**Secondary Life-Aspect Categories: Various**

- Justification: Accessories can enhance different life aspects depending on their specific function

## Cross-Category Products

Some products may fit well in multiple life-aspect categories. Here are examples of how to handle these cases:

### Ergonomic Executive Chairs

- **Primary Category**: Vida Profesional
- **Strong Secondary**: Vida Saludable
- **Approach**: Feature in both categories, with messaging adjusted to emphasize different benefits

### Gaming Chairs with Health Features

- **Primary Category**: Vida Activa
- **Strong Secondary**: Vida Saludable
- **Approach**: Feature in both categories, highlighting different aspects in each context

## URL Structure Implementation

### Current URL Structure

```
/category/sillas-ejecutivas
/category/sillas-ergonomicas
/category/sillas-gamer
/category/sillas-secretariales
/category/sillas-de-visita
/category/accesorios
```

### New URL Structure

```
/vida/profesional
/vida/activa
/vida/saludable
/vida/productiva
/vida/social
/vida/complementos
```

### Redirect Mapping

| Current URL | New URL | HTTP Status |
|-------------|---------|-------------|
| /category/sillas-ejecutivas | /vida/profesional | 301 |
| /category/sillas-ergonomicas | /vida/saludable | 301 |
| /category/sillas-gamer | /vida/activa | 301 |
| /category/sillas-secretariales | /vida/productiva | 301 |
| /category/sillas-de-visita | /vida/social | 301 |
| /category/accesorios | /vida/complementos | 301 |

## Product Display Strategy

When displaying products within life-aspect categories:

1. **Primary Category Products**: Display prominently at the top
2. **Secondary Category Products**: Display in a "You might also like" or "Also in this category" section
3. **Cross-Category Products**: Display in all relevant categories, with messaging tailored to each life aspect

## Next Steps

1. Update product data to include primary and secondary life-aspect categories
2. Create visual designs for each life-aspect category landing page
3. Implement the new URL structure and redirects
4. Update the navigation component to reflect the new structure
