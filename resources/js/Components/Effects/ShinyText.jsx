const ShinyText = ({
  text,
  disabled = false,
  speed = 3,  // sedikit lebih cepat dari 5s agar efek terasa bergerak
  className = ''
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`
        relative inline-block font-extrabold text-transparent bg-clip-text
        ${disabled ? '' : 'animate-shine'} ${className}
      `}
      style={{
        backgroundImage:
          'linear-gradient(110deg, #015196 0%, #0A6BEA 20%, #FFD700 40%, #ffffff 50%, #015196 70%, #0A6BEA 100%)',
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
        filter: 'drop-shadow(0 0 10px rgba(10,107,234,0.2))',
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
