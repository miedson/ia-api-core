FROM python:3.10-slim

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TRANSFORMERS_CACHE=/tmp/hf_cache \
    HF_HOME=/tmp/hf_cache

# Dependências de sistema (somente runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia requirements primeiro (cache)
COPY requirements.txt .

# Atualiza pip e instala dependências
RUN pip install --upgrade pip \
    && pip install torch --index-url https://download.pytorch.org/whl/cpu \
    && pip install -r requirements.txt

# Copia o código
COPY service.py .

CMD ["uvicorn", "service:app", "--host", "0.0.0.0", "--port", "3001"]
