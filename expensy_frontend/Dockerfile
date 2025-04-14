# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) first for efficient caching
COPY package.json package-lock.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Set the API URL that will be embedded into the frontend
# Instead of localhost, use conatiner name if running locally in a docker network, and in kubernetes backend service name
#ENV NEXT_PUBLIC_API_URL="http://localhost:8706"

# Define build arg
ARG NEXT_PUBLIC_API_URL

# Make it available as an environment variable . This ensures NEXT_PUBLIC_API_URL is injected at build time and available during npm run build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Step 7: Build the Next.js app (production build)
RUN npm run build

# Step 8: Expose the port that Next.js will run on
EXPOSE 3002

# Step 9: Start the Next.js app
CMD ["npm", "start"]
