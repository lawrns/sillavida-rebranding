import React from 'react';

/**
 * StyleGuide component
 *
 * A visual representation of the current SillaVida monochromatic design system.
 * This component displays color swatches, typography examples, and design elements
 * that align with the current monochromatic white/black/grey color scheme.
 */
const StyleGuide: React.FC = () => {
  // Current monochromatic color palette
  const monochromaticColors = {
    black: {
      pure: '#000000',
      dark: '#333333',
      medium: '#666666',
      light: '#999999',
    },
    gray: {
      border: '#E5E5E5',
      background: '#F5F5F5',
      subtle: '#FAFAFA',
    },
    white: {
      pure: '#FFFFFF',
      off: '#FDFDFD',
    }
  };

  return (
    <div className="style-guide">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Monochromatic Color System</h2>
        <p className="text-gray-600 mb-8">
          SillaVida uses a clean monochromatic color palette focused on black, white, and grey tones
          for a modern, minimalist aesthetic.
        </p>

        <div className="space-y-8">
          {/* Black Scale */}
          <div>
            <h3 className="text-xl font-medium mb-4">Black Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ColorSwatch color={monochromaticColors.black.pure} name="Pure Black" />
              <ColorSwatch color={monochromaticColors.black.dark} name="Dark Gray" />
              <ColorSwatch color={monochromaticColors.black.medium} name="Medium Gray" />
              <ColorSwatch color={monochromaticColors.black.light} name="Light Gray" />
            </div>
          </div>

          {/* Gray Scale */}
          <div>
            <h3 className="text-xl font-medium mb-4">Gray Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorSwatch color={monochromaticColors.gray.border} name="Border Gray" textColor="#333" />
              <ColorSwatch color={monochromaticColors.gray.background} name="Background Gray" textColor="#333" />
              <ColorSwatch color={monochromaticColors.gray.subtle} name="Subtle Gray" textColor="#333" />
            </div>
          </div>

          {/* White Scale */}
          <div>
            <h3 className="text-xl font-medium mb-4">White Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorSwatch color={monochromaticColors.white.pure} name="Pure White" textColor="#333" />
              <ColorSwatch color={monochromaticColors.white.off} name="Off White" textColor="#333" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        <p className="text-gray-600 mb-8">
          SillaVida uses Montserrat for headings and Open Sans for body text, providing excellent readability
          and a modern, professional appearance.
        </p>

        <div className="space-y-8">
          {/* Headings */}
          <div>
            <h3 className="text-xl font-medium mb-4">Headings</h3>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <h1 style={{
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  color: '#000000'
                }}>
                  Heading 1 (H1)
                </h1>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Montserrat, Size: 2.25rem (36px), Weight: 700
                </div>
              </div>

              <div>
                <h2 style={{
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                  color: '#000000'
                }}>
                  Heading 2 (H2)
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Montserrat, Size: 1.875rem (30px), Weight: 600
                </div>
              </div>

              <div>
                <h3 style={{
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                  color: '#000000'
                }}>
                  Heading 3 (H3)
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Montserrat, Size: 1.5rem (24px), Weight: 600
                </div>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  lineHeight: '1.2',
                  color: '#000000'
                }}>
                  Heading 4 (H4)
                </h4>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Montserrat, Size: 1.25rem (20px), Weight: 500
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
                  fontFamily: 'Open Sans, Arial, Helvetica, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  color: '#000000'
                }}>
                  Primary Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                  Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Open Sans, Size: 1rem (16px), Weight: 400
                </div>
              </div>

              <div>
                <p style={{
                  fontFamily: 'Open Sans, Arial, Helvetica, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  color: '#666666'
                }}>
                  Secondary Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                  Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Open Sans, Size: 0.875rem (14px), Weight: 400
                </div>
              </div>

              <div>
                <p style={{
                  fontFamily: 'Playfair Display, Georgia, Times New Roman, serif',
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                  color: '#333333'
                }}>
                  "This is a special quote text using Playfair Display. It's designed to stand out and create visual interest."
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Font: Playfair Display, Size: 1.125rem (18px), Weight: 400, Style: Italic
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Spacing</h2>
        <p className="text-gray-600 mb-8">
          Consistent spacing creates visual rhythm and hierarchy throughout the interface.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Spacing Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
              {[
                { key: 'xs', value: '0.25rem', px: '4px' },
                { key: 'sm', value: '0.5rem', px: '8px' },
                { key: 'md', value: '1rem', px: '16px' },
                { key: 'lg', value: '1.5rem', px: '24px' },
                { key: 'xl', value: '2rem', px: '32px' },
                { key: '2xl', value: '3rem', px: '48px' },
                { key: '3xl', value: '4rem', px: '64px' },
                { key: '4xl', value: '6rem', px: '96px' },
              ].map(({ key, value, px }) => (
                <div key={key} className="flex items-center">
                  <div
                    className="bg-gray-300 mr-4"
                    style={{
                      width: value,
                      height: '24px',
                    }}
                  />
                  <div>
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-gray-500">{value} ({px})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Shadows</h2>
        <p className="text-gray-600 mb-8">
          Subtle shadows add depth and hierarchy to interface elements.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Shadow Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { size: 'sm', shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
                { size: 'md', shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
                { size: 'lg', shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
                { size: 'xl', shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
                { size: '2xl', shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
              ].map(({ size, shadow }) => (
                <div
                  key={size}
                  className="bg-white p-6 rounded-lg"
                  style={{
                    boxShadow: shadow,
                  }}
                >
                  <div className="font-medium">Shadow {size}</div>
                  <div className="text-sm text-gray-500 mt-1 break-all">
                    {shadow}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Border Radius</h2>
        <p className="text-gray-600 mb-8">
          Consistent border radius creates a cohesive visual language.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Border Radius Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'none', value: '0px' },
                { key: 'sm', value: '0.125rem' },
                { key: 'md', value: '0.375rem' },
                { key: 'lg', value: '0.5rem' },
                { key: 'xl', value: '0.75rem' },
                { key: '2xl', value: '1rem' },
                { key: 'full', value: '9999px' },
              ].map(({ key, value }) => (
                <div key={key} className="flex flex-col items-center">
                  <div
                    className="bg-black w-24 h-24 mb-2"
                    style={{
                      borderRadius: value,
                    }}
                  />
                  <div className="font-medium">{key}</div>
                  <div className="text-sm text-gray-500">{value}</div>
                </div>
              ))}
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
