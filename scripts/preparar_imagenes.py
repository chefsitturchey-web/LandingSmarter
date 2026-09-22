"""Prepara las imagenes de la landing a partir del arte de la academia.

    python scripts/preparar_imagenes.py

Todo sale de dos sitios: la app movil (`../mobil app/assets/`) y el prototipo
web (`../prototipo/recursos/`). Nada se dibuja aqui: se recorta, se limpia y se
compone. Astro despues las optimiza al compilar.

Lo que hace:
- copia el logo, la mascota y los personajes de las monedas;
- recorta las poses de la hoja de mascotas y les quita el fondo blanco;
- arma jugadores vestidos con las piezas reales de la Tienda SMARTER, en el
  mismo orden de capas que usa la app.
"""

import os
import shutil

from PIL import Image, ImageDraw

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SMARTER = os.path.dirname(AQUI)
APP = os.path.join(SMARTER, 'mobil app', 'assets')
PROTO = os.path.join(SMARTER, 'prototipo', 'recursos')
DESTINO = os.path.join(AQUI, 'src', 'assets', 'img')


def copiar():
    os.makedirs(DESTINO, exist_ok=True)
    for nombre in ['logo', 'mascota', 'avatar_circulo', 'avatar_triangulo',
                   'avatar_cuadrado', 'avatar_jefe', 'avatar_otorongo',
                   'Boss160mitad']:
        shutil.copy(os.path.join(APP, 'images', nombre + '.png'),
                    os.path.join(DESTINO, nombre.lower() + '.png'))


def sin_fondo_blanco(im):
    """Quita el blanco que toca el borde, sin tocar el blanco de dentro."""
    im = im.convert('RGBA')
    marca = (255, 0, 255, 0)
    for punto in [(0, 0), (im.width - 1, 0), (0, im.height - 1),
                  (im.width - 1, im.height - 1)]:
        if im.getpixel(punto)[:3] != marca[:3]:
            ImageDraw.floodfill(im, punto, marca, thresh=38)
    datos = [(0, 0, 0, 0) if p[:3] == marca[:3] else p for p in im.get_flattened_data()]
    im.putdata(datos)
    im = solo_la_figura(im)
    caja = im.getchannel('A').getbbox()
    return im.crop(caja) if caja else im


def solo_la_figura(im):
    """Deja solo el trozo mas grande: el recorte a veces se lleva el borde de
    la pose vecina, y eso es un pedazo suelto, no parte de la figura."""
    from collections import deque

    escala = 4
    chico = im.getchannel('A').resize(
        (max(1, im.width // escala), max(1, im.height // escala)))
    w, h = chico.size
    lleno = [a > 20 for a in chico.get_flattened_data()]
    etiqueta = [0] * (w * h)
    tamanos = {}
    actual = 0
    for inicio in range(w * h):
        if not lleno[inicio] or etiqueta[inicio]:
            continue
        actual += 1
        cola = deque([inicio])
        etiqueta[inicio] = actual
        n = 0
        while cola:
            i = cola.popleft()
            n += 1
            x, y = i % w, i // w
            for j in (i - 1 if x > 0 else -1, i + 1 if x < w - 1 else -1,
                      i - w if y > 0 else -1, i + w if y < h - 1 else -1):
                if j >= 0 and lleno[j] and not etiqueta[j]:
                    etiqueta[j] = actual
                    cola.append(j)
        tamanos[actual] = n
    if not tamanos:
        return im
    mayor = max(tamanos, key=tamanos.get)
    mascara = Image.new('L', (w, h))
    mascara.putdata([255 if e == mayor else 0 for e in etiqueta])
    mascara = mascara.resize(im.size).point(lambda v: 255 if v > 0 else 0)
    alfa = Image.composite(im.getchannel('A'), Image.new('L', im.size), mascara)
    im.putalpha(alfa)
    return im


def poses_mascota():
    hoja = Image.open(os.path.join(PROTO, 'mascotas.png')).convert('RGB')
    w, h = hoja.size
    # La hoja es de 1672 x 941: una pose grande a la izquierda y cuatro a la
    # derecha, en dos filas. Recortes medidos sobre ella.
    cortes = {
        'mascota-escribiendo': (0, 0, int(w * 0.375), h),
        'mascota-laptop': (int(w * 0.40), 0, int(w * 0.72), int(h * 0.52)),
        'mascota-leyendo': (int(w * 0.72), 0, w, int(h * 0.52)),
        'mascota-libros': (int(w * 0.40), int(h * 0.56), int(w * 0.72), h),
        'mascota-ok': (int(w * 0.72), int(h * 0.56), w, h),
    }
    for nombre, caja in cortes.items():
        pose = sin_fondo_blanco(hoja.crop(caja))
        pose.thumbnail((700, 700), Image.LANCZOS)
        pose.save(os.path.join(DESTINO, nombre + '.png'))


def jugador(nombre, base, ropa, pelo, accesorio=None, mano=None, detras=False):
    """Un jugador vestido, con el orden de capas de la app."""
    t = os.path.join(APP, 'tienda')
    capas = []
    if mano and detras:
        capas.append(f'mano/{mano}')
    capas += [f'base/{base}', f'ropa/{ropa}', f'base/{base}_cabeza', f'pelo/{pelo}']
    if accesorio:
        capas.append(f'accesorio/{accesorio}')
    if mano and not detras:
        capas.append(f'mano/{mano}')
    lienzo = None
    for capa in capas:
        im = Image.open(os.path.join(t, capa + '.webp')).convert('RGBA')
        lienzo = im if lienzo is None else Image.alpha_composite(lienzo, im)
    caja = lienzo.getchannel('A').getbbox()
    lienzo.crop(caja).save(os.path.join(DESTINO, nombre + '.png'))


def jugadores():
    jugador('jugador-1', 'piel_media', 'casaca_negra', 'cola_caballo',
            'audifonos', 'espada_regla', detras=True)
    jugador('jugador-2', 'piel_clara', 'uniforme', 'colitas', 'orejas_gato',
            'lapiz_estrella', detras=True)
    jugador('jugador-3', 'piel_oscura', 'tunica_mago', 'despeinado', 'lentes',
            'escudo_calculadora')
    jugador('jugador-4', 'piel_media', 'aventurero', 'ondulado', 'gorro_lana')
    jugador('jugador-5', 'piel_clara', 'conjunto_rosa', 'monitos', 'tiara')


def stickers():
    t = os.path.join(APP, 'tienda', 'stickers')
    for nombre in ['tu_puedes', 'liga_academica', 'reto_escolar', 'buho_legendario']:
        Image.open(os.path.join(t, nombre + '.webp')).save(
            os.path.join(DESTINO, 'sticker-' + nombre.replace('_', '-') + '.png'))
    m = os.path.join(APP, 'tienda', 'medallas')
    for nombre in ['concurso_oro', 'asistencia_perfecta', 'campeon_juegos']:
        Image.open(os.path.join(m, nombre + '.webp')).save(
            os.path.join(DESTINO, 'medalla-' + nombre.replace('_', '-') + '.png'))


if __name__ == '__main__':
    copiar()
    poses_mascota()
    jugadores()
    stickers()
    print('listo:', len(os.listdir(DESTINO)), 'imagenes en', DESTINO)
