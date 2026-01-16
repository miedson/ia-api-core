FROM python:3.10-slim

# Dependências de sistema (ESSENCIAL)
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia requirements primeiro (cache)
COPY requirements.txt .

# Atualiza pip
RUN pip install --upgrade pip

# Instala torch CPU-only (compatível com VPS)
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu

# Instala o resto
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY service.py .

CMD ["uvicorn", "service:app", "--host", "0.0.0.0", "--port", "3001"]