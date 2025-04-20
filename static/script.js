document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const fileName = document.querySelector('.file-name');
    const preview = document.getElementById('preview');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.querySelector('.quality-value');
    const form = document.getElementById('uploadForm');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const imageInfo = document.querySelector('.image-info');
    const suggestionsContainer = document.querySelector('.suggestions-container');
    const suggestionsGrid = document.getElementById('suggestionsGrid');
    const originalWidth = document.getElementById('originalWidth');
    const originalHeight = document.getElementById('originalHeight');
    const fileSize = document.getElementById('fileSize');

    // Atualizar valor da qualidade
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });

    // Preview da imagem
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);

            // Analisar imagem
            await analyzeImage(file);
        }
    });

    // Analisar imagem
    async function analyzeImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                
                // Mostrar informações
                originalWidth.textContent = `${data.width}px`;
                originalHeight.textContent = `${data.height}px`;
                fileSize.textContent = formatFileSize(data.file_size);
                imageInfo.style.display = 'block';

                // Mostrar sugestões
                showSuggestions(data.suggestions);
                suggestionsContainer.style.display = 'block';
            } else {
                throw new Error('Erro ao analisar imagem');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Mostrar sugestões
    function showSuggestions(suggestions) {
        suggestionsGrid.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'suggestion-button';
            button.textContent = suggestion.label;
            
            button.addEventListener('click', () => {
                // Remover classe active de todos os botões
                document.querySelectorAll('.suggestion-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adicionar classe active ao botão clicado
                button.classList.add('active');
                
                // Preencher campos de largura e altura
                widthInput.value = suggestion.width;
                heightInput.value = suggestion.height;
            });
            
            suggestionsGrid.appendChild(button);
        });
    }

    // Formatar tamanho do arquivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Validação dos campos numéricos
    function validateNumberInput(input) {
        if (input.value === '') {
            input.value = '';
        } else {
            const value = parseInt(input.value);
            if (isNaN(value) || value < 0) {
                input.value = '';
            }
        }
    }

    widthInput.addEventListener('input', () => validateNumberInput(widthInput));
    heightInput.addEventListener('input', () => validateNumberInput(heightInput));

    // Envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!imageInput.files[0]) {
            alert('Por favor, selecione uma imagem.');
            return;
        }

        const formData = new FormData(form);
        
        try {
            const response = await fetch('/process', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                // Obter nome original do arquivo
                const originalName = imageInput.files[0].name;
                const extension = originalName.split('.').pop();
                const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                
                a.download = `dsize_${baseName}_${timestamp}.${extension}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            alert('Erro ao processar imagem: ' + error.message);
            console.error(error);
        }
    });
}); 