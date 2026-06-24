#!/usr/bin/env python3
import os
import re
from pathlib import Path
from io import BytesIO

import requests
from PIL import Image

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_IMAGES_DIR = ROOT_DIR / "frontend" / "public" / "images"
SERVER_FILE = ROOT_DIR / "backend" / "server.py"

SEED_IMAGE_MAP = {
    "shuddh-haldi": "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/4ama2kfa_WhatsApp%20Image%202026-06-20%20at%2012.39.04.jpeg",
    "shuddh-mirchi": "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/0jr7l1id_WhatsApp%20Image%202026-06-20%20at%2012.39.03.jpeg",
    "shuddh-dhaniya": "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/55v60azb_WhatsApp%20Image%202026-06-20%20at%2012.39.03%20%281%29.jpeg",
    "royal-garam-masala": "https://images.pexels.com/photos/4198656/pexels-photo-4198656.jpeg",
}

FRONTEND_URL_TEMPLATE = "/images/{slug}.png"


def download_and_convert(url: str, dest_path: Path):
    print(f"Downloading {url}")
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content))
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest_path, format="PNG", optimize=True, compress_level=1)
    print(f"Saved {dest_path.relative_to(ROOT_DIR)}")


def update_server_file():
    text = SERVER_FILE.read_text(encoding="utf-8")
    for slug, url in SEED_IMAGE_MAP.items():
        local_path = FRONTEND_URL_TEMPLATE.format(slug=slug)
        escaped_url = re.escape(url)
        text = re.sub(rf'"{escaped_url}"', f'"{local_path}"', text)
    SERVER_FILE.write_text(text, encoding="utf-8")
    print(f"Updated {SERVER_FILE.relative_to(ROOT_DIR)} image_url values to local paths")


def main():
    FRONTEND_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    for slug, url in SEED_IMAGE_MAP.items():
        dest_file = FRONTEND_IMAGES_DIR / f"{slug}.png"
        download_and_convert(url, dest_file)

    update_server_file()
    print("Completed saving remote images locally and updating seed data.")


if __name__ == "__main__":
    main()
