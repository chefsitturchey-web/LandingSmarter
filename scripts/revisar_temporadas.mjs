// Revision local del sitio compilado. No publica nada.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const destino = new URL('../capturas-temporadas/', import.meta.url);
await mkdir(destino, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}),
});
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const resultados = [];
const colores = { normal: '#D9006F', navidad: '#123D32', anionuevo: '#18162E', halloween: '#1B1030' };
try {
  for (const temporada of Object.keys(colores)) {
    for (const ancho of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width: ancho, height: ancho === 1440 ? 1000 : 844 } });
      const errores = [];
      const recursos = [];
      page.on('pageerror', error => errores.push(error.message));
      page.on('response', response => {
        // Esta ruta la sirve el Worker de produccion, no Astro preview.
        const infoLocal = new URL(response.url()).pathname === '/descargar/info' && response.status() === 404;
        if (response.status() >= 400 && !infoLocal) errores.push(`${response.status()} ${response.url()}`);
      });
      page.on('request', request => recursos.push(request.url()));
      await page.goto(`${base}/?temporada=${temporada}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Recorre las secciones para que las entradas y las imagenes terminen.
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 650) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(90);
      }
      await page.waitForTimeout(800);
      await page.locator('.pie').screenshot({ path: new URL(`${temporada}-${ancho}-pie.png`, destino).pathname.slice(1) });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1000);
      const datos = await page.evaluate(() => ({
        temporada: document.documentElement.dataset.temporada,
        color: document.querySelector('meta[name="theme-color"]').content,
        ancho: document.documentElement.scrollWidth,
        ventana: innerWidth,
        anio: document.querySelector('[data-anio-saludo]').textContent,
        esperado: String(new Date().getFullYear() + 1),
      }));
      assert.equal(datos.temporada, temporada);
      assert.equal(datos.color, colores[temporada]);
      assert.equal(datos.ancho, datos.ventana, 'Desbordamiento horizontal');
      assert.equal(datos.anio, datos.esperado);
      if (temporada === 'navidad' || temporada === 'anionuevo') {
        const gorro = await page.locator(temporada === 'navidad' ? '.nv-gorro' : '.an-gorro').boundingBox();
        assert(gorro.y >= 0, 'El gorro se corta por arriba');
      }
      assert.deepEqual(errores, []);
      for (const otra of Object.keys(colores).filter(otra => otra !== temporada && otra !== 'normal')) {
        assert(!recursos.some(url => url.includes(`/${otra}/`)), `Se descargo otra temporada: ${otra}`);
      }
      await page.screenshot({ path: new URL(`${temporada}-${ancho}.png`, destino).pathname.slice(1), fullPage: true });
      await page.screenshot({ path: new URL(`${temporada}-${ancho}-portada.png`, destino).pathname.slice(1) });
      // Tambien revisa el ancho minimo y la preferencia de movimiento.
      await page.setViewportSize({ width: 360, height: 800 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.nv-nieve').evaluate(el => getComputedStyle(el).display), 'none');
      assert.equal(await page.locator('.an-confeti').evaluate(el => getComputedStyle(el).display), 'none');
      resultados.push({ temporada, ancho, errores, recursosTemporada: recursos.filter(url => /\/(halloween|navidad|anionuevo)\//.test(url)) });
      await page.close();
      console.log(`Revisado: ${temporada} ${ancho}px`);
    }
  }

  const page = await browser.newPage();
  await page.clock.install();
  for (const [fecha, temporada] of [
    ['2026-09-30', 'normal'], ['2026-10-01', 'halloween'], ['2026-10-31', 'halloween'],
    ['2026-11-01', 'normal'], ['2026-11-30', 'normal'], ['2026-12-01', 'navidad'],
    ['2026-12-29', 'navidad'], ['2026-12-30', 'anionuevo'], ['2026-12-31', 'anionuevo'],
    ['2027-01-01', 'normal'], ['2027-10-01', 'halloween'], ['2028-12-01', 'navidad'],
    ['2028-12-30', 'anionuevo'],
  ]) {
    await page.clock.setFixedTime(new Date(`${fecha}T12:00:00`));
    await page.goto(base);
    assert.equal(await page.locator('html').getAttribute('data-temporada'), temporada, fecha);
    assert.equal(await page.locator('[data-anio-saludo]').textContent(), String(Number(fecha.slice(0, 4)) + 1));
    for (const pedida of Object.keys(colores)) {
      await page.goto(`${base}/?temporada=${pedida}`);
      assert.equal(await page.locator('html').getAttribute('data-temporada'), pedida);
    }
    await page.goto(`${base}/?temporada=desconocida`);
    assert.equal(await page.locator('html').getAttribute('data-temporada'), temporada);
  }
  await writeFile(new URL('revision.json', destino), JSON.stringify(resultados, null, 2));
  console.log('Fechas, overrides, recursos, movimiento reducido y anchos verificados.');
} finally {
  await browser.close();
}
