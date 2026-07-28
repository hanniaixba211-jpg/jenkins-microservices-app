FROM node:18-alpine
WORKDIR /app
COPY services/api-gateway/package*.json ./
RUN npm install --only=production
COPY services/api-gateway/ .
EXPOSE 3000
CMD ["npm", "start"]