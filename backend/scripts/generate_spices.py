"""One-shot spice image generator. Run from /app/backend:
    python scripts/generate_spices.py
Generates 12 photo-realistic transparent spice PNGs into /app/backend/static/spices/
"""
import os
import sys
import asyncio
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
load_dotenv(ROOT / ".env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

OUT = ROOT / "static" / "spices"
OUT.mkdir(parents=True, exist_ok=True)

# Pure-BLACK backgrounds work with CSS mix-blend-mode: screen — the black
# disappears against a dark page, leaving the spice visible photographically.
BG_INSTRUCTION = (
    "Photograph on a pure solid black background, studio macro lighting, "
    "tack-sharp focus, ultra high detail, isolated single subject, no text, "
    "no shadows on background, single floating object, professional food "
    "photography, 4k, highly realistic. The background MUST be pure (#000000) "
    "black with no gradient and no other elements."
)

SPICES = {
    "chili": "A single whole dried Indian red chili pepper (laal mirch), curved tapered shape with a tiny green stem, deep crimson red colour, slightly wrinkled skin texture",
    "turmeric": "A single whole raw turmeric root (haldi), bright orange-yellow flesh, irregular knobby shape with thin papery skin",
    "cumin": "A small pile of about 8-10 whole cumin seeds (jeera), elongated brown ridged seeds, top-down macro shot, no container",
    "coriander": "A small pile of about 8-10 whole coriander seeds (sabut dhaniya), small round beige spheres with vertical ridges, top-down macro shot, no container",
    "cardamom": "A whole green cardamom pod (elaichi), oval shape, vibrant green, slightly pointed at one end, single pod isolated",
    "pepper": "A small pile of about 8-10 black peppercorns (kaali mirch), wrinkled dark brown-black spheres, top-down macro shot, no container",
    "star_anise": "A single dried star anise pod (chakra phool), perfect 8-pointed star shape, dark reddish-brown, woody texture",
    "cinnamon": "A single rolled cinnamon stick (dalchini), tightly rolled brown bark, cylindrical shape lying horizontally",
    "clove": "A few whole dried cloves (laung), nail-like dark brown buds with rounded heads and slim stems, isolated",
    "bay_leaf": "A single dried bay leaf (tej patta), elongated oval leaf, muted olive green with visible veins",
    "mustard": "A small pile of about 10-12 yellow mustard seeds (sarson), tiny ochre-yellow spheres, top-down macro shot, no container",
    "saffron": "A few crimson saffron strands (kesar), thin curling threads, deep red-orange, isolated, scattered naturally",
}


async def generate_one(name: str, prompt: str):
    out_path = OUT / f"{name}.png"
    if out_path.exists():
        print(f"  · {name}: already exists, skipping")
        return
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=f"spice-gen-{name}",
        system_message="You are an expert food photographer.",
    ).with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    full_prompt = f"{prompt}. {BG_INSTRUCTION}"
    print(f"  · generating {name} …")
    text, images = await chat.send_message_multimodal_response(UserMessage(text=full_prompt))
    if not images:
        print(f"  ! {name}: no image returned. Text: {text[:120]}")
        return
    image_bytes = base64.b64decode(images[0]["data"])
    out_path.write_bytes(image_bytes)
    print(f"  ✓ {name}: {len(image_bytes) // 1024} KB → {out_path}")


async def main():
    print(f"Output dir: {OUT}")
    for name, prompt in SPICES.items():
        try:
            await generate_one(name, prompt)
        except Exception as e:
            print(f"  ! {name}: {e}")
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
