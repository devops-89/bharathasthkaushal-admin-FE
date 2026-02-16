import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Video } from "lucide-react";

// Global cache for video blobs to prevent re-fetching
const videoCache = new Map();

const SecureVideo = ({ src, className, controls = true, poster }) => {
    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const videoRef = useRef(null);

    const BACKEND_URL = "http://4.206.208.169:3000";

    // Check if the URL is for our backend
    const isBackendVideo = (url) => {
        return url && (url.includes(BACKEND_URL) || url.startsWith("/"));
    };

    useEffect(() => {
        let observer;
        let isMounted = true;

        // If it's not a backend video, we don't need to do any special fetching
        if (!isBackendVideo(src)) {
            setLoading(false);
            setVideoSrc(src);
            return;
        }

        const fetchVideo = async () => {
            if (!src) {
                setLoading(false);
                setError(true);
                return;
            }

            // Check cache first
            if (videoCache.has(src)) {
                if (isMounted) {
                    setVideoSrc(videoCache.get(src));
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
                videoCache.set(src, objectUrl);

                if (isMounted) {
                    setVideoSrc(objectUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Video load failed for:", src, err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    fetchVideo();
                    if (observer) observer.disconnect();
                }
            });
        };

        if (src) {
            if (videoCache.has(src)) {
                // If cached, load immediately without observer
                fetchVideo();
            } else {
                // Lazy load
                observer = new IntersectionObserver(handleIntersection, {
                    rootMargin: "200px", // Start loading when 200px away (videos are bigger)
                    threshold: 0.1,
                });

                if (videoRef.current) {
                    observer.observe(videoRef.current);
                }
            }
        }

        return () => {
            isMounted = false;
            if (observer) observer.disconnect();
        };
    }, [src]);

    // Render standard video for external URLs
    if (!isBackendVideo(src)) {
        return (
            <video
                src={src}
                className={className}
                controls={controls}
                poster={poster}
            />
        );
    }

    if (error) {
        return (
            <div
                className={`bg-gray-100 flex items-center justify-center ${className}`}
            >
                <div className="text-center">
                    <Video className="w-8 h-8 text-gray-300 mx-auto" />
                    <span className="text-xs text-gray-400 block mt-1">Failed to load video</span>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div ref={videoRef} className={`bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
                <Video className="w-8 h-8 text-gray-300 animate-bounce" />
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            src={videoSrc}
            className={className}
            controls={controls}
            poster={poster}
        />
    );
};

export default SecureVideo;
