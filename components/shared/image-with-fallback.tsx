import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function ImageFallback({
  src,
  fallbackSrc,
  ...props
}: { src: string; fallbackSrc: string } & ImageProps) {
  const [imageError, setImageError] = useState(false);
  return (
    <Image
      {...props}
      src={imageError ? fallbackSrc : src}
      alt="image"
      onError={() => setImageError(true)}
    />
  );
}
