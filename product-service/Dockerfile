FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production || true
COPY . .
EXPOSE 5000
CMD ["npm","start"]
