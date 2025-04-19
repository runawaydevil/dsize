document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const fileName = document.querySelector('.file-name');
    const preview = document.getElementById('preview');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.querySelector('.quality-value');
    const form = document.getElementById('uploadForm');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    // Atualizar valor da qualidade
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });

    // Preview da imagem
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

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