// El Worker de la web: sirve lo que deja `npm run build` y, ademas, la
// direccion fija de descarga de la app.
//
// `/descargar` pregunta a Supabase cual es la ultima version publicada y
// redirige a su APK en Cloudflare R2. El boton y el codigo QR apuntan siempre
// ahi: publicar una version nueva en la app (subir el APK a R2 y marcarla como
// publicada) cambia lo que se baja sin tocar esta web ni reimprimir el QR.
//
// En un iPhone, iPad o Mac el APK no se puede abrir: ahi `/descargar` lleva a
// la version web de la app. Asi se comparte un solo enlace con todas las
// familias y a cada una le abre lo que le sirve.
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

const APP_WEB = '/app/';

// Los iPad nuevos dicen ser una Mac: tambien caen aqui, que es lo correcto.
function esApple(request) {
  return /iPhone|iPad|iPod|Macintosh/.test(request.headers.get('User-Agent') ?? '');
}

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
      const destino = esApple(request) ? APP_WEB : (await ultimaVersion()).apk;
      return new Response(null, {
        status: 302,
        headers: {
          Location: destino,
          'Cache-Control': 'no-store',
          // La respuesta depende del aparato: ningun cache la comparte.
          Vary: 'User-Agent',
        },
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
