#!/usr/bin/env python3
import re
from pathlib import Path
from io import BytesIO

import requests
from PIL import Image

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_IMAGES_DIR = ROOT_DIR / "frontend" / "public" / "images"

# Map each JPEG URL to a local PNG filename.
URL_TO_FILENAME = {
    "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/4ama2kfa_WhatsApp%20Image%202026-06-20%20at%2012.39.04.jpeg": "shuddh-haldi.png",
    "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/0jr7l1id_WhatsApp%20Image%202026-06-20%20at%2012.39.03.jpeg": "shuddh-mirchi.png",
    "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/55v60azb_WhatsApp%20Image%202026-06-20%20at%2012.39.03%20%281%29.jpeg": "shuddh-dhaniya.png",
    "https://images.pexels.com/photos/4198656/pexels-photo-4198656.jpeg": "royal-garam-masala.png",
    "https://images.pexels.com/photos/11308973/pexels-photo-11308973.jpeg": "design-guideline-11308973.png",
    "https://images.pexels.com/photos/4198654/pexels-photo-4198654.jpeg": "design-guideline-4198654.png",
    "https://images.pexels.com/photos/33440713/pexels-photo-33440713.jpeg": "design-guideline-33440713.png",
    "https://images.pexels.com/photos/10487771/pexels-photo-10487771.jpeg": "design-guideline-10487771.png",
    "https://images.pexels.com/photos/19450236/pexels-photo-19450236.jpeg": "design-guideline-19450236.png",
}

FILES_TO_PATCH = [
    ROOT_DIR / "frontend" / "src" / "components" / "Hero.jsx",
    ROOT_DIR / "frontend" / "src" / "components" / "CinematicReveal.jsx",
    ROOT_DIR / "frontend" / "src" / "components" / "Storytelling.jsx",
    ROOT_DIR / "frontend" / "src" / "components" / "About.jsx",
    ROOT_DIR / "design_guidelines.json",
]


def download_image(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {url}")
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content))
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")
    image.save(dest, format="PNG", optimize=True, compress_level=1)
    print(f"Saved {dest.relative_to(ROOT_DIR)}")


def patch_file(file_path: Path, replacements: dict[str, str]):
    text = file_path.read_text(encoding="utf-8")
    original = text
    for url, local_path in replacements.items():
        text = text.replace(url, local_path)
    if text != original:
        file_path.write_text(text, encoding="utf-8")
        print(f"Updated {file_path.relative_to(ROOT_DIR)}")
    else:
        print(f"No replacements needed for {file_path.relative_to(ROOT_DIR)}")


def main():
    replacements = {url: f"/images/{filename}" for url, filename in URL_TO_FILENAME.items()}
    FRONTEND_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    for url, filename in URL_TO_FILENAME.items():
        dest_file = FRONTEND_IMAGES_DIR / filename
        if dest_file.exists():
            print(f"Skipping existing {dest_file.relative_to(ROOT_DIR)}")
            continue
        download_image(url, dest_file)

    for file_path in FILES_TO_PATCH:
        patch_file(file_path, replacements)

    print("Completed JPEG discovery, conversion, and local save.")


if __name__ == "__main__":
    main()
