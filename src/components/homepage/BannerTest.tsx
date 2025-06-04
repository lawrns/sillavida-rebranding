import React from 'react';

/**
 * BannerTest component for testing banner designs
 * Feature flagged component that can replace the hero slider temporarily
 */
const BannerTest: React.FC = () => {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full h-[600px]">
        <img
          src="/images/Banner test/Gemini_Generated_Image_q1drcoq1drcoq1dr.png"
          alt="SillaVida Banner Test"
          className="w-full h-full object-cover object-top"
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