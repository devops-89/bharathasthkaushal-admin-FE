import imageCompression from "browser-image-compression";

export const compressImage = async (file, customOptions = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedBlob = await imageCompression(file, options);
    
    // Return a File object to maintain compatibility with forms expecting Files
    return new File([compressedBlob], file.name, {
      type: compressedBlob.type || file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // Fallback to original file on failure
  }
};
