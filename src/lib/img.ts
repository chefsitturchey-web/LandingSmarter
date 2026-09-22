import type { ImageMetadata } from 'astro';

/** Las imagenes de `src/assets/img`, por nombre sin extension.
 *
 * Asi un componente pide `img('mascota-ok')` y Astro las sigue optimizando al
 * compilar. Un nombre que no existe revienta la compilacion, no la web. */
const todas = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.png', {
  eager: true,
});

export function img(nombre: string): ImageMetadata {
  const encontrada = todas[`../assets/img/${nombre}.png`];
  if (!encontrada) throw new Error(`No existe la imagen ${nombre}.png`);
  return encontrada.default;
}
