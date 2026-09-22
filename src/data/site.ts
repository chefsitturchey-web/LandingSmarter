/**
 * Todo el texto y los datos de la web, en un solo sitio.
 *
 * Los componentes solo pintan lo que hay aqui: cambiar un telefono, un
 * programa o una pregunta es tocar este archivo y nada mas. Si mas adelante
 * esto sale de una base de datos, se cambia el origen y los componentes no se
 * enteran.
 *
 * Marcado con EJEMPLO: datos de muestra que se cambian por los reales antes
 * de salir a produccion.
 */

export const academia = {
  nombre: 'Academia SMARTER',
  lema: 'Creando mentes brillantes, hoy y siempre',
  descripcion:
    'Clases de primaria y secundaria en grupos pequeños o particulares, virtuales o presenciales. Nivelación, reforzamiento y avanzado, con una app donde el alumno gana monedas por aprender.',
  // EJEMPLO
  whatsapp: '51999888777',
  telefono: '+51 999 888 777',
  correo: 'info@smarter.edu.pe',
  ciudad: 'Lima, Perú',
  url: 'https://landing-smarter.pages.dev',
};

/** La app para Android.
 *
 * El APK vive en las Releases de GitHub y no en esta web: Cloudflare Pages no
 * sirve archivos de mas de 25 MB. Este enlace siempre baja la ultima version
 * publicada, asi que subir una version nueva no obliga a tocar la web. */
export const app = {
  apk: 'https://github.com/milenis131-sys/smarter-app/releases/latest/download/smarter.apk',
  version: '1.0',
  requisito: 'Android 7 o superior',
};

// EJEMPLO
export const cifras = [
  { valor: '500+', texto: 'alumnos formados' },
  { valor: '15+', texto: 'profesores' },
  { valor: '98%', texto: 'papás satisfechos' },
];

export const pasos = [
  {
    titulo: 'Nos escribes',
    texto: 'Llena el formulario con los datos del alumno. Toma menos de 3 minutos y llega directo a nuestro WhatsApp.',
    pose: 'escribiendo',
  },
  {
    titulo: 'Te llamamos',
    texto: 'Un coordinador te contacta en menos de una hora para resolver dudas y conocer al alumno.',
    pose: 'laptop',
  },
  {
    titulo: 'Eligen juntos',
    texto: 'Programa, modalidad, horario y forma de pago: lo que mejor le acomode a tu familia.',
    pose: 'libros',
  },
  {
    titulo: 'A aprender',
    texto: 'Te damos la cuenta de la app y el alumno empieza sus clases, con sus notas y monedas a la mano.',
    pose: 'ok',
  },
] as const;

export type Programa = {
  nombre: string;
  para: string;
  texto: string;
  destacado?: string;
};

export const programas: Programa[] = [
  {
    nombre: 'Círculo SMARTER',
    para: 'Para ir por la excelencia',
    texto: 'Grupo selecto con seguimiento intensivo y tutoría personalizada, para alumnos comprometidos con dar lo mejor.',
    destacado: 'Programa estrella',
  },
  {
    nombre: 'Ciclo Anual',
    para: 'Todo el año escolar',
    texto: 'Acompañamiento de marzo a diciembre al ritmo del colegio. La opción más completa, con descuento por pago adelantado.',
  },
  {
    nombre: 'Preparación para exámenes',
    para: 'Para la fecha que importa',
    texto: 'Bimestrales, admisión a colegios y concursos: práctica con exámenes tipo y repaso de lo que más se toma.',
  },
  {
    nombre: 'Nivelación y reforzamiento',
    para: 'Para no quedarse atrás',
    texto: 'Cerramos los vacíos de años anteriores y acompañamos lo que se ve en el colegio, con práctica y dudas resueltas cada semana.',
  },
  {
    nombre: 'Avanzado',
    para: 'Para destacar',
    texto: 'Olimpiadas, concursos y preparación temprana para la preuniversitaria, para quien quiere ir más allá.',
  },
  {
    nombre: 'Clases particulares',
    para: 'Uno a uno',
    texto: 'Un docente solo para el alumno, en el horario que le acomode y con un plan hecho a su medida.',
  },
];

export const grados = [
  '1.° Primaria', '2.° Primaria', '3.° Primaria', '4.° Primaria', '5.° Primaria', '6.° Primaria',
  '1.° Secundaria', '2.° Secundaria', '3.° Secundaria', '4.° Secundaria', '5.° Secundaria',
];

export const modalidades = ['Virtual (en vivo)', 'Presencial (en sede)', 'Cualquiera de las dos'];

/** Los personajes del Banco SMARTER, con los valores con los que arranca la
 * app. Cada uno vale el doble que el anterior. */
export const monedas = [
  { nombre: 'Círculo', valor: 10, img: 'avatar_circulo' },
  { nombre: 'Triángulo', valor: 20, img: 'avatar_triangulo' },
  { nombre: 'Cuadrado', valor: 40, img: 'avatar_cuadrado' },
  { nombre: 'Jefe', valor: 80, img: 'avatar_jefe' },
  { nombre: 'Otorongo', valor: 160, img: 'avatar_otorongo' },
] as const;

/** Lo que hace cada quien en la app. */
export const enLaApp = [
  {
    quien: 'El alumno',
    cosas: [
      'Ve su horario, asistencia y notas',
      'Junta monedas y viste a su jugador en la Tienda',
      'Reta a sus compañeros a juegos de lógica',
    ],
  },
  {
    quien: 'El apoderado',
    cosas: [
      'Sigue la asistencia y el avance de sus hijos',
      'Revisa pagos y estados de cuenta del mes',
      'Mira la Tienda y las medallas de sus hijos',
    ],
  },
];

/** Los juegos de la app. Suman puntos en el ranking, no monedas: las
 * monedas solo las da el docente en clase. */
export const juegos = {
  lista: ['Ajedrez', 'Sudoku', 'Wordle', 'Cálculo mental', 'Pupiletras', 'Memoria', '2048', 'Tres en raya'],
  pantallas: [
    { img: 'app-wordle', titulo: 'Wordle', texto: 'Una palabra de cinco letras en seis intentos.' },
    { img: 'app-ajedrez', titulo: 'Ajedrez', texto: 'Contra la máquina, en cuatro niveles, o retando a un compañero.' },
    { img: 'app-ranking', titulo: 'Ranking', texto: 'Alumnos, docentes y papás en la misma tabla.' },
  ],
};

export const descarga = {
  pasos: [
    {
      titulo: 'Descarga el archivo',
      texto: 'Toca el botón desde tu celular Android o escanea el código. Baja un archivo llamado smarter.apk.',
    },
    {
      titulo: 'Permite la instalación',
      texto: 'Al abrirlo, Android pregunta si confías en el origen. Toca "Configuración", activa "Permitir de esta fuente" y vuelve.',
    },
    {
      titulo: 'Entra con tu cuenta',
      texto: 'Usa el correo y la contraseña que te da la academia al matricularte. Si aún no la tienes, pídela por WhatsApp.',
    },
  ],
};

// EJEMPLO
export const testimonios = [
  {
    texto: 'Mi hija subió de 12 a 18 en matemáticas en solo tres meses. Los profes son muy pacientes y la metodología funciona.',
    nombre: 'María García',
    detalle: 'Mamá de Sofía, 5.° Secundaria',
  },
  {
    texto: 'Lo mejor es ver en la app cómo va mi hijo sin tener que estar persiguiéndolo. Es muy fácil de usar.',
    nombre: 'Jorge Ramírez',
    detalle: 'Papá de Diego, 6.° Primaria',
  },
  {
    texto: 'Empezamos con clases particulares y ahora está en el Círculo SMARTER. Pide las monedas como si fueran figuritas.',
    nombre: 'Lucía Castillo',
    detalle: 'Mamá de Valentina, 3.° Secundaria',
  },
];

export const preguntas = [
  {
    p: '¿Las clases son virtuales o presenciales?',
    r: 'Las dos. Puedes elegir clases virtuales en vivo o presenciales en sede, y lo definimos contigo al matricular.',
  },
  {
    p: '¿Cómo consigo una cuenta para la app?',
    r: 'La cuenta la crea la academia cuando el alumno se matricula: te llega el correo y la contraseña para el alumno y para el apoderado.',
  },
  {
    p: '¿La app está para iPhone?',
    r: 'Por ahora solo para Android. La versión para iPhone está en camino.',
  },
  {
    p: '¿Por qué Android me avisa al instalarla?',
    r: 'Porque la app se descarga desde nuestra web y no desde Play Store. Es normal: Android lo avisa con cualquier app que no viene de la tienda.',
  },
  {
    p: '¿Las monedas se compran con dinero?',
    r: 'No. Las monedas solo se ganan aprendiendo: las da el docente por participar, avanzar o destacar, y se gastan en la Tienda SMARTER.',
  },
  {
    p: '¿Cuántos alumnos hay por grupo?',
    r: 'Grupos pequeños, para que el docente pueda seguir a cada alumno. Si prefieres uno a uno, están las clases particulares.',
  },
];
