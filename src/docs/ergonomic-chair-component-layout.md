# Ergonomic Chair Educational Section Component Layout

## Overview
This document outlines the component layout and structure for the "Por qué invertir en una silla ergonómica" educational section. The layout is designed to present the educational content in an engaging, accessible way that effectively communicates the value of investing in an ergonomic chair.

## Component Structure

### 1. Educational Section Container

```
+-------------------------------------------------------+
|                                                       |
|  EDUCATIONAL SECTION CONTAINER                        |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  HEADER                                           |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  INTRODUCTION                                     |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  CONTENT SECTIONS                                 |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  CALL TO ACTION                                   |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `className`: String - CSS class for styling
- `id`: String - Unique identifier for the section
- `backgroundColor`: String - Background color (from Vida palette)
- `padding`: Object - Padding values for different screen sizes

**Behavior:**
- Responsive container that adjusts to different screen sizes
- Maintains consistent spacing and alignment of child components
- Applies appropriate background color and styling from the Vida theme

### 2. Header Component

```
+-------------------------------------------------------+
|                                                       |
|  HEADER COMPONENT                                     |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  TITLE                                            |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  SUBTITLE                                         |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `title`: String - Main title text
- `subtitle`: String - Optional subtitle text
- `alignment`: String - Text alignment (left, center, right)
- `titleSize`: String - Size of the title text
- `subtitleSize`: String - Size of the subtitle text
- `titleColor`: String - Color of the title text (from Vida palette)
- `subtitleColor`: String - Color of the subtitle text (from Vida palette)

**Behavior:**
- Displays the main title and optional subtitle
- Applies appropriate typography and styling from the Vida theme
- Adjusts font sizes for different screen sizes

### 3. Introduction Component

```
+-------------------------------------------------------+
|                                                       |
|  INTRODUCTION COMPONENT                               |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  TEXT CONTENT                                     |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  VISUAL ELEMENT (Optional)                        |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `content`: String - Introduction text content
- `visualElement`: Object - Optional visual element (image, icon, etc.)
- `visualElementPosition`: String - Position of the visual element (left, right, top, bottom)
- `textColor`: String - Color of the text content (from Vida palette)

**Behavior:**
- Displays the introduction text content
- Optionally displays a visual element
- Applies appropriate typography and styling from the Vida theme
- Adjusts layout for different screen sizes

### 4. Content Section Component

```
+-------------------------------------------------------+
|                                                       |
|  CONTENT SECTION COMPONENT                            |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  SECTION HEADER                                   |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  CONTENT BLOCKS                                   |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  CONTENT BLOCK                        |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  CONTENT BLOCK                        |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  CONTENT BLOCK                        |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `title`: String - Section title
- `contentBlocks`: Array - Array of content block objects
- `backgroundColor`: String - Background color (from Vida palette)
- `textColor`: String - Color of the text content (from Vida palette)
- `layout`: String - Layout of the content blocks (grid, list, etc.)

**Behavior:**
- Displays the section title
- Renders the content blocks in the specified layout
- Applies appropriate typography and styling from the Vida theme
- Adjusts layout for different screen sizes

### 5. Content Block Component

```
+-------------------------------------------------------+
|                                                       |
|  CONTENT BLOCK COMPONENT                              |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  TITLE                                            |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  VISUAL ELEMENT                                   |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  TEXT CONTENT                                     |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  STATISTIC (Optional)                             |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `title`: String - Block title
- `visualElement`: Object - Visual element (image, icon, etc.)
- `content`: String - Text content
- `statistic`: Object - Optional statistic object (value, label, etc.)
- `backgroundColor`: String - Background color (from Vida palette)
- `textColor`: String - Color of the text content (from Vida palette)
- `visualElementPosition`: String - Position of the visual element (left, right, top, bottom)

**Behavior:**
- Displays the block title, visual element, and text content
- Optionally displays a statistic
- Applies appropriate typography and styling from the Vida theme
- Adjusts layout for different screen sizes

### 6. Statistic Component

```
+-------------------------------------------------------+
|                                                       |
|  STATISTIC COMPONENT                                  |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  VALUE                                            |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  LABEL                                            |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `value`: String - Statistic value
- `label`: String - Statistic label
- `valueColor`: String - Color of the value text (from Vida palette)
- `labelColor`: String - Color of the label text (from Vida palette)
- `valueSize`: String - Size of the value text
- `labelSize`: String - Size of the label text
- `alignment`: String - Text alignment (left, center, right)

**Behavior:**
- Displays the statistic value and label
- Applies appropriate typography and styling from the Vida theme
- Adjusts font sizes for different screen sizes

### 7. Visual Element Component

```
+-------------------------------------------------------+
|                                                       |
|  VISUAL ELEMENT COMPONENT                             |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  VISUAL CONTENT                                   |
|  |  (Image, Icon, Chart, Diagram, etc.)              |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  CAPTION (Optional)                               |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `type`: String - Type of visual element (image, icon, chart, diagram, etc.)
- `source`: String - Source of the visual element (URL, SVG code, etc.)
- `caption`: String - Optional caption text
- `altText`: String - Alternative text for accessibility
- `width`: String - Width of the visual element
- `height`: String - Height of the visual element
- `captionColor`: String - Color of the caption text (from Vida palette)

**Behavior:**
- Displays the visual element (image, icon, chart, diagram, etc.)
- Optionally displays a caption
- Provides alternative text for accessibility
- Adjusts size for different screen sizes

### 8. Call to Action Component

```
+-------------------------------------------------------+
|                                                       |
|  CALL TO ACTION COMPONENT                             |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  TEXT CONTENT                                     |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  BUTTON                                           |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
```

**Properties:**
- `content`: String - Text content
- `buttonText`: String - Button text
- `buttonLink`: String - Button link URL
- `buttonVariant`: String - Button variant (primary, secondary, etc.)
- `backgroundColor`: String - Background color (from Vida palette)
- `textColor`: String - Color of the text content (from Vida palette)
- `buttonColor`: String - Color of the button (from Vida palette)

**Behavior:**
- Displays the text content and button
- Applies appropriate typography and styling from the Vida theme
- Adjusts layout for different screen sizes

## Layout Variations

### Desktop Layout (3-Column)

```
+-------------------------------------------------------+
|                                                       |
|  HEADER                                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  INTRODUCTION                                         |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  CONTENT SECTIONS                                     |
|                                                       |
|  +----------------+  +----------------+  +------------+
|  |                |  |                |  |            |
|  |  SECTION 1     |  |  SECTION 2     |  |  SECTION 3 |
|  |                |  |                |  |            |
|  |  +----------+  |  |  +----------+  |  |  +--------+
|  |  |          |  |  |  |          |  |  |  |        |
|  |  |  BLOCK 1 |  |  |  |  BLOCK 1 |  |  |  | BLOCK 1|
|  |  |          |  |  |  |          |  |  |  |        |
|  |  +----------+  |  |  +----------+  |  |  +--------+
|  |                |  |                |  |            |
|  |  +----------+  |  |  +----------+  |  |  +--------+
|  |  |          |  |  |  |          |  |  |  |        |
|  |  |  BLOCK 2 |  |  |  |  BLOCK 2 |  |  |  | BLOCK 2|
|  |  |          |  |  |  |          |  |  |  |        |
|  |  +----------+  |  |  +----------+  |  |  +--------+
|  |                |  |                |  |            |
|  |  +----------+  |  |  +----------+  |  |  +--------+
|  |  |          |  |  |  |          |  |  |  |        |
|  |  |  BLOCK 3 |  |  |  |  BLOCK 3 |  |  |  | BLOCK 3|
|  |  |          |  |  |  |          |  |  |  |        |
|  |  +----------+  |  |  +----------+  |  |  +--------+
|  |                |  |                |  |            |
|  +----------------+  +----------------+  +------------+
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  CALL TO ACTION                                       |
|                                                       |
+-------------------------------------------------------+
```

### Tablet Layout (2-Column)

```
+-------------------------------------------------------+
|                                                       |
|  HEADER                                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  INTRODUCTION                                         |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  CONTENT SECTIONS                                     |
|                                                       |
|  +----------------------------+  +-------------------+
|  |                            |  |                   |
|  |  SECTION 1                 |  |  SECTION 2        |
|  |                            |  |                   |
|  |  +----------------------+  |  |  +---------------+
|  |  |                      |  |  |  |               |
|  |  |  BLOCK 1             |  |  |  |  BLOCK 1      |
|  |  |                      |  |  |  |               |
|  |  +----------------------+  |  |  +---------------+
|  |                            |  |                   |
|  |  +----------------------+  |  |  +---------------+
|  |  |                      |  |  |  |               |
|  |  |  BLOCK 2             |  |  |  |  BLOCK 2      |
|  |  |                      |  |  |  |               |
|  |  +----------------------+  |  |  +---------------+
|  |                            |  |                   |
|  |  +----------------------+  |  |  +---------------+
|  |  |                      |  |  |  |               |
|  |  |  BLOCK 3             |  |  |  |  BLOCK 3      |
|  |  |                      |  |  |  |               |
|  |  +----------------------+  |  |  +---------------+
|  |                            |  |                   |
|  +----------------------------+  +-------------------+
|                                                       |
|  +-----------------------------------------------+    |
|  |                                               |    |
|  |  SECTION 3                                    |    |
|  |                                               |    |
|  |  +-------------------+  +-------------------+ |    |
|  |  |                   |  |                   | |    |
|  |  |  BLOCK 1          |  |  BLOCK 2          | |    |
|  |  |                   |  |                   | |    |
|  |  +-------------------+  +-------------------+ |    |
|  |                                               |    |
|  |  +---------------------------------------+    |    |
|  |  |                                       |    |    |
|  |  |  BLOCK 3                              |    |    |
|  |  |                                       |    |    |
|  |  +---------------------------------------+    |    |
|  |                                               |    |
|  +-----------------------------------------------+    |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  CALL TO ACTION                                       |
|                                                       |
+-------------------------------------------------------+
```

### Mobile Layout (1-Column)

```
+-------------------------------------------------------+
|                                                       |
|  HEADER                                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  INTRODUCTION                                         |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  CONTENT SECTIONS                                     |
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  SECTION 1                                        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 1                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 2                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 3                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  SECTION 2                                        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 1                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 2                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 3                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
|  +---------------------------------------------------+
|  |                                                   |
|  |  SECTION 3                                        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 1                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 2                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  |  +---------------------------------------+        |
|  |  |                                       |        |
|  |  |  BLOCK 3                              |        |
|  |  |                                       |        |
|  |  +---------------------------------------+        |
|  |                                                   |
|  +---------------------------------------------------+
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  CALL TO ACTION                                       |
|                                                       |
+-------------------------------------------------------+
```

## Component Implementation

### React Component Structure

```jsx
// Educational Section Container
const ErgonomicEducationalSection = ({ children, backgroundColor, padding, id, className }) => {
  return (
    <section id={id} className={`ergonomic-educational-section ${className}`} style={{ backgroundColor, padding }}>
      {children}
    </section>
  );
};

// Header Component
const SectionHeader = ({ title, subtitle, alignment, titleSize, subtitleSize, titleColor, subtitleColor }) => {
  return (
    <header className={`section-header text-${alignment}`}>
      <h2 className={`section-title ${titleSize}`} style={{ color: titleColor }}>{title}</h2>
      {subtitle && <h3 className={`section-subtitle ${subtitleSize}`} style={{ color: subtitleColor }}>{subtitle}</h3>}
    </header>
  );
};

// Introduction Component
const Introduction = ({ content, visualElement, visualElementPosition, textColor }) => {
  return (
    <div className={`introduction ${visualElement ? `with-visual-${visualElementPosition}` : ''}`}>
      <div className="introduction-text" style={{ color: textColor }}>
        {content}
      </div>
      {visualElement && <VisualElement {...visualElement} />}
    </div>
  );
};

// Content Section Component
const ContentSection = ({ title, contentBlocks, backgroundColor, textColor, layout }) => {
  return (
    <div className={`content-section ${layout}`} style={{ backgroundColor }}>
      <h3 className="content-section-title" style={{ color: textColor }}>{title}</h3>
      <div className={`content-blocks ${layout}`}>
        {contentBlocks.map((block, index) => (
          <ContentBlock key={index} {...block} />
        ))}
      </div>
    </div>
  );
};

// Content Block Component
const ContentBlock = ({ title, visualElement, content, statistic, backgroundColor, textColor, visualElementPosition }) => {
  return (
    <div className={`content-block ${visualElementPosition}`} style={{ backgroundColor }}>
      <h4 className="content-block-title" style={{ color: textColor }}>{title}</h4>
      {visualElement && <VisualElement {...visualElement} />}
      <div className="content-block-text" style={{ color: textColor }}>
        {content}
      </div>
      {statistic && <Statistic {...statistic} />}
    </div>
  );
};

// Statistic Component
const Statistic = ({ value, label, valueColor, labelColor, valueSize, labelSize, alignment }) => {
  return (
    <div className={`statistic text-${alignment}`}>
      <div className={`statistic-value ${valueSize}`} style={{ color: valueColor }}>{value}</div>
      <div className={`statistic-label ${labelSize}`} style={{ color: labelColor }}>{label}</div>
    </div>
  );
};

// Visual Element Component
const VisualElement = ({ type, source, caption, altText, width, height, captionColor }) => {
  return (
    <div className={`visual-element ${type}`}>
      {type === 'image' && <img src={source} alt={altText} width={width} height={height} />}
      {type === 'icon' && <div className="icon" dangerouslySetInnerHTML={{ __html: source }} />}
      {type === 'chart' && <div className="chart" dangerouslySetInnerHTML={{ __html: source }} />}
      {type === 'diagram' && <div className="diagram" dangerouslySetInnerHTML={{ __html: source }} />}
      {caption && <div className="visual-caption" style={{ color: captionColor }}>{caption}</div>}
    </div>
  );
};

// Call to Action Component
const CallToAction = ({ content, buttonText, buttonLink, buttonVariant, backgroundColor, textColor, buttonColor }) => {
  return (
    <div className="call-to-action" style={{ backgroundColor }}>
      <div className="call-to-action-text" style={{ color: textColor }}>
        {content}
      </div>
      <a href={buttonLink} className={`button ${buttonVariant}`} style={{ backgroundColor: buttonColor }}>
        {buttonText}
      </a>
    </div>
  );
};
```

## CSS Structure

```css
/* Base Styles */
.ergonomic-educational-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--font-primary);
}

/* Header Styles */
.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-weight: 400;
  margin-bottom: 1rem;
}

/* Introduction Styles */
.introduction {
  margin-bottom: 3rem;
}

.introduction.with-visual-left {
  display: flex;
  flex-direction: row;
}

.introduction.with-visual-right {
  display: flex;
  flex-direction: row-reverse;
}

.introduction-text {
  flex: 1;
  padding: 1rem;
}

/* Content Section Styles */
.content-section {
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 8px;
}

.content-section-title {
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.content-blocks.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.content-blocks.list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Content Block Styles */
.content-block {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.content-block-title {
  margin-bottom: 1rem;
  font-weight: 600;
}

.content-block-text {
  margin-bottom: 1rem;
}

/* Statistic Styles */
.statistic {
  margin: 1.5rem 0;
}

.statistic-value {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.statistic-label {
  font-weight: 400;
}

/* Visual Element Styles */
.visual-element {
  margin: 1.5rem 0;
}

.visual-element img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.visual-caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-style: italic;
}

/* Call to Action Styles */
.call-to-action {
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 8px;
  margin-top: 3rem;
}

.call-to-action-text {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .content-blocks.grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .introduction.with-visual-left,
  .introduction.with-visual-right {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .content-blocks.grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1.25rem;
  }
  
  .call-to-action {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
  }
  
  .content-section {
    padding: 1.5rem;
  }
  
  .content-block {
    padding: 1.25rem;
  }
  
  .call-to-action {
    padding: 1.5rem 1rem;
  }
  
  .call-to-action-text {
    font-size: 1.125rem;
  }
}
```

## Placement Strategy

### Homepage Placement

```
+-------------------------------------------------------+
|                                                       |
|  NAVBAR                                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  HERO SECTION                                         |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  FEATURED PRODUCTS                                    |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  ERGONOMIC EDUCATIONAL SECTION (CONDENSED)            |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  PROMOTIONAL BANNERS                                  |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  TESTIMONIALS                                         |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  FOOTER                                               |
|                                                       |
+-------------------------------------------------------+
```

### Dedicated Page Placement

```
+-------------------------------------------------------+
|                                                       |
|  NAVBAR                                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  PAGE HEADER                                          |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  ERGONOMIC EDUCATIONAL SECTION (FULL)                 |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  RELATED PRODUCTS                                     |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  FOOTER                                               |
|                                                       |
+-------------------------------------------------------+
```

### Product Page Placement

```
+-------------------------------------------------------+
|                                                       |
|  NAVBAR                                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  PRODUCT DETAILS                                      |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  PRODUCT FEATURES                                     |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  ERGONOMIC EDUCATIONAL SECTION (RELEVANT BENEFITS)    |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  RELATED PRODUCTS                                     |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  FOOTER                                               |
|                                                       |
+-------------------------------------------------------+
```

### Category Page
