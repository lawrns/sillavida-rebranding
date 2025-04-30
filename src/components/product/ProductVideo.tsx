import React from 'react';
import './ProductVideo.css';

interface ProductVideoProps {
  videoId: string;
  title?: string;
}

const ProductVideo: React.FC<ProductVideoProps> = ({ 
  videoId = 'onBSRJi-Fso',
  title = 'Descubre SillaVida' 
}) => {
  return (
    <section className="product-video-section">
      <h2 className="section-title">{title}</h2>
      <div className="video-container">
        <iframe 
          width="560" 
          height="315" 
          src={`https://www.youtube.com/embed/${videoId}?si=VEQ9oNI5AxuVZefo`}
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default ProductVideo;
