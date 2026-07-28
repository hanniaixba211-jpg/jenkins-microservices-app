FROM node:18-alpine
WORKDIR /app
COPY services/user-service/package*.json ./
RUN npm install --only=production
COPY services/user-service/ ./services/user-service/
COPY shared/ ./shared/
WORKDIR /app/services/user-service
EXPOSE 3001
CMD ["npm", "start"]