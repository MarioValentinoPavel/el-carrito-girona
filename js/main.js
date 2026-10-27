// El Carrito · «Brasa»: chispas de la parrilla que suben por la portada; el cursor las empuja y un toque aviva las brasas
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function embers() {
    const hero = document.getElementById('hero'), cv = document.getElementById('embers'), g = cv.getContext('2d');
    let W, H, d, vis = true, mx = -1e4, my = -1e4;
    const P = [];
    const size = () => { const r = cv.getBoundingClientRect(); d = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
    size(); new ResizeObserver(size).observe(cv);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);
    const spawn = (x, y, burst) => P.push({ x, y, vx: (Math.random() - .5) * (burst ? 6 : .6), vy: -(burst ? 2 + Math.random() * 6 : .6 + Math.random() * 1.6), life: 1, s: .8 + Math.random() * 2.2, h: 18 + Math.random() * 22, w: Math.random() * 6.28 });
    hero.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mx = my = -1e4; });
    hero.addEventListener('pointerdown', (e) => { if (e.target.closest('a,button')) return; const r = cv.getBoundingClientRect(); for (let i = 0; i < 60; i++) spawn(e.clientX - r.left, e.clientY - r.top, true); });
    const frame = (t) => {
      g.clearRect(0, 0, W, H);
      if (P.length < 220) for (let i = 0; i < 3; i++) spawn(Math.random() * W, H + 10, false);
      g.globalCompositeOperation = 'lighter';
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.w += .05; p.vx += Math.sin(p.w + t * .001) * .03; p.vy -= .004;
        const dx = p.x - mx, dy = p.y - my, dist = Math.hypot(dx, dy);
        if (dist < 140) { p.vx += dx / dist * .35; p.vy += dy / dist * .2; }
        p.x += p.vx; p.y += p.vy; p.vx *= .98; p.life -= .0035 + (p.vy < -3 ? .01 : 0);
        if (p.life <= 0 || p.y < -20) { P.splice(i, 1); continue; }
        const a = Math.max(0, p.life) * (.6 + .4 * Math.sin(t * .02 + p.w));
        g.fillStyle = `hsla(${p.h},100%,${55 + p.life * 20}%,${a})`;
        g.beginPath(); g.arc(p.x, p.y, p.s * (.6 + p.life), 0, 7); g.fill();
      }
      g.globalCompositeOperation = 'source-over';
    };
    if (reduce) return;
    const loop = (t) => { if (vis) frame(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  function motion() {
    if (reduce || typeof gsap === 'undefined') return;
    gsap.fromTo('.hero-bg img', { scale: 1.25 }, { scale: 1.05, duration: 2.6, ease: 'expo.out' });
    gsap.fromTo('.brandword span', { yPercent: 70, opacity: 0, skewX: -12 }, { yPercent: 0, opacity: 1, skewX: 0, duration: 1.5, ease: 'expo.out', stagger: .12, delay: .2 });
    gsap.to('.hero-bg img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-in', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function init() { embers(); motion(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
