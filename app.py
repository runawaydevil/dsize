from flask import Flask, render_template, request, send_file, after_this_request, jsonify
from PIL import Image
import os
import io
from datetime import datetime
import tempfile

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'temp'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Criar pasta temporária se não existir
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def get_suggested_sizes(width, height):
    """Retorna sugestões de tamanhos baseadas nas dimensões originais"""
    suggestions = []
    
    # Sugestões comuns para web
    web_sizes = [
        (1920, 1080),  # Full HD
        (1280, 720),   # HD
        (800, 600),     # Padrão web
        (640, 480),    # VGA
        (320, 240)     # QVGA
    ]
    
    # Calcular proporção original
    original_ratio = width / height
    
    # Gerar sugestões mantendo a proporção
    for target_width, target_height in web_sizes:
        if target_width < width:  # Só sugere tamanhos menores
            # Calcular altura mantendo a proporção
            new_height = int(target_width / original_ratio)
            suggestions.append({
                'width': target_width,
                'height': new_height,
                'label': f'{target_width}x{new_height}'
            })
    
    return suggestions

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Nenhuma imagem enviada'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Nenhuma imagem selecionada'}), 400
    
    try:
        img = Image.open(file)
        width, height = img.size
        file_size = len(file.read())
        file.seek(0)  # Reset file pointer
        
        # Obter sugestões de redimensionamento
        suggestions = get_suggested_sizes(width, height)
        
        return jsonify({
            'width': width,
            'height': height,
            'file_size': file_size,
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return 'Nenhuma imagem enviada', 400
    
    file = request.files['image']
    if file.filename == '':
        return 'Nenhuma imagem selecionada', 400
    
    # Obter parâmetros com tratamento para valores vazios
    width_str = request.form.get('width', '0')
    height_str = request.form.get('height', '0')
    
    try:
        width = int(width_str) if width_str else 0
        height = int(height_str) if height_str else 0
        quality = int(request.form.get('quality', 85))
    except ValueError:
        return 'Valores inválidos para largura, altura ou qualidade', 400
    
    # Processar imagem
    img = Image.open(file)
    
    # Redimensionar se necessário
    if width > 0 and height > 0:
        img = img.resize((width, height), Image.LANCZOS)
    
    # Criar arquivo temporário
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    temp_path = temp_file.name
    temp_file.close()
    
    # Salvar imagem no arquivo temporário
    img.save(temp_path, format='JPEG', quality=quality)
    
    # Configurar para deletar após download
    @after_this_request
    def remove_file(response):
        try:
            os.unlink(temp_path)
        except Exception as error:
            app.logger.error(f"Erro ao remover arquivo temporário: {str(error)}")
        return response
    
    # Obter nome original do arquivo e criar novo nome
    original_filename = os.path.splitext(file.filename)[0]
    new_filename = f"dsize_{original_filename}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    
    return send_file(
        temp_path,
        mimetype='image/jpeg',
        as_attachment=True,
        download_name=new_filename
    )

if __name__ == '__main__':
    app.run(port=3876, debug=True) 