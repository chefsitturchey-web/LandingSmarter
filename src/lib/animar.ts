/**
 * Lo que se mueve en la pagina: entradas al bajar y cifras que cuentan.
 *
 * Sin librerias: IntersectionObserver ya avisa cuando algo llega a la
 * pantalla, y el resto es CSS (ver `data-aparece` en global.css).
 */
export function animar() {
  const html = document.documentElement;
  const nav = document.querySelector('.nav');

  // La barra de arriba toma sombra al despegarse del borde.
  const alBajar = () => nav?.classList.toggle('despegada', window.scrollY > 8);
  alBajar();
  window.addEventListener('scroll', alBajar, { passive: true });

  if (!html.classList.contains('anim')) return;

  const vigia = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('visto');
        if (e.target instanceof HTMLElement && e.target.dataset.contar) contar(e.target);
        vigia.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  document.querySelectorAll<HTMLElement>('[data-aparece], [data-contar]').forEach((el) => {
    // Lo que ya se ve al abrir entra de una vez, aunque asome apenas por el
    // borde de abajo: esperar a que se baje lo dejaria escondido a la vista.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visto');
      if (el.dataset.contar) contar(el);
      return;
    }
    vigia.observe(el);
  });
}

/** Sube de 0 a la cifra final: "500+" cuenta hasta 500 y deja el "+". */
function contar(el: HTMLElement) {
  const final = el.dataset.contar ?? '';
  const numero = parseInt(final, 10);
  if (Number.isNaN(numero)) return;
  const resto = final.slice(String(numero).length);
  const dura = 1400;
  const inicio = performance.now();

  const paso = (ahora: number) => {
    const t = Math.min(1, (ahora - inicio) / dura);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = `${Math.round(numero * suave)}${resto}`;
    if (t < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}
