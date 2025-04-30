import React from 'react';
import { tokens } from '../../styles/tokens';

/**
 * StyleGuide component
 * 
 * A visual representation of the design system tokens.
 * This component displays color swatches, typography examples,
 * spacing, shadows, and other design tokens.
 */
const StyleGuide: React.FC = () => {
  return (
    <div className="style-guide">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
        
        <div className="space-y-8">
          {/* Primary Colors */}
          <div>
            <h3 className="text-xl font-medium mb-4">Primary Colors (Teal)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={tokens.colors.palette.teal.base} name="Teal Base" />
              <ColorSwatch color={tokens.colors.palette.teal.light} name="Teal Light" />
              <ColorSwatch color={tokens.colors.palette.teal.dark} name="Teal Dark" />
              <ColorSwatch color={tokens.colors.palette.teal.extraLight} name="Teal Extra Light" />
            </div>
          </div>
          
          {/* Secondary Colors */}
          <div>
            <h3 className="text-xl font-medium mb-4">Secondary Colors (Sage)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={tokens.colors.palette.sage.base} name="Sage Base" />
              <ColorSwatch color={tokens.colors.palette.sage.light} name="Sage Light" />
              <ColorSwatch color={tokens.colors.palette.sage.dark} name="Sage Dark" />
              <ColorSwatch color={tokens.colors.palette.sage.extraLight} name="Sage Extra Light" />
            </div>
          </div>
          
          {/* Accent Colors */}
          <div>
            <h3 className="text-xl font-medium mb-4">Accent Colors (Beige)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={tokens.colors.palette.beige.base} name="Beige Base" />
              <ColorSwatch color={tokens.colors.palette.beige.light} name="Beige Light" />
              <ColorSwatch color={tokens.colors.palette.beige.dark} name="Beige Dark" />
              <ColorSwatch color={tokens.colors.palette.beige.extraLight} name="Beige Extra Light" />
            </div>
          </div>
          
          {/* Highlight Colors */}
          <div>
            <h3 className="text-xl font-medium mb-4">Highlight Colors (Terracotta)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={tokens.colors.palette.terracotta.base} name="Terracotta Base" />
              <ColorSwatch color={tokens.colors.palette.terracotta.light} name="Terracotta Light" />
              <ColorSwatch color={tokens.colors.palette.terracotta.dark} name="Terracotta Dark" />
              <ColorSwatch color={tokens.colors.palette.terracotta.extraLight} name="Terracotta Extra Light" />
            </div>
          </div>
          
          {/* Neutral Colors */}
          <div>
            <h3 className="text-xl font-medium mb-4">Neutral Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={tokens.colors.palette.neutral.black} name="Black" />
              <ColorSwatch color={tokens.colors.palette.neutral.grayDark} name="Gray Dark" />
              <ColorSwatch color={tokens.colors.palette.neutral.grayMedium} name="Gray Medium" />
              <ColorSwatch color={tokens.colors.palette.neutral.grayLight} name="Gray Light" />
              <ColorSwatch color={tokens.colors.palette.neutral.grayExtraLight} name="Gray Extra Light" />
              <ColorSwatch color={tokens.colors.palette.neutral.offWhite} name="Off White" />
              <ColorSwatch color={tokens.colors.palette.neutral.white} name="White" textColor="#333" />
            </div>
          </div>
          
          {/* Status Colors */}
          <div>
            <h3 className="text-xl font-medium mb-4">Status Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={tokens.colors.status.success} name="Success" />
              <ColorSwatch color={tokens.colors.status.warning} name="Warning" textColor="#333" />
              <ColorSwatch color={tokens.colors.status.error} name="Error" />
              <ColorSwatch color={tokens.colors.status.info} name="Info" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        
        <div className="space-y-8">
          {/* Headings */}
          <div>
            <h3 className="text-xl font-medium mb-4">Headings</h3>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <h1 style={{ 
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.heading.h1.fontSize,
                  fontWeight: tokens.typography.heading.h1.fontWeight,
                  lineHeight: tokens.typography.heading.h1.lineHeight,
                  letterSpacing: tokens.typography.heading.h1.letterSpacing,
                }}>
                  Heading 1 (H1)
                </h1>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.heading}, 
                  Size: {tokens.typography.heading.h1.fontSize}, 
                  Weight: {tokens.typography.heading.h1.fontWeight}
                </div>
              </div>
              
              <div>
                <h2 style={{ 
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.heading.h2.fontSize,
                  fontWeight: tokens.typography.heading.h2.fontWeight,
                  lineHeight: tokens.typography.heading.h2.lineHeight,
                  letterSpacing: tokens.typography.heading.h2.letterSpacing,
                }}>
                  Heading 2 (H2)
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.heading}, 
                  Size: {tokens.typography.heading.h2.fontSize}, 
                  Weight: {tokens.typography.heading.h2.fontWeight}
                </div>
              </div>
              
              <div>
                <h3 style={{ 
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.heading.h3.fontSize,
                  fontWeight: tokens.typography.heading.h3.fontWeight,
                  lineHeight: tokens.typography.heading.h3.lineHeight,
                  letterSpacing: tokens.typography.heading.h3.letterSpacing,
                }}>
                  Heading 3 (H3)
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.heading}, 
                  Size: {tokens.typography.heading.h3.fontSize}, 
                  Weight: {tokens.typography.heading.h3.fontWeight}
                </div>
              </div>
              
              <div>
                <h4 style={{ 
                  fontFamily: tokens.typography.fontFamily.heading,
                  fontSize: tokens.typography.heading.h4.fontSize,
                  fontWeight: tokens.typography.heading.h4.fontWeight,
                  lineHeight: tokens.typography.heading.h4.lineHeight,
                  letterSpacing: tokens.typography.heading.h4.letterSpacing,
                }}>
                  Heading 4 (H4)
                </h4>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.heading}, 
                  Size: {tokens.typography.heading.h4.fontSize}, 
                  Weight: {tokens.typography.heading.h4.fontWeight}
                </div>
              </div>
            </div>
          </div>
          
          {/* Body Text */}
          <div>
            <h3 className="text-xl font-medium mb-4">Body Text</h3>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <p style={{ 
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.body.primary.fontSize,
                  fontWeight: tokens.typography.body.primary.fontWeight,
                  lineHeight: tokens.typography.body.primary.lineHeight,
                  letterSpacing: tokens.typography.body.primary.letterSpacing,
                }}>
                  Primary Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
                  Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.body}, 
                  Size: {tokens.typography.body.primary.fontSize}, 
                  Weight: {tokens.typography.body.primary.fontWeight}
                </div>
              </div>
              
              <div>
                <p style={{ 
                  fontFamily: tokens.typography.fontFamily.body,
                  fontSize: tokens.typography.body.secondary.fontSize,
                  fontWeight: tokens.typography.body.secondary.fontWeight,
                  lineHeight: tokens.typography.body.secondary.lineHeight,
                  letterSpacing: tokens.typography.body.secondary.letterSpacing,
                }}>
                  Secondary Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
                  Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.body}, 
                  Size: {tokens.typography.body.secondary.fontSize}, 
                  Weight: {tokens.typography.body.secondary.fontWeight}
                </div>
              </div>
              
              <div>
                <p style={{ 
                  fontFamily: tokens.typography.fontFamily.special,
                  fontSize: tokens.typography.special.quote.fontSize,
                  fontWeight: tokens.typography.special.quote.fontWeight,
                  lineHeight: tokens.typography.special.quote.lineHeight,
                  letterSpacing: tokens.typography.special.quote.letterSpacing,
                  fontStyle: 'italic',
                }}>
                  "This is a special quote text using the special font family. It's designed to stand out and create visual interest."
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Font: {tokens.typography.fontFamily.special}, 
                  Size: {tokens.typography.special.quote.fontSize}, 
                  Weight: {tokens.typography.special.quote.fontWeight}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Spacing</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Spacing Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
              {Object.entries(tokens.spacing)
                .filter(([key]) => !isNaN(Number(key)) || ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <div 
                      className="bg-teal-extraLight mr-4" 
                      style={{ 
                        width: typeof value === 'string' ? value : '1rem',
                        height: '24px',
                      }}
                    />
                    <div>
                      <div className="font-medium">{key}</div>
                      <div className="text-sm text-gray-500">{String(value)}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Shadows</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Shadow Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
                <div 
                  key={size} 
                  className="bg-white p-6 rounded-lg" 
                  style={{ 
                    boxShadow: tokens.shadows[size as keyof typeof tokens.shadows],
                  }}
                >
                  <div className="font-medium">Shadow {size}</div>
                  <div className="text-sm text-gray-500 mt-1 break-all">
                    {tokens.shadows[size as keyof typeof tokens.shadows]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Border Radius</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Border Radius Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(tokens.borders.radius)
                .filter(([key]) => key !== 'shorthand')
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center">
                    <div 
                      className="bg-teal w-24 h-24 mb-2" 
                      style={{ 
                        borderRadius: typeof value === 'string' ? value : undefined,
                      }}
                    />
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-gray-500">{String(value)}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper component for color swatches
interface ColorSwatchProps {
  color: string;
  name: string;
  textColor?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name, textColor = '#fff' }) => {
  return (
    <div className="flex flex-col">
      <div 
        className="h-24 rounded-t-lg flex items-end p-2"
        style={{ 
          backgroundColor: color,
          color: textColor,
        }}
      >
        <span className="font-medium">{name}</span>
      </div>
      <div className="bg-white p-2 rounded-b-lg border border-t-0 border-gray-200">
        <code className="text-sm">{color}</code>
      </div>
    </div>
  );
};

export default StyleGuide;
