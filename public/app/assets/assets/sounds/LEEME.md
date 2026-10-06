# Sonidos de la app

Los siete que pide `lib/core/audio/app_sounds.dart` ya estan aqui. Si el enum
crece, el archivo nuevo va en esta misma carpeta con el nombre exacto que diga.

## Que hay, y de donde salio

Seis son de **Kenney** (kenney.nl) bajo **CC0 / dominio publico**: uso
comercial, sin atribucion obligatoria y sin pedir permiso. Se acredita igual
porque es de buena educacion y porque asi se sabe de donde reponer uno.

El de derrota se sintetiza en `tool/sonido_derrota.py`: es de la app.

| Archivo | Original | Paquete |
|---|---|---|
| `ui_tap.mp3` | `click_001.ogg` | Interface Sounds |
| `ui_welcome.mp3` | `jingles_STEEL02.ogg` | Music Jingles |
| `game_coin.mp3` | `highUp.ogg` | Digital Audio |
| `game_correct.mp3` | `confirmation_001.ogg` | Interface Sounds |
| `game_wrong.mp3` | `error_001.ogg` | Interface Sounds |
| `game_victory.mp3` | `powerUp3.ogg` | Digital Audio |
| `game_defeat.mp3` | sintetizado | `tool/sonido_derrota.py` |

Nada generado con IA: la licencia de lo que devuelven esas herramientas para
audio no esta clara, y esto se reparte a los alumnos de una academia.

## Que se les hizo

Vienen en `.ogg`, que Android reproduce pero iOS no. Van convertidos a MP3 mono
a 44.1 kHz, que suena en los dos.

Y nivelados todos al mismo volumen (`loudnorm I=-16`). Sin eso, un set juntado
de tres paquetes distintos tiene un acierto que apenas se oye al lado de una
victoria que pega un salto, y se nota mas que cualquier sonido mal elegido.

Los siete juntos pesan 32 KB.

## El de derrota no se oia

Era `lowDown.ogg`, de Digital Audio: un tono que baja de 95 a 44 Hz. El
parlante de un celular casi no reproduce por debajo de 300 Hz, y menos del 1 %
de su energia caia por encima: al perder una partida no sonaba nada. La medida
de "sube o baja" decia que era el correcto, y lo era; lo que no media es si se
iba a oir.

El nuevo tiene la misma forma, unas tres octavas mas arriba. Para cualquier
sonido que se cambie conviene comprobar eso mismo: que la mayor parte de su
energia quede por encima de 350 Hz.

## Como se eligieron, y que queda por comprobar

**No se pudieron escuchar.** Se eligieron por nombre y midiendo si el tono sube
o baja, que es lo que separa "bien" de "mal" en cualquier idioma. La medida
acerto en los cortos: `confirmation_001` sube, `error_001` baja, `highUp` sube,
`lowDown` baja.

Solo se pudo comprobar con medidas, y la que faltaba se pago: ver arriba.

Donde **no** sirve es en los jingles musicales: un instrumento que decae siempre
termina con menos brillo del que empezo, asi que la medida la manda el
decaimiento y no la melodia, y los diecisiete jingles del paquete salieron
"bajando". Por eso victoria y derrota salen del paquete digital, donde el nombre
y la medida dicen lo mismo, en vez de un jingle elegido a ciegas con riesgo de
celebrar una derrota.

Queda escucharlos en el telefono. Para cambiar cualquiera: pon otro archivo
encima con **el mismo nombre**. No hay que tocar codigo.

Los originales estan en kenney.nl/assets, en Interface Sounds, Digital Audio y
Music Jingles.
