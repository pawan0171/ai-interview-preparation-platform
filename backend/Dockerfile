# Use lightweight Node.js LTS image
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install dependencies first for efficient layer caching
COPY package*.json ./

RUN npm install --production

# Copy application code
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

# Expose backend API and WebSocket port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
