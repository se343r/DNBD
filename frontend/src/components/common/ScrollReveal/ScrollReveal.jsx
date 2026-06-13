import React from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import './ScrollReveal.css';

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = '0s',
  duration = '0.8s',
  className = '',
  ...props
}) {
  const [ref, isVisible] = useScrollReveal();

  const style = {
    animationDelay: delay,
    animationDuration: duration,
  };

  return (
    <div
      ref={ref}
      className={`reveal-wrapper reveal-${animation} ${isVisible ? 'revealed' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
