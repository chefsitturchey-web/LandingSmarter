# Halloween

La app se disfraza del **1 al 31 de octubre de 2026** y el 1 de noviembre
amanece como siempre, sin instalar nada. Es solo aspecto: no cambia lo que
hace ninguna pantalla.

## Que cambia

- El fondo de todas las pantallas: degradado, ilustraciones y telaranas.
- Un cartel de "¡Feliz Halloween!" en los tres inicios.
- Los botones principales y la pestana activa, de rosa a calabaza.
- El logo con sombrero y arana; la mascota de la entrada, pidiendo dulces.
- Cada juego con su ilustracion en la lista.
- El confeti y las escenas de ganar y perder.
- Los siete sonidos, en version de temporada.

Las constancias y los estados de cuenta que se mandan a las familias no se
disfrazan.

## Donde se enciende y se apaga

Todo sale de `lib/core/theme/seasonal.dart`.

| Para | Se hace |
|---|---|
| Cambiar las fechas | `halloweenFrom` y `halloweenUntil`. Es codigo: llega con un parche. |
| Probarla fuera de fecha | `--dart-define=TEMPORADA=halloween` |
| Apagarla dentro de fecha | `--dart-define=TEMPORADA=ninguna` |

## El icono de la app

El icono no se puede cambiar por fecha: va en el instalador. Mientras
`pubspec.yaml` apunte a `assets/icon/halloween/`, la version que se compile
sale con el icono de calabaza. Para volver al de siempre:

1. En `pubspec.yaml`, quitar `halloween/` de las rutas de
   `flutter_launcher_icons`.
2. `dart run flutter_launcher_icons`
3. Sacar una version nueva.

## De donde sale cada cosa

| Que | Como se rehace |
|---|---|
| Ilustraciones | Fluent Emoji de Microsoft, licencia MIT. Ver `LICENCIA.md`. |
| Sonidos (`assets/sounds/halloween_*.mp3`) | `python tool/sonidos_halloween.py`. Sintetizados: son de la app. |
| Icono | `python tool/icono_halloween.py` |
| Capturas para ensenarlo | `flutter test tool/capturas/capturas_test.dart` y `python tool/capturas/hojas.py` |
