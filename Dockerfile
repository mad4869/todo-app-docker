FROM node:16 AS frontend-build

WORKDIR /todo-app-docker

# Copy frontend-specific files
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install frontend dependencies
RUN npm install
RUN npm run build

FROM python:3.10 AS backend-build

WORKDIR /todo-app-docker

# Copy and install Python dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy the remaining app files
COPY . .

# Set environment variables
ENV ENVIRONMENT="development"
ENV FLASK_APP="run.py"
ENV FLASK_DEBUG=1
ENV SECRET_KEY="eabac5cd4de46ff0c6262f96"
ENV POSTGRES_USER="postgres"
ENV POSTGRES_PASSWORD="password"
ENV POSTGRES_HOST="localhost"
ENV POSTGRES_PORT="5432"
ENV POSTGRES_DB="tododb"

# Expose the necessary port (assuming your Flask app uses port 5000)
EXPOSE 5000

# Start the Flask server
CMD ["flask", "run", "--host=0.0.0.0"]