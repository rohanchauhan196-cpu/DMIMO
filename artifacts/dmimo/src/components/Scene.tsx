import { useEffect, useRef } from "react";

interface Point3D { x: number; y: number; z: number; }

function project(
  p: Point3D, cx: number, cy: number, fov: number, angle: number, tilt: number
): [number, number] {
  const cosA = Math.cos(angle), sinA = Math.sin(angle);
  const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
  const rx = p.x * cosA - p.z * sinA;
  const rz = p.x * sinA + p.z * cosA;
  const ry2 = p.y * cosT - rz * sinT;
  const rz2 = p.y * sinT + rz * cosT;
  const scale = fov / (fov + rz2 + 7);
  const size = Math.min(cx, cy);
  return [cx + rx * scale * size * 0.55, cy + ry2 * scale * size * 0.55];
}

function makeCuboid(x: number, y: number, z: number, w: number, h: number, d: number): [Point3D, Point3D][] {
  const v: Point3D[] = [
    {x:x-w,y:y-h,z:z-d},{x:x+w,y:y-h,z:z-d},{x:x+w,y:y+h,z:z-d},{x:x-w,y:y+h,z:z-d},
    {x:x-w,y:y-h,z:z+d},{x:x+w,y:y-h,z:z+d},{x:x+w,y:y+h,z:z+d},{x:x-w,y:y+h,z:z+d},
  ];
  return [
    [v[0],v[1]],[v[1],v[2]],[v[2],v[3]],[v[3],v[0]],
    [v[4],v[5]],[v[5],v[6]],[v[6],v[7]],[v[7],v[4]],
    [v[0],v[4]],[v[1],v[5]],[v[2],v[6]],[v[3],v[7]],
  ];
}

interface Particle { x:number; y:number; z:number; vx:number; vy:number; vz:number; size:number; opacity:number; }

export function ArchitectureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const structures = [
      makeCuboid(0, 0.4, 0, 1.0, 2.2, 1.0),
      makeCuboid(0, -0.1, 0, 1.6, 0.7, 1.6),
      makeCuboid(0.55, -0.4, 0.55, 0.42, 1.3, 0.42),
      makeCuboid(-0.7, -0.2, -0.45, 0.35, 1.6, 0.35),
    ];

    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
      vz: (Math.random() - 0.5) * 0.004,
      size: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resize();
    // Retry after a paint cycle in case layout hasn't settled
    const t = setTimeout(resize, 50);
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) { animId = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      angle += 0.0025;

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (Math.abs(p.x) > 6) p.vx *= -1;
        if (Math.abs(p.y) > 6) p.vy *= -1;
        if (Math.abs(p.z) > 6) p.vz *= -1;
        const [px, py] = project(p, cx, cy, 5, angle, 0.15);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.opacity * 0.5})`;
        ctx.fill();
      }

      // Structural lines
      const colors = [
        "rgba(212,175,55,0.35)",
        "rgba(160,160,160,0.2)",
        "rgba(212,175,55,0.28)",
        "rgba(255,255,255,0.12)",
      ];
      const widths = [1.4, 0.8, 1.1, 0.7];

      structures.forEach((edges, si) => {
        ctx.strokeStyle = colors[si];
        ctx.lineWidth = widths[si];
        edges.forEach(([a, b]) => {
          const [ax, ay] = project(a, cx, cy, 5, angle, 0.15);
          const [bx, by] = project(b, cx, cy, 5, angle, 0.15);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        });
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
