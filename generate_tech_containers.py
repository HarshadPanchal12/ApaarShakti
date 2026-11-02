import os
from PIL import Image, ImageDraw, ImageFont

tech_items = [
    {
        "file": "nextjs.png",
        "name": "Next.js 14",
        "role": "Frontend App Router"
    },
    {
        "file": "react.png",
        "name": "React 18",
        "role": "Interactive UI"
    },
    {
        "file": "fastapi.png",
        "name": "FastAPI",
        "role": "High-Speed REST API"
    },
    {
        "file": "python.png",
        "name": "Python 3.13",
        "role": "Verification Engine"
    },
    {
        "file": "supabase_clean.png",
        "name": "Supabase",
        "role": "Auth & PostgreSQL BaaS"
    },
    {
        "file": "postgres.png",
        "name": "PostgreSQL",
        "role": "Relational DB & RLS"
    },
    {
        "file": "tailwind.png",
        "name": "Tailwind CSS",
        "role": "UI Design System"
    },
    {
        "file": "crypto_shield.png",
        "name": "Ed25519 & Fernet",
        "role": "Digital Signatures & DPDP"
    }
]

font_dir = "C:/Windows/Fonts"
font_bold_path = os.path.join(font_dir, "segoeuib.ttf")
font_reg_path = os.path.join(font_dir, "segoeui.ttf")

def get_fonts(scale=1):
    f_title = ImageFont.truetype(font_bold_path, int(22 * scale))
    f_name = ImageFont.truetype(font_bold_path, int(17 * scale))
    f_role = ImageFont.truetype(font_reg_path, int(12.5 * scale))
    return f_title, f_name, f_role

def render_item(base_img, item, x, y, w, h, f_name, f_role, scale=1):
    logo = Image.open(item["file"]).convert("RGBA")
    logo_max = int(50 * scale)
    logo.thumbnail((logo_max, logo_max), Image.Resampling.LANCZOS)
    lw, lh = logo.size
    
    pad_left = int(16 * scale)
    logo_x = x + pad_left
    logo_y = y + (h - lh) // 2
    
    base_img.paste(logo, (logo_x, logo_y), logo)
    
    draw = ImageDraw.Draw(base_img)
    text_x = logo_x + logo_max + int(14 * scale)
    
    name_bbox = draw.textbbox((0, 0), item["name"], font=f_name)
    role_bbox = draw.textbbox((0, 0), item["role"], font=f_role)
    name_h = name_bbox[3] - name_bbox[1]
    role_h = role_bbox[3] - role_bbox[1]
    
    total_text_h = name_h + role_h + int(4 * scale)
    start_text_y = y + (h - total_text_h) // 2
    
    draw.text((text_x, start_text_y), item["name"], font=f_name, fill="#0F172A")
    draw.text((text_x, start_text_y + name_h + int(4 * scale)), item["role"], font=f_role, fill="#64748B")

# 1. 2-ROW HORIZONTAL CONTAINER (4 items x 2 rows)
def create_2row_container():
    scale = 2
    cols, rows = 4, 2
    card_w = int(280 * scale)
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
    
    _, f_name, f_role = get_fonts(scale)
    
    for i, item in enumerate(tech_items):
        r = i // cols
        c = i % cols
        x = pad + c * (card_w + gap_x)
        y = pad + r * (card_h + gap_y)
        
        draw.rounded_rectangle([x, y, x + card_w, y + card_h], radius=int(12 * scale), fill="#F8FAFC", outline="#E2E8F0", width=int(1.5 * scale))
        render_item(img, item, x, y, card_w, card_h, f_name, f_role, scale)
        
    img.save("tech_stack_2rows.png", dpi=(300, 300))
    print(f"Generated tech_stack_2rows.png: {total_w}x{total_h}")

# 2. 2-COLUMN VERTICAL CONTAINER (2 items x 4 rows)
def create_vertical_container():
    scale = 2
    cols, rows = 2, 4
    card_w = int(275 * scale)
    card_h = int(80 * scale)
    gap_x = int(12 * scale)
    gap_y = int(12 * scale)
    pad = int(16 * scale)
    border_w = int(2 * scale)
    
    total_w = pad * 2 + cols * card_w + (cols - 1) * gap_x
    total_h = pad * 2 + rows * card_h + (rows - 1) * gap_y
    
    img = Image.new("RGBA", (total_w, total_h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([border_w, border_w, total_w - border_w, total_h - border_w], radius=int(18 * scale), fill="#FFFFFF", outline="#CBD5E1", width=border_w)
    
    _, f_name, f_role = get_fonts(scale)
    
    for i, item in enumerate(tech_items):
        r = i // cols
        c = i % cols
        x = pad + c * (card_w + gap_x)
        y = pad + r * (card_h + gap_y)
        
        draw.rounded_rectangle([x, y, x + card_w, y + card_h], radius=int(12 * scale), fill="#F8FAFC", outline="#E2E8F0", width=int(1.5 * scale))
        render_item(img, item, x, y, card_w, card_h, f_name, f_role, scale)
        
    img.save("tech_stack_vertical.png", dpi=(300, 300))
    print(f"Generated tech_stack_vertical.png: {total_w}x{total_h}")

# 3. 1-ROW HORIZONTAL STRIP (8 items x 1 row)
def create_1row_container():
    scale = 2
    cols, rows = 8, 1
    card_w = int(230 * scale)
    card_h = int(76 * scale)
    gap_x = int(12 * scale)
    pad = int(16 * scale)
    border_w = int(2 * scale)
    
    total_w = pad * 2 + cols * card_w + (cols - 1) * gap_x
    total_h = pad * 2 + card_h
    
    img = Image.new("RGBA", (total_w, total_h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([border_w, border_w, total_w - border_w, total_h - border_w], radius=int(18 * scale), fill="#FFFFFF", outline="#CBD5E1", width=border_w)
    
    _, f_name, f_role = get_fonts(scale * 0.95)
    
    for i, item in enumerate(tech_items):
        x = pad + i * (card_w + gap_x)
        y = pad
        
        draw.rounded_rectangle([x, y, x + card_w, y + card_h], radius=int(12 * scale), fill="#F8FAFC", outline="#E2E8F0", width=int(1.5 * scale))
        render_item(img, item, x, y, card_w, card_h, f_name, f_role, scale * 0.95)
        
    img.save("tech_stack_1row.png", dpi=(300, 300))
    print(f"Generated tech_stack_1row.png: {total_w}x{total_h}")

if __name__ == "__main__":
    create_2row_container()
    create_vertical_container()
    create_1row_container()
