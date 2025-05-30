import React from 'react';

/**
 * BannerTest component for testing banner designs
 * Feature flagged component that can replace the hero slider temporarily
 */
const BannerTest: React.FC = () => {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full">
        <img
          src="/images/Banner test/ChatGPT Image May 30, 2025, 05_24_57 PM.png"
          alt="SillaVida Banner Test"
          className="w-full h-auto object-cover"
          loading="eager"
          onError={(e) => {
            console.error('Banner image failed to load');
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Optional overlay content can be added here */}
        <div className="absolute inset-0 bg-black/0 pointer-events-none" />
      </div>
    </section>
  );
};

export default BannerTest;