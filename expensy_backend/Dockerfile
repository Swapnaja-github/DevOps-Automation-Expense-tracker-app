FROM node:18

# set working directory in the container where commands would run
WORKDIR /app

# copy package files
COPY package*.json package-lock.json ./

# install dependencies
RUN npm install

# copy the rest of the app
COPY . .

# Set default environment variables for both the Redis and MongoDB connection
# # Instead of localhost, use conatiner name if running locally in a docker network, and in kubernetes redis service name
ENV DATABASE_URI="mongodb://<username>:<password>@<host>:<port>?authSource=admin"
ENV REDIS_HOST="localhost"
ENV REDIS_PORT="6379"
ENV REDIS_PASSWORD=""


# expose the app port 
EXPOSE 8706

# start the app
CMD ["npm", "start"] 