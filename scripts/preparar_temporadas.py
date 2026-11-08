"""Descarga los emojis de Microsoft y los guarda como WebP de 256 px.

Requiere Pillow. Ejecutar desde la raiz con acceso a GitHub.
Los dibujos locales se usan hasta que esten disponibles estos archivos.
"""

from io import BytesIO
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen

from PIL import Image


RAIZ = Path(__file__).resolve().parents[1]
ORIGEN = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets"
RECURSOS = {
    "navidad": {
        "christmas_tree": "Christmas tree",
        "wrapped_gift": "Wrapped gift",
        "star": "Star",
        "bell": "Bell",
    },
    "anionuevo": {
        "party_popper": "Party popper",
        "sparkles": "Sparkles",
        "clinking_glasses": "Clinking glasses",
    },
}


def main():
    for temporada, recursos in RECURSOS.items():
        carpeta = RAIZ / "public" / temporada
        carpeta.mkdir(parents=True, exist_ok=True)
        for nombre, directorio in recursos.items():
            url = f"{ORIGEN}/{quote(directorio)}/3D/{nombre}_3d.png"
            with urlopen(url, timeout=30) as respuesta:
                imagen = Image.open(BytesIO(respuesta.read())).convert("RGBA")
            imagen = imagen.resize((256, 256), Image.Resampling.LANCZOS)
            imagen.save(carpeta / f"{nombre}.webp", "WEBP", quality=88, method=6)
            print(f"Preparado: {temporada}/{nombre}.webp")


if __name__ == "__main__":
    main()
