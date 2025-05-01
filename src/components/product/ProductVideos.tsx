import React, { useEffect } from 'react';
import './ProductVideos.css';

interface ProductVideosProps {
  product: any;
}

interface MediaItem {
  type: 'external' | 'native' | 'image';
  url: string;
  altText: string;
  host?: string;
  title?: string;
}

const ProductVideos: React.FC<ProductVideosProps> = ({ product }) => {
  // Define the prefix to identify video content
  const videoPrefix = 'video-';

  // Add debugging effect
  useEffect(() => {
    console.log('ProductVideos - Product Data:', product);
    if (product.media?.edges) {
      console.log('ProductVideos - Media Edges:', product.media.edges);
    }
    if (product.images?.edges) {
      console.log('ProductVideos - Images with video prefix:', 
        product.images.edges.filter((image: any) => 
          (image.node.altText || '').startsWith(videoPrefix)
        )
      );
    }
  }, [product]);

  // Get videos from media field (preferred) or fall back to images with video prefix
  const getVideoItems = (): MediaItem[] => {
    const mediaItems: MediaItem[] = [];
    
    // Check if we have media field data
    if (product.media?.edges) {
      // First, try to get videos from the media field
      product.media.edges.forEach((media: any) => {
        const node = media.node;
        console.log('ProductVideos - Processing media node:', node);
        
        // Check for external videos (YouTube, Vimeo)
        if (node.embeddedUrl) {
          console.log('ProductVideos - Found external video:', node.embeddedUrl);
          const alt = node.alt || '';
          mediaItems.push({
            type: 'external',
            url: node.embeddedUrl,
            altText: alt,
            host: node.host
          });
        }
        // Check for native videos
        else if (node.sources && node.sources.length > 0) {
          console.log('ProductVideos - Found native video:', node.sources[0].url);
          const alt = node.alt || '';
          mediaItems.push({
            type: 'native',
            url: node.sources[0].url,
            altText: alt
          });
        }
        // Check for MediaImage type that might have a video in the alt text
        else if (node.image) {
          const altText = node.image.altText || '';
          if (altText.startsWith(videoPrefix)) {
            console.log('ProductVideos - Found image with video prefix in media:', altText);
            mediaItems.push({
              type: 'image',
              url: node.image.url,
              altText: altText
            });
          }
        }
      });
    }
    
    // If no videos found in media, fall back to images with video prefix in alt text
    if (mediaItems.length === 0) {
      console.log('ProductVideos - No videos found in media, checking images');
      // Filter images with video prefix in alt text
      const videoImages = (product.images?.edges || []).filter((image: any) => {
        const altText = image.node.altText || '';
        return altText.startsWith(videoPrefix);
      });
      
      console.log('ProductVideos - Found images with video prefix:', videoImages);
      
      // Add these to our media items
      videoImages.forEach((image: any) => {
        mediaItems.push({
          type: 'image',
          url: image.node.url,
          altText: image.node.altText || ''
        });
      });
    }
    
    // If we still don't have any videos, check if we have any media items that might be videos
    if (mediaItems.length === 0 && product.media?.edges) {
      console.log('ProductVideos - No videos found with prefix, checking all media items');
      
      // Look for any media items that might be videos
      product.media.edges.forEach((media: any) => {
        const node = media.node;
        
        // Check for any media that might be a video
        if (node.__typename === 'Video' || 
            (node.sources && node.sources.length > 0) || 
            (node.mediaContentType === 'VIDEO')) {
          console.log('ProductVideos - Found video by type:', node);
          mediaItems.push({
            type: 'native',
            url: node.sources?.[0]?.url || '',
            altText: node.alt || ''
          });
        }
      });
    }
    
    console.log('ProductVideos - Final media items:', mediaItems);
    return mediaItems;
  };

  // Get all video items
  const videoItems = getVideoItems();

  // Function to parse Title and Video URL from Alt Text
  const parseVideoAltText = (altText: string | null, defaultUrl: string = ''): { title: string; videoUrl: string } => {
    if (!altText) {
      return { title: 'Video', videoUrl: defaultUrl }; // Fallback
    }
    
    // If it's from media field and doesn't have the prefix, use the whole text as title
    if (!altText.startsWith(videoPrefix)) {
      return { title: altText || 'Video', videoUrl: defaultUrl };
    }

    // Debug the alt text parsing
    console.log('Parsing alt text:', altText);

    const content = altText.substring(videoPrefix.length);
    
    // Check for different formats
    // Format 1: video-Title — Description
    // Format 2: video-Title:Description:VideoURL
    if (content.includes('—')) {
      const parts = content.split('—');
      const title = parts[0].trim();
      console.log('Parsed using em dash format:', { title, videoUrl: defaultUrl });
      return { title, videoUrl: defaultUrl };
    } else if (content.includes(':')) {
      // Format should be: video-Title:Description:VideoURL
      const parts = content.split(':');
      console.log('Parsed using colon format:', parts);
      
      if (parts.length >= 3) {
        return {
          title: parts[0].trim(),
          videoUrl: parts[2].trim() || defaultUrl
        };
      } else if (parts.length === 2) {
        return {
          title: parts[0].trim(),
          videoUrl: defaultUrl
        };
      }
    }
    
    // Default fallback
    console.log('Using default parsing for:', content);
    return {
      title: content.trim(),
      videoUrl: defaultUrl
    };
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Match YouTube URL patterns
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to extract Vimeo video ID from URL
  const getVimeoVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Match Vimeo URL patterns
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    
    return match ? match[3] : null;
  };

  // Function to render the appropriate video embed based on URL and type
  const renderVideoEmbed = (item: MediaItem): JSX.Element => {
    console.log('ProductVideos - Rendering video item:', item);
    
    // For external videos from Shopify media field
    if (item.type === 'external') {
      if (item.host === 'YOUTUBE') {
        const youtubeId = getYouTubeVideoId(item.url);
        console.log('ProductVideos - Rendering YouTube video with ID:', youtubeId);
        return (
          <iframe 
            width="560" 
            height="315" 
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={item.title || 'YouTube video'} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        );
      } else if (item.host === 'VIMEO') {
        const vimeoId = getVimeoVideoId(item.url);
        console.log('ProductVideos - Rendering Vimeo video with ID:', vimeoId);
        return (
          <iframe 
            src={`https://player.vimeo.com/video/${vimeoId}`} 
            width="560" 
            height="315" 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
            title={item.title || 'Vimeo video'}
          ></iframe>
        );
      }
    }
    
    // For native videos from Shopify media field
    if (item.type === 'native') {
      console.log('ProductVideos - Rendering native video:', item.url);
      
      // Check if URL is empty, show debug info
      if (!item.url) {
        return (
          <div className="video-placeholder" style={{ padding: '20px', border: '1px solid #ccc', background: '#f9f9f9' }}>
            <p>No video URL available</p>
          </div>
        );
      }
      
      return (
        <video 
          controls 
          width="100%" 
          height="auto"
          title={item.title || 'Video'}
        >
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    // For videos from image alt text
    if (item.type === 'image') {
      const { title, videoUrl } = parseVideoAltText(item.altText, item.url);
      console.log('ProductVideos - Parsed video from image:', { title, videoUrl });
      
      const youtubeId = getYouTubeVideoId(videoUrl);
      const vimeoId = getVimeoVideoId(videoUrl);
      
      if (youtubeId) {
        console.log('ProductVideos - Rendering YouTube video from alt text with ID:', youtubeId);
        return (
          <iframe 
            width="560" 
            height="315" 
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        );
      } else if (vimeoId) {
        console.log('ProductVideos - Rendering Vimeo video from alt text with ID:', vimeoId);
        return (
          <iframe 
            src={`https://player.vimeo.com/video/${vimeoId}`} 
            width="560" 
            height="315" 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
            title={title}
          ></iframe>
        );
      } else if (videoUrl) {
        // Direct video file
        console.log('ProductVideos - Rendering direct video file from alt text:', videoUrl);
        return (
          <video 
            controls 
            width="100%" 
            height="auto"
            title={title}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }
    }
    
    // General debug placeholder
    console.log('ProductVideos - No suitable video format found, showing debug placeholder');
    return (
      <div className="video-placeholder" style={{ padding: '20px', border: '1px solid red', background: '#fff', color: '#333' }}>
        <p>Debug: No suitable video format found for this product</p>
      </div>
    );
  };

  if (videoItems.length === 0) {
    console.log('ProductVideos - No video items found, not rendering component');
    
    // For debugging only - show debug info when no videos are found
    // Always show debug in development (Vite sets import.meta.env.DEV to true in development)
    if (import.meta.env.DEV) {
      // Extract video URLs from alt texts for debugging
      const videoUrlsFromAltText = (product.images?.edges || [])
        .filter((image: any) => (image.node.altText || '').startsWith(videoPrefix))
        .map((image: any) => {
          const parsed = parseVideoAltText(image.node.altText, '');
          return {
            altText: image.node.altText,
            parsedTitle: parsed.title,
            parsedUrl: parsed.videoUrl
          };
        });
      
      return (
        <div className="debug-info" style={{ padding: '20px', border: '1px solid red', margin: '20px 0', background: '#fff', color: '#333' }}>
          <h3>Debug Info: No Videos Found</h3>
          <p>Product Handle: {product.handle}</p>
          <p>Has Media: {product.media?.edges ? 'Yes' : 'No'}</p>
          <p>Media Items: {product.media?.edges?.length || 0}</p>
          <p>Images with video prefix: {
            (product.images?.edges || []).filter((image: any) => 
              (image.node.altText || '').startsWith(videoPrefix)
            ).length
          }</p>
          
          {product.media?.edges && (
            <div>
              <h4>Media Items:</h4>
              <ul>
                {product.media.edges.map((media: any, index: number) => (
                  <li key={index}>
                    <strong>Type:</strong> {media.node.__typename || 'Unknown'}<br />
                    <strong>Content Type:</strong> {media.node.mediaContentType || 'Unknown'}<br />
                    {media.node.embeddedUrl ? 
                      <><strong>External:</strong> {media.node.embeddedUrl} ({media.node.host})<br /></> : null}
                    {media.node.sources ? 
                      <><strong>Native:</strong> {JSON.stringify(media.node.sources)}<br /></> : null}
                    {media.node.image ? 
                      <><strong>Image:</strong> {media.node.image.url}<br /></> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h4>Image Alt Texts:</h4>
            <ul>
              {(product.images?.edges || []).map((image: any, index: number) => (
                <li key={index}>{image.node.altText || 'No alt text'}</li>
              ))}
            </ul>
          </div>
          
          {videoUrlsFromAltText.length > 0 && (
            <div>
              <h4>Parsed Video Information:</h4>
              <ul>
                {videoUrlsFromAltText.map((item: { altText: string; parsedTitle: string; parsedUrl: string }, index: number) => (
                  <li key={index}>
                    <strong>Alt Text:</strong> {item.altText}<br />
                    <strong>Title:</strong> {item.parsedTitle}<br />
                    <strong>URL:</strong> {item.parsedUrl || 'No URL found'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    
    return null; // Don't render the section if no videos are found
  }

  return (
    <section className="product-videos-section">
      <div className="video-grid">
        {videoItems.map((item: MediaItem, index: number) => {
          // Get title based on item type
          let title;
          
          if (item.type === 'external' || item.type === 'native') {
            const parsed = parseVideoAltText(item.altText);
            title = parsed.title;
          } else {
            const parsed = parseVideoAltText(item.altText);
            title = parsed.title;
          }
          
          return (
            <div key={`video-${index}`} className="video-item">
              <div className="video-container">
                {renderVideoEmbed(item)}
              </div>
              <div className="video-content">
                <h3 className="video-title">{title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductVideos;
