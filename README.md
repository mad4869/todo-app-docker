# Todo App Docker
A project to dockerize a Flask-based simple to-do app.


## Background Scenario
Consider yourself as a software engineer who needs to deploy a Flask-based to-do web application and wants to use Docker to build an isolated container for the web app.

## Building Process
### 1. Build the Image of the Web App
The first step is to make a **Dockerfile** to put together the steps to build a custom image of the web app.
```
# Use python as the base image
FROM python:3.10

LABEL version="1.0"

# Set the working directory
WORKDIR /todo-app

# Install the dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Set the enviromental variables for the Flask app
ENV FLASK_APP="run.py"
ENV FLASK_DEBUG=1
ENV ENVIRONMENT="development"
# Set the enviromental variables for database connection
ENV POSTGRES_USER="postgres"
ENV POSTGRES_PORT="5432"

# Install node
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

# Copy the remaining files
COPY . .

# Install front end dependencies
RUN npm install

# Run static assets compiler
RUN flask digest compile

# Set the port
EXPOSE 5000

# Set the command to run the app
CMD ["flask", "run", "--host=0.0.0.0"]
```
Do not forget to set up an `.env` file in the root directory to store all environmental variables required for the Flask app.

**.env**
```
SECRET_KEY="some_secret_key"
JWT_SECRET_KEY="some_secret_key"
```
After that, we just need to run the `docker build` command:
```
docker build --no-cache -t todo-app:latest .
```
This custom base image can also be pulled from Docker Hub registry using `docker pull` command:
```
docker pull mad4869/todo-app:latest
```
### 2. Pull the Postgres Image
The web app needs to connect to a database, so here we are using PostgreSQL base image. Just pull the image from the registry using `docker pull` command:
```
docker pull postgres:latest
```
### 3. Run the Containers
We already get the images we need, so it is time to run the containers using `docker run` command. While we run the containers, we also need to set the **volume, network, port, and enviromental variables** to make sure the two containers could work in harmony.

Here we create new volume and network for both Flask app and Postgres containers.
```
docker network create todo-network
```
```
docker volume create todo-volume
```
```
docker volume create postgres-volume
```

First we run the PostgreSQL container:
```
docker run --name postgres-container -v postgres-volume --network todo-network -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo-db -d postgres
```
The PostgreSQL container will operate using *postgres-volume* as the volume, *todo-network* as the network, in the port 5432, *password* as the password, and *todo-db* as the database for the Flask app. Adjust the values accordingly.

And then for the Flask app container:
```
docker run --name todo-app-container -p 5000:5000 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo-db -e POSTGRES_HOST=postgres-container -d todo-app
```
The database set up is corresponding to the Postgres setting and the app will be running in the port 5000.

Lastly, we need to initialize the connection between the app and Postgres by running `flask db` commands inside the container by using `docker exec`:
```
docker exec todo-app-container flask db init
docker exec todo-app-container flask db migrate
docker exec todo-app-container flask db upgrade
```

And now the Flask app will be running inside the *todo-app-container* and will be connecting to the *postgres-container* as its database.
### 4. Run the Containers through Docker-Compose
The other option is running the containers simultaneously using `docker compose` command. First we need to create `docker-compose.yml` file:
```
version: '3'
services:
  todo-app:
    image: todo-app:latest
    container_name: todo-app-container
    restart: always
    ports:
      - 5000:5000
    volumes:
      - todo-volume:/app/data
    command: flask run --host=0.0.0.0
    environment:
      - POSTGRES_HOST=postgres-container
      - POSTGRES_DB=todo-db
    env_file:
      - todo.env
    depends_on:
      - postgres
    networks:
      - todo-network
  postgres:
    image: postgres:latest
    container_name: postgres-container
    restart: always
    ports:
      - 5433:5432
    volumes:
      - postgres-volume:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_DB=todo-db
    env_file:
      - postgres.env
    networks:
      - todo-network
networks:
  todo-network:
    external: true
volumes:
  todo-volume:
    external: true
  postgres-volume:
    external: true
``` 
Inside the file, we configure all the components needed to run both containers, including the enviromental variables that stored inside the `.env` files.

**todo.env**
```
SECRET_KEY="some_secret_key"
JWT_SECRET_KEY="some_secret_key"
POSTGRES_PASSWORD="password"
```
**postgres.env**
```
POSTGRES_PASSWORD="password"
```
If all the components are ready, we run the `docker compose` command:
```
docker compose up -d
```
If there is no issue during the running, we run the same `flask db` commands inside the Flask app container:
```
docker exec todo-app-container flask db init
docker exec todo-app-container flask db migrate
docker exec todo-app-container flask db upgrade
```

## Backup and Restore
After we dealt with the containers, we also need to create scripts to backup and restore data. 

The backup script will run as a **cron job** once a day and will generate backup data using `pg_dumpall` command.

```
#!/bin/bash

BACKUP="path/to/backups/backup_$(date +%d-%m-%Y).sql"

docker exec postgres-container pg_dumpall -U postgres > "$BACKUP"
```
```
0 0 * * * /home/user/path/to/backup.sh
```
*cron job runs once a day every midnight*

In case of emergency, the backup data can be inserted into a running container and be executed to restore the missing data.
```
#!/bin/bash

BACKUP="path/to/backups/backup_$(date +%d-%m-%Y).sql"

docker cp "$BACKUP" postgres-container:/var/backups
```
*insert backup data to a running postgres container*
```
#!/bin/bash

BACKUP="/var/backups/backup_$(date +%d-%m-%Y).sql"

docker exec postgres-container psql -U postgres -d todo-db -f "$BACKUP"
```
*execute the command to restore data inside a running postgres container*

## Conclusion
That was the overview on the process of building Docker containers for a Flask web application and PostgreSQL. We can run them separately then connect them together or we can also run them simultaneously via `docker compose`. Last but not least, create backup and restore mechanism in case the data is somehow broken or missing.
