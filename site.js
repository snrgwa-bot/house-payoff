(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Count a number up from 0 once it scrolls into view.
  const countUp = el => {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = to.toLocaleString('en-US'); return; }
    const start = performance.now(), dur = 1600;
    const tick = now => {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))).toLocaleString('en-US');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('.count').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal, .chart-card').forEach(el => io.observe(el));

  // Rotate real screenshots inside the hero phone.
  const shots = [...document.querySelectorAll('#rotator img')];
  if (shots.length > 1 && !reduce) {
    let i = 0;
    setInterval(() => {
      shots[i].classList.remove('on');
      i = (i + 1) % shots.length;
      shots[i].classList.add('on');
    }, 3200);
  }

  // Payoff chart: yearly balances ($k) for the example loan.
  const base = [262, 249, 234, 220, 204, 188, 171, 153, 135, 116, 96, 75, 53, 30, 7, 0];
  const plan = [262, 246, 228, 210, 191, 171, 151, 129, 106, 83, 58, 33, 6, 0];
  const x = yr => 40 + yr * (640 / 15);
  const y = k => 270 - (k / 262) * 240;
  const line = pts => pts.map((k, yr) => `${yr ? 'L' : 'M'}${x(yr).toFixed(1)},${y(k).toFixed(1)}`).join(' ');
  const set = (id, d) => { const el = document.getElementById(id); if (el) el.setAttribute('d', d); };
  set('basePath', line(base));
  set('planPath', line(plan));
  set('planArea', `${line(plan)} L${x(plan.length - 1)},270 L40,270 Z`);
  const marker = document.getElementById('marker');
  if (marker) marker.setAttribute('transform', `translate(${x(plan.length - 1)},270)`);

  // Gallery: every screenshot, duplicated for a seamless marquee.
  const gallery = document.getElementById('gallery');
  if (gallery) {
    const names = ['home', 'plan', 'frequency', 'schedule', 'progress', 'costs', 'afford', 'paywall'];
    const html = names.map(n => `<img src="assets/shots/${n}.jpg" alt="" loading="lazy">`).join('');
    gallery.innerHTML = html + html;
  }
})();
