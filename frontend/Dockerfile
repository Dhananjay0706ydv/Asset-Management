# Use the official Node.js environment
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the React code
COPY . .

# Expose the React development port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
