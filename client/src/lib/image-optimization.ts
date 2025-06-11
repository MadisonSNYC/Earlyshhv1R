
// Image optimization utilities
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  blur?: boolean;
}

export function optimizeImageUrl(
  src: string, 
  options: ImageOptimizationOptions = {}
): string {
  const { width, height, quality = 80, format = 'webp', blur = false } = options;
  
  // For external URLs, use a service like Cloudinary or ImageKit
  if (src.startsWith('http')) {
    // Example with Cloudinary (replace with your actual service)
    const cloudinaryBase = 'https://res.cloudinary.com/earlyshh/image/fetch/';
    const params = [];
    
    if (width) params.push(`w_${width}`);
    if (height) params.push(`h_${height}`);
    if (quality) params.push(`q_${quality}`);
    if (format) params.push(`f_${format}`);
    if (blur) params.push('e_blur:300');
    
    return `${cloudinaryBase}${params.join(',')}/${encodeURIComponent(src)}`;
  }
  
  return src;
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

// Lazy loading intersection observer
export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    }
  );
}

// Progressive image loading component
export function useProgressiveImage(src: string, placeholder?: string) {
  const [currentSrc, setCurrentSrc] = React.useState(placeholder || '');
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);
  
  return { currentSrc, isLoading };
}
