// El Worker de la web: sirve lo que deja `npm run build` y, ademas, la
// direccion fija de descarga de la app.
//
// `/descargar` pregunta a Supabase cual es la ultima version publicada y
// redirige a su APK en Cloudflare R2. El boton y el codigo QR apuntan siempre
// ahi: publicar una version nueva en la app (subir el APK a R2 y marcarla como
// publicada) cambia lo que se baja sin tocar esta web ni reimprimir el QR.
//
// La clave de Supabase es la publica (la misma que lleva la app) y solo puede
// leer versiones ya publicadas.

const SUPABASE_URL = 'https://tawbyplxvrzyydyaakgc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_k7Y5wWI_gNkTQfy8LsLxmw_r-RFZLfm';

// Si Supabase no responde, se baja la ultima version conocida antes que
// dejar a la familia con un error.
const RESPALDO = {
  version: '1.0.1',
  build: 2,
  apk: 'https://pub-3bc0ccae21bd406a96879cd03f9774ac.r2.dev/smarter-1.0.1-2.apk',
};

async function ultimaVersion() {
  const url =
    `${SUPABASE_URL}/rest/v1/app_releases` +
    '?select=version,build_number,apk_url' +
    '&platform=eq.android&channel=eq.stable&published=eq.true' +
    '&order=build_number.desc&limit=1';
  try {
    const respuesta = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      // Cinco minutos: una version recien publicada tarda eso como mucho en
      // aparecer, y la web no consulta Supabase en cada descarga.
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!respuesta.ok) return RESPALDO;
    const [fila] = await respuesta.json();
    if (!fila?.apk_url?.startsWith('https://')) return RESPALDO;
    return { version: fila.version, build: fila.build_number, apk: fila.apk_url };
  } catch {
    return RESPALDO;
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/descargar' || pathname === '/descargar/') {
      const { apk } = await ultimaVersion();
      return new Response(null, {
        status: 302,
        headers: { Location: apk, 'Cache-Control': 'no-store' },
      });
    }

    if (pathname === '/descargar/info') {
      const { version, build } = await ultimaVersion();
      return Response.json(
        { version, build },
        { headers: { 'Cache-Control': 'public, max-age=300' } },
      );
    }

    return env.ASSETS.fetch(request);
  },
};
