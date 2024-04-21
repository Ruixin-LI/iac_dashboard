# Base image
FROM node:latest
# Create app directory
WORKDIR /usr/src/app
# Copy dependency
COPY package*.json ./
# Copy code
COPY . .
# Install dependencies in the container
RUN npm install
# Build, compile the code, optimize, prepare for serving
RUN npm run build

EXPOSE 3000
# Default cmd to run when container up, server
CMD ["npm", "start"]
