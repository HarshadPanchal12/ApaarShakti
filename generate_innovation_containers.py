import os
import math
from PIL import Image, ImageDraw, ImageFont

font_dir = "C:/Windows/Fonts"
font_bold_path = os.path.join(font_dir, "segoeuib.ttf")
font_reg_path = os.path.join(font_dir, "segoeui.ttf")

# ==============================================================================
# DRAW CLEAN VECTOR-STYLE LINE ART ICONS
# ==============================================================================
def draw_line_crypto(size=256, color="#0284C7"):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = 12
    # Shield outline
    pts = [(128, 24), (216, 52), (216, 136), (128, 236), (40, 136), (40, 52), (128, 24)]
    d.line(pts, fill=color, width=w, joint="curve")
    # Key inside
    d.ellipse([106, 78, 150, 122], outline=color, width=10)
    d.line([(128, 122), (128, 182)], fill=color, width=10)
    d.line([(128, 150), (148, 150)], fill=color, width=10)
    d.line([(128, 172), (144, 172)], fill=color, width=10)
    return img

def draw_line_dpdp(size=256, color="#10B981"):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = 12
    # Lock body outline
    d.rounded_rectangle([64, 104, 192, 224], radius=24, outline=color, width=w)
    # Shackle
    d.arc([86, 36, 170, 128], start=180, end=0, fill=color, width=w)
    # Checkmark inside
    pts = [(96, 164), (120, 188), (164, 140)]
    d.line(pts, fill=color, width=12, joint="curve")
    return img

def draw_line_rules(size=256, color="#F59E0B"):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = 12
    # Document / Clipboard with checkmarks
    d.rounded_rectangle([60, 36, 196, 226], radius=20, outline=color, width=w)
    d.rounded_rectangle([96, 20, 160, 50], radius=8, outline=color, width=w)
    
    # 3 Check lines inside
    for y in [92, 142, 192]:
        d.line([(86, y), (102, y + 16), (124, y - 10)], fill=color, width=8, joint="curve")
        d.line([(136, y + 4), (170, y + 4)], fill=color, width=8)
    return img

def draw_line_qr(size=256, color="#8B5CF6"):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = 12
    # Phone outline
    d.rounded_rectangle([52, 24, 204, 234], radius=28, outline=color, width=w)
    d.line([(110, 42), (146, 42)], fill=color, width=6)
    d.line([(116, 218), (140, 218)], fill=color, width=6)
    
    # QR corners inside
    d.rectangle([80, 76, 120, 116], outline=color, width=7)
    d.rectangle([92, 88, 108, 104], fill=color)
    d.rectangle([136, 76, 176, 116], outline=color, width=7)
    d.rectangle([148, 88, 164, 104], fill=color)
    d.rectangle([80, 132, 120, 172], outline=color, width=7)
    d.rectangle([92, 144, 108, 160], fill=color)
    # Scan line
    d.line([(68, 124), (188, 124)], fill="#EC4899", width=6)
    return img

def draw_line_ai(size=256, color="#F43F5E"):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = 12
    # Chart with upward trend
    d.line([(48, 48), (48, 216), (218, 216)], fill=color, width=w)
    trend = [(58, 176), (104, 128), (142, 154), (196, 76)]
    d.line(trend, fill=color, width=12, joint="curve")
    d.line([(166, 76), (196, 76), (196, 106)], fill=color, width=12)
    # Pulse beacon / alert
    d.ellipse([140, 36, 168, 64], fill="#F43F5E")
    return img

def draw_line_audit(size=256, color="#6366F1"):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w = 12
    # Government Temple / National Building
    d.line([(44, 94), (128, 42), (212, 94), (44, 94)], fill=color, width=w, joint="curve")
    d.rectangle([40, 94, 216, 112], outline=color, width=w)
    d.line([(68, 112), (68, 192)], fill=color, width=12)
    d.line([(128, 112), (128, 192)], fill=color, width=12)
    d.line([(188, 112), (188, 192)], fill=color, width=12)
    d.rectangle([40, 192, 216, 214], outline=color, width=w)
    return img

# Innovation Items Definition
innovations = [
    {
        "title_lines": ["Ed25519 Cryptographic", "Trust & Signatures"],
        "name": "Ed25519 Digital Trust",
        "desc": "Offline Asymmetric Signatures",
        "color": "#0284C7",
        "bg_pill": "#E0F2FE",
        "draw_func": draw_line_crypto
    },
    {
        "title_lines": ["DPDP Act 2023", "Consent Architecture"],
        "name": "DPDP Act 2023 Consent",
        "desc": "Student-Governed PII Privacy",
        "color": "#10B981",
        "bg_pill": "#D1FAE5",
        "draw_func": draw_line_dpdp
    },
    {
        "title_lines": ["14-Rule Automated", "Intake Audit Engine"],
        "name": "14-Rule Intake Engine",
        "desc": "Real-time Seat Cap & Dupe Check",
        "color": "#F59E0B",
        "bg_pill": "#FEF3C7",
        "draw_func": draw_line_rules
    },
    {
        "title_lines": ["Zero-Knowledge", "Offline QR Verification"],
        "name": "Zero-Knowledge QR",
        "desc": "Instant Verification Without Login",
        "color": "#8B5CF6",
        "bg_pill": "#EDE9FE",
        "draw_func": draw_line_qr
    },
    {
        "title_lines": ["AI Anomaly & Outlier", "Spike Detection"],
        "name": "AI Anomaly Detection",
        "desc": "Quota Spikes & Ghost Alerts",
        "color": "#F43F5E",
        "bg_pill": "#FFE4E6",
        "draw_func": draw_line_ai
    },
    {
        "title_lines": ["Immutable National", "Regulatory Audit"],
        "name": "Regulatory Audit Chain",
        "desc": "Tamper-Proof AICTE Compliance",
        "color": "#6366F1",
        "bg_pill": "#EEF2FF",
        "draw_func": draw_line_audit
    }
]

# ==============================================================================
# 1. EXACT REFERENCE STYLE: Clean Horizontal Banner (Like User's Image)
# ==============================================================================
def create_reference_style_banner():
    scale = 2
    items_count = len(innovations)
    item_w = int(220 * scale)
    total_h = int(240 * scale)
    pad_x = int(24 * scale)
    border_w = int(2 * scale)
    total_w = pad_x * 2 + items_count * item_w
    
    img = Image.new("RGBA", (total_w, total_h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([border_w, border_w, total_w - border_w, total_h - border_w], radius=int(18 * scale), fill="#FFFFFF", outline="#CBD5E1", width=border_w)
    
    f_title = ImageFont.truetype(font_bold_path, int(15.5 * scale))
    icon_box_size = int(72 * scale)
    
    for i, item in enumerate(innovations):
        center_x = pad_x + i * item_w + item_w // 2
        
        raw_icon = item["draw_func"](size=256, color=item["color"])
        icon_resized = raw_icon.resize((icon_box_size, icon_box_size), Image.Resampling.LANCZOS)
        
        icon_x = center_x - icon_box_size // 2
        icon_y = int(30 * scale)
        img.paste(icon_resized, (icon_x, icon_y), icon_resized)
        
        line1, line2 = item["title_lines"]
        b1 = draw.textbbox((0, 0), line1, font=f_title)
        b2 = draw.textbbox((0, 0), line2, font=f_title)
        w1, h1 = b1[2] - b1[0], b1[3] - b1[1]
        w2, h2 = b2[2] - b2[0], b2[3] - b2[1]
        
        text_start_y = icon_y + icon_box_size + int(18 * scale)
        draw.text((center_x - w1 // 2, text_start_y), line1, font=f_title, fill="#1E293B")
        draw.text((center_x - w2 // 2, text_start_y + h1 + int(4 * scale)), line2, font=f_title, fill="#1E293B")
        
    img.save("innovation_reference_style.png", dpi=(300, 300))
    print(f"Generated innovation_reference_style.png: {total_w}x{total_h}")

# ==============================================================================
# 2. 2-ROW CONTAINER (3 items x 2 rows) - Premium Card Grid
# ==============================================================================
def create_2row_card_container():
    scale = 2
    cols, rows = 3, 2
    card_w = int(320 * scale)
    card_h = int(82 * scale)
    gap_x = int(14 * scale)
    gap_y = int(14 * scale)
    pad = int(18 * scale)
    border_w = int(2 * scale)
    
    total_w = pad * 2 + cols * card_w + (cols - 1) * gap_x
    total_h = pad * 2 + rows * card_h + (rows - 1) * gap_y
    
    img = Image.new("RGBA", (total_w, total_h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([border_w, border_w, total_w - border_w, total_h - border_w], radius=int(20 * scale), fill="#FFFFFF", outline="#CBD5E1", width=border_w)
    
    f_name = ImageFont.truetype(font_bold_path, int(16.5 * scale))
    f_desc = ImageFont.truetype(font_reg_path, int(12.5 * scale))
    
    icon_box_size = int(50 * scale)
    
    for i, item in enumerate(innovations):
        r = i // cols
        c = i % cols
        x = pad + c * (card_w + gap_x)
        y = pad + r * (card_h + gap_y)
        
        draw.rounded_rectangle([x, y, x + card_w, y + card_h], radius=int(12 * scale), fill="#F8FAFC", outline="#E2E8F0", width=int(1.5 * scale))
        
        pill_pad = int(14 * scale)
        pill_x = x + pill_pad
        pill_y = y + (card_h - icon_box_size) // 2
        
        draw.rounded_rectangle([pill_x, pill_y, pill_x + icon_box_size, pill_y + icon_box_size], radius=int(10 * scale), fill=item["bg_pill"], outline=None)
        
        raw_icon = item["draw_func"](size=256, color=item["color"])
        icon_small = raw_icon.resize((int(36 * scale), int(36 * scale)), Image.Resampling.LANCZOS)
        img.paste(icon_small, (pill_x + int(7 * scale), pill_y + int(7 * scale)), icon_small)
        
        text_x = pill_x + icon_box_size + int(14 * scale)
        name_bbox = draw.textbbox((0, 0), item["name"], font=f_name)
        desc_bbox = draw.textbbox((0, 0), item["desc"], font=f_desc)
        name_h = name_bbox[3] - name_bbox[1]
        desc_h = desc_bbox[3] - desc_bbox[1]
        
        total_th = name_h + desc_h + int(4 * scale)
        start_ty = y + (card_h - total_th) // 2
        
        draw.text((text_x, start_ty), item["name"], font=f_name, fill="#0F172A")
        draw.text((text_x, start_ty + name_h + int(4 * scale)), item["desc"], font=f_desc, fill="#64748B")
        
    img.save("innovation_cards_2rows.png", dpi=(300, 300))
    print(f"Generated innovation_cards_2rows.png: {total_w}x{total_h}")

# ==============================================================================
# 3. 2-COLUMN VERTICAL CONTAINER (2 columns x 3 rows)
# ==============================================================================
def create_vertical_card_container():
    scale = 2
    cols, rows = 2, 3
    card_w = int(310 * scale)
    card_h = int(82 * scale)
    gap_x = int(14 * scale)
    gap_y = int(14 * scale)
    pad = int(18 * scale)
    border_w = int(2 * scale)
    
    total_w = pad * 2 + cols * card_w + (cols - 1) * gap_x
    total_h = pad * 2 + rows * card_h + (rows - 1) * gap_y
    
    img = Image.new("RGBA", (total_w, total_h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([border_w, border_w, total_w - border_w, total_h - border_w], radius=int(20 * scale), fill="#FFFFFF", outline="#CBD5E1", width=border_w)
    
    f_name = ImageFont.truetype(font_bold_path, int(16.5 * scale))
    f_desc = ImageFont.truetype(font_reg_path, int(12.5 * scale))
    
    icon_box_size = int(50 * scale)
    
    for i, item in enumerate(innovations):
        r = i // cols
        c = i % cols
        x = pad + c * (card_w + gap_x)
        y = pad + r * (card_h + gap_y)
        
        draw.rounded_rectangle([x, y, x + card_w, y + card_h], radius=int(12 * scale), fill="#F8FAFC", outline="#E2E8F0", width=int(1.5 * scale))
        
        pill_pad = int(14 * scale)
        pill_x = x + pill_pad
        pill_y = y + (card_h - icon_box_size) // 2
        
        draw.rounded_rectangle([pill_x, pill_y, pill_x + icon_box_size, pill_y + icon_box_size], radius=int(10 * scale), fill=item["bg_pill"], outline=None)
        
        raw_icon = item["draw_func"](size=256, color=item["color"])
        icon_small = raw_icon.resize((int(36 * scale), int(36 * scale)), Image.Resampling.LANCZOS)
        img.paste(icon_small, (pill_x + int(7 * scale), pill_y + int(7 * scale)), icon_small)
        
        text_x = pill_x + icon_box_size + int(14 * scale)
        name_bbox = draw.textbbox((0, 0), item["name"], font=f_name)
        desc_bbox = draw.textbbox((0, 0), item["desc"], font=f_desc)
        name_h = name_bbox[3] - name_bbox[1]
        desc_h = desc_bbox[3] - desc_bbox[1]
        
        total_th = name_h + desc_h + int(4 * scale)
        start_ty = y + (card_h - total_th) // 2
        
        draw.text((text_x, start_ty), item["name"], font=f_name, fill="#0F172A")
        draw.text((text_x, start_ty + name_h + int(4 * scale)), item["desc"], font=f_desc, fill="#64748B")
        
    img.save("innovation_cards_vertical.png", dpi=(300, 300))
    print(f"Generated innovation_cards_vertical.png: {total_w}x{total_h}")

if __name__ == "__main__":
    create_reference_style_banner()
    create_2row_card_container()
    create_vertical_card_container()
