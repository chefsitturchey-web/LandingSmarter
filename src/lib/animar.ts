/**
 * Lo que se mueve en la pagina: entradas al bajar, cifras que cuentan, el
 * arte de la portada que sigue al mouse y el menu que sabe donde se esta.
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

  marcarSeccion();

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

  paralaje();
}

/** Marca en el menu la seccion que se esta leyendo. */
function marcarSeccion() {
  const enlaces = new Map<string, HTMLAnchorElement>();
  for (const a of document.querySelectorAll<HTMLAnchorElement>('.nav-enlaces a')) {
    const id = a.hash.slice(1);
    if (id) enlaces.set(id, a);
  }
  if (!enlaces.size) return;

  const vigia = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        // Una seccion sin enlace (la portada, el formulario) apaga la marca.
        for (const [id, a] of enlaces) {
          if (id === e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        }
      }
    },
    // Cuenta la seccion que cruza una franja a media pantalla.
    { rootMargin: '-45% 0px -50% 0px' },
  );

  document.querySelectorAll('main > section, footer').forEach((seccion) => vigia.observe(seccion));
}

/**
 * El arte de la portada sigue al mouse: cada capa se corre un poco, mas
 * cuanto mas cerca esta. No salta al puntero: lo persigue y frena al llegar,
 * que es lo que lo hace parecer con peso.
 *
 * Solo con mouse; en el celular no hay puntero que seguir.
 */
function paralaje() {
  const arte = document.querySelector<HTMLElement>('[data-paralaje]');
  const zona = arte?.closest<HTMLElement>('section');
  if (!arte || !zona || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const capas = [...arte.querySelectorAll<HTMLElement>('[data-fondo]')].map((el) => ({
    el,
    fuerza: Number(el.dataset.fondo),
  }));

  let metaX = 0;
  let metaY = 0;
  let x = 0;
  let y = 0;
  let cuadro = 0;

  const paso = () => {
    x += (metaX - x) * 0.09;
    y += (metaY - y) * 0.09;
    for (const { el, fuerza } of capas) {
      el.style.transform = `translate3d(${(x * fuerza).toFixed(2)}px, ${(y * fuerza).toFixed(2)}px, 0)`;
    }
    const quieto = Math.abs(metaX - x) < 0.1 && Math.abs(metaY - y) < 0.1;
    cuadro = quieto ? 0 : requestAnimationFrame(paso);
  };

  const mover = (dx: number, dy: number) => {
    metaX = dx;
    metaY = dy;
    if (!cuadro) cuadro = requestAnimationFrame(paso);
  };

  zona.addEventListener('pointermove', (e) => {
    const caja = zona.getBoundingClientRect();
    mover(e.clientX - (caja.left + caja.width / 2), e.clientY - (caja.top + caja.height / 2));
  });

  zona.addEventListener('pointerleave', () => mover(0, 0));
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
