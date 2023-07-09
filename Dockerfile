FROM python:3.10

LABEL version="1.0"

WORKDIR /todo-app

COPY requirements.txt .
RUN pip install -r requirements.txt

ENV FLASK_APP="run.py"
ENV FLASK_DEBUG=1
ENV ENVIRONMENT="development"

ENV POSTGRES_USER="postgres"
ENV POSTGRES_HOST="postgres-container"
ENV POSTGRES_PORT="5432"
ENV POSTGRES_DB="todo-db"

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

COPY . .

RUN npm install

RUN flask digest compile

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]