"use client";

import React from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollAnimation({ children, delay = 0, className = "" }: ScrollAnimationProps) {
  return (
    <div
      className={`scroll-animation ${className}`.trim()}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default ScrollAnimation;
