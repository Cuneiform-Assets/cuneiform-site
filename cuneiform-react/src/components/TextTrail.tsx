import React, { useEffect, useRef, useState } from 'react';

interface TextTrailProps {
  text: string;
  fontFamily?: string;
  fontWeight?: string | number;
  noiseFactor?: number;
  noiseScale?: number;
  rgbPersistFactor?: number;
  alphaPersistFactor?: number;
  animateColor?: boolean;
  startColor?: string;
  textColor?: string;
  backgroundColor?: string;
  colorCycleInterval?: number;
  supersample?: number;
  className?: string;
}

const TextTrail: React.FC<TextTrailProps> = ({
  text = 'Hello World',
  fontFamily = 'Raleway',
  fontWeight = '900',
  noiseFactor = 1.2,
  noiseScale = 0.001,
  rgbPersistFactor = 0.95,
  alphaPersistFactor = 0.92,
  animateColor = true,
  startColor = '#ff6b6b',
  textColor = '#4ecdc4',
  backgroundColor = 'transparent',
  colorCycleInterval = 2000,
  supersample = 2,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [mounted, setMounted] = useState(false);

  // Animation state
  const mousePos = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const colorPhase = useRef(0);
  const trailBuffer = useRef<Uint8ClampedArray | null>(null);

  // Color cycling colors
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];

  const noise = (x: number, y: number, t: number): number => {
    const seed = Math.sin(x * noiseScale + t) * Math.cos(y * noiseScale + t);
    return (Math.sin(seed * 12.9898) * 43758.5453) % 1;
  };

  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getCurrentColor = (): string => {
    if (!animateColor) return textColor;
    
    const index = Math.floor(colorPhase.current / (colorCycleInterval / colors.length)) % colors.length;
    const nextIndex = (index + 1) % colors.length;
    const progress = (colorPhase.current % (colorCycleInterval / colors.length)) / (colorCycleInterval / colors.length);
    
    return interpolateColor(colors[index], colors[nextIndex], progress);
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * ratio * supersample;
    canvas.height = rect.height * ratio * supersample;
    
    ctx.scale(ratio * supersample, ratio * supersample);
    
    // Initialize trail buffer
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    trailBuffer.current = new Uint8ClampedArray(imageData.data.length);

    // Set initial mouse position to center
    mousePos.current = {
      x: canvas.width / 2 / (ratio * supersample),
      y: canvas.height / 2 / (ratio * supersample)
    };
  };

  const drawText = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1) / supersample, canvas.height / (window.devicePixelRatio || 1) / supersample);
    
    // Set font properties
    ctx.font = `${fontWeight} 4rem ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = (canvas.width / (window.devicePixelRatio || 1) / supersample) / 2;
    const centerY = (canvas.height / (window.devicePixelRatio || 1) / supersample) / 2;
    
    // Create noise-based distortion for each character
    const chars = text.split('');
    let xOffset = -ctx.measureText(text).width / 2;
    
    chars.forEach((char, i) => {
      const charWidth = ctx.measureText(char).width;
      const charX = centerX + xOffset + charWidth / 2;
      const charY = centerY;
      
      // Apply noise-based offset
      const noiseX = noise(charX, charY, time.current) * noiseFactor * 10;
      const noiseY = noise(charY, charX, time.current) * noiseFactor * 10;
      
      // Add mouse interaction
      const distToMouse = Math.sqrt((charX - mousePos.current.x) ** 2 + (charY - mousePos.current.y) ** 2);
      const influence = Math.max(0, 1 - distToMouse / 100);
      const attractX = (mousePos.current.x - charX) * influence * 0.1;
      const attractY = (mousePos.current.y - charY) * influence * 0.1;
      
      ctx.fillStyle = getCurrentColor();
      ctx.fillText(char, charX + noiseX + attractX, charY + noiseY + attractY);
      
      xOffset += charWidth;
    });

    // Create trail effect (simplified for React)
    createTrailEffect(ctx);
  };

  const createTrailEffect = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas || !trailBuffer.current) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply persistence to create trail
    for (let i = 0; i < data.length; i += 4) {
      // RGB channels
      trailBuffer.current[i] = trailBuffer.current[i] * rgbPersistFactor + data[i] * (1 - rgbPersistFactor);
      trailBuffer.current[i + 1] = trailBuffer.current[i + 1] * rgbPersistFactor + data[i + 1] * (1 - rgbPersistFactor);
      trailBuffer.current[i + 2] = trailBuffer.current[i + 2] * rgbPersistFactor + data[i + 2] * (1 - rgbPersistFactor);
      
      // Alpha channel
      trailBuffer.current[i + 3] = Math.max(
        trailBuffer.current[i + 3] * alphaPersistFactor,
        data[i + 3]
      );
      
      // Apply trail buffer back to image data
      data[i] = trailBuffer.current[i];
      data[i + 1] = trailBuffer.current[i + 1];
      data[i + 2] = trailBuffer.current[i + 2];
      data[i + 3] = trailBuffer.current[i + 3];
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const animate = () => {
    time.current += 0.016; // ~60fps
    colorPhase.current = (colorPhase.current + 16) % colorCycleInterval;
    
    drawText();
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: (e.clientX - rect.left) * (canvas.width / rect.width) / (window.devicePixelRatio || 1) / supersample,
      y: (e.clientY - rect.top) * (canvas.height / rect.height) / (window.devicePixelRatio || 1) / supersample
    };
  };

  useEffect(() => {
    setMounted(true);
    setupCanvas();
    animate();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [text, fontFamily, fontWeight]);

  if (!mounted) {
    return <div className={`text-6xl font-bold text-white ${className}`}>{text}</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`block mx-auto ${className}`}
      style={{ 
        width: '100%', 
        maxWidth: '800px', 
        height: '100px',
        background: backgroundColor 
      }}
      onMouseMove={handleMouseMove}
    />
  );
};

export default TextTrail;