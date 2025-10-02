# Utiliser Python 3.11
FROM python:3.11-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Installer dépendances système
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Copier requirements et installer dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code du backend
COPY . .

# Exposer le port
EXPOSE 8000

# Lancer le serveur Django avec Gunicorn
CMD ["gunicorn", "crime_report.wsgi:application", "--bind", "0.0.0.0:8000"]
