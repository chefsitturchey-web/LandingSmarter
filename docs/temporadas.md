# Temporadas de la landing

El script inline de `src/layouts/Base.astro` resuelve la temporada antes de pintar, usando la fecha local del visitante. Se repite todos los años:

- Halloween: 1 al 31 de octubre.
- Navidad: 1 al 29 de diciembre.
- Año Nuevo: 30 y 31 de diciembre. El saludo muestra el año siguiente.
- Normal: las demás fechas, incluido el 1 de enero.

Para revisar una temporada, agregar `?temporada=normal`, `?temporada=halloween`, `?temporada=navidad` o `?temporada=anionuevo`. Un valor desconocido conserva la elección por fecha.

Los estilos nuevos viven en `src/styles/navidad.css` y `src/styles/anionuevo.css`. `temporadas.css` reúne los adornos comunes y el ambiente de marca de la vista normal. Los componentes están agrupados por temporada. Los adornos no reciben toques, se ocultan a lectores de pantalla y respetan la preferencia de movimiento reducido.

## Ilustraciones

`scripts/preparar_temporadas.py` descarga los PNG de Fluent Emoji desde el repositorio oficial de Microsoft y los convierte a WebP de 256 × 256 con Pillow:

```powershell
python scripts/preparar_temporadas.py
npm.cmd run build
```

Los avisos MIT están en `public/navidad/LICENCIA.md` y `public/anionuevo/LICENCIA.md`. En esta versión los WebP todavía no están descargados. Mientras falte un archivo, `Adorno.astro` muestra un SVG local. Estos dibujos de respaldo no son de Microsoft.

La disponibilidad de cada WebP se comprueba al compilar. Después de descargar hay que volver a compilar. Las imágenes tienen carga diferida y sus contenedores se ocultan fuera de temporada, como en Halloween.

## Revisión local

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1
# En otra terminal, con Playwright disponible:
$env:PLAYWRIGHT_BROWSERS_PATH='D:\DevTools\ms-playwright'
node scripts/revisar_temporadas.mjs
```

El script también admite `PLAYWRIGHT_MODULE` (archivo del módulo), `PLAYWRIGHT_EXECUTABLE_PATH` (navegador existente) y `PREVIEW_URL`. No instala dependencias ni navegadores. Para usar una instalación existente mediante npx se puede comprobar con `npx.cmd --offline --prefix D:/DevTools/pw playwright-core --version`.

Genera capturas completas y detalles de portada y pie a 1440 y 390 px en `capturas-temporadas/`, que está excluida de Git. Comprueba también 360 px, las fechas límite de varios años, los overrides, el año del saludo, el color del navegador, los recursos de otras temporadas y el movimiento reducido.

El preview estático no implementa `/descargar/info`: esa respuesta pertenece al Worker. Su 404 local se excluye de los errores de recursos. La revisión no prueba el Worker ni publica nada.
