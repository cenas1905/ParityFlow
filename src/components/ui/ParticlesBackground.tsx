'use client';

import React, { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string; // HSL color string, e.g. "99, 102, 241" (indigo)
  particleSize?: number;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  className = '',
  quantity = 60,
  staticity = 50,
  ease = 50,
  color = '99, 102, 241',
  particleSize = 1.8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    initCanvas();
    animate();
    window.addEventListener('resize', initCanvas);

    return () => {
      window.removeEventListener('resize', initCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onMouseMove();
  }, []);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = [];
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.random() * particleSize + 0.5;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.15;
    const dy = (Math.random() - 0.5) * 0.15;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${color}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const drawParticles = () => {
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const drawConnections = () => {
    if (!context.current) return;
    const items = circles.current;
    const maxDistance = 90;

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const dx = (items[i].x + items[i].translateX) - (items[j].x + items[j].translateX);
        const dy = (items[i].y + items[i].translateY) - (items[j].y + items[j].translateY);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.08 * Math.min(items[i].alpha, items[j].alpha);
          context.current.beginPath();
          context.current.moveTo(items[i].x + items[i].translateX, items[i].y + items[i].translateY);
          context.current.lineTo(items[j].x + items[j].translateX, items[j].y + items[j].translateY);
          context.current.strokeStyle = `rgba(${color}, ${alpha})`;
          context.current.lineWidth = 0.8;
          context.current.stroke();
        }
      }
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
  ): number => {
    const outgoing =
      start2 + ((stop2 - start2) * (value - start1)) / (stop1 - start1);
    return outgoing;
  };

  const animate = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
    circles.current.forEach((circle: Circle, i: number) => {
      // Fade in/out alpha
      const edge = [
        circle.x + circle.translateX - circle.size, // left
        canvasSize.current.w - (circle.x + circle.translateX) - circle.size, // right
        circle.y + circle.translateY - circle.size, // top
        canvasSize.current.h - (circle.y + circle.translateY) - circle.size, // bottom
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapOpacity = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapOpacity < 1) {
        circle.alpha = circle.targetAlpha * remapOpacity;
      } else if (circle.alpha < circle.targetAlpha) {
        circle.alpha += 0.02;
      }

      // Movement
      circle.x += circle.dx;
      circle.y += circle.dy;

      // Interaction
      const rx = mouse.current.x - (circle.x + circle.translateX);
      const ry = mouse.current.y - (circle.y + circle.translateY);
      const r = Math.sqrt(rx * rx + ry * ry);
      const limit = 120; // range of mouse repulsion

      if (r < limit) {
        const force = (limit - r) / limit;
        const targetX = circle.translateX - (rx / r) * force * circle.magnetism;
        const targetY = circle.translateY - (ry / r) * force * circle.magnetism;

        circle.translateX += (targetX - circle.translateX) / ease;
        circle.translateY += (targetY - circle.translateY) / ease;
      } else {
        circle.translateX += (0 - circle.translateX) / staticity;
        circle.translateY += (0 - circle.translateY) / staticity;
      }

      // Out of bounds detection
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // Recycle
        circles.current[i] = circleParams();
      } else {
        drawCircle(circle, true);
      }
    });

    drawConnections();
    requestAnimationFrame(animate);
  };

  return (
    <div ref={canvasContainerRef} className={`${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticlesBackground;
