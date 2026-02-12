import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Package } from "lucide-react";

// Global cache for image blobs to prevent re-fetching
const imageCache = new Map();

const SecureImage = ({ src, alt, className, fallbackIcon }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const BACKEND_URL = "http://4.206.208.169:3000";

  // Check if the URL is for our backend
  const isBackendImage = (url) => {
    return url && (url.includes(BACKEND_URL) || url.startsWith("/"));
  };

  useEffect(() => {
    let observer;
    let isMounted = true;

    // If it's not a backend image, we don't need to do any special fetching
    if (!isBackendImage(src)) {
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      if (!src) {
        setLoading(false);
        setError(true);
        return;
      }

      // Check cache first
      if (imageCache.has(src)) {
        if (isMounted) {
          setImageSrc(imageCache.get(src));
          setLoading(false);
        }
        return;
      }

      try {
        // Use proxy path if applicable
        const url = src.replace(BACKEND_URL, "");

        const response = await axios.get(url, {
          responseType: "blob",
          headers: {
            "x-company-id": "2917DA28-C412-5525-E814-A3E1E80638CB",
          },
        });

        const objectUrl = URL.createObjectURL(response.data);
        imageCache.set(src, objectUrl);

        if (isMounted) {
          setImageSrc(objectUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error("Image load failed for:", src, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchImage();
          if (observer) observer.disconnect();
        }
      });
    };

    if (src) {
      if (imageCache.has(src)) {
        // If cached, load immediately without observer
        fetchImage();
      } else {
        // Lazy load
        observer = new IntersectionObserver(handleIntersection, {
          rootMargin: "50px", // Start loading when 50px away
          threshold: 0.1,
        });

        if (imgRef.current) {
          observer.observe(imgRef.current);
        }
      }
    }

    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
    };
  }, [src]);

  // Render standard img for external URLs
  if (!isBackendImage(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          e.target.onerror = null;
          // Optional: set a fallback here if needed, but for now let's just keep standard behavior
        }}
      />
    );
  }

  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          {fallbackIcon || (
            <Package className="w-8 h-8 text-gray-300 mx-auto" />
          )}
          <span className="text-xs text-gray-400 block mt-1">Failed</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div ref={imgRef} className={`bg-gray-100 animate-pulse ${className}`} />
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

export default SecureImage;
