FROM python:3.10-slim

WORKDIR /app

# Instala dependências primeiro (cacheável)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Depois copia o código
COPY service.py .

CMD ["uvicorn", "service:app", "--host", "0.0.0.0", "--port", "3001"]
