"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "w-8 h-8",
  size,
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 512.002 512.002"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#2196F3"
        d="M256.002,32.001c-141.152,0-256,100.48-256,224c0,50.624,19.328,99.2,54.816,138.24L3.874,453.569
	c-4.096,4.736-5.024,11.424-2.4,17.088c2.592,5.696,8.288,9.344,14.528,9.344h240c141.152,0,256-100.48,256-224
	S397.154,32.001,256.002,32.001z"
      />
      <circle fill="#FAFAFA" cx="256.002" cy="256.001" r="32" />
      <circle fill="#FAFAFA" cx="128.002" cy="256.001" r="32" />
      <circle fill="#FAFAFA" cx="384.002" cy="256.001" r="32" />
    </svg>
  );
};
