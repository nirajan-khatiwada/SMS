# use node:18-alpine as base
FROM node:18-alpine
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the application
EXPOSE 5173
# Start the application
CMD ["npm", "run","dev"]