/**
 * Particle Effects: Footstep dust, lake ripples, falling leaves, night fireflies, disco lights
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createFootstep(x, y) {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() * 6 - 3),
        y: y + (Math.random() * 4 - 2),
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 12 - 4,
        size: 2.5 + Math.random() * 2,
        color: 'rgba(210, 180, 140, 0.6)',
        alpha: 0.6,
        life: 0.35,
        maxLife: 0.35,
        type: 'dust'
      });
    }
  }

  createStarBurst(x, y) {
    const colors = ['#f1c40f', '#e67e22', '#3498db', '#2ecc71', '#9b59b6'];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const speed = 40 + Math.random() * 60;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0.8,
        maxLife: 0.8,
        type: 'star'
      });
    }
  }

  createAmbientNature(camera, timeMode) {
    if (Math.random() < 0.25) {
      // Falling Leaf
      this.particles.push({
        x: camera.x + Math.random() * camera.width,
        y: camera.y - 10,
        vx: 15 + Math.random() * 20,
        vy: 20 + Math.random() * 25,
        size: 3.5,
        color: Math.random() > 0.5 ? '#e74c3c' : '#27ae60',
        alpha: 0.8,
        life: 4,
        maxLife: 4,
        type: 'leaf'
      });
    }

    if (timeMode === 'night' && Math.random() < 0.35) {
      // Glowing Firefly
      this.particles.push({
        x: camera.x + Math.random() * camera.width,
        y: camera.y + Math.random() * camera.height,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        size: 2.5 + Math.random() * 2,
        color: '#f4d03f',
        alpha: 0.9,
        life: 3,
        maxLife: 3,
        type: 'firefly'
      });
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.type === 'leaf') {
        p.vx = Math.sin(p.life * 4) * 20;
      }
    }
  }

  draw(ctx, camera) {
    ctx.save();
    for (const p of this.particles) {
      const sx = p.x - camera.x;
      const sy = p.y - camera.y;

      if (sx < -20 || sx > camera.width + 20 || sy < -20 || sy > camera.height + 20) continue;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'firefly') {
        ctx.shadowColor = '#f39c12';
        ctx.shadowBlur = 6;
      }

      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
}
