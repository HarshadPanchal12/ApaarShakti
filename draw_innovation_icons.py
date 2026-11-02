import os
import math
from PIL import Image, ImageDraw, ImageFont

def create_super_canvas(size=512):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0)), size

# 1. Ed25519 Cryptography / Digital Signature (Cyan/Blue)
def draw_crypto_icon():
    img, S = create_super_canvas()
    d = ImageDraw.Draw(img)
    # Shield + Key / Digital Sig
    pts = [(256, 40), (430, 95), (430, 260), (256, 470), (82, 260), (82, 95)]
    d.polygon(pts, fill="#0284C7")
    in_pts = [(256, 70), (405, 120), (405, 255), (256, 440), (107, 255), (107, 120)]
    d.polygon(in_pts, fill="#38BDF8")
    # Key / Signature inside
    d.ellipse([216, 170, 296, 250], fill="#FFFFFF")
    d.ellipse([236, 190, 276, 230], fill="#0284C7")
    d.rectangle([244, 240, 268, 350], fill="#FFFFFF")
    d.rectangle([268, 290, 300, 314], fill="#FFFFFF")
    d.rectangle([268, 326, 294, 350], fill="#FFFFFF")
    return img

# 2. DPDP Act 2023 Consent & Privacy (Emerald Green)
def draw_consent_icon():
    img, S = create_super_canvas()
    d = ImageDraw.Draw(img)
    # Circular Privacy / User Lock
    d.ellipse([50, 50, 462, 462], fill="#059669")
    d.ellipse([80, 80, 432, 432], fill="#10B981")
    # User / Hand / Consent checkmark
    # Checkmark inside
    pts = [(160, 260), (230, 330), (360, 190)]
    d.line(pts, fill="#FFFFFF", width=46, joint="curve")
    return img

# 3. 14-Rule Automated Intake Engine (Amber/Orange)
def draw_engine_icon():
    img, S = create_super_canvas()
    d = ImageDraw.Draw(img)
    # Rounded badge / Gear with Lightning
    d.rounded_rectangle([60, 60, 452, 452], radius=90, fill="#D97706")
    d.rounded_rectangle([86, 86, 426, 426], radius=70, fill="#F59E0B")
    # Lightning bolt inside
    bolt = [(270, 110), (170, 260), (250, 260), (220, 395), (342, 230), (262, 230)]
    d.polygon(bolt, fill="#FFFFFF")
    return img

# 4. Zero-Knowledge Offline QR (Purple / Indigo)
def draw_qr_icon():
    img, S = create_super_canvas()
    d = ImageDraw.Draw(img)
    # Rounded container
    d.rounded_rectangle([60, 60, 452, 452], radius=90, fill="#4F46E5")
    d.rounded_rectangle([86, 86, 426, 426], radius=70, fill="#6366F1")
    # QR outer corners
    # Top-Left
    d.rectangle([130, 130, 220, 220], outline="#FFFFFF", width=18)
    d.rectangle([155, 155, 195, 195], fill="#FFFFFF")
    # Top-Right
    d.rectangle([292, 130, 382, 220], outline="#FFFFFF", width=18)
    d.rectangle([317, 155, 357, 195], fill="#FFFFFF")
    # Bottom-Left
    d.rectangle([130, 292, 220, 382], outline="#FFFFFF", width=18)
    d.rectangle([155, 317, 195, 357], fill="#FFFFFF")
    # Scan line / center dot
    d.rectangle([290, 290, 340, 340], fill="#FFFFFF")
    d.rectangle([350, 350, 380, 380], fill="#FFFFFF")
    return img

# 5. AI Anomaly & Fraud Detection (Rose / Crimson)
def draw_anomaly_icon():
    img, S = create_super_canvas()
    d = ImageDraw.Draw(img)
    # Hexagon / Alert
    pts = [(256, 40), (440, 145), (440, 365), (256, 470), (72, 365), (72, 145)]
    d.polygon(pts, fill="#E11D48")
    in_pts = [(256, 70), (415, 160), (415, 350), (256, 440), (97, 350), (97, 160)]
    d.polygon(in_pts, fill="#F43F5E")
    # Exclamation mark inside
    d.rounded_rectangle([236, 140, 276, 290], radius=16, fill="#FFFFFF")
    d.ellipse([236, 320, 276, 360], fill="#FFFFFF")
    return img

# 6. Immutable Regulatory Audit (Violet / Royal Blue)
def draw_audit_icon():
    img, S = create_super_canvas()
    d = ImageDraw.Draw(img)
    # Official Government / Verified Ledger Stamp
    d.ellipse([50, 50, 462, 462], fill="#7C3AED")
    d.ellipse([80, 80, 432, 432], fill="#8B5CF6")
    # Pillars / Temple / Ledger
    # Pediment (triangle)
    d.polygon([(256, 130), (370, 195), (142, 195)], fill="#FFFFFF")
    # Roof beam
    d.rectangle([136, 195, 376, 215], fill="#FFFFFF")
    # Pillars (3 pillars)
    d.rectangle([160, 225, 195, 335], fill="#FFFFFF")
    d.rectangle([238, 225, 274, 335], fill="#FFFFFF")
    d.rectangle([317, 225, 352, 335], fill="#FFFFFF")
    # Base
    d.rectangle([136, 335, 376, 365], fill="#FFFFFF")
    return img

if __name__ == "__main__":
    os.makedirs("test_icons", exist_ok=True)
    draw_crypto_icon().save("test_icons/crypto.png")
    draw_consent_icon().save("test_icons/consent.png")
    draw_engine_icon().save("test_icons/engine.png")
    draw_qr_icon().save("test_icons/qr.png")
    draw_anomaly_icon().save("test_icons/anomaly.png")
    draw_audit_icon().save("test_icons/audit.png")
    print("All 6 test icons created successfully!")

