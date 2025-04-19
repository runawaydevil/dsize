# DSIZE - Image Resizer & Compressor

Um aplicativo web moderno para redimensionar e comprimir imagens, desenvolvido por Pablo Murad (runawaydevil).

## 🚀 Funcionalidades

- 📏 Redimensionamento de imagens com dimensões personalizáveis
- 🗜️ Compressão de imagens com controle de qualidade
- 👀 Preview da imagem antes do processamento
- 🎨 Interface moderna e responsiva
- 🗑️ Não armazena imagens após o processamento
- 📝 Nomeação automática dos arquivos processados

## 🛠️ Tecnologias utilizadas

- Python 3.8+
- Flask
- Pillow (PIL)
- HTML5
- CSS3
- JavaScript

## 📋 Requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/runawaydevil/dsize.git
cd dsize
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Gere os arquivos de imagem:
```bash
python convert_logo.py
```

## 🚀 Uso

1. Inicie o servidor:
```bash
python app.py
```

2. Acesse o aplicativo em seu navegador:
```
http://localhost:3876
```

## 📝 Como usar

1. Selecione uma imagem clicando no botão "Escolha uma imagem"
2. Ajuste as dimensões desejadas (largura e altura em pixels)
3. Ajuste a qualidade da compressão usando o slider
4. Clique em "Processar Imagem"
5. A imagem processada será baixada automaticamente com o nome no formato `dsize_nomeoriginal_datahora.extensão`

## 🔒 Segurança

- As imagens são processadas em memória
- Arquivos temporários são automaticamente removidos após o download
- Não há armazenamento persistente de imagens
- Limite de tamanho de arquivo: 16MB

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

## 👨‍💻 Contato

Desenvolvido por [Pablo Murad (runawaydevil)](https://github.com/runawaydevil)

## 📌 Notas

- O aplicativo roda na porta 3876
- A interface é totalmente responsiva e funciona em dispositivos móveis
- As imagens processadas mantêm a extensão original do arquivo 