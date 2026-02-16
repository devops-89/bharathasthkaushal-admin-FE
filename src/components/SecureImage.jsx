import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Package } from "lucide-react";
const imageCache = new Map();
const SecureImage = ({ src, alt, className, fallbackIcon }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const BACKEND_URL = "http://4.206.208.169:3000";
  const isBackendImage = (url) => {
    return url && (url.includes(BACKEND_URL) || url.startsWith("/"));
  };

  useEffect(() => {
    let observer;
    let isMounted = true;
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
      if (imageCache.has(src)) {
        if (isMounted) {
          setImageSrc(imageCache.get(src));
          setLoading(false);
        }
        return;
      }

      try {
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
       
        fetchImage();
      } else {
       
        observer = new IntersectionObserver(handleIntersection, {
          rootMargin: "50px", 
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
  if (!isBackendImage(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          e.target.onerror = null;
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
