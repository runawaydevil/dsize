from PIL import Image, ImageDraw, ImageFont
import os

def create_logo():
    # Criar imagem para logo
    img = Image.new('RGB', (200, 200), color='#4a6bff')
    draw = ImageDraw.Draw(img)
    
    # Desenhar círculo gradiente
    for i in range(90, 0, -1):
        color = int(255 * (i/90))
        draw.ellipse((100-i, 100-i, 100+i, 100+i), outline=(color, color, 255))
    
    # Desenhar quadrados
    draw.rectangle((70, 70, 130, 130), fill='white')
    draw.rectangle((80, 80, 120, 120), outline='white', width=4)
    
    # Adicionar texto
    try:
        font = ImageFont.truetype("arial.ttf", 20)
        small_font = ImageFont.truetype("arial.ttf", 12)
    except:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    draw.text((100, 160), "DSIZE", fill='white', font=font, anchor="mm")
    draw.text((100, 180), "Image Resizer", fill='white', font=small_font, anchor="mm")
    
    # Salvar logo
    img.save('static/logo.png')

def create_favicon():
    # Criar imagem para favicon
    img = Image.new('RGB', (32, 32), color='#4a6bff')
    draw = ImageDraw.Draw(img)
    
    # Desenhar círculo gradiente
    for i in range(14, 0, -1):
        color = int(255 * (i/14))
        draw.ellipse((16-i, 16-i, 16+i, 16+i), outline=(color, color, 255))
    
    # Desenhar quadrados
    draw.rectangle((11, 11, 21, 21), fill='white')
    draw.rectangle((13, 13, 19, 19), outline='white', width=1)
    
    # Adicionar texto
    try:
        font = ImageFont.truetype("arial.ttf", 8)
    except:
        font = ImageFont.load_default()
    
    draw.text((16, 26), "DS", fill='white', font=font, anchor="mm")
    
    # Salvar favicon
    img.save('static/favicon.ico')

if __name__ == '__main__':
    # Criar diretório static se não existir
    if not os.path.exists('static'):
        os.makedirs('static')
    
    create_logo()
    create_favicon()
    print("Logo e favicon criados com sucesso!") 