import { useRef } from 'react';

const GlareHover = ({
  background = 'rgba(255,255,255,0.9)',
  borderRadius = '1rem',
  borderColor = 'rgba(0,0,0,0.05)',
  children,
  glareColor = 'rgba(1,81,150,0.5)',
  glareOpacity = 0.45,
  glareAngle = -45,
  glareSize = 180,
  transitionDuration = 700,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const overlayRef = useRef(null);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.backgroundPosition = '-120% -120%';
    el.offsetHeight; // reflow untuk reset animasi
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '120% 120%';
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (!playOnce) {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = '-120% -120%';
    }
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
      rgba(255,255,255,0) 55%,
      ${rgba} 70%,
      rgba(255,255,255,0) 85%)`,
    backgroundSize: `${glareSize}% ${glareSize}%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-120% -120%',
    pointerEvents: 'none',
    mixBlendMode: 'soft-light',
  };

  return (
    <div
      className={`relative overflow-hidden border shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 ${className}`}
      style={{
        background,
        borderRadius,
        borderColor,
        borderWidth: '1px',
        ...style,
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlareHover;
