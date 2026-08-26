import React, { useEffect, useRef } from 'react';
import { WorldTheme } from '../../types/gift';

interface ParticleCanvasProps {
  theme: WorldTheme;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  rotation?: number;
  rotSpeed?: number;
  sinOffset?: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = theme === 'galaxy' ? 90 : theme === 'rainy' ? 120 : 50;
    const particles: Particle[] = [];

    const getThemeColors = () => {
      switch (theme) {
        case 'galaxy':
          return ['#A78BFA', '#818CF8', '#C084FC', '#F472B6', '#FFFFFF'];
        case 'rosegarden':
          return ['#FF758F', '#FF4D6D', '#FFB3C1', '#FFE5EC', '#FFB703'];
        case 'rainy':
          return ['#38BDF8', '#60A5FA', '#93C5FD', '#BAE6FD'];
        case 'mountain':
          return ['#FDE047', '#FBBF24', '#F59E0B', '#FED7AA'];
        case 'christmas':
          return ['#FFFFFF', '#E0F2FE', '#F87171', '#34D399', '#FDE047'];
        case 'festive':
        default:
          return ['#F59E0B', '#E11D48', '#FFD700', '#F43F5E', '#FB923C'];
      }
    };

    const colors = getThemeColors();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: theme === 'rainy' ? -0.5 : (Math.random() - 0.5) * (theme === 'rosegarden' ? 1 : 0.6),
        vy: theme === 'rainy' ? Math.random() * 8 + 6 : Math.random() * (theme === 'rosegarden' ? 1.5 : 0.8) + 0.3,
        size: theme === 'rainy' ? Math.random() * 2 + 1 : Math.random() * 4 + 1.5,
        opacity: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        sinOffset: Math.random() * Math.PI * 2,
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render thematic gradient backdrops
      if (theme === 'galaxy') {
        const radGrd = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.8);
        radGrd.addColorStop(0, 'rgba(49, 27, 88, 0.35)');
        radGrd.addColorStop(0.5, 'rgba(19, 13, 46, 0.5)');
        radGrd.addColorStop(1, 'rgba(8, 6, 18, 0.8)');
        ctx.fillStyle = radGrd;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'rosegarden') {
        const radGrd = ctx.createRadialGradient(width * 0.5, height * 0.3, 50, width * 0.5, height * 0.5, width * 0.7);
        radGrd.addColorStop(0, 'rgba(80, 10, 35, 0.35)');
        radGrd.addColorStop(1, 'rgba(10, 6, 15, 0.8)');
        ctx.fillStyle = radGrd;
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'festive') {
        const radGrd = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.7);
        radGrd.addColorStop(0, 'rgba(95, 35, 10, 0.35)');
        radGrd.addColorStop(1, 'rgba(15, 8, 12, 0.8)');
        ctx.fillStyle = radGrd;
        ctx.fillRect(0, 0, width, height);
      }

      // Render individual particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (theme === 'rainy') {
          // Rainy streak
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.8;
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
          ctx.stroke();

          p.y += p.vy;
          p.x += p.vx;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (theme === 'rosegarden') {
          // Drifting Rose Petals
          ctx.save();
          ctx.translate(p.x, p.y);
          p.rotation = (p.rotation || 0) + (p.rotSpeed || 0.02);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * 0.8;

          // Petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.y += p.vy;
          p.x += Math.sin((tick + (p.sinOffset || 0) * 10) * 0.02) * 0.8;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else {
          // Sparkle or Star or Snowflake
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * (0.6 + 0.4 * Math.sin(tick * 0.05 + (p.sinOffset || 0)));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Soft glow
          if (p.size > 2.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fill();
          }
          ctx.restore();

          p.y += p.vy * 0.4;
          p.x += Math.sin(tick * 0.01 + (p.sinOffset || 0)) * 0.3;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
