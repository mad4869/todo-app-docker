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